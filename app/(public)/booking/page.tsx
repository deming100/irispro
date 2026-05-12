"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format, isBefore, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { PRODUCTS, CAR_TYPES } from "@/lib/constants";

const STEPS = [
  "Service Type",
  "Product",
  "Car Details",
  "Date & Time",
  "Contact",
  "Review",
];

interface BookingData {
  serviceType: string;
  productTier: string;
  carPlate: string;
  carBrand: string;
  carModel: string;
  carType: string;
  carYear: string;
  specialNotes: string;
  appointmentDate: Date | null;
  timeSlot: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

interface SlotInfo {
  slot: string;
  count: number;
  maxCapacity: number;
  available: boolean;
  isPast: boolean;
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-10 overflow-x-auto pb-2">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  done
                    ? "bg-[#C9A84C] border-[#C9A84C] text-black"
                    : active
                    ? "border-[#C9A84C] text-[#C9A84C] bg-transparent"
                    : "border-[#2A2A2A] text-gray-600 bg-transparent"
                }`}
              >
                {done ? "✓" : step}
              </div>
              <span
                className={`text-[10px] hidden sm:block whitespace-nowrap ${
                  active ? "text-[#C9A84C]" : done ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 sm:w-14 h-0.5 mx-1 ${
                  done ? "bg-[#C9A84C]" : "bg-[#2A2A2A]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState<BookingData>({
    serviceType: "Automobile Tinting",
    productTier: searchParams.get("product") || "",
    carPlate: "",
    carBrand: "",
    carModel: "",
    carType: "",
    carYear: "",
    specialNotes: "",
    appointmentDate: null,
    timeSlot: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
  });

  useEffect(() => {
    const product = searchParams.get("product");
    if (product) {
      const found = PRODUCTS.find((p) => p.id === product);
      if (found) {
        setData((d) => ({ ...d, productTier: found.name }));
        setStep((s) => (s === 1 ? 2 : s));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data.appointmentDate) {
      const dateStr = format(data.appointmentDate, "yyyy-MM-dd");
      setLoadingSlots(true);
      fetch(`/api/slots?date=${dateStr}`)
        .then((r) => r.json())
        .then((d) => setSlots(d.slots || []))
        .finally(() => setLoadingSlots(false));
    }
  }, [data.appointmentDate]);

  const update = (field: keyof BookingData, value: unknown) =>
    setData((d) => ({ ...d, [field]: value }));

  const canNext = () => {
    if (step === 1) return !!data.serviceType;
    if (step === 2) return !!data.productTier;
    if (step === 3) return !!data.carPlate && !!data.carBrand && !!data.carModel && !!data.carType;
    if (step === 4) return !!data.appointmentDate && !!data.timeSlot;
    if (step === 5) return !!data.customerName && !!data.customerPhone;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          appointmentDate: data.appointmentDate?.toISOString(),
        }),
      });
      const json = await res.json();
      if (res.status === 409) {
        update("timeSlot", "");
        setStep(4);
        // Refresh slots so the full slot shows as Fully Booked immediately
        if (data.appointmentDate) {
          const dateStr = format(data.appointmentDate, "yyyy-MM-dd");
          setLoadingSlots(true);
          fetch(`/api/slots?date=${dateStr}`)
            .then((r) => r.json())
            .then((d) => setSlots(d.slots || []))
            .finally(() => setLoadingSlots(false));
        }
        setError("This slot just got fully booked. Please select another time.");
        return;
      }
      if (!res.ok) throw new Error(json.error || "Failed to create booking");
      router.push(`/booking/confirmation?ref=${json.booking.reference}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProduct = PRODUCTS.find((p) => p.name === data.productTier);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Book Your Appointment</h1>
        <p className="text-gray-400">Complete the form below to reserve your slot</p>
      </div>

      <StepIndicator current={step} />

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8">

        {/* Step 1: Service Type */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Select Service Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["Automobile Tinting", "Residential Film", "Commercial Film"].map((s) => (
                <button
                  key={s}
                  onClick={() => update("serviceType", s)}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    data.serviceType === s
                      ? "border-[#C9A84C] bg-[#C9A84C]/10"
                      : "border-[#2A2A2A] hover:border-[#C9A84C]/40"
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {s === "Automobile Tinting" ? "🚗" : s === "Residential Film" ? "🏠" : "🏢"}
                  </div>
                  <div className="font-semibold text-sm">{s}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Product */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Select Film Series</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => update("productTier", p.name)}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    data.productTier === p.name
                      ? "border-[#C9A84C] bg-[#C9A84C]/10"
                      : "border-[#2A2A2A] hover:border-[#C9A84C]/40"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-sm">{p.name}</div>
                    {p.highlight && (
                      <span className="text-[10px] bg-[#C9A84C] text-black font-bold px-2 py-0.5 rounded">TOP</span>
                    )}
                  </div>
                  <div className="text-[#C9A84C] text-xs mb-2">{p.tagline}</div>
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span>{p.uvBlock}% UV</span>
                    <span>{p.heatRejection}% Heat</span>
                    <span>{p.warranty}yr</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Car Details */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Car Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Car Plate Number *</label>
                <input
                  type="text"
                  value={data.carPlate}
                  onChange={(e) => update("carPlate", e.target.value.toUpperCase())}
                  placeholder="e.g. BAA 1234"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Car Brand *</label>
                  <input
                    type="text"
                    value={data.carBrand}
                    onChange={(e) => update("carBrand", e.target.value)}
                    placeholder="e.g. Toyota"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Car Model *</label>
                  <input
                    type="text"
                    value={data.carModel}
                    onChange={(e) => update("carModel", e.target.value)}
                    placeholder="e.g. Fortuner"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Car Type *</label>
                  <select
                    value={data.carType}
                    onChange={(e) => update("carType", e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                  >
                    <option value="">Select type</option>
                    {CAR_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Year (optional)</label>
                  <input
                    type="number"
                    value={data.carYear}
                    onChange={(e) => update("carYear", e.target.value)}
                    placeholder="e.g. 2022"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Special Notes (optional)</label>
                <textarea
                  value={data.specialNotes}
                  onChange={(e) => update("specialNotes", e.target.value)}
                  placeholder="e.g. has panoramic sunroof, existing tint to remove..."
                  rows={3}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Date & Time */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Select Date & Time</h2>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={data.appointmentDate ?? undefined}
                  onSelect={(d) => {
                    update("appointmentDate", d || null);
                    update("timeSlot", "");
                  }}
                  disabled={(date) =>
                    isBefore(date, startOfDay(new Date())) ||
                    date.getDay() === 0
                  }
                  className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] text-white"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  {data.appointmentDate
                    ? `Available slots for ${format(data.appointmentDate, "EEE, d MMM yyyy")}`
                    : "Select a date to see slots"}
                </h3>
                {loadingSlots ? (
                  <div className="text-gray-400 text-sm">Loading slots...</div>
                ) : data.appointmentDate ? (
                  <div className="grid grid-cols-2 gap-2">
                    {slots.map((s) => (
                      <button
                        key={s.slot}
                        disabled={!s.available}
                        onClick={() => update("timeSlot", s.slot)}
                        className={`px-3 py-3 rounded-lg text-sm font-medium border transition-all ${
                          data.timeSlot === s.slot
                            ? "bg-[#C9A84C] border-[#C9A84C] text-black"
                            : s.available
                            ? "border-[#2A2A2A] text-white hover:border-[#C9A84C] hover:text-[#C9A84C]"
                            : "border-[#1A1A1A] text-gray-700 cursor-not-allowed bg-[#0D0D0D]"
                        }`}
                      >
                        <div>{s.slot}</div>
                        <div className={`text-[10px] mt-0.5 ${
                          s.available ? "text-green-400" : "text-red-400/70"
                        }`}>
                          {s.isPast ? "Past" : s.available ? "Available" : "Fully Booked"}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Contact */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Contact Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={data.customerName}
                  onChange={(e) => update("customerName", e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  value={data.customerPhone}
                  onChange={(e) => update("customerPhone", e.target.value)}
                  placeholder="+673 XXX XXXX"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email (optional)</label>
                <input
                  type="email"
                  value={data.customerEmail}
                  onChange={(e) => update("customerEmail", e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Review */}
        {step === 6 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Review & Confirm</h2>
            <div className="space-y-4">
              <ReviewRow label="Service Type" value={data.serviceType} />
              <ReviewRow label="Film Series" value={data.productTier} />
              {selectedProduct && (
                <ReviewRow
                  label="Specs"
                  value={`${selectedProduct.uvBlock}% UV · ${selectedProduct.heatRejection}% Heat · ${selectedProduct.warranty}yr Warranty`}
                />
              )}
              <div className="border-t border-[#2A2A2A] pt-4" />
              <ReviewRow label="Car Plate" value={data.carPlate} />
              <ReviewRow label="Vehicle" value={`${data.carBrand} ${data.carModel}`} />
              <ReviewRow label="Type" value={data.carType} />
              {data.carYear && <ReviewRow label="Year" value={data.carYear} />}
              {data.specialNotes && <ReviewRow label="Notes" value={data.specialNotes} />}
              <div className="border-t border-[#2A2A2A] pt-4" />
              <ReviewRow
                label="Date"
                value={data.appointmentDate ? format(data.appointmentDate, "EEEE, d MMMM yyyy") : ""}
              />
              <ReviewRow label="Time" value={data.timeSlot} />
              <div className="border-t border-[#2A2A2A] pt-4" />
              <ReviewRow label="Name" value={data.customerName} />
              <ReviewRow label="Phone" value={data.customerPhone} />
              {data.customerEmail && <ReviewRow label="Email" value={data.customerEmail} />}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Nav Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-[#2A2A2A]">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            className="px-6 py-3 border border-[#2A2A2A] rounded-lg text-sm font-medium text-gray-300 hover:border-[#C9A84C] hover:text-[#C9A84C] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          {step < 6 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="px-8 py-3 bg-[#C9A84C] text-black rounded-lg text-sm font-bold hover:bg-[#E8C96A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-[#C9A84C] text-black rounded-lg text-sm font-bold hover:bg-[#E8C96A] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Submitting..." : "Confirm Booking"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-400 flex-shrink-0">{label}</span>
      <span className="text-white text-right">{value}</span>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading...</div>}>
      <BookingForm />
    </Suspense>
  );
}

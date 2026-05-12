import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import DemoBanner from "@/components/DemoBanner";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoBanner />
      <Navbar />
      <main className="flex-1 pt-24">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

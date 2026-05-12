# IrisPro Brunei — Window Tinting Demo Website

A full-stack Next.js 14 demo website for IrisPro Brunei, a JPD-approved car window tinting company in Brunei.

## Features

- **Public pages**: Homepage, Products, Multi-step Booking, Confirmation, Contact
- **Admin dashboard**: Booking management, slot configuration, stats overview
- **Booking system**: 6-step form with real-time slot availability
- **Conflict prevention**: DB-level transaction prevents double-booking
- **WhatsApp integration**: Floating button + pre-filled message

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM (v5)
- **Auth**: NextAuth.js (credentials provider)
- **Language**: TypeScript

---

## Prerequisites

- Node.js 18+
- PostgreSQL database running locally (or a connection string)

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Edit `.env` and update the database URL:

```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/irispro?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Create the Database

Make sure PostgreSQL is running and create the database:

```bash
psql -U postgres -c "CREATE DATABASE irispro;"
```

### 4. Run Migrations

```bash
npx prisma migrate dev --name init
```

Or push schema directly (no migration files):

```bash
npx prisma db push
```

### 5. Seed the Database

```bash
npx prisma db seed
```

This creates:
- Admin user: `admin@irispro.bn` / `admin123`
- Default slot configs (3 bookings max per slot)
- 3 sample bookings

### 6. Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Pages

| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/products` | Film series catalog |
| `/booking` | Multi-step booking form |
| `/booking/confirmation` | Booking confirmation |
| `/contact` | Contact info + map |
| `/admin/login` | Admin login |
| `/admin` | Dashboard stats |
| `/admin/bookings` | Manage bookings |
| `/admin/slots` | Configure slot capacity |

## Admin Credentials

```
Email: admin@irispro.bn
Password: admin123
```

---

## Useful Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npx prisma studio    # Open Prisma Studio (GUI for DB)
npx prisma db seed   # Re-run seed script
```

---

## Notes

- No real payment processing — demo only
- WhatsApp button links to +673 888-9918
- Booking confirmation logs to the server console
- Sundays are automatically disabled in the booking calendar
- Slots are disabled after their time has passed on today's date

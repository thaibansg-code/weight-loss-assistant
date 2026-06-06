# ผู้ช่วยลดน้ำหนัก — Claude Configuration

## โปรเจ็คนี้คืออะไร
แอปพลิเคชันผู้ช่วยลดน้ำหนักอัจฉริยะ สร้างด้วย Next.js 15, TypeScript, Tailwind CSS, Supabase และ Claude AI

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude (claude-sonnet-4-6)
- **Auth**: Supabase Auth
- **Charts**: Recharts
- **Deploy**: Vercel

## โครงสร้างโปรเจ็ค
```
src/
├── app/
│   ├── (auth)/login, register      # หน้า Auth
│   ├── (dashboard)/                # หน้าหลัก (ต้อง login)
│   │   ├── dashboard/              # ภาพรวม
│   │   ├── meals/                  # บันทึกมื้ออาหาร
│   │   ├── exercise/               # บันทึกออกกำลังกาย
│   │   ├── weight/                 # บันทึกน้ำหนัก
│   │   ├── water/                  # บันทึกน้ำดื่ม
│   │   ├── progress/               # ความคืบหน้า
│   │   ├── ai-coach/               # AI Coach (Claude)
│   │   └── settings/               # ตั้งค่าโปรไฟล์
│   ├── api/ai-coach/               # API Route สำหรับ Claude
│   └── onboarding/                 # กรอกข้อมูลครั้งแรก
├── components/
│   ├── layout/Sidebar, Header      # Layout components
│   └── dashboard/                  # Dashboard widgets
├── lib/
│   ├── supabase/client, server     # Supabase clients
│   └── utils.ts                    # BMI, TDEE calculators
└── types/index.ts                  # TypeScript types
```

## Supabase Tables
- `user_profiles` — ข้อมูลผู้ใช้ (น้ำหนัก ส่วนสูง เป้าหมาย)
- `weight_logs` — บันทึกน้ำหนักรายวัน
- `meal_logs` — บันทึกมื้ออาหาร (แคลอรี่ โปรตีน คาร์บ ไขมัน)
- `exercise_logs` — บันทึกการออกกำลังกาย
- `daily_goals` — เป้าหมายรายวัน (น้ำดื่ม ก้าวเดิน)

## Environment Variables ที่ต้องตั้ง
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
```

## Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
```

## Design System
- Primary color: green-600 (#16a34a)
- Border radius: rounded-xl (12px), rounded-2xl (16px)
- Font: Geist Sans (Thai-friendly)
- Cards: white bg + border-gray-100 + shadow-sm

## AI Coach
- Model: claude-sonnet-4-6
- ตอบภาษาไทยเสมอ
- เน้นคำแนะนำที่ปลอดภัยและยั่งยืน
- API endpoint: /api/ai-coach (POST)

## Coding Conventions
- ใช้ TypeScript strict mode
- Server Components สำหรับหน้าที่ดึงข้อมูล
- Client Components สำหรับ interactive UI (ใส่ 'use client')
- ไม่ใช้ any type — ใช้ proper TypeScript types
- ตั้งชื่อ function เป็นภาษาอังกฤษ แต่ comment/label เป็นภาษาไทยได้

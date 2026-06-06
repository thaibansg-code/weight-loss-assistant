# Task Tracker — ผู้ช่วยลดน้ำหนัก

> อัปเดตล่าสุด: 2026-06-06

## 🔴 ต้องทำทันที (Immediate)

### 1. ตั้งค่า Supabase
- [ ] สร้าง Supabase project (ผ่าน MCP)
- [ ] Run migration SQL เพื่อสร้าง tables ทั้งหมด
- [ ] ตั้งค่า Row Level Security (RLS) policies
- [ ] Copy URL และ keys ใส่ `.env.local`

### 2. ตั้งค่า Anthropic API Key
- [ ] ไป console.anthropic.com
- [ ] สร้าง API key
- [ ] ใส่ใน `.env.local` → `ANTHROPIC_API_KEY=`

### 3. เชื่อมต่อ GitHub
- [ ] Push code ขึ้น GitHub (repository: weight-loss-assistant)
- [ ] ตั้งค่า `.gitignore` (ตรวจสอบ .env.local ไม่ถูก commit)

### 4. Deploy บน Vercel
- [ ] เชื่อม Vercel กับ GitHub repo
- [ ] ตั้งค่า Environment Variables ใน Vercel dashboard
- [ ] ทดสอบ production build

---

## 🟡 Phase 2 Tasks

### Thai Food Database
- [ ] รวบรวมอาหารไทยยอดนิยม 100+ รายการ
- [ ] สร้าง table `foods` ใน Supabase
- [ ] สร้าง search UI ใน meals page

### Barcode Scanner
- [ ] ติดตั้ง library สำหรับ barcode scan
- [ ] เชื่อมกับ Open Food Facts API
- [ ] UI สำหรับ scan และ confirm

### Notifications
- [ ] ตั้งค่า Web Push Notifications
- [ ] เตือนเช้า/กลางวัน/เย็น ให้บันทึกอาหาร
- [ ] เตือนดื่มน้ำทุก 2 ชั่วโมง

### Weekly Report
- [ ] สรุปสัปดาห์ (แคลอรี่เฉลี่ย, น้ำหนักที่ลด)
- [ ] AI สร้าง personalized tips
- [ ] ส่งทาง email (Resend)

---

## 🟢 Completed ✅

- [x] สร้าง Next.js project พร้อม TypeScript + Tailwind
- [x] ติดตั้ง Supabase SSR + Anthropic SDK + Recharts
- [x] สร้าง Authentication (Login/Register)
- [x] สร้าง Onboarding flow (2-step)
- [x] Dashboard หลัก + Calorie Ring + Weight Chart
- [x] หน้า Meals — บันทึก/ลบมื้ออาหาร
- [x] หน้า Exercise — บันทึก/ลบการออกกำลังกาย
- [x] หน้า Weight — บันทึกน้ำหนัก + BMI calculator
- [x] หน้า Water — ติดตามน้ำดื่ม
- [x] หน้า Progress — กราฟและสถิติ
- [x] AI Coach — chat กับ Claude AI ภาษาไทย
- [x] Settings — แก้ไขโปรไฟล์ + TDEE calculator
- [x] CLAUDE.md + .claude/ agent configs
- [x] project.md + task.md
- [x] Middleware สำหรับ auth protection

---

## SQL Migration ที่ต้อง run ใน Supabase

```sql
-- สร้าง tables (copy ไปรัน ใน Supabase SQL Editor)

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  height_cm DECIMAL(5,2),
  current_weight_kg DECIMAL(5,2),
  target_weight_kg DECIMAL(5,2),
  activity_level TEXT DEFAULT 'moderate',
  goal TEXT DEFAULT 'lose_weight',
  daily_calorie_target INTEGER DEFAULT 1800,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2) NOT NULL,
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  food_name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein_g DECIMAL(6,2) DEFAULT 0,
  carbs_g DECIMAL(6,2) DEFAULT 0,
  fat_g DECIMAL(6,2) DEFAULT 0,
  quantity DECIMAL(6,2) DEFAULT 1,
  unit TEXT DEFAULT 'จาน',
  logged_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  exercise_type TEXT DEFAULT 'cardio',
  duration_minutes INTEGER NOT NULL,
  calories_burned INTEGER NOT NULL,
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  calorie_target INTEGER DEFAULT 1800,
  calorie_consumed INTEGER DEFAULT 0,
  calorie_burned INTEGER DEFAULT 0,
  water_ml INTEGER DEFAULT 0,
  water_target_ml INTEGER DEFAULT 2000,
  steps INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;

-- Policies (ผู้ใช้เห็นข้อมูลตัวเองเท่านั้น)
CREATE POLICY "Users can manage own profile" ON user_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own weight logs" ON weight_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own meal logs" ON meal_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own exercise logs" ON exercise_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own daily goals" ON daily_goals FOR ALL USING (auth.uid() = user_id);
```

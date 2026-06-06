# ผู้ช่วยลดน้ำหนัก (Weight Loss Assistant)

## วิสัยทัศน์
แอปพลิเคชันผู้ช่วยลดน้ำหนักอัจฉริยะที่ใช้ AI ช่วยให้ผู้ใช้บรรลุเป้าหมายสุขภาพ โดยการติดตามแคลอรี่ น้ำหนัก การออกกำลังกาย และให้คำแนะนำส่วนตัวจาก Claude AI

## เป้าหมายหลัก
- ช่วยให้ผู้ใช้ลดน้ำหนักอย่างปลอดภัยและยั่งยืน
- ให้ข้อมูลโภชนาการที่ถูกต้องและเข้าใจง่าย
- สร้างนิสัยการกินและการออกกำลังกายที่ดี
- ให้คำแนะนำ AI ที่เป็นส่วนตัวและเกี่ยวข้องกับข้อมูลจริงของผู้ใช้

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | Anthropic Claude (claude-sonnet-4-6) |
| Charts | Recharts |
| Deploy | Vercel |
| Icons | Lucide React |

## ฟีเจอร์หลัก

### ✅ Phase 1 — Core (MVP)
- [x] ระบบ Authentication (Login/Register)
- [x] Onboarding — กรอกข้อมูลส่วนตัวครั้งแรก
- [x] Dashboard — ภาพรวมวันนี้ (แคลอรี่, น้ำหนัก, กราฟ)
- [x] บันทึกมื้ออาหาร (ชื่ออาหาร, แคลอรี่, มาโคร)
- [x] บันทึกออกกำลังกาย (ชื่อ, เวลา, แคลอรี่เผาผลาญ)
- [x] บันทึกน้ำหนัก + คำนวณ BMI
- [x] บันทึกน้ำดื่ม
- [x] AI Coach (Claude AI ตอบภาษาไทย)
- [x] หน้าความคืบหน้า + กราฟน้ำหนัก
- [x] ตั้งค่าโปรไฟล์ (TDEE Calculator)

### 🚧 Phase 2 — Enhancement
- [ ] Thai food database (อาหารไทยยอดนิยม + แคลอรี่)
- [ ] Barcode scanner สำหรับ scan อาหารสำเร็จรูป
- [ ] Push notifications (เตือนบันทึกอาหาร)
- [ ] Weekly summary report
- [ ] Meal plan suggestions จาก AI
- [ ] Social features (ชุมชนลดน้ำหนัก)
- [ ] Apple Health / Google Fit integration
- [ ] Streak tracker (วันติดต่อกัน)

### 🔮 Phase 3 — Advanced
- [ ] Photo food recognition (ถ่ายรูปอาหาร)
- [ ] Wearable device sync
- [ ] Personalized workout plans
- [ ] Nutritionist consultation booking
- [ ] Premium subscription

## Database Schema

```sql
-- ข้อมูลผู้ใช้
user_profiles (
  id, user_id, name, age, gender,
  height_cm, current_weight_kg, target_weight_kg,
  activity_level, goal, daily_calorie_target,
  created_at, updated_at
)

-- บันทึกน้ำหนัก
weight_logs (
  id, user_id, weight_kg, notes, logged_at
)

-- บันทึกมื้ออาหาร
meal_logs (
  id, user_id, meal_type, food_name,
  calories, protein_g, carbs_g, fat_g,
  quantity, unit, logged_at
)

-- บันทึกออกกำลังกาย
exercise_logs (
  id, user_id, exercise_name, exercise_type,
  duration_minutes, calories_burned, notes, logged_at
)

-- เป้าหมายรายวัน
daily_goals (
  id, user_id, date,
  calorie_target, calorie_consumed, calorie_burned,
  water_ml, water_target_ml, steps
)
```

## Architecture Decisions

**Server vs Client Components**
- Server: หน้าที่ดึงข้อมูล Supabase (dashboard, progress)
- Client: หน้าที่มี form หรือ real-time update (meals, exercise, ai-coach)

**Auth Flow**
- Supabase SSR Auth
- Middleware redirect ถ้าไม่ได้ login
- Cookie-based session

**AI Integration**
- Anthropic SDK ใน API Route
- ไม่ใช้ streaming (เพื่อ simplicity ใน MVP)
- System prompt เน้นความปลอดภัยด้านสุขภาพ

## Team & Roles

| Role | Agent | รับผิดชอบ |
|------|-------|----------|
| Nutrition Expert | `nutrition-expert` | คำแนะนำอาหาร, แคลอรี่ |
| Fitness Coach | `fitness-coach` | การออกกำลังกาย, TDEE |
| Data Analyst | `data-analyst` | Supabase queries, schema |
| UI Developer | `ui-developer` | Frontend, components |

## Deployment

- **Dev**: `npm run dev` → localhost:3000
- **Production**: Vercel (auto-deploy จาก main branch)
- **Database**: Supabase (ตั้งค่า env vars ใน Vercel dashboard)

## Links
- GitHub: https://github.com/thaibansg-code/weight-loss-assistant
- Vercel: (เชื่อม GitHub repo → vercel.com แล้วตั้ง env vars)
- Supabase: https://supabase.com/dashboard/project/akbjdszkfrjaoujaojiu

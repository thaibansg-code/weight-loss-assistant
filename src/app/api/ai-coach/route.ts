import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateBMI } from '@/lib/utils'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // ดึงข้อมูล user สำหรับ context
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userContext = ''
    if (user) {
      const today = new Date().toISOString().split('T')[0]
      const [profileRes, mealsRes, exerciseRes, weightRes] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('meal_logs').select('calories,protein_g,carbs_g,fat_g').eq('user_id', user.id).gte('logged_at', today),
        supabase.from('exercise_logs').select('calories_burned,duration_minutes').eq('user_id', user.id).gte('logged_at', today),
        supabase.from('weight_logs').select('weight_kg,logged_at').eq('user_id', user.id).order('logged_at', { ascending: false }).limit(1),
      ])

      const profile = profileRes.data
      const meals = mealsRes.data ?? []
      const exercises = exerciseRes.data ?? []
      const latestWeight = weightRes.data?.[0]

      if (profile) {
        const totalCalories = meals.reduce((s, m) => s + m.calories, 0)
        const totalProtein = meals.reduce((s, m) => s + m.protein_g, 0)
        const totalCarbs = meals.reduce((s, m) => s + m.carbs_g, 0)
        const totalFat = meals.reduce((s, m) => s + m.fat_g, 0)
        const totalBurned = exercises.reduce((s, e) => s + e.calories_burned, 0)
        const bmi = profile.current_weight_kg && profile.height_cm
          ? calculateBMI(profile.current_weight_kg, profile.height_cm)
          : null

        userContext = `
ข้อมูลผู้ใช้:
- ชื่อ: ${profile.name ?? 'ผู้ใช้'}
- อายุ: ${profile.age} ปี | เพศ: ${profile.gender === 'male' ? 'ชาย' : profile.gender === 'female' ? 'หญิง' : 'อื่นๆ'}
- น้ำหนัก: ${profile.current_weight_kg} kg | ส่วนสูง: ${profile.height_cm} cm
- BMI: ${bmi ? `${bmi.bmi} (${bmi.category === 'normal' ? 'ปกติ' : bmi.category === 'underweight' ? 'ต่ำกว่าเกณฑ์' : bmi.category === 'overweight' ? 'น้ำหนักเกิน' : 'อ้วน'})` : 'ไม่มีข้อมูล'}
- น้ำหนักเป้าหมาย: ${profile.target_weight_kg} kg
- เป้าหมาย: ${profile.goal === 'lose_weight' ? 'ลดน้ำหนัก' : profile.goal === 'maintain' ? 'คงน้ำหนัก' : 'เพิ่มกล้ามเนื้อ'}
- แคลอรี่เป้าหมายต่อวัน: ${profile.daily_calorie_target} kcal
- ระดับกิจกรรม: ${profile.activity_level}

ข้อมูลวันนี้:
- แคลอรี่ที่รับประทาน: ${totalCalories} kcal (เป้า ${profile.daily_calorie_target} kcal, เหลือ ${Math.max(0, profile.daily_calorie_target - totalCalories)} kcal)
- โปรตีน: ${totalProtein.toFixed(1)}g | คาร์บ: ${totalCarbs.toFixed(1)}g | ไขมัน: ${totalFat.toFixed(1)}g
- แคลอรี่ที่เผาผลาญ: ${totalBurned} kcal
- น้ำหนักล่าสุด: ${latestWeight ? `${latestWeight.weight_kg} kg` : 'ยังไม่ได้บันทึก'}
`
      }
    }

    const systemPrompt = `คุณคือ AI Coach ผู้ช่วยลดน้ำหนักที่เชี่ยวชาญด้านโภชนาการและการออกกำลังกาย
ตอบเป็นภาษาไทยเสมอ ให้คำแนะนำที่อิงหลักวิทยาศาสตร์ ปลอดภัย และนำไปปฏิบัติได้จริง
เน้นการลดน้ำหนักอย่างยั่งยืน ไม่ใช่แค่การลดน้ำหนักเร็วๆ
ตอบกระชับ ชัดเจน ใจดี และให้กำลังใจเสมอ
หากคำถามเกี่ยวกับสุขภาพที่ต้องแพทย์ ให้แนะนำพบแพทย์ด้วย

${userContext ? `ข้อมูลส่วนตัวของผู้ใช้ที่คุณควรอ้างอิงในการตอบ:\n${userContext}` : ''}`

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    })

    // แปลง history (ยกเว้น message ล่าสุด)
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const chat = model.startChat({ history })
    const lastMessage = messages[messages.length - 1]
    const result = await chat.sendMessage(lastMessage.content)
    const message = result.response.text()

    return NextResponse.json({ message })
  } catch (error) {
    console.error('AI Coach error:', error)
    return NextResponse.json({ message: 'เกิดข้อผิดพลาด กรุณาลองใหม่' }, { status: 500 })
  }
}

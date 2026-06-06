import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `คุณคือผู้ช่วยลดน้ำหนักที่มีความเชี่ยวชาญด้านโภชนาการและการออกกำลังกาย
ตอบเป็นภาษาไทยเสมอ ให้คำแนะนำที่อิงหลักวิทยาศาสตร์ ปลอดภัย และนำไปปฏิบัติได้จริง
เน้นการลดน้ำหนักอย่างยั่งยืนและสุขภาพโดยรวม ไม่ใช่แค่การลดน้ำหนักเร็วๆ
หากมีคำถามเกี่ยวกับสุขภาพที่ต้องการแพทย์ ให้แนะนำให้ปรึกษาแพทย์ด้วย`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const message = response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({ message })
  } catch (error) {
    console.error('AI Coach error:', error)
    return NextResponse.json({ message: 'เกิดข้อผิดพลาด กรุณาลองใหม่' }, { status: 500 })
  }
}

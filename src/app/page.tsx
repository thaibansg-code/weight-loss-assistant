import Link from 'next/link'
import { Scale, Apple, Dumbbell, MessageCircle, TrendingDown, Target } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero */}
      <section className="px-4 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Scale className="w-4 h-4" />
          ผู้ช่วยลดน้ำหนักอัจฉริยะ
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          ลดน้ำหนักอย่าง
          <span className="text-green-600"> ฉลาด</span>
          <br />ด้วย AI ส่วนตัวของคุณ
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          ติดตามแคลอรี่ วางแผนมื้ออาหาร บันทึกการออกกำลังกาย และรับคำแนะนำจาก AI
          ที่เข้าใจเป้าหมายของคุณ
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            เริ่มต้นฟรี
          </Link>
          <Link
            href="/login"
            className="border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          ฟีเจอร์ที่ช่วยให้คุณสำเร็จ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 text-center bg-green-600">
        <h2 className="text-3xl font-bold text-white mb-4">พร้อมเริ่มต้นการเปลี่ยนแปลงหรือยัง?</h2>
        <p className="text-green-100 mb-8 text-lg">เข้าร่วมกับผู้ใช้งานที่กำลังเปลี่ยนแปลงชีวิตด้วย AI</p>
        <Link
          href="/register"
          className="bg-white text-green-700 font-bold px-10 py-4 rounded-xl hover:bg-green-50 transition-colors text-lg inline-block"
        >
          เริ่มต้นเลย — ฟรี!
        </Link>
      </section>

      <footer className="text-center py-8 text-gray-500 text-sm">
        © 2024 ผู้ช่วยลดน้ำหนัก · Powered by Claude AI & Supabase
      </footer>
    </main>
  )
}

const features = [
  {
    icon: Apple,
    title: 'ติดตามแคลอรี่',
    description: 'บันทึกมื้ออาหารอย่างง่ายดาย พร้อมข้อมูลโภชนาการโปรตีน คาร์บ และไขมัน',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Scale,
    title: 'ติดตามน้ำหนัก',
    description: 'บันทึกน้ำหนักรายวัน ดูกราฟความคืบหน้า และคำนวณ BMI อัตโนมัติ',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Dumbbell,
    title: 'บันทึกออกกำลังกาย',
    description: 'ติดตามการออกกำลังกาย คำนวณแคลอรี่ที่เผาผลาญ และวางแผนการฝึก',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: MessageCircle,
    title: 'ที่ปรึกษา AI',
    description: 'รับคำแนะนำส่วนตัวจาก Claude AI เกี่ยวกับอาหาร การออกกำลังกาย และสุขภาพ',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: TrendingDown,
    title: 'วิเคราะห์แนวโน้ม',
    description: 'ดูกราฟและสถิติความคืบหน้า ประเมินผลลัพธ์และปรับแผนได้ทันที',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: Target,
    title: 'ตั้งเป้าหมาย',
    description: 'กำหนดเป้าหมายน้ำหนัก แคลอรี่ประจำวัน และรับแผนที่เหมาะกับคุณ',
    color: 'bg-yellow-100 text-yellow-600',
  },
]

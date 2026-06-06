export interface ThaiFood {
  name: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  unit: string
  category: string
}

export const THAI_FOODS: ThaiFood[] = [
  // ข้าวและก๋วยเตี๋ยว
  { name: 'ข้าวสวย', calories: 168, protein_g: 3.5, carbs_g: 37, fat_g: 0.3, unit: 'ทัพพี', category: 'ข้าว/แป้ง' },
  { name: 'ข้าวผัด', calories: 350, protein_g: 10, carbs_g: 50, fat_g: 12, unit: 'จาน', category: 'ข้าว/แป้ง' },
  { name: 'ข้าวมันไก่', calories: 450, protein_g: 25, carbs_g: 55, fat_g: 15, unit: 'จาน', category: 'ข้าว/แป้ง' },
  { name: 'ข้าวหน้าเป็ด', calories: 480, protein_g: 28, carbs_g: 58, fat_g: 16, unit: 'จาน', category: 'ข้าว/แป้ง' },
  { name: 'ข้าวกะเพรา (ไก่)', calories: 420, protein_g: 22, carbs_g: 52, fat_g: 14, unit: 'จาน', category: 'ข้าว/แป้ง' },
  { name: 'ก๋วยเตี๋ยวน้ำ', calories: 250, protein_g: 15, carbs_g: 38, fat_g: 5, unit: 'ชาม', category: 'ข้าว/แป้ง' },
  { name: 'ก๋วยเตี๋ยวผัดไทย', calories: 380, protein_g: 18, carbs_g: 50, fat_g: 12, unit: 'จาน', category: 'ข้าว/แป้ง' },
  { name: 'ก๋วยเตี๋ยวราดหน้า', calories: 360, protein_g: 20, carbs_g: 48, fat_g: 10, unit: 'จาน', category: 'ข้าว/แป้ง' },
  { name: 'ผัดซีอิ๊ว', calories: 370, protein_g: 18, carbs_g: 52, fat_g: 11, unit: 'จาน', category: 'ข้าว/แป้ง' },
  { name: 'บะหมี่น้ำ', calories: 280, protein_g: 16, carbs_g: 40, fat_g: 6, unit: 'ชาม', category: 'ข้าว/แป้ง' },
  { name: 'ข้าวต้ม', calories: 130, protein_g: 4, carbs_g: 28, fat_g: 0.5, unit: 'ชาม', category: 'ข้าว/แป้ง' },
  { name: 'โจ๊กหมู', calories: 180, protein_g: 12, carbs_g: 25, fat_g: 4, unit: 'ชาม', category: 'ข้าว/แป้ง' },

  // อาหารจานเดียว
  { name: 'แกงเขียวหวานไก่', calories: 320, protein_g: 20, carbs_g: 15, fat_g: 20, unit: 'จาน', category: 'แกง' },
  { name: 'แกงมัสมั่น', calories: 380, protein_g: 18, carbs_g: 25, fat_g: 22, unit: 'จาน', category: 'แกง' },
  { name: 'แกงเผ็ดเนื้อ', calories: 290, protein_g: 22, carbs_g: 10, fat_g: 18, unit: 'จาน', category: 'แกง' },
  { name: 'แกงจืดเต้าหู้', calories: 120, protein_g: 8, carbs_g: 6, fat_g: 5, unit: 'ชาม', category: 'แกง' },
  { name: 'ต้มยำกุ้ง', calories: 150, protein_g: 18, carbs_g: 6, fat_g: 6, unit: 'ชาม', category: 'แกง' },
  { name: 'ต้มข่าไก่', calories: 220, protein_g: 18, carbs_g: 8, fat_g: 14, unit: 'ชาม', category: 'แกง' },
  { name: 'ต้มจืดผักกาด', calories: 80, protein_g: 5, carbs_g: 8, fat_g: 2, unit: 'ชาม', category: 'แกง' },

  // กับข้าว
  { name: 'ไก่ทอด', calories: 290, protein_g: 28, carbs_g: 10, fat_g: 16, unit: 'ชิ้น (100g)', category: 'เนื้อสัตว์' },
  { name: 'ปลาทอด', calories: 200, protein_g: 22, carbs_g: 5, fat_g: 10, unit: 'ชิ้น', category: 'เนื้อสัตว์' },
  { name: 'หมูทอด', calories: 310, protein_g: 25, carbs_g: 8, fat_g: 20, unit: 'ชิ้น (100g)', category: 'เนื้อสัตว์' },
  { name: 'ไข่ดาว', calories: 90, protein_g: 7, carbs_g: 0.5, fat_g: 7, unit: 'ฟอง', category: 'ไข่' },
  { name: 'ไข่เจียว', calories: 150, protein_g: 10, carbs_g: 2, fat_g: 12, unit: 'ฟอง', category: 'ไข่' },
  { name: 'ไข่ต้ม', calories: 70, protein_g: 6, carbs_g: 0.6, fat_g: 5, unit: 'ฟอง', category: 'ไข่' },
  { name: 'ผัดผักรวม', calories: 120, protein_g: 5, carbs_g: 10, fat_g: 7, unit: 'จาน', category: 'ผัก' },
  { name: 'ผัดบรอกโคลี', calories: 110, protein_g: 6, carbs_g: 9, fat_g: 6, unit: 'จาน', category: 'ผัก' },
  { name: 'ผัดคะน้าหมูกรอบ', calories: 280, protein_g: 15, carbs_g: 12, fat_g: 18, unit: 'จาน', category: 'ผัก' },
  { name: 'ยำวุ้นเส้น', calories: 190, protein_g: 12, carbs_g: 22, fat_g: 6, unit: 'จาน', category: 'ยำ/สลัด' },
  { name: 'ส้มตำไทย', calories: 140, protein_g: 4, carbs_g: 22, fat_g: 5, unit: 'จาน', category: 'ยำ/สลัด' },
  { name: 'ลาบหมู', calories: 200, protein_g: 20, carbs_g: 12, fat_g: 8, unit: 'จาน', category: 'ยำ/สลัด' },
  { name: 'พะแนงไก่', calories: 280, protein_g: 22, carbs_g: 10, fat_g: 18, unit: 'จาน', category: 'แกง' },

  // อาหารเช้า
  { name: 'ปาท่องโก๋', calories: 200, protein_g: 4, carbs_g: 28, fat_g: 9, unit: '2 ชิ้น', category: 'อาหารเช้า' },
  { name: 'ขนมจีบ', calories: 60, protein_g: 4, carbs_g: 6, fat_g: 2, unit: 'ชิ้น', category: 'อาหารเช้า' },
  { name: 'ซาลาเปา', calories: 150, protein_g: 6, carbs_g: 24, fat_g: 4, unit: 'ลูก', category: 'อาหารเช้า' },
  { name: 'ข้าวเหนียวมะม่วง', calories: 350, protein_g: 5, carbs_g: 70, fat_g: 7, unit: 'จาน', category: 'ของหวาน' },

  // ของว่าง/ผลไม้
  { name: 'กล้วยหอม', calories: 105, protein_g: 1.3, carbs_g: 27, fat_g: 0.4, unit: 'ลูก', category: 'ผลไม้' },
  { name: 'แอปเปิ้ล', calories: 80, protein_g: 0.4, carbs_g: 21, fat_g: 0.2, unit: 'ลูก', category: 'ผลไม้' },
  { name: 'ส้ม', calories: 62, protein_g: 1.2, carbs_g: 15, fat_g: 0.2, unit: 'ลูก', category: 'ผลไม้' },
  { name: 'มะม่วง', calories: 130, protein_g: 1, carbs_g: 33, fat_g: 0.5, unit: 'ลูก', category: 'ผลไม้' },
  { name: 'มะละกอ', calories: 55, protein_g: 0.6, carbs_g: 14, fat_g: 0.2, unit: 'ชิ้น (100g)', category: 'ผลไม้' },
  { name: 'แตงโม', calories: 30, protein_g: 0.6, carbs_g: 7.5, fat_g: 0.2, unit: 'ชิ้น (100g)', category: 'ผลไม้' },

  // เครื่องดื่ม
  { name: 'ชานมไข่มุก', calories: 360, protein_g: 3, carbs_g: 72, fat_g: 6, unit: 'แก้ว', category: 'เครื่องดื่ม' },
  { name: 'กาแฟเย็น (หวานน้อย)', calories: 120, protein_g: 2, carbs_g: 20, fat_g: 4, unit: 'แก้ว', category: 'เครื่องดื่ม' },
  { name: 'น้ำผลไม้คั้นสด', calories: 110, protein_g: 1, carbs_g: 26, fat_g: 0.2, unit: 'แก้ว', category: 'เครื่องดื่ม' },
  { name: 'นมจืด', calories: 120, protein_g: 8, carbs_g: 12, fat_g: 5, unit: 'กล่อง (200ml)', category: 'เครื่องดื่ม' },
  { name: 'โยเกิร์ตไขมันต่ำ', calories: 100, protein_g: 10, carbs_g: 14, fat_g: 1, unit: 'ถ้วย', category: 'นม/โยเกิร์ต' },

  // ฟาสต์ฟู้ด
  { name: 'ไก่ทอด KFC (1 ชิ้น)', calories: 290, protein_g: 22, carbs_g: 10, fat_g: 18, unit: 'ชิ้น', category: 'ฟาสต์ฟู้ด' },
  { name: 'แฮมเบอร์เกอร์', calories: 450, protein_g: 22, carbs_g: 40, fat_g: 22, unit: 'ชิ้น', category: 'ฟาสต์ฟู้ด' },
  { name: 'พิซซ่า (1 slice)', calories: 280, protein_g: 12, carbs_g: 35, fat_g: 10, unit: 'ชิ้น', category: 'ฟาสต์ฟู้ด' },
]

export const FOOD_CATEGORIES = [...new Set(THAI_FOODS.map((f) => f.category))]

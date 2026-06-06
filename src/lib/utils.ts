import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { BMIResult } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateBMI(weightKg: number, heightCm: number): BMIResult {
  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)
  const roundedBmi = Math.round(bmi * 10) / 10

  let category: BMIResult['category']
  if (bmi < 18.5) category = 'underweight'
  else if (bmi < 25) category = 'normal'
  else if (bmi < 30) category = 'overweight'
  else category = 'obese'

  const ideal_weight_min = Math.round(18.5 * heightM * heightM * 10) / 10
  const ideal_weight_max = Math.round(24.9 * heightM * heightM * 10) / 10

  return { bmi: roundedBmi, category, ideal_weight_min, ideal_weight_max }
}

export function calculateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female' | 'other',
  activityLevel: string
): number {
  // Mifflin-St Jeor Equation
  let bmr: number
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  }

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }

  return Math.round(bmr * (activityMultipliers[activityLevel] ?? 1.2))
}

export function calculateCalorieTarget(tdee: number, goal: string): number {
  switch (goal) {
    case 'lose_weight': return Math.max(1200, tdee - 500)
    case 'gain_muscle': return tdee + 300
    default: return tdee
  }
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export interface UserProfile {
  id: string
  user_id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  height_cm: number
  current_weight_kg: number
  target_weight_kg: number
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goal: 'lose_weight' | 'maintain' | 'gain_muscle'
  daily_calorie_target: number
  created_at: string
  updated_at: string
}

export interface WeightLog {
  id: string
  user_id: string
  weight_kg: number
  notes?: string
  logged_at: string
}

export interface MealLog {
  id: string
  user_id: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  food_name: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  quantity: number
  unit: string
  logged_at: string
}

export interface ExerciseLog {
  id: string
  user_id: string
  exercise_name: string
  exercise_type: 'cardio' | 'strength' | 'flexibility' | 'other'
  duration_minutes: number
  calories_burned: number
  notes?: string
  logged_at: string
}

export interface DailyGoal {
  id: string
  user_id: string
  date: string
  calorie_target: number
  calorie_consumed: number
  calorie_burned: number
  water_ml: number
  water_target_ml: number
  steps: number
}

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface BMIResult {
  bmi: number
  category: 'underweight' | 'normal' | 'overweight' | 'obese'
  ideal_weight_min: number
  ideal_weight_max: number
}

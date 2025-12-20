
export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface Supplements {
  creatine: boolean;
  multivitamin: boolean;
}

// Workout Types
export interface ExerciseSet {
  id: string;
  weight?: number; // kg
  reps?: number;
  time?: number; // seconds or minutes
  speed?: number; // km/h
  incline?: number; // %
  completed: boolean;
}

export interface WorkoutExercise {
  id: string; // unique instance id
  exerciseId: string; // refering to the static DB
  name: string;
  muscle: string;
  sets: ExerciseSet[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutLog {
  exercises: WorkoutExercise[];
  startTime?: string;
  endTime?: string;
  notes?: string;
}

export interface DailyLog extends NutritionData {
  meals: MealEntry[];
  waterIntake: number; // in ml
  supplements: Supplements;
  weight?: number; // in kg
  workout?: WorkoutLog;
}

export interface MealEntry {
  id: string;
  name: string; // Summary name
  timestamp: string;
  nutrition: NutritionData;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64
  isError?: boolean;
}

export interface Targets extends NutritionData {
  waterTarget: number; // in ml
}

// Store logs by date string "YYYY-MM-DD"
export type History = Record<string, DailyLog>;

// Default Targets
export const DEFAULT_TARGETS: Targets = {
  calories: 2950,
  protein: 170,
  carbs: 430,
  fat: 62,
  fiber: 35,
  sugar: 50,
  sodium: 2300,
  waterTarget: 3000, // 3 Liters default
};

export const INITIAL_DAILY_LOG: DailyLog = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  sugar: 0,
  sodium: 0,
  meals: [],
  waterIntake: 0,
  supplements: {
    creatine: false,
    multivitamin: false
  },
  workout: {
    exercises: []
  }
};

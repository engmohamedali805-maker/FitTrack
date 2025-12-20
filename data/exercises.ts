export interface ExerciseDefinition {
  id: string;
  name: string;
  muscle: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio';
}

export const EXERCISE_DB: ExerciseDefinition[] = [
  // Chest (صدر)
  { id: 'chest_press_machine', name: 'Chest Press Machine', muscle: 'Chest' },
  { id: 'decline_cable_press', name: 'Decline Cable Press Full', muscle: 'Chest' },
  { id: 'decline_cable_fly', name: 'Decline Cable Flys', muscle: 'Chest' },
  { id: 'bench_press', name: 'Barbell Bench Press', muscle: 'Chest' },
  
  // Back (ظهر)
  { id: 'lat_pulldown_wide', name: 'Lat Pull Down Wide', muscle: 'Back' },
  { id: 'lat_pulldown_close', name: 'Lat Pulldown Close Grip ( 11 )', muscle: 'Back' },
  { id: 'seated_row_neutral', name: 'Seated Rows Neutral Grip 11', muscle: 'Back' },
  { id: 'seated_row_wide', name: 'Seated Row Wide Grip', muscle: 'Back' },
  { id: 'rows_machine_wide', name: 'Rows Machine Wide Grip', muscle: 'Back' },
  { id: 'back_extension', name: 'Back Extension (Glutes/Erector)', muscle: 'Back' },

  // Legs (أرجل)
  { id: 'db_rdl', name: 'Dumbbell Romanian Deadlift', muscle: 'Legs' },
  { id: 'seated_leg_curl', name: 'Seated Leg Curl Down', muscle: 'Legs' },
  { id: 'leg_extensions', name: 'Leg Extensions', muscle: 'Legs' },
  { id: 'machine_abduction', name: 'Machine Abductions', muscle: 'Legs' },
  { id: 'standing_calf_raise_db', name: 'Standing Calf Raises With Dumbbell', muscle: 'Legs' },
  { id: 'leg_press', name: 'Leg Presses', muscle: 'Legs' },
  { id: 'seated_calf_raise', name: 'Seated Calf Raise', muscle: 'Legs' },

  // Shoulders (أكتاف)
  { id: 'front_shoulder_press_machine', name: 'Front Shoulder Presses Machine', muscle: 'Shoulders' },
  { id: 'lateral_raises_bench', name: 'Lateral Raises On Bench Shoulder', muscle: 'Shoulders' },
  { id: 'rear_delt_fly_machine', name: 'Rear Delt Fly Machine', muscle: 'Shoulders' },

  // Arms (ذراعين)
  { id: 'tricep_rope_pushdown', name: 'Triceps Rope Pushdown', muscle: 'Arms' },
  { id: 'tricep_cable_overhead', name: 'Seated Triceps Cable Overhead Extension', muscle: 'Arms' },
  { id: 'bicep_incline_db_curl', name: 'Biceps Inclined Dumbbell Curls', muscle: 'Arms' },
  { id: 'preacher_curl_machine', name: 'Preacher Curl Machine', muscle: 'Arms' },
  { id: 'cable_curl_pronated', name: 'Cable Curl Pronated Grip', muscle: 'Arms' },

  // Core (بطن)
  { id: 'crunches', name: 'Crunches', muscle: 'Core' },
  { id: 'russian_twist', name: 'Russian Twist Exercise', muscle: 'Core' },
  { id: 'plank', name: 'Plank Core', muscle: 'Core' },
  
  // Cardio (كارديو)
  { id: 'treadmill', name: 'Treadmill Run', muscle: 'Cardio' },
  { id: 'bike', name: 'Stationary Bike', muscle: 'Cardio' },
  { id: 'elliptical', name: 'Elliptical (Orbitrak)', muscle: 'Cardio' },
  { id: 'stairmaster', name: 'Stairmaster (Steps)', muscle: 'Cardio' },
  { id: 'rowing', name: 'Rowing Machine', muscle: 'Cardio' },
  { id: 'arc_trainer', name: 'Arc Trainer', muscle: 'Cardio' },
  { id: 'rope_jumps', name: 'Jump Rope', muscle: 'Cardio' },
];
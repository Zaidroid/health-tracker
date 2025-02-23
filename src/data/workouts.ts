interface Workout {
  day: string;
  title: string;
  exercises: string[];
}

export const workoutSchedule: Workout[] = [
  {
    day: 'Monday',
    title: 'Upper Body (Push Focus)',
    exercises: [
      'Push-ups: 3 sets of 10-15 reps',
      'Dips (using a chair or parallel bars): 3 sets of 8-12 reps',
      'Resistance band shoulder press: 3 sets of 12 reps',
    ],
  },
  {
    day: 'Tuesday',
    title: 'Lower Body (Knee-Friendly)',
    exercises: [
      'Glute bridges: 3 sets of 15 reps',
      'Bodyweight squats: 3 sets of 12 reps (adjust depth if needed)',
      'Resistance band leg curls: 3 sets of 15 reps',
    ],
  },
  {
    day: 'Wednesday',
    title: 'Rest or Active Recovery',
    exercises: [],
  },
  {
    day: 'Thursday',
    title: 'Upper Body (Pull Focus)',
    exercises: [
      'Pull-ups: 3 sets of 3-5 reps',
      'Inverted rows: 3 sets of 8-10 reps',
      'Resistance band bicep curls: 3 sets of 12 reps',
    ],
  },
  {
    day: 'Friday',
    title: 'Skill & Core Training',
    exercises: [
      'Handstand wall walks: 3 sets of 5 reps',
      'Wall-supported handstand hold: 3 sets of 15-30 seconds',
      'Standard plank: 3 sets of 20-30 seconds',
      'Side planks: 3 sets of 15-20 seconds per side',
    ],
  },
  {
    day: 'Saturday',
    title: 'Full Body Workout',
    exercises: [
      'Burpees (if knee allows): 3 sets of 10 reps',
      'Mountain climbers: 3 sets of 20 reps',
      'Resistance band rows: 3 sets of 12 reps',
    ],
  },
  {
    day: 'Sunday',
    title: 'Rest',
    exercises: [],
  },
];

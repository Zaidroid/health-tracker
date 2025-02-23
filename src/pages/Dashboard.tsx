import React, { useState, useEffect } from 'react';
import { Activity, Dumbbell, Award, RefreshCw, ChevronLeft, ChevronRight, TrendingUp, ArrowUp, BarChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HealthMetrics } from '../types';
import { workoutSchedule } from '../data/workouts';
import { format, differenceInCalendarWeeks } from 'date-fns';

export function Dashboard() {
  const { user } = useAuth();
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    steps: 0,
    caloriesBurned: 0,
    activeMinutes: 0,
    lastSynced: new Date(),
  });

  const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay()); // 0=Sunday, 1=Monday, ...
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [workoutLogs, setWorkoutLogs] = useState<{
    [date: string]: {
      workouts: {
        title: string;
        exercises: { name: string; sets: number[] }[];
      }[];
    };
  }>({});

    const [currentProgressionIndex, setCurrentProgressionIndex] = useState(0); // 0, 1, or 2

  // Helper function to initialize workout logs
  const getInitialWorkoutLogs = (workouts: typeof workoutSchedule) => {
    return workouts.map((workout) => ({
      title: workout.title,
      exercises: workout.exercises.map((exercise) => ({
        name: exercise.split(':')[0].trim(),
        sets: Array(parseInt(exercise.split('sets of')[0].split('sets')[0].trim(), 10) || 0).fill(''),
      })),
    }));
  };

  useEffect(() => {
    const selectedDay = daysOfWeek[currentDayIndex];
    const selectedDateString = format(new Date(), 'yyyy-MM-dd');
    const todaysWorkouts = workoutSchedule.filter((workout) => workout.day === selectedDay);

    if (!workoutLogs[selectedDateString] && todaysWorkouts.length > 0) {
      setWorkoutLogs((prevLogs) => ({
        ...prevLogs,
        [selectedDateString]: { workouts: getInitialWorkoutLogs(todaysWorkouts) },
      }));
    }
  }, [currentDayIndex, daysOfWeek, workoutLogs]);

  const nextDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex + 1) % 7);
  };

  const previousDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex - 1 + 7) % 7);
  };

  const handleSyncGoogleFit = async () => {
    console.log('Syncing with Google Fit... (Full implementation requires a backend)');

    // Simulate fetching data.  This is NOT real Google Fit data.
    setHealthMetrics({
      steps: Math.floor(Math.random() * 5000) + 5000, // Random steps between 5000 and 10000
      caloriesBurned: Math.floor(Math.random() * 500) + 200, // Random calories between 200 and 700
      activeMinutes: Math.floor(Math.random() * 30) + 30, // Random active minutes between 30 and 60
      lastSynced: new Date(),
    });
  };

  const handleSaveWorkout = () => {
    console.log('Saving workout...');
    console.log('Workout Logs:', workoutLogs);
  };


  const todayDateString = format(new Date(), 'yyyy-MM-dd');

    const handleInputChange = (
    workoutIndex: number,
    exerciseIndex: number,
    setIndex: number,
    value: string
  ) => {
    setWorkoutLogs((prevLogs) => {
      const updatedLogs = { ...prevLogs };
      const todayLogs = updatedLogs[todayDateString];

      if (!todayLogs) return prevLogs;

      const updatedWorkouts = [...todayLogs.workouts];
      const updatedExercises = [...updatedWorkouts[workoutIndex].exercises];
      const updatedSets = [...updatedExercises[exerciseIndex].sets];

      updatedSets[setIndex] = isNaN(parseInt(value)) ? 0 : parseInt(value, 10);
      updatedExercises[exerciseIndex] = { ...updatedExercises[exerciseIndex], sets: updatedSets };
      updatedWorkouts[workoutIndex] = { ...updatedWorkouts[workoutIndex], exercises: updatedExercises };

      return {
        ...updatedLogs,
        [todayDateString]: { workouts: updatedWorkouts },
      };
    });
  };

  const todaysWorkouts = workoutSchedule.filter((workout) => workout.day === daysOfWeek[currentDayIndex]);

    // Functions for Weekly Progress Navigation
    const nextWeek = () => {
        setCurrentProgressionIndex((prevIndex) => (prevIndex + 1) % 3);
    };

    const previousWeek = () => {
        setCurrentProgressionIndex((prevIndex) => (prevIndex + 2) % 3); // Wrap around and ensure positive
    };

    const getWeekPeriodTitle = (index: number) => {
        switch (index) {
            case 0: return 'Week 1-2';
            case 1: return 'Week 3-4';
            case 2: return 'Week 5-6';
            default: return '';
        }
    };

    const getProgressionGoals = (index: number) => {
        switch (index) {
          case 0:
            return [
              "Push-ups: 3x10-15",
              "Pull-ups: 3x3-5",
              "Planks: 3x20-30 sec"
            ];
          case 1:
            return [
              "Push-ups: 3x15-20",
              "Pull-ups: 3x4-6",
              "Planks: 3x30-45 sec"
            ];
          case 2:
            return [
              "Push-ups: 3x20+",
              "Pull-ups: 3x5-7",
              "Planks: 3x45-60 sec"
            ];
          default:
            return [];
        }
      };

    // Calculate current week (1-6) based on training start date and currentWeekIndex
    const getCurrentWeek = () => {
        if (!user) return 1;
        const startDate = new Date(user.trainingStartDate);
        const today = new Date();
        // Calculate the week number and adjust for the progression index
        let weekNumber = ((differenceInCalendarWeeks(today, startDate) % 6) + 1 + currentProgressionIndex) % 6;
        return weekNumber === 0 ? 6 : weekNumber; // Ensure week number is between 1 and 6
    };

    const currentWeek = getCurrentWeek();

  return (
    <div className="space-y-8">
      {/* Health Metrics */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Today's Health Metrics</h2>
          <button
            onClick={handleSyncGoogleFit}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:bg-indigo-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync with Google Fit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Steps</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{healthMetrics.steps}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Dumbbell className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories Burned</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{healthMetrics.caloriesBurned}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Minutes</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{healthMetrics.activeMinutes}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Workout */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {daysOfWeek[currentDayIndex]}'s Workout
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={previousDay}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Previous Day"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={nextDay}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Next Day"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
        {todaysWorkouts.length > 0 ? (
          todaysWorkouts.map((workout, workoutIndex) => (
            <div key={workoutIndex} className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{workout.title}</h3>
              {workout.exercises.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex} className="mb-2">
                  <p className="text-gray-700 dark:text-gray-300">{exercise.split(':')[0].trim()}</p>
                  <div className="flex space-x-2">
                    {workoutLogs[todayDateString]?.workouts[workoutIndex]?.exercises[exerciseIndex]?.sets.map((set, setIndex) => (
                      <input
                        key={setIndex}
                        type="number"
                        placeholder={`Set ${setIndex + 1}`}
                        className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        value={
                          workoutLogs[todayDateString]?.workouts[workoutIndex]?.exercises[exerciseIndex]?.sets[
                            setIndex
                          ] ?? ''
                        }
                        onChange={(e) =>
                          handleInputChange(workoutIndex, exerciseIndex, setIndex, e.target.value)
                        }
                      />
                    )) ||  Array(parseInt((exercise.match(/(\d+)\s+sets/) || [])[1] || '0', 10)).fill('').map((_, setIndex) => (
                        <input
                        key={setIndex}
                        type="number"
                        placeholder={`Set ${setIndex + 1}`}
                        className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        value={''}
                        onChange={(e) =>
                          handleInputChange(workoutIndex, exerciseIndex, setIndex, e.target.value)
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-gray-700 dark:text-gray-300">Rest Day - No workouts scheduled for today.</p>
        )}
        <button
            onClick={handleSaveWorkout}
            className="w-full mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-700 active:bg-indigo-800"
          >
            Save Workout
          </button>
      </section>

      {/* --- Progress Widget (Redesigned) --- */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Weekly Progress</h2>
          {/* Week Navigation */}
          <div className="flex space-x-2">
            <button
              onClick={previousWeek}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Previous Week"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={nextWeek}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Next Week"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{getWeekPeriodTitle(currentProgressionIndex)}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getProgressionGoals(currentProgressionIndex).map((goal, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
              <div className="flex items-center">
                {goal.includes('Push-ups') && <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
                {goal.includes('Pull-ups') && <ArrowUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
                {goal.includes('Planks') && <BarChart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{goal.split(':')[0].trim()}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{goal.split(':')[1].trim()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

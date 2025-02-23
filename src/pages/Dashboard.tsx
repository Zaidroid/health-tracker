import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Activity, Dumbbell, Award, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HealthMetrics } from '../types';
import { workoutSchedule } from '../data/workouts';
import { format } from 'date-fns';

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

  // Helper function to initialize workout logs for a given day
  const getInitialWorkoutLogs = (workouts: typeof workoutSchedule) => {
    return workouts.map((workout) => ({
      title: workout.title,
      exercises: workout.exercises.map((exercise) => {
        const setsMatch = exercise.match(/(\d+)\s+sets/); // Use regex to find the number of sets
        const numSets = setsMatch ? parseInt(setsMatch[1], 10) : 0;
        const validNumSets = Math.max(0, numSets); // Ensure non-negative
        return {
          name: exercise.split(':')[0].trim(), // Extract exercise name
          sets: Array(validNumSets).fill(''), // Initialize sets array with empty strings
        };
      }),
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
    setCurrentDayIndex((prevIndex) => (prevIndex - 1 + 7) % 7); // Ensure positive index
  };

  const handleSyncGoogleFit = async () => {
    // TODO: Implement Google Fit sync
    console.log('Syncing with Google Fit...');
  };

  const handleSaveWorkout = () => {
    // TODO: Implement workout saving
    console.log('Saving workout...');
    console.log('Workout Logs:', workoutLogs);
  };

  const progressData = [
    { date: '2025-02-10', pushups: 10, planks: 20 },
    { date: '2025-02-11', pushups: 12, planks: 25 },
    { date: '2025-02-12', pushups: 13, planks: 30 },
  ];

  const todayDateString = format(new Date(), 'yyyy-MM-dd');
  const selectedDateString = format(new Date(), 'yyyy-MM-dd');

  const handleInputChange = (
    workoutIndex: number,
    exerciseIndex: number,
    setIndex: number,
    value: string
  ) => {
    setWorkoutLogs((prevLogs) => {
      const updatedLogs = { ...prevLogs };
      const todayLogs = updatedLogs[selectedDateString];

      if (!todayLogs) return prevLogs; // Safety check

      const updatedWorkouts = [...todayLogs.workouts];
      const updatedExercises = [...updatedWorkouts[workoutIndex].exercises];
      const updatedSets = [...updatedExercises[exerciseIndex].sets];

      updatedSets[setIndex] = isNaN(parseInt(value)) ? 0 : parseInt(value, 10);
      updatedExercises[exerciseIndex] = { ...updatedExercises[exerciseIndex], sets: updatedSets };
      updatedWorkouts[workoutIndex] = { ...updatedWorkouts[workoutIndex], exercises: updatedExercises };

      return {
        ...updatedLogs,
        [selectedDateString]: { workouts: updatedWorkouts },
      };
    });
  };

    // Filter workouts for the *current* day OUTSIDE useEffect
  const todaysWorkouts = workoutSchedule.filter((workout) => workout.day === daysOfWeek[currentDayIndex]);

  return (
    <div className="space-y-8">
      {/* Health Metrics */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Today's Health Metrics</h2>
          <button
            onClick={handleSyncGoogleFit}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync with Google Fit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Steps</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{healthMetrics.steps}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center">
              <Dumbbell className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories Burned</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{healthMetrics.caloriesBurned}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
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
                  <p className="text-gray-700 dark:text-gray-300">{exercise.split(':')[0].trim()}</p> {/* Display exercise name */}
                  <div className="flex space-x-2">
                    {/* Conditionally render inputs based on workoutLogs existence */}
                    {workoutLogs[selectedDateString]?.workouts[workoutIndex]?.exercises[exerciseIndex]?.sets.map((set, setIndex) => (
                      <input
                        key={setIndex}
                        type="number"
                        placeholder={`Set ${setIndex + 1}`}
                        className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        value={
                          workoutLogs[selectedDateString]?.workouts[workoutIndex]?.exercises[exerciseIndex]?.sets[
                            setIndex
                          ] ?? ''
                        }
                        onChange={(e) =>
                          handleInputChange(workoutIndex, exerciseIndex, setIndex, e.target.value)
                        }
                      />
                    )) ||  Array(Math.max(0, parseInt((exercise.match(/(\d+)\s+sets/) || [])[1] || '0', 10))).fill('').map((_, setIndex) => (
                        // Render empty inputs if workoutLogs doesn't exist yet
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
            className="w-full mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-700"
          >
            Save Workout
          </button>
      </section>

      {/* Progress Charts */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Progress</h2>
        <div className="w-full h-64">
          <LineChart width={800} height={250} data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" dark:stroke="#555" />
            <XAxis dataKey="date" stroke="#666" dark:stroke="#ccc" />
            <YAxis stroke="#666" dark:stroke="#ccc" />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', borderColor: '#ccc', color: '#333' }}
              itemStyle={{ color: '#666' }}
              labelStyle={{ fontWeight: 'bold', color: '#333' }}
            />
            <Legend />
            <Line type="monotone" dataKey="pushups" stroke="#8884d8" name="Push-ups" />
            <Line type="monotone" dataKey="planks" stroke="#82ca9d" name="Plank (seconds)" />
          </LineChart>
        </div>
      </section>
    </div>
  );
}

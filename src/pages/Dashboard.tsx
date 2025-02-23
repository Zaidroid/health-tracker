// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Activity, Dumbbell, Award, RefreshCw, ChevronLeft, ChevronRight, TrendingUp, ArrowUp, BarChart, Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HealthMetrics, User } from '../types'; // Import User type
import { workoutSchedule } from '../data/workouts';
import { format, differenceInCalendarWeeks } from 'date-fns';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { createClient } from '@supabase/supabase-js';

// --- Insights Data Type ---
interface InsightsData {
  averageDailySteps: number;
  weeklyWorkoutCompletionRate: number;
  longestWorkoutStreak: number;
}

export default function Dashboard() { // CHANGED: Now a default export
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

  // --- Insights Widget State ---
  const [insightsData, setInsightsData] = useState<InsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    // --- Simulate Fetching Insights Data ---
    const fetchInsightsData = async (currentUser: User) => {
        // --- Supabase Client (Initialized INSIDE the function) ---
        const supabaseUrl = 'https://aojcvcnlnkrhkwulbpkn.supabase.co';
        const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvamN2Y25sbmtyaGt3dWxicGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNDUwNTAsImV4cCI6MjA1NTkyMTA1MH0.07q_q4TT1ub-4p9iqjfy8vAKbuMt0AUZEOeXU6qvd7s';
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

    setIsLoading(true);
    setError(null);

    try {
      // --- Fetch data from Supabase ---
      const { data, error: fetchError } = await supabase
        .from('user_metrics') // *** CHANGE THIS TO YOUR TABLE NAME ***
        .select('date, steps, workout_completed') // *** CHANGE THESE TO YOUR COLUMN NAMES ***
        .eq('user_id', currentUser.id) // Filter by the current user's ID
        .order('date', { ascending: false }); // Order by date (most recent first)

      if (fetchError) {
        throw fetchError;
      }

      if (!data || data.length === 0) {
        setInsightsData(null); // No data found
        return;
      }

      // --- Calculate Insights ---

      // 1. Average Daily Steps (last 7 days)
      const today = new Date();
      const last7Days = data.filter(item => {
          const itemDate = new Date(item.date);
          const diffInDays = Math.floor((today.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
          return diffInDays < 7;
      });

      const totalSteps = last7Days.reduce((sum, item) => sum + (item.steps || 0), 0);
      const averageDailySteps = last7Days.length > 0 ? Math.round(totalSteps / last7Days.length) : 0;

      // 2. Weekly Workout Completion Rate (last 7 days)
      const completedWorkouts = last7Days.filter(item => item.workout_completed).length;
      const weeklyWorkoutCompletionRate = last7Days.length > 0 ? Math.round((completedWorkouts / last7Days.length) * 100) : 0;

      // 3. Longest Workout Streak (Simplified - Ideally done in SQL)
      let longestWorkoutStreak = 0;
      let currentStreak = 0;
      for (const item of data) {
        if (item.workout_completed) {
          currentStreak++;
        } else {
          longestWorkoutStreak = Math.max(longestWorkoutStreak, currentStreak);
          currentStreak = 0;
        }
      }
      longestWorkoutStreak = Math.max(longestWorkoutStreak, currentStreak); // Check final streak


      // --- Prepare data for Recharts ---
      const chartData = [
        { name: 'Avg. Daily Steps', value: averageDailySteps },
        { name: 'Workout Completion %', value: weeklyWorkoutCompletionRate },
        { name: 'Longest Streak', value: longestWorkoutStreak },
      ];

      setInsightsData({
        averageDailySteps,
        weeklyWorkoutCompletionRate,
        longestWorkoutStreak,
      });

    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
    if (user) { // Only fetch if user is logged in
      fetchInsightsData(user);
    }
  }, [user]);


  // Helper function to initialize workout logs
  const getInitialWorkoutLogs = (workouts: typeof workoutSchedule, savedLogs: any) => {
    if (savedLogs) {
        return savedLogs.workouts || []; // Return saved logs if available
    }
    return workouts.map((workout) => ({
      title: workout.title,
      exercises: workout.exercises.map((exercise) => ({
        name: exercise.split(':')[0].trim(),
        sets: Array(parseInt(exercise.split('sets of')[0].split('sets')[0].trim(), 10) || 0).fill(0), // Initialize with 0
      })),
    }));
  };

  useEffect(() => {
    const selectedDay = daysOfWeek[currentDayIndex];
    const selectedDateString = format(new Date(), 'yyyy-MM-dd');
    const todaysWorkouts = workoutSchedule.filter((workout) => workout.day === selectedDay);

    const fetchWorkoutLogs = async () => {
        if (!user) return;

        const supabaseUrl = 'https://aojcvcnlnkrhkwulbpkn.supabase.co';
        const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvamN2Y25sbmtyaGt3dWxicGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNDUwNTAsImV4cCI6MjA1NTkyMTA1MH0.07q_q4TT1ub-4p9iqjfy8vAKbuMt0AUZEOeXU6qvd7s';
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data, error } = await supabase
            .from('user_metrics') // *** CHANGE THIS TO YOUR TABLE NAME ***
            .select('workout_logs')
            .eq('user_id', user.id)
            .eq('date', selectedDateString)
            .single(); // Use .single() to get a single row or null

        if (error) {
            console.error("Error fetching workout logs:", error);
            // Handle error appropriately, e.g., show an error message to the user
        }

        const savedLogs = data ? data.workout_logs : null;

        if (!workoutLogs[selectedDateString] ) {
            setWorkoutLogs((prevLogs) => ({
                ...prevLogs,
                [selectedDateString]: { workouts: getInitialWorkoutLogs(todaysWorkouts, savedLogs) },
            }));
        }
    }

    fetchWorkoutLogs();

  }, [currentDayIndex, daysOfWeek, user]);

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

    const handleSaveWorkout = async () => {
    if (!user) return;

    const todayDateString = format(new Date(), 'yyyy-MM-dd');
    const todaysLogs = workoutLogs[todayDateString];

    if (!todaysLogs) {
      console.warn("No workout logs to save for today.");
      return;
    }

     const supabaseUrl = 'https://aojcvcnlnkrhkwulbpkn.supabase.co';
        const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvamN2Y25sbmtyaGt3dWxicGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNDUwNTAsImV4cCI6MjA1NTkyMTA1MH0.07q_q4TT1ub-4p9iqjfy8vAKbuMt0AUZEOeXU6qvd7s';
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Check if a record for today already exists
    const { data: existingData, error: fetchError } = await supabase
      .from('user_metrics') // *** CHANGE THIS TO YOUR TABLE NAME ***
      .select('id')
      .eq('user_id', user.id)
      .eq('date', todayDateString)
      .single(); // Use .single() to get a single row or null

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error checking for existing workout data:", fetchError);
      return;
    }

    try {
      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('user_metrics') // *** CHANGE THIS TO YOUR TABLE NAME ***
          .update({ workout_logs: todaysLogs })
          .eq('id', existingData.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_metrics') // *** CHANGE THIS TO YOUR TABLE NAME ***
          .insert([
            {
              user_id: user.id,
              date: todayDateString,
              workout_logs: todaysLogs,
              // Add other fields as needed (e.g., steps, if you're tracking them here)
            },
          ]);

        if (error) throw error;
      }
      console.log('Workout saved successfully!');
    } catch (error: any) {
      console.error('Error saving workout:', error);
      // Handle error appropriately, e.g., show an error message to the user
    }
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
        updatedLogs[todayDateString] = { workouts: updatedWorkouts };

      return updatedLogs;
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
        {/* Health Metrics Widgets (Top Row) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


                {/* Health Metrics */}

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 col-span-full">
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
      </div>



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

      {/* Insights Widget (Bottom) */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Lightbulb className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Insights</h2>
          </div>
          {isLoading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading insights...</p>
          ) : error ? (
            <p className="text-red-500 dark:text-red-400">Error: {error}</p>
          ) : insightsData ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart
                data={[
                  { name: 'Avg. Daily Steps', value: insightsData.averageDailySteps },
                  { name: 'Workout Completion %', value: insightsData.weeklyWorkoutCompletionRate },
                  { name: 'Longest Streak', value: insightsData.longestWorkoutStreak },
                ]}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280"/>
                <Tooltip contentStyle={{ backgroundColor: '#374151', borderColor: '#6b7280', color: '#fff' }} />
                <Legend wrapperStyle={{ color: '#9ca3af' }} />
                <Bar dataKey="value" fill="#818cf8" />
              </RechartsBarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No insights data available.</p>
          )}
        </section>
    </div>
  );
}

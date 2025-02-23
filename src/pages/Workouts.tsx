import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { workoutSchedule } from '../data/workouts'; // Import from data file

export function Workouts() {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    setExpandedDay((prevDay) => (prevDay === day ? null : day));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Workouts</h1>

      <p className="text-gray-700 dark:text-gray-300 mb-6">
        This program is designed to help build muscle and improve overall fitness through a structured calisthenics routine. The plan includes upper-body, lower-body, and skill training while allowing progression over six weeks.
      </p>

      {/* Training Schedule */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Training Schedule</h2>

        {workoutSchedule.map(({ day, title, exercises }) => (
          <div key={day} className="mb-4">
            <button
              className="w-full flex items-center justify-between text-left p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              onClick={() => toggleDay(day)}
              aria-expanded={expandedDay === day}
              aria-controls={`content-${day}`}
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{day} - {title}</h3>
              {expandedDay === day ? (
                <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <div
              id={`content-${day}`}
              className={`${expandedDay === day ? 'block' : 'hidden'} mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg`}
            >
              <ul className="list-disc list-inside space-y-2">
                {exercises.map((exercise, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">
                    {exercise}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      {/* Progression Plan (Remains the same) */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Progression Plan (Weeks 1-6)</h2>
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Week 1-2: Focus on mastering form and endurance.</h3>
          <ul className="list-disc list-inside space-y-1">
            <li className="text-gray-700 dark:text-gray-300">Push-ups: 3x10-15</li>
            <li className="text-gray-700 dark:text-gray-300">Pull-ups: 3x3-5</li>
            <li className="text-gray-700 dark:text-gray-300">Planks: 3x20-30 sec</li>
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Week 3-4: Increase reps and intensity.</h3>
          <ul className="list-disc list-inside space-y-1">
            <li className="text-gray-700 dark:text-gray-300">Push-ups: 3x15-20</li>
            <li className="text-gray-700 dark:text-gray-300">Pull-ups: 3x4-6</li>
            <li className="text-gray-700 dark:text-gray-300">Planks: 3x30-45 sec</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Week 5-6: Push towards strength improvements.</h3>
          <ul className="list-disc list-inside space-y-1">
            <li className="text-gray-700 dark:text-gray-300">Push-ups: 3x20+</li>
            <li className="text-gray-700 dark:text-gray-300">Pull-ups: 3x5-7</li>
            <li className="text-gray-700 dark:text-gray-300">Planks: 3x45-60 sec</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

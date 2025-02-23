import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-gray-50 dark:bg-gray-800 py-2 text-center text-sm font-semibold text-gray-900 dark:text-white"
          >
            {day}
          </div>
        ))}
        {days.map((day, dayIdx) => (
          <div
            key={day.toString()}
            className={`
              relative bg-white dark:bg-gray-800 py-8 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer
              ${isToday(day) ? 'bg-indigo-50 dark:bg-indigo-900' : ''}
              ${!isSameMonth(day, currentDate) ? 'text-gray-400 dark:text-gray-500' : ''}
              ${selectedDate && day.toDateString() === selectedDate.toDateString() ? 'border-2 border-indigo-600 dark:border-indigo-400' : ''}
            `}
            onClick={() => setSelectedDate(day)}
          >
            <time
              dateTime={format(day, 'yyyy-MM-dd')}
              className={`
                text-sm
                ${isToday(day) ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'dark:text-white'}
              `}
            >
              {format(day, 'd')}
            </time>
            {/* TODO: Add workout indicators */}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Workout for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          {/* TODO: Add workout details and logging interface */}
        </div>
      )}
    </div>
  );
}

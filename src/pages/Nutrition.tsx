import React, { useState } from 'react';

interface Meal {
  name: string;
  calories: number;
  protein: number;
}

export function Nutrition() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [newMeal, setNewMeal] = useState<Meal>({ name: '', calories: 0, protein: 0 });
  const [imageSrc, setImageSrc] = useState<string | null>(null); // State to store the image

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if ((name === 'calories' || name === 'protein') && !/^\d*$/.test(value)) {
      return;
    }
    setNewMeal({
      ...newMeal,
      [name]: name === 'name' ? value : (value === '' ? 0 : parseInt(value, 10)),
    });
  };

  const handleAddMeal = () => {
    if (newMeal.name && newMeal.calories >= 0 && newMeal.protein >= 0) {
      setMeals([...meals, newMeal]);
      setNewMeal({ name: '', calories: 0, protein: 0 });
      setImageSrc(null); // Clear image after adding meal
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

    const analyzeImage = async (base64Image: string) => {
    // Replace with your actual API key (commented out for security)
    // const apiKey = 'AIzaSyC_mBXjEtf5UUwq3OPrhUKmLmXVwY1pigM';
    const apiKey = 'YOUR_API_KEY';

    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image.split(',')[1], // Remove data URL prefix
          },
          features: [
            { type: 'LABEL_DETECTION', maxResults: 10 },
            { type: 'TEXT_DETECTION', maxResults: 10 },
            // Add more features as needed (e.g., WEB_DETECTION)
          ],
        },
      ],
    };

    // *** Placeholder API Call (Commented Out) ***
    
    // try {
    //   const response = await fetch(
    //     `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(requestBody),
    //     }
    //   );

    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }

    //   const data = await response.json();
    //   console.log('API Response:', data);

    //   // --- Placeholder Response Handling (Example - Adapt as needed) ---
    //   // This is highly dependent on the structure of the API response.
    //   // You'll need to inspect the actual response and adjust this logic.

    //   let mealName = '';
    //   let calories = 0;
    //   let protein = 0;

    //   // Example: Extract meal name from label annotations
    //   if (data.responses[0].labelAnnotations) {
    //       mealName = data.responses[0].labelAnnotations[0]?.description || ''; // Get the top label
    //   }

    //    // Example: Extract calories and protein from text annotations (This is very unreliable and needs refinement)
    //     if (data.responses[0].textAnnotations) {
    //       const text = data.responses[0].textAnnotations[0]?.description || '';
    //       const calorieMatch = text.match(/(\d+)\s*cal/i); // Look for "XXX cal"
    //       const proteinMatch = text.match(/(\d+)\s*g\s*protein/i); // Look for "XXXg protein"

    //       if (calorieMatch) {
    //         calories = parseInt(calorieMatch[1], 10);
    //       }
    //       if (proteinMatch) {
    //         protein = parseInt(proteinMatch[1], 10);
    //       }
    //     }

    //   // Update newMeal state (Placeholder)
    //   setNewMeal({ name: mealName, calories: calories, protein: protein });

    // } catch (error) {
    //   console.error('Error analyzing image:', error);
    //   // Handle errors (e.g., display an error message to the user)
    // }
        console.log("API call would be made here with body:", requestBody);
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Nutrition Tracking</h1>

      {/* Input Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Meal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="mealName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meal Name</label>
            <input
              type="text"
              id="mealName"
              name="name"
              value={newMeal.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Calories</label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={newMeal.calories || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="protein" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Protein (g)</label>
            <input
              type="number"
              id="protein"
              name="protein"
              value={newMeal.protein || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="mt-4">
          <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Image</label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full"
          />
          {imageSrc && (
            <img src={imageSrc} alt="Meal Preview" className="mt-2 max-h-48 rounded-md" />
          )}
        </div>

        <button
          onClick={() => {
            if (imageSrc) {
              analyzeImage(imageSrc);
            }
          }}
          className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-700 active:bg-indigo-800"
          disabled={!imageSrc} // Disable if no image is selected
        >
          Analyze Image
        </button>

        <button
          onClick={handleAddMeal}
          className="mt-4 ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-700 active:bg-green-800"
        >
          Add Meal
        </button>
      </div>

      {/* Meal List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Meal Log</h2>
        {meals.length > 0 ? (
          <ul className="space-y-4">
            {meals.map((meal, index) => (
              <li key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{meal.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Calories: {meal.calories}, Protein: {meal.protein}g
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">No meals logged yet.</p>
        )}
      </div>
    </div>
  );
}

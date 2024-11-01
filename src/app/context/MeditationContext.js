"use client"; // Required to use React hooks in a client component

import { createContext, useState, useContext } from "react";

const MeditationContext = createContext();

export const MeditationProvider = ({ children }) => {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to generate a detailed meditation guide
  const generatePrompt = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", { // Assuming your API endpoint is similar
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meditation: "random" }), // You can adjust the body as necessary
      });

      const data = await response.json();

      if (response.ok) {
        setPrompts((prevPrompts) => [
          {
            id: Date.now(),
            title: data.title,
            introduction: data.introduction,
            steps: data.steps,
            conclusion: data.conclusion,
          },
          ...prevPrompts,
        ]);
      } else {
        console.error("Error generating prompt:", data.message);
      }
    } catch (error) {
      console.error("Error generating prompt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a prompt by its id
  const deletePrompt = (id) => {
    setPrompts((prevPrompts) => prevPrompts.filter((prompt) => prompt.id !== id));
  };

  return (
    <MeditationContext.Provider value={{ prompts, generatePrompt, deletePrompt, isLoading }}>
      {children}
    </MeditationContext.Provider>
  );
};

// Custom hook to use the meditation context
export const useMeditation = () => {
  const context = useContext(MeditationContext);
  if (!context) {
    throw new Error('useMeditation must be used within a MeditationProvider');
  }
  return context;
};


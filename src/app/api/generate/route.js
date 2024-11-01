import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const meditationTypes = [
  "Mindfulness",
  "Affirmation",
  "Breathing Exercise",
  "Guided Imagery",
  "Loving Kindness",
  "Body Scan",
  "Chanting",
  "Visualization"
];

// This will store previously used types to avoid repetition
const usedMeditationTypes = new Set();

export async function POST(req) {
  try {
    const body = await req.json(); // Get the request body
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Check if a specific meditation type is requested
    const requestedType = body.meditationType;
    let randomType;

    // If a specific type is requested and is valid
    if (requestedType && meditationTypes.includes(requestedType)) {
      randomType = requestedType;
    } else {
      // Check if all meditation types have been used
      if (usedMeditationTypes.size === meditationTypes.length) {
        // Reset the set to allow re-generation
        usedMeditationTypes.clear();
      }

      // Select a random type that hasn't been used yet
      do {
        randomType = meditationTypes[Math.floor(Math.random() * meditationTypes.length)];
      } while (usedMeditationTypes.has(randomType));

      // Add the selected type to the used set
      usedMeditationTypes.add(randomType);
    }

    // Construct the prompt for generating a detailed meditation guide
    const promptText = `Generate a detailed ${randomType} meditation guide in JSON format, including:
    - title
    - introduction
    - steps
    - conclusion

    Provide unique and creative content for each section, ensuring it is calming and engaging.

    {
      "title": "The title of the meditation",
      "introduction": "A calming introduction for the meditation.",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "conclusion": "A calming conclusion to end the meditation."
    }`;

    const result = await model.generateContent(promptText);
    let output = await result.response.text();

    // Clean up and parse JSON
    output = output.replace(/```json/g, "").replace(/```/g, "");
    const generatedData = JSON.parse(output);

    return NextResponse.json({
      title: generatedData.title,
      introduction: generatedData.introduction,
      steps: generatedData.steps,
      conclusion: generatedData.conclusion,
    });
  } catch (error) {
    console.error("Error in generate route:", error);
    return NextResponse.json({
      error: "An error occurred while generating the meditation content.",
    });
  }
}


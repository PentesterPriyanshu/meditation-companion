// pages/index.js
import { MeditationProvider } from "./context/MeditationContext"; // Update to MeditationProvider
import MeditationList from "./components/MeditationList"; // Update to MeditationList
import { CopilotPopup } from "@copilotkit/react-ui";

export default function Home() {
  return (
    <>
      <div className="w-full">
        <MeditationProvider>
          <div className="mx-auto">
            <MeditationList />
          </div>
        </MeditationProvider>

        <CopilotPopup
          instructions={`
            Provide a daily meditation prompt based on the user’s selected type. 
            When the user types a number from 1 to 8, respond with a specific meditation prompt.
            Each response should include the meditation type and details in a calming manner.
            
            Meditation types:
            1 - Mindfulness
            2 - Affirmation
            3 - Breathing Exercise
            4 - Guided Imagery
            5 - Loving Kindness
            6 - Body Scan
            7 - Chanting
            8 - Visualization
            
            Format each response as:
            "Meditation Type: [Type]" - "Prompt details."
          `}
          labels={{
            title: "Meditation ",
            initial: `Type a number to get a specific meditation prompt:
            1 - Mindfulness
            2 - Affirmation
            3 - Breathing Exercise
            4 - Guided Imagery
            5 - Loving Kindness
            6 - Body Scan
            7 - Chanting
            8 - Visualization`
          }}
        />
      </div>
    </>
  );
}


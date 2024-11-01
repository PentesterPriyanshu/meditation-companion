"use client";
import React, { useEffect, useState } from "react";
import { useMeditation } from "../context/MeditationContext";
import { Button } from "@/components/ui/button";
import { Heart, RefreshCw, Share2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// Clock component
const Clock = () => {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-white backdrop-blur-lg bg-white/5 p-8 rounded-2xl inline-block transition-transform duration-300 hover:scale-105">
      {time ? (
        <>
          <div className="text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-green-300">
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
          <div className="text-xl text-teal-100/80">
            {time.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

// MeditationCard component with sharing and liking functionality
const MeditationCard = ({ meditation, onDelete, onShare, onLike, liked }) => (
  <Card className="bg-white/5 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader className="flex justify-between items-center">
      <CardTitle className="text-lg font-semibold">{meditation.title || "Meditation Prompt"}</CardTitle>
      <div className="flex space-x-3">
        <Heart
          className={`cursor-pointer hover:scale-110 transition-transform ${liked ? 'text-red-500' : 'text-teal-300'}`}
          onClick={() => onLike(meditation.id)}
        />
        <Share2
          className="text-teal-300 cursor-pointer hover:scale-110 transition-transform"
          onClick={() => onShare(meditation)}
        />
      </div>
    </CardHeader>
    <CardContent className="text-teal-100">
      {meditation.introduction && <p className="mb-4">{meditation.introduction}</p>}
      {meditation.steps && (
        <ul className="list-disc list-inside mb-4 space-y-2">
          {meditation.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      )}
      {meditation.conclusion && <p className="mt-4">{meditation.conclusion}</p>}
    </CardContent>
    <CardFooter>
      <Button variant="outline" onClick={onDelete} className="w-full text-teal-200 hover:text-teal-100">
        Delete
      </Button>
    </CardFooter>
  </Card>
);

const MeditationList = () => {
  const { prompts: meditations, generatePrompt: generateMeditation, deletePrompt: deleteMeditation, isLoading } = useMeditation();
  const [likedMeditations, setLikedMeditations] = useState({});
  const [particlePositions, setParticlePositions] = useState([]);

  useEffect(() => {
    const particles = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${5 + Math.random() * 10}s`,
    }));
    setParticlePositions(particles);
  }, []);

  const handleLike = (id) => {
    setLikedMeditations((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    console.log("Liked meditation with ID:", id);
  };

  const handleShare = (meditation) => {
    const shareText = `${meditation.title}\n\n${meditation.introduction || ""}`;
    console.log("Sharing meditation:", meditation);
    if (navigator.share) {
      navigator.share({
        title: meditation.title,
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Meditation prompt copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-800 via-green-800 to-blue-800 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse -bottom-48 -right-48"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {particlePositions.map((style, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={style}
          ></div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Clock Section */}
        <div className="text-center pt-20 pb-10">
          <Clock />
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mb-10">
          <Button
            onClick={generateMeditation}
            disabled={isLoading}
            className="relative group bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-green-400 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
            <span className="relative flex items-center gap-2">
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate New Meditation"
              )}
            </span>
          </Button>
        </div>

        {/* Meditations Display */}
        <div className="max-w-3xl mx-auto space-y-6">
          {meditations.map((meditation, index) => (
            <div
              key={index}
              className="transform transition-all duration-300 hover:scale-105"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`,
              }}
            >
              <MeditationCard
                meditation={meditation}
                onDelete={() => deleteMeditation(meditation.id)}
                onLike={handleLike}
                onShare={handleShare}
                liked={likedMeditations[meditation.id]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeditationList;

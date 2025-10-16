import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AxesSliders, DEFAULT_VIBE_AXES } from "@/components/AxesSliders";
import { ThumbsUp, ThumbsDown, SkipForward } from "lucide-react";
import { VibeProfile, VibeProfileSchema } from "@/types/venue";
import { trackEvent } from "@/lib/analytics";

// Mock venue cards for calibration swipes
const CALIBRATION_VENUES = [
  {
    id: "cal-1",
    name: "Quiet Library Corner",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400",
    vibe: "quiet",
    description: "Silent study spot with individual desks",
  },
  {
    id: "cal-2",
    name: "Bustling Coffee Shop",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
    vibe: "lively",
    description: "Busy café with music and conversation",
  },
  {
    id: "cal-3",
    name: "Intimate Wine Bar",
    image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400",
    vibe: "romantic",
    description: "Dim lighting, cozy booths, date-night atmosphere",
  },
  {
    id: "cal-4",
    name: "Budget Food Court",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
    vibe: "budget",
    description: "Cheap eats, casual seating, student-friendly",
  },
  {
    id: "cal-5",
    name: "Upscale Restaurant",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    vibe: "upscale",
    description: "Fine dining with formal service and ambiance",
  },
  {
    id: "cal-6",
    name: "Cozy Reading Nook",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
    vibe: "cozy",
    description: "Comfortable chairs, warm lighting, peaceful",
  },
];

/**
 * Onboarding page for vibe profile calibration
 * Per PRD Section 2.1
 */
const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"swipe" | "sliders">("swipe");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [likedVibes, setLikedVibes] = useState<string[]>([]);
  const [dislikedVibes, setDislikedVibes] = useState<string[]>([]);
  const [axes, setAxes] = useState<Record<string, number>>({
    noise_level: 0.5,
    lighting_warmth: 0.5,
    price_level: 0.5,
  });
  const [startTime] = useState(Date.now());

  const currentVenue = CALIBRATION_VENUES[currentCardIndex];
  const progress = ((currentCardIndex + 1) / CALIBRATION_VENUES.length) * 100;

  const handleSwipe = (liked: boolean) => {
    if (liked) {
      setLikedVibes([...likedVibes, currentVenue.vibe]);
    } else {
      setDislikedVibes([...dislikedVibes, currentVenue.vibe]);
    }

    if (currentCardIndex < CALIBRATION_VENUES.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setStep("sliders");
    }
  };

  const handleSkipSwipes = () => {
    setStep("sliders");
  };

  const handleComplete = () => {
    const profile: VibeProfile = {
      preferences: axes as { noise_level: number; lighting_warmth: number; price_level: number },
      liked_vibes: likedVibes,
      disliked_vibes: dislikedVibes,
      completed: true,
    };

    // Save to localStorage
    localStorage.setItem("vibe_profile", JSON.stringify(profile));

    // Track completion
    trackEvent({
      type: "onboarding_completed",
      data: { duration_ms: Date.now() - startTime },
    });

    navigate("/");
  };

  const handleSkipAll = () => {
    const defaultProfile: VibeProfile = {
      preferences: { noise_level: 0.5, lighting_warmth: 0.5, price_level: 0.5 },
      liked_vibes: [],
      disliked_vibes: [],
      completed: false,
    };

    localStorage.setItem("vibe_profile", JSON.stringify(defaultProfile));

    trackEvent({
      type: "onboarding_skipped",
      data: {},
    });

    navigate("/");
  };

  const handleAxisChange = (key: string, value: number) => {
    setAxes({ ...axes, [key]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">V</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              VibeMap
            </span>
          </div>
          <h1 className="text-3xl font-bold">Find Your Vibe</h1>
          <p className="text-muted-foreground">
            {step === "swipe"
              ? "Swipe through some places to calibrate your preferences"
              : "Fine-tune your vibe preferences"}
          </p>
        </div>

        {/* Progress */}
        {step === "swipe" && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-center text-muted-foreground">
              {currentCardIndex + 1} of {CALIBRATION_VENUES.length}
            </p>
          </div>
        )}

        {/* Content */}
        {step === "swipe" ? (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-80 w-full">
                <img
                  src={currentVenue.image}
                  alt={currentVenue.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {currentVenue.name}
                  </h3>
                  <p className="text-sm opacity-90">
                    {currentVenue.description}
                  </p>
                </div>
              </div>
              <div className="p-6 flex gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => handleSwipe(false)}
                >
                  <ThumbsDown className="h-5 w-5 mr-2" />
                  Not for me
                </Button>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={() => handleSwipe(true)}
                >
                  <ThumbsUp className="h-5 w-5 mr-2" />
                  Love it
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Adjust Your Preferences
                </h3>
                <AxesSliders
                  axes={DEFAULT_VIBE_AXES}
                  values={axes}
                  onChange={handleAxisChange}
                />
              </div>
              <Button size="lg" className="w-full" onClick={handleComplete}>
                Complete Setup
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Skip Button */}
        <Button
          variant="ghost"
          className="w-full"
          onClick={step === "swipe" ? handleSkipSwipes : handleSkipAll}
        >
          <SkipForward className="h-4 w-4 mr-2" />
          {step === "swipe" ? "Skip to preferences" : "Skip for now"}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;

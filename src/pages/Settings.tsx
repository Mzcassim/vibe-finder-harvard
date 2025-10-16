import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AxesSliders, DEFAULT_VIBE_AXES } from "@/components/AxesSliders";
import { TagChips } from "@/components/TagChips";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Save, RotateCcw } from "lucide-react";
import { VibeProfile, VibeProfileSchema } from "@/types/venue";
import { toast } from "sonner";

const ALL_VIBE_TAGS = [
  "cozy",
  "studious",
  "romantic",
  "lively",
  "quiet",
  "budget",
  "upscale",
  "hidden_gem",
  "touristy",
  "date_spot",
  "group_friendly",
  "kid_friendly",
  "outdoorsy",
  "third_wave_coffee",
  "late_night",
];

/**
 * Settings page - Adjust vibe preferences and account settings
 */
const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [axes, setAxes] = useState<Record<string, number>>({
    noise_level: 0.5,
    lighting_warmth: 0.5,
    price_level: 0.5,
  });
  const [likedVibes, setLikedVibes] = useState<string[]>([]);
  const [dislikedVibes, setDislikedVibes] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Load current profile
  useEffect(() => {
    const savedProfile = localStorage.getItem("vibe_profile");
    if (savedProfile) {
      try {
        const profile = VibeProfileSchema.parse(JSON.parse(savedProfile));
        setAxes(profile.preferences);
        setLikedVibes(profile.liked_vibes);
        setDislikedVibes(profile.disliked_vibes);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    }
  }, []);

  const handleAxisChange = (key: string, value: number) => {
    setAxes({ ...axes, [key]: value });
    setHasChanges(true);
  };

  const handleLikedToggle = (tag: string) => {
    if (likedVibes.includes(tag)) {
      setLikedVibes(likedVibes.filter((t) => t !== tag));
    } else {
      setLikedVibes([...likedVibes, tag]);
      // Remove from disliked if it's there
      setDislikedVibes(dislikedVibes.filter((t) => t !== tag));
    }
    setHasChanges(true);
  };

  const handleDislikedToggle = (tag: string) => {
    if (dislikedVibes.includes(tag)) {
      setDislikedVibes(dislikedVibes.filter((t) => t !== tag));
    } else {
      setDislikedVibes([...dislikedVibes, tag]);
      // Remove from liked if it's there
      setLikedVibes(likedVibes.filter((t) => t !== tag));
    }
    setHasChanges(true);
  };

  const handleSave = () => {
    const profile: VibeProfile = {
      preferences: axes as { noise_level: number; lighting_warmth: number; price_level: number },
      liked_vibes: likedVibes,
      disliked_vibes: dislikedVibes,
      completed: true,
    };

    localStorage.setItem("vibe_profile", JSON.stringify(profile));
    setHasChanges(false);
    toast.success("Profile updated!", {
      description: "Your preferences have been saved",
    });
  };

  const handleReset = () => {
    const defaultProfile: VibeProfile = {
      preferences: { noise_level: 0.5, lighting_warmth: 0.5, price_level: 0.5 },
      liked_vibes: [],
      disliked_vibes: [],
      completed: true,
    };

    setAxes(defaultProfile.preferences);
    setLikedVibes([]);
    setDislikedVibes([]);
    setHasChanges(true);
    
    toast.info("Reset to defaults", {
      description: "Don't forget to save!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">V</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                VibeMap
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Customize your account and vibe preferences
            </p>
          </div>

          {/* Axes Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preference Sliders</CardTitle>
              <CardDescription>
                Adjust your general preferences for different venue characteristics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AxesSliders
                axes={DEFAULT_VIBE_AXES}
                values={axes}
                onChange={handleAxisChange}
              />
            </CardContent>
          </Card>

          {/* Liked Vibes */}
          <Card>
            <CardHeader>
              <CardTitle>Vibes You Love</CardTitle>
              <CardDescription>
                Select vibes you typically enjoy - we'll prioritize these
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TagChips
                tags={ALL_VIBE_TAGS}
                selectedTags={likedVibes}
                onTagToggle={handleLikedToggle}
                selectable
                variant="default"
              />
              {likedVibes.length === 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  No preferences selected yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Disliked Vibes */}
          <Card>
            <CardHeader>
              <CardTitle>Vibes to Avoid</CardTitle>
              <CardDescription>
                Select vibes you want to avoid - we'll filter these out
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TagChips
                tags={ALL_VIBE_TAGS.filter((tag) => !likedVibes.includes(tag))}
                selectedTags={dislikedVibes}
                onTagToggle={handleDislikedToggle}
                selectable
                variant="outline"
              />
              {dislikedVibes.length === 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  No exclusions set
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleSave}
              disabled={!hasChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>

          {hasChanges && (
            <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
              ⚠️ You have unsaved changes
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

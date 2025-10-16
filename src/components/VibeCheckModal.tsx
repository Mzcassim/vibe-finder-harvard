import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AxesSliders, DEFAULT_VIBE_AXES } from "./AxesSliders";
import { TagChips } from "./TagChips";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { VibeCheck } from "@/types/venue";
import { trackVibeCheck } from "@/lib/analytics";
import { toast } from "sonner";

interface VibeCheckModalProps {
  venueId: string;
  venueName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (check: VibeCheck) => void;
}

const SUGGESTED_TAGS = [
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
];

/**
 * VibeCheckModal for user feedback on venue vibes
 * Per PRD Section 2.5
 */
export const VibeCheckModal: React.FC<VibeCheckModalProps> = ({
  venueId,
  venueName,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [overall, setOverall] = useState<"positive" | "negative" | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [axes, setAxes] = useState<Record<string, number>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickSubmit = async (vote: "positive" | "negative") => {
    setIsSubmitting(true);
    const check: VibeCheck = {
      venue_id: venueId,
      overall: vote,
    };

    try {
      onSubmit?.(check);
      trackVibeCheck(venueId, 0, vote);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      toast.success("Thanks for your feedback!", {
        description: `You've contributed ${Math.floor(Math.random() * 50) + 1} times`,
      });
      
      handleClose();
    } catch (error) {
      toast.error("Failed to submit feedback", {
        description: "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDetailedSubmit = async () => {
    if (!overall) return;

    setIsSubmitting(true);
    const check: VibeCheck = {
      venue_id: venueId,
      overall,
      axes: Object.keys(axes).length > 0 ? axes : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    };

    try {
      onSubmit?.(check);
      trackVibeCheck(venueId, Object.keys(axes).length, overall);
      
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      toast.success("Thanks for the detailed feedback!", {
        description: "Your input helps calibrate this venue's vibe",
      });
      
      handleClose();
    } catch (error) {
      toast.error("Failed to submit feedback", {
        description: "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOverall(null);
    setShowDetails(false);
    setAxes({});
    setSelectedTags([]);
    onClose();
  };

  const handleAxisChange = (key: string, value: number) => {
    setAxes((prev) => ({ ...prev, [key]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vibe Check</DialogTitle>
          <DialogDescription>
            Help us calibrate the vibe for <strong>{venueName}</strong>
          </DialogDescription>
        </DialogHeader>

        {!showDetails ? (
          // Quick feedback
          <div className="space-y-4 py-4">
            <p className="text-sm text-center text-muted-foreground">
              Does this venue match your expectations?
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="flex-1 h-20 flex-col gap-2"
                onClick={() => handleQuickSubmit("positive")}
                disabled={isSubmitting}
              >
                <ThumbsUp className="h-6 w-6" />
                <span>Yes, accurate!</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 h-20 flex-col gap-2"
                onClick={() => handleQuickSubmit("negative")}
                disabled={isSubmitting}
              >
                <ThumbsDown className="h-6 w-6" />
                <span>Not quite</span>
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowDetails(true)}
            >
              Add detailed feedback
            </Button>
          </div>
        ) : (
          // Detailed feedback
          <div className="space-y-6 py-4">
            {/* Overall vote */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Overall Assessment</label>
              <div className="flex gap-2">
                <Button
                  variant={overall === "positive" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setOverall("positive")}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Accurate
                </Button>
                <Button
                  variant={overall === "negative" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setOverall("negative")}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Inaccurate
                </Button>
              </div>
            </div>

            {/* Axes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Adjust Vibe Levels (Optional)
              </label>
              <AxesSliders
                axes={DEFAULT_VIBE_AXES}
                values={axes}
                onChange={handleAxisChange}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Add Tags (Optional)
              </label>
              <TagChips
                tags={SUGGESTED_TAGS}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
                selectable
              />
            </div>
          </div>
        )}

        {showDetails && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Back
            </Button>
            <Button
              onClick={handleDetailedSubmit}
              disabled={!overall || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

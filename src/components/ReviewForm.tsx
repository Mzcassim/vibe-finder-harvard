import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RatingStars } from "@/components/RatingStars";
import { toast } from "sonner";

interface ReviewFormProps {
  venueId: string;
  venueName: string;
  onSubmit?: (rating: number, reviewText: string) => void;
  existingReview?: {
    rating: number;
    text: string;
  };
  onCancel?: () => void;
}

/**
 * Form for submitting or editing a review
 */
export const ReviewForm: React.FC<ReviewFormProps> = ({
  venueId,
  venueName,
  onSubmit,
  existingReview,
  onCancel,
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [reviewText, setReviewText] = useState(existingReview?.text || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (reviewText.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    if (reviewText.length > 500) {
      toast.error("Review must be less than 500 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(rating, reviewText);
      }
      
      // Reset form if new review
      if (!existingReview) {
        setRating(0);
        setReviewText("");
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {existingReview ? "Edit Your Review" : "Write a Review"}
        </CardTitle>
        <CardDescription>
          Share your experience at {venueName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Your Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <RatingStars
                rating={rating}
                onRate={setRating}
                size="lg"
              />
              {rating > 0 && (
                <span className="text-sm text-muted-foreground">
                  {["Terrible", "Poor", "Average", "Good", "Excellent"][rating - 1]}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Your Review <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Share details about your experience, the vibe, what you loved..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
              maxLength={500}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Minimum 10 characters</span>
              <span
                className={reviewText.length > 450 ? "text-amber-600" : ""}
              >
                {reviewText.length}/500
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || reviewText.trim().length < 10}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

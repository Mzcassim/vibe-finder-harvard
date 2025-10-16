import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/RatingStars";
import { ThumbsUp, Edit, Trash2, Flag } from "lucide-react";
import { Review } from "@/types/user";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
  onUpvote?: (reviewId: string) => void;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  onFlag?: (reviewId: string) => void;
  hasUpvoted?: boolean;
  isOwnReview?: boolean;
}

/**
 * Display a single review with actions
 */
export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onUpvote,
  onEdit,
  onDelete,
  onFlag,
  hasUpvoted = false,
  isOwnReview = false,
}) => {
  const [upvoted, setUpvoted] = useState(hasUpvoted);
  const [upvoteCount, setUpvoteCount] = useState(review.upvotes);

  const handleUpvote = () => {
    if (onUpvote) {
      onUpvote(review.review_id);
      setUpvoted(!upvoted);
      setUpvoteCount(upvoted ? upvoteCount - 1 : upvoteCount + 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <button
                className="font-semibold hover:underline"
                onClick={() => window.location.href = `/user/${encodeURIComponent(review.username)}`}
              >
                {review.username}
              </button>
              <div className="flex items-center gap-2 mt-1">
                <RatingStars rating={review.rating} readonly size="sm" />
                <span className="text-xs text-muted-foreground">
                  {formatDate(review.created_at)}
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1">
              {isOwnReview ? (
                <>
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(review)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this review?")) {
                          onDelete(review.review_id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </>
              ) : (
                onFlag && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onFlag(review.review_id)}
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Review Text */}
          <p className="text-sm leading-relaxed">{review.review_text}</p>

          {/* Upvote */}
          {onUpvote && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button
                variant={upvoted ? "default" : "outline"}
                size="sm"
                onClick={handleUpvote}
                className="gap-2"
              >
                <ThumbsUp className={cn("h-3 w-3", upvoted && "fill-current")} />
                <span className="text-xs font-medium">Helpful ({upvoteCount})</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

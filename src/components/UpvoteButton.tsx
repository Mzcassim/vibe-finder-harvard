import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UpvoteButtonProps {
  venueId: string;
  initialCount?: number;
  size?: "sm" | "default" | "lg";
  showCount?: boolean;
}

/**
 * Upvote button component for venues
 */
export const UpvoteButton: React.FC<UpvoteButtonProps> = ({
  venueId,
  initialCount = 0,
  size = "default",
  showCount = true,
}) => {
  const [upvoted, setUpvoted] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has already upvoted
  useEffect(() => {
    const userId = localStorage.getItem("user_email") || "anonymous";
    const upvotesKey = `upvotes_${venueId}`;
    const upvotes = JSON.parse(localStorage.getItem(upvotesKey) || "[]");
    setUpvoted(upvotes.includes(userId));
    setCount(upvotes.length);
  }, [venueId]);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/venues/${venueId}/upvote`, {
        method: "POST",
      });
      
      if (!response.ok) throw new Error("Failed to upvote");
      
      const data = await response.json();
      setUpvoted(data.upvoted);
      setCount(data.total_upvotes);
      
      if (data.upvoted) {
        toast.success("Upvoted!", {
          description: "Your support helps others discover great places",
        });
      }
    } catch (error) {
      console.error("Failed to upvote:", error);
      toast.error("Failed to upvote", {
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={upvoted ? "default" : "outline"}
      size={size}
      onClick={handleUpvote}
      disabled={isLoading}
      className={cn(
        "gap-2",
        upvoted && "bg-primary hover:bg-primary/90"
      )}
    >
      <ThumbsUp 
        className={cn(
          "h-4 w-4",
          upvoted && "fill-current"
        )} 
      />
      {showCount && <span className="font-semibold">{count}</span>}
    </Button>
  );
};

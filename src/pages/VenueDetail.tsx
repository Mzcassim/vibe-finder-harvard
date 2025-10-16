import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RadarChart } from "@/components/RadarChart";
import { UncertaintyPill } from "@/components/UncertaintyPill";
import { TagChips } from "@/components/TagChips";
import { VibeCheckModal } from "@/components/VibeCheckModal";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewForm } from "@/components/ReviewForm";
import { UpvoteButton } from "@/components/UpvoteButton";
import { RatingStars } from "@/components/RatingStars";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  MapPin,
  Star,
  Heart,
  Share2,
  Navigation,
  MessageSquare,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import { Review } from "@/types/user";
import { VenueVM, VibeCheck, VenueSchema } from "@/types/venue";
import { toVenueVM } from "@/lib/adapters";
import { HARVARD_SQUARE, getUserLocation } from "@/lib/geo";
import { trackVenueOpened } from "@/lib/analytics";
import { toast } from "sonner";

/**
 * VenueDetail page - detailed venue view with vibe check
 * Per PRD Section 2.4
 */
const VenueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [venue, setVenue] = useState<VenueVM | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showVibeCheck, setShowVibeCheck] = useState(false);
  const [userGeo, setUserGeo] = useState(HARVARD_SQUARE);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const currentUser = localStorage.getItem("user_email");

  // Get user location
  useEffect(() => {
    getUserLocation().then((loc) => {
      if (loc) setUserGeo(loc);
    });
  }, []);

  // Fetch venue details
  useEffect(() => {
    if (!id) return;

    const fetchVenue = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/venues/${id}`);
        if (!response.ok) throw new Error("Venue not found");
        
        const data = await response.json();
        const validated = VenueSchema.parse(data);
        const vm = toVenueVM(validated, userGeo);
        
        setVenue(vm);
        trackVenueOpened(id, "list");
      } catch (error) {
        console.error("Failed to fetch venue:", error);
        toast.error("Failed to load venue details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenue();
  }, [id, userGeo]);

  // Check if saved
  useEffect(() => {
    const saved = localStorage.getItem("saved_venues");
    if (saved) {
      try {
        const ids = JSON.parse(saved) as string[];
        setIsSaved(ids.includes(id || ""));
      } catch (error) {
        console.error("Failed to check saved status:", error);
      }
    }
  }, [id]);

  const handleSave = () => {
    const saved = localStorage.getItem("saved_venues");
    let ids: string[] = [];
    
    if (saved) {
      try {
        ids = JSON.parse(saved);
      } catch (error) {
        console.error("Failed to parse saved venues:", error);
      }
    }

    if (isSaved) {
      ids = ids.filter((i) => i !== id);
      toast.success("Removed from saved");
    } else {
      ids.push(id || "");
      toast.success("Saved!");
    }

    localStorage.setItem("saved_venues", JSON.stringify(ids));
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const handleVibeCheckSubmit = async (check: VibeCheck) => {
    try {
      const response = await fetch("/api/vibe-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(check),
      });

      if (!response.ok) throw new Error("Failed to submit");
    } catch (error) {
      console.error("Vibe check failed:", error);
      throw error;
    }
  };

  // Fetch reviews
  useEffect(() => {
    if (!id) return;
    
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/venues/${id}/reviews`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (rating: number, reviewText: string) => {
    try {
      if (editingReview) {
        // Update existing review
        const response = await fetch(`/api/reviews/${editingReview.review_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating,
            review_text: reviewText,
          }),
        });

        if (!response.ok) throw new Error("Failed to update review");
        
        const updatedReview = await response.json();
        setReviews(reviews.map(r => r.review_id === updatedReview.review_id ? updatedReview : r));
        setEditingReview(null);
        setShowReviewForm(false);
        toast.success("Review updated!");
      } else {
        // Create new review
        const response = await fetch(`/api/venues/${id}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating,
            review_text: reviewText,
          }),
        });

        if (!response.ok) throw new Error("Failed to submit review");
        
        const newReview = await response.json();
        setReviews([newReview, ...reviews]);
        setShowReviewForm(false);
        toast.success("Review submitted!", {
          description: "Thanks for sharing your experience!",
        });
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error(editingReview ? "Failed to update review" : "Failed to submit review");
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete review");

      setReviews(reviews.filter(r => r.review_id !== reviewId));
      toast.success("Review deleted");
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review");
    }
  };

  const handleDeleteContribution = async () => {
    if (!window.confirm("Are you sure you want to delete this contribution?")) {
      return;
    }

    try {
      const response = await fetch(`/api/venues/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Contribution deleted");
      navigate("/explore");
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete contribution");
    }
  };

  const handleEditContribution = () => {
    navigate(`/contribute?edit=${id}`);
  };

  const isOwnContribution = venue && venue.contributorName === currentUser && venue.isVerified === false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Venue Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The venue you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
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

      <div className="container mx-auto px-4 py-8">
        {/* Hero Image */}
        {venue.heroImage && (
          <div className="relative h-96 w-full overflow-hidden rounded-lg mb-6">
            <img
              src={venue.heroImage}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{venue.name}</h1>
              {venue.address && (
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <MapPin className="h-4 w-4" />
                  <span>{venue.address}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-4 flex-1">
                    {!venue.heroImage && (
                      <CardTitle className="text-3xl">{venue.name}</CardTitle>
                    )}
                    
                    <div className="flex flex-wrap gap-2 items-center">
                      {venue.category && (
                        <Badge variant="secondary">{venue.category}</Badge>
                      )}
                      <TagChips tags={venue.tags.slice(0, 4)} variant="outline" />
                      <UncertaintyPill confidence={venue.confidence} />
                    </div>

                    {venue.rating && (
                      <div className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-lg w-fit">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-medium text-accent">
                          {venue.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleSave}>
                      <Heart
                        className={`h-4 w-4 ${
                          isSaved ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Vibe Analysis */}
            {venue.radar.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Vibe Analysis</CardTitle>
                  <CardDescription>
                    How this venue rates across different dimensions
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                  <RadarChart axes={venue.radar} size={400} className="max-w-full" />
                </CardContent>
              </Card>
            )}

            {/* Description/About - Only show for user contributions */}
            {venue.rationale.length > 0 && venue.isVerified === false && (
              <Card>
                <CardHeader>
                  <CardTitle>About This Place</CardTitle>
                  <CardDescription>
                    Description provided by contributor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {venue.rationale.map((reason, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-muted-foreground">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Time Notes */}
            {venue.timeNotes && (
              <Card className="border-amber-200 dark:border-amber-900">
                <CardContent className="p-4">
                  <div className="flex gap-2 text-amber-700 dark:text-amber-300">
                    <span>⏰</span>
                    <p className="text-sm">{venue.timeNotes}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contributor Attribution & Edit/Delete */}
            {venue.isVerified === false && (
              <Card className="border-amber-200 dark:border-amber-900">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm text-muted-foreground">Contributed by</span>
                      {!venue.isAnonymous && venue.contributorName ? (
                        <button
                          onClick={() => navigate(`/user/${encodeURIComponent(venue.contributorName!)}`)}
                          className="text-sm font-medium text-amber-700 dark:text-amber-300 hover:underline"
                        >
                          {venue.contributorName}
                        </button>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">Anonymous</span>
                      )}
                    </div>
                    
                    {isOwnContribution && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditContribution}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDeleteContribution}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Reviews ({reviews.length})</CardTitle>
                    <CardDescription>
                      What others are saying about this place
                    </CardDescription>
                  </div>
                  {!showReviewForm && (
                    <Button onClick={() => setShowReviewForm(true)}>
                      Write a Review
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showReviewForm && (
                  <ReviewForm
                    venueId={id!}
                    venueName={venue.name}
                    onSubmit={handleReviewSubmit}
                    onCancel={() => {
                      setShowReviewForm(false);
                      setEditingReview(null);
                    }}
                    existingReview={editingReview ? {
                      rating: editingReview.rating,
                      text: editingReview.review_text,
                    } : undefined}
                  />
                )}

                {reviews.length === 0 && !showReviewForm ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground mb-4">
                      No reviews yet. Be the first to share your experience!
                    </p>
                    <Button onClick={() => setShowReviewForm(true)}>
                      Write First Review
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard
                        key={review.review_id}
                        review={review}
                        isOwnReview={review.user_id === currentUser}
                        onEdit={handleEditReview}
                        onDelete={handleDeleteReview}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <UpvoteButton venueId={venue.id} size="lg" showCount />
                <Button className="w-full" size="lg">
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => setShowVibeCheck(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Vibe Check
                </Button>
              </CardContent>
            </Card>

            {/* Distance */}
            {venue.distanceText && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Distance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">
                    {venue.distanceText}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Vibe Check Modal */}
      <VibeCheckModal
        venueId={venue.id}
        venueName={venue.name}
        isOpen={showVibeCheck}
        onClose={() => setShowVibeCheck(false)}
        onSubmit={handleVibeCheckSubmit}
      />
    </div>
  );
};

export default VenueDetail;

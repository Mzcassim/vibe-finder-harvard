import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VenueCard } from "@/components/VenueCard";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Edit, MapPin, Star, ThumbsUp, Award, Calendar } from "lucide-react";
import { UserActivity, calculateEarnedBadges, getNextBadgeProgress, BADGES } from "@/types/user";
import { VenueVM, SearchResponseSchema } from "@/types/venue";
import { toVenueVMs } from "@/lib/adapters";
import { HARVARD_SQUARE } from "@/lib/geo";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Public user profile page showing contributions, stats, and badges
 */
const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [userData, setUserData] = useState<UserActivity | null>(null);
  const [contributions, setContributions] = useState<VenueVM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = localStorage.getItem("user_email");
  const isOwnProfile = currentUser === decodeURIComponent(username || "");

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch user stats
        const userResponse = await fetch(`/api/users/${username}`);
        const user = await userResponse.json();
        setUserData(user);

        // Fetch user's contributions
        const contribResponse = await fetch(`/api/users/${username}/contributions`);
        const contribData = await contribResponse.json();
        const validated = SearchResponseSchema.parse(contribData);
        const vms = toVenueVMs(validated.items, HARVARD_SQUARE);
        setContributions(vms);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-48" />
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This user doesn't exist or hasn't made any contributions yet.
            </p>
            <Button onClick={() => navigate("/")}>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const earnedBadges = calculateEarnedBadges(userData.stats);
  const nextBadges = getNextBadgeProgress(userData.stats);
  const allBadges = BADGES;

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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-white">
                    {userData.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{userData.username}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Joined {new Date(userData.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                {isOwnProfile && (
                  <Button variant="outline" onClick={() => navigate("/settings")}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Settings
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold">{userData.stats.contributions_count}</p>
                <p className="text-sm text-muted-foreground">Contributions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <ThumbsUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold">{userData.stats.upvotes_received}</p>
                <p className="text-sm text-muted-foreground">Upvotes Received</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold">{userData.stats.reviews_count}</p>
                <p className="text-sm text-muted-foreground">Reviews</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold">{earnedBadges.length}</p>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
              </CardContent>
            </Card>
          </div>

          {/* Badges Section */}
          <Card>
            <CardHeader>
              <CardTitle>🏆 Achievements</CardTitle>
              <CardDescription>
                Earned {earnedBadges.length} of {allBadges.length} badges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Earned Badges */}
                {earnedBadges.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Unlocked</h3>
                    <div className="flex flex-wrap gap-4">
                      {earnedBadges.map((badge) => (
                        <BadgeDisplay key={badge.id} badge={badge} earned={true} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Badges */}
                {nextBadges.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3">In Progress</h3>
                    <div className="space-y-3">
                      {nextBadges.map(({ badge, progress, remaining }) => (
                        <div key={badge.id} className="flex items-center gap-4">
                          <BadgeDisplay badge={badge} earned={false} progress={progress} size="sm" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{badge.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {remaining} more to unlock
                            </p>
                            <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contributions */}
          <Card>
            <CardHeader>
              <CardTitle>📍 Contributions</CardTitle>
              <CardDescription>
                {contributions.length} venue{contributions.length !== 1 ? "s" : ""} added to the map
                {isOwnProfile && contributions.some(v => v.isAnonymous) && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (includes anonymous contributions)
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contributions.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No contributions yet</p>
                  {isOwnProfile && (
                    <Button
                      className="mt-4"
                      onClick={() => navigate("/contribute")}
                    >
                      Add Your First Venue
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {contributions.map((venue) => (
                    <VenueCard
                      key={venue.id}
                      vm={venue}
                      onOpen={(id) => navigate(`/venue/${id}`)}
                      source="list"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

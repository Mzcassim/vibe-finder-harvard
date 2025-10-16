import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VenueCard } from "@/components/VenueCard";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Check, X, Shield } from "lucide-react";
import { VenueVM, SearchResponseSchema } from "@/types/venue";
import { toVenueVMs } from "@/lib/adapters";
import { HARVARD_SQUARE, getUserLocation } from "@/lib/geo";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

/**
 * Admin Verify page - Review and verify user-submitted venues
 */
const AdminVerify: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [unverifiedVenues, setUnverifiedVenues] = useState<VenueVM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userGeo, setUserGeo] = useState(HARVARD_SQUARE);

  // Get user location
  useEffect(() => {
    getUserLocation().then((loc) => {
      if (loc) setUserGeo(loc);
    });
  }, []);

  // Fetch unverified venues
  useEffect(() => {
    const fetchUnverified = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/unverified");
        const data = await response.json();
        const validated = SearchResponseSchema.parse(data);
        const vms = toVenueVMs(validated.items, userGeo);
        setUnverifiedVenues(vms);
      } catch (error) {
        console.error("Failed to fetch unverified venues:", error);
        setUnverifiedVenues([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnverified();
  }, [userGeo]);

  const handleVerify = async (venueId: string, approved: boolean) => {
    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venue_id: venueId, approved }),
      });

      if (!response.ok) throw new Error("Failed to verify");

      toast.success(approved ? "Venue approved!" : "Venue rejected", {
        description: approved 
          ? "The venue is now visible on the map" 
          : "The venue has been removed",
      });

      // Remove from list
      setUnverifiedVenues(unverifiedVenues.filter((v) => v.id !== venueId));
    } catch (error) {
      console.error("Failed to verify venue:", error);
      toast.error("Failed to process verification");
    }
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
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Admin Verification
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Venue Verification</h1>
            <p className="text-muted-foreground">
              Review and approve user-contributed venues
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {unverifiedVenues.length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {Math.floor(Math.random() * 15) + 5}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Total Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {Math.floor(Math.random() * 100) + 50}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Unverified Venues List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {isLoading ? "Loading..." : `${unverifiedVenues.length} Pending Venues`}
            </h2>

            {isLoading ? (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-lg" />
                ))}
              </>
            ) : unverifiedVenues.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">
                    There are no pending venues to review.
                  </p>
                </CardContent>
              </Card>
            ) : (
              unverifiedVenues.map((venue) => (
                <div key={venue.id} className="relative">
                  <VenueCard
                    vm={venue}
                    onOpen={(id) => navigate(`/venue/${id}`)}
                    source="list"
                  />
                  
                  {/* Verification Actions */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleVerify(venue.id, false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleVerify(venue.id, true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVerify;

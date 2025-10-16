import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VenueCard } from "@/components/VenueCard";
import { ArrowLeft, FolderPlus, Trash2 } from "lucide-react";
import { VenueVM } from "@/types/venue";
import { useAuth } from "@/contexts/AuthContext";
import { HARVARD_SQUARE } from "@/lib/geo";
import { toVenueVMs } from "@/lib/adapters";
import { MOCK_VENUES } from "@/mocks/data";

interface Collection {
  id: string;
  name: string;
  venueIds: string[];
  created_at: string;
}

/**
 * Saved venues and collections page
 * Per PRD Section 2.6
 */
const Saved: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [savedVenueIds, setSavedVenueIds] = useState<Set<string>>(new Set());
  const [collections, setCollections] = useState<Collection[]>([]);
  const [venues, setVenues] = useState<VenueVM[]>([]);

  // Load saved venues from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("saved_venues");
    if (saved) {
      try {
        const ids = JSON.parse(saved) as string[];
        setSavedVenueIds(new Set(ids));
      } catch (error) {
        console.error("Failed to load saved venues:", error);
      }
    }

    const savedCollections = localStorage.getItem("collections");
    if (savedCollections) {
      try {
        setCollections(JSON.parse(savedCollections));
      } catch (error) {
        console.error("Failed to load collections:", error);
      }
    }
  }, []);

  // Load venue data for saved IDs
  useEffect(() => {
    if (savedVenueIds.size === 0) {
      setVenues([]);
      return;
    }

    // In a real app, fetch from API
    // For now, filter from mock data
    const savedVenues = MOCK_VENUES.filter((v) =>
      savedVenueIds.has(v.venue_id)
    );
    const vms = toVenueVMs(savedVenues, HARVARD_SQUARE);
    setVenues(vms);
  }, [savedVenueIds]);

  const handleUnsave = (id: string) => {
    const newSaved = new Set(savedVenueIds);
    newSaved.delete(id);
    setSavedVenueIds(newSaved);
    
    // Save to localStorage
    localStorage.setItem("saved_venues", JSON.stringify([...newSaved]));
  };

  const handleVenueOpen = (id: string) => {
    navigate(`/venue/${id}`);
  };

  const handleCreateCollection = () => {
    const name = prompt("Collection name:");
    if (!name) return;

    const newCollection: Collection = {
      id: `col-${Date.now()}`,
      name,
      venueIds: [],
      created_at: new Date().toISOString(),
    };

    const updated = [...collections, newCollection];
    setCollections(updated);
    localStorage.setItem("collections", JSON.stringify(updated));
  };

  const handleDeleteCollection = (id: string) => {
    if (!confirm("Delete this collection?")) return;

    const updated = collections.filter((c) => c.id !== id);
    setCollections(updated);
    localStorage.setItem("collections", JSON.stringify(updated));
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

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Saved Venues Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Saved Venues</h1>
            <p className="text-muted-foreground">
              {venues.length} saved
            </p>
          </div>

          {venues.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No saved venues yet
                </p>
                <Button onClick={() => navigate("/")}>
                  Start Exploring
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  vm={venue}
                  onOpen={handleVenueOpen}
                  onSave={handleUnsave}
                  isSaved={true}
                  source="list"
                />
              ))}
            </div>
          )}
        </section>

        {/* Collections Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Collections</h2>
            <Button onClick={handleCreateCollection}>
              <FolderPlus className="h-4 w-4 mr-2" />
              New Collection
            </Button>
          </div>

          {collections.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No collections yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Organize your saved venues into collections
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => (
                <Card key={collection.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">
                        {collection.name}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCollection(collection.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {collection.venueIds.length} venue{collection.venueIds.length === 1 ? "" : "s"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Created {new Date(collection.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Saved;

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapView } from "@/components/MapView";
import { useAuth } from "@/contexts/AuthContext";
import {
    ArrowLeft,
    MapPin,
    Star,
    Clock,
    Phone,
    Globe,
    Navigation,
    Heart,
    Share2,
    ChevronDown,
    ChevronUp
} from "lucide-react";

// Mock data - in a real app, this would come from an API
const LOCATION_DATA: Record<string, {
    name: string;
    address: string;
    rating: number;
    category: string;
    vibe: string;
    distance: string;
    phone: string;
    website: string;
    hours: string;
    description: string;
    vibeLevels: Record<string, number>;
    reviews: Array<{
        id: number;
        author: string;
        rating: number;
        text: string;
        date: string;
    }>;
    amenities: string[];
}> = {
    "cafe-nero": {
        name: "Café Nero",
        address: "1 Harvard Square, Cambridge, MA 02138",
        rating: 4.5,
        category: "Coffee Shop",
        vibe: "cozy studying",
        distance: "0.2 mi",
        phone: "(617) 876-5432",
        website: "www.caffenero.com",
        hours: "Mon-Fri: 6:00 AM - 10:00 PM, Sat-Sun: 7:00 AM - 11:00 PM",
        description: "A cozy European-style coffee shop perfect for studying, working, or catching up with friends. Known for its authentic Italian coffee and comfortable seating.",
        vibeLevels: {
            quiet: 4,
            social: 2,
            energetic: 1,
            romantic: 3,
            productive: 5
        },
        reviews: [
            {
                id: 1,
                author: "Sarah M.",
                rating: 5,
                text: "Perfect study spot! Great coffee and the atmosphere is exactly what I need to focus.",
                date: "2 days ago"
            },
            {
                id: 2,
                author: "Mike R.",
                rating: 4,
                text: "Love the Italian vibes here. Coffee is authentic and the staff is friendly.",
                date: "1 week ago"
            },
            {
                id: 3,
                author: "Emily K.",
                rating: 4,
                text: "Great location right in Harvard Square. Can get busy during peak hours but worth it.",
                date: "2 weeks ago"
            }
        ],
        amenities: ["WiFi", "Outdoor Seating", "Pet Friendly", "Takeout", "Delivery"]
    },
    "the-sinclair": {
        name: "The Sinclair",
        address: "52 Church St, Cambridge, MA 02138",
        rating: 4.7,
        category: "Bar & Music",
        vibe: "lively social",
        distance: "0.3 mi",
        phone: "(617) 547-5200",
        website: "www.thesinclaircambridge.com",
        hours: "Tue-Thu: 5:00 PM - 1:00 AM, Fri-Sat: 5:00 PM - 2:00 AM, Sun: 6:00 PM - 12:00 AM",
        description: "A vibrant music venue and bar featuring live performances, craft cocktails, and a lively atmosphere perfect for socializing and entertainment.",
        vibeLevels: {
            quiet: 1,
            social: 5,
            energetic: 5,
            romantic: 2,
            productive: 1
        },
        reviews: [
            {
                id: 1,
                author: "Alex T.",
                rating: 5,
                text: "Amazing venue! Great sound quality and intimate setting. Perfect for discovering new music.",
                date: "3 days ago"
            },
            {
                id: 2,
                author: "Jessica L.",
                rating: 4,
                text: "Love the atmosphere here. Drinks are creative and the staff knows their music.",
                date: "1 week ago"
            }
        ],
        amenities: ["Live Music", "Full Bar", "Dance Floor", "Private Events", "Coat Check"]
    },
    "tatte-bakery": {
        name: "Tatte Bakery",
        address: "1288 Massachusetts Ave, Cambridge, MA 02138",
        rating: 4.6,
        category: "Bakery & Café",
        vibe: "instagram-worthy",
        distance: "0.4 mi",
        phone: "(617) 945-2800",
        website: "www.tattebakery.com",
        hours: "Daily: 6:30 AM - 8:00 PM",
        description: "A beautiful Middle Eastern-inspired bakery and café known for its stunning presentation, delicious pastries, and Instagram-worthy aesthetic.",
        vibeLevels: {
            quiet: 3,
            social: 4,
            energetic: 2,
            romantic: 4,
            productive: 3
        },
        reviews: [
            {
                id: 1,
                author: "Rachel G.",
                rating: 5,
                text: "The most beautiful café! Every corner is Instagram-worthy and the food is incredible.",
                date: "1 day ago"
            },
            {
                id: 2,
                author: "David P.",
                rating: 4,
                text: "Great pastries and coffee. The interior design is absolutely stunning.",
                date: "4 days ago"
            }
        ],
        amenities: ["WiFi", "Outdoor Seating", "Takeout", "Delivery", "Photogenic"]
    },
    "widener-library": {
        name: "Widener Library",
        address: "Harvard Yard, Cambridge, MA 02138",
        rating: 4.8,
        category: "Library",
        vibe: "quiet reading",
        distance: "0.5 mi",
        phone: "(617) 495-2413",
        website: "library.harvard.edu",
        hours: "Mon-Thu: 8:00 AM - 11:00 PM, Fri: 8:00 AM - 8:00 PM, Sat-Sun: 10:00 AM - 6:00 PM",
        description: "Harvard's flagship library, one of the largest academic libraries in the world. A peaceful sanctuary for serious study and research.",
        vibeLevels: {
            quiet: 5,
            social: 1,
            energetic: 1,
            romantic: 2,
            productive: 5
        },
        reviews: [
            {
                id: 1,
                author: "Jennifer W.",
                rating: 5,
                text: "The ultimate study spot. Silent, beautiful, and inspiring. A true academic sanctuary.",
                date: "2 days ago"
            },
            {
                id: 2,
                author: "Robert H.",
                rating: 5,
                text: "Incredible architecture and atmosphere. Perfect for deep focus and research.",
                date: "1 week ago"
            }
        ],
        amenities: ["Silent Study", "Research Resources", "Computers", "Printing", "Study Rooms"]
    }
};

const LocationDetail = () => {
    const { locationId } = useParams<{ locationId: string }>();
    const { logout } = useAuth();
    const [showAllReviews, setShowAllReviews] = useState(false);

    // Find the location data
    const location = locationId ? LOCATION_DATA[locationId] : undefined;

    if (!location) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">Location Not Found</h2>
                        <p className="text-muted-foreground mb-6">The location you're looking for doesn't exist.</p>
                        <Link to="/">
                            <Button>Back to Search</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
    };

    const getVibeLevel = (level: number) => {
        return "★".repeat(level) + "☆".repeat(5 - level);
    };

    const getVibeColor = (level: number) => {
        if (level >= 4) return "text-green-500";
        if (level >= 3) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Search
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                                <span className="text-lg font-bold text-primary-foreground">V</span>
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                VibeMap
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Harvard Area</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="flex items-center gap-2"
                        >
                            <span>Sign Out</span>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Location Header */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-3xl mb-2">{location.name}</CardTitle>
                                        <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                            <MapPin className="h-4 w-4" />
                                            <span>{location.address}</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-lg w-fit">
                                            <Star className="h-4 w-4 fill-accent text-accent" />
                                            <span className="font-medium text-accent">{location.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon">
                                            <Heart className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="secondary">{location.category}</Badge>
                                    <Badge variant="outline" className="border-primary text-primary">
                                        {location.vibe}
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground mb-4">{location.description}</p>
                                <div className="text-sm text-muted-foreground">
                                    {location.distance} away
                                </div>
                            </CardContent>
                        </Card>

                        {/* Vibe Levels */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Vibe Analysis</CardTitle>
                                <CardDescription>How this place rates across different vibes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Object.entries(location.vibeLevels).map(([vibe, level]) => (
                                        <div key={vibe} className="flex items-center justify-between">
                                            <span className="capitalize font-medium">{vibe}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`${getVibeColor(level as number)} font-mono`}>
                                                    {getVibeLevel(level as number)}
                                                </span>
                                                <span className="text-sm text-muted-foreground w-8">
                                                    {level}/5
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reviews */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Reviews</CardTitle>
                                <CardDescription>What people are saying about this place</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {(showAllReviews ? location.reviews : location.reviews.slice(0, 2)).map((review) => (
                                        <div key={review.id} className="border-l-2 border-primary/20 pl-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-medium">{review.author}</span>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-3 w-3 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-muted-foreground">{review.date}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{review.text}</p>
                                        </div>
                                    ))}
                                    {location.reviews.length > 2 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowAllReviews(!showAllReviews)}
                                            className="flex items-center gap-2"
                                        >
                                            {showAllReviews ? (
                                                <>
                                                    <ChevronUp className="h-4 w-4" />
                                                    Show Less
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="h-4 w-4" />
                                                    Show All Reviews
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Map */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Navigation className="h-4 w-4" />
                                    Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 rounded-lg overflow-hidden">
                                    <MapView className="h-full w-full" />
                                </div>
                                <Button className="w-full mt-4">
                                    <Navigation className="h-4 w-4 mr-2" />
                                    Get Directions
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Contact Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{location.phone}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    <a href={`https://${location.website}`} className="text-sm text-primary hover:underline">
                                        {location.website}
                                    </a>
                                </div>
                                <Separator />
                                <div className="flex items-start gap-3">
                                    <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                                    <div>
                                        <p className="text-sm font-medium mb-1">Hours</p>
                                        <p className="text-xs text-muted-foreground">{location.hours}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Amenities */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Amenities</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {location.amenities.map((amenity) => (
                                        <Badge key={amenity} variant="outline" className="text-xs">
                                            {amenity}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationDetail;

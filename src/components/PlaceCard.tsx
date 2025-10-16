import { MapPin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface PlaceCardProps {
  name: string;
  address: string;
  rating: number;
  category: string;
  vibe: string;
  distance: string;
  locationId?: string;
}

export const PlaceCard = ({ name, address, rating, category, vibe, distance, locationId }: PlaceCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (locationId) {
      navigate(`/location/${locationId}`);
    }
  };

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-border"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-1">{name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{address}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-lg">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-medium text-accent">{rating}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary">{category}</Badge>
          <Badge variant="outline" className="border-primary text-primary">
            {vibe}
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground">
          {distance} away
        </div>
      </CardContent>
    </Card>
  );
};

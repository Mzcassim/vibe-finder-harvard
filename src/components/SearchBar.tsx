import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

const EXAMPLE_VIBES = [
  "cozy coffee shop for studying",
  "lively bar for meeting new people",
  "quiet spot to read a book",
  "instagram-worthy brunch",
];

export const SearchBar = ({ value, onChange, onSearch }: SearchBarProps) => {
  const handleExampleClick = (vibe: string) => {
    onChange(vibe);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl" />
        <div className="relative bg-card border border-border rounded-2xl shadow-lg p-2 flex gap-2">
          <div className="flex-1 flex items-center gap-3 px-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <Input
              placeholder="Describe the vibe you're looking for..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            />
          </div>
          <Button 
            onClick={onSearch}
            className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
            size="lg"
          >
            <Search className="h-4 w-4 mr-2" />
            Find Places
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {EXAMPLE_VIBES.map((vibe) => (
          <button
            key={vibe}
            onClick={() => handleExampleClick(vibe)}
            className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm transition-colors"
          >
            {vibe}
          </button>
        ))}
      </div>
    </div>
  );
};

# How to Add More Venues

Currently, you have **8 mock venues** defined in `src/mocks/data.ts`. Here's how to add more:

## Quick Steps

1. Open `src/mocks/data.ts`
2. Add a new venue object to the `MOCK_VENUES` array
3. Refresh the browser - that's it!

## Venue Template

Copy this template and fill in your venue details:

```typescript
{
  venue_id: "unique-id-here",  // Must be unique!
  name: "Your Venue Name",
  geo: { lat: 42.3XXX, lon: -71.1XXX },  // Get from Google Maps
  images: [
    { url: "https://images.unsplash.com/photo-XXXXXXX?w=800" }
  ],
  metadata: {
    category: "cafe",  // cafe, restaurant, bar, library, park, etc.
    price_level: 2,    // 1=cheap, 2=moderate, 3=pricey, 4=expensive
    addr: "123 Main St, Cambridge, MA",
  },
  llm_labels: {
    vibe_tags: ["cozy", "studious"],  // First tag = primary vibe
    axes: {
      noise_level: 0.3,      // 0=silent, 1=very loud
      lighting_warmth: 0.7,  // 0=bright, 1=dim/warm
      crowd_density: 0.5,    // 0=empty, 1=packed
      price_level: 0.4,      // 0=very cheap, 1=very expensive
      formality: 0.2,        // 0=casual, 1=formal
    },
    rationales: [
      "First reason why this place has this vibe",
      "Second reason (optional)",
      "Third reason (optional)",
    ],
  },
  agg_signals: {
    avg_rating: 4.5,      // Out of 5
    review_count: 150,    // Number of reviews
  },
  confidence: 0.85,       // 0-1, how confident we are in the vibe
  updated_at: "2025-10-16T12:00:00Z",
}
```

## Example: Adding a New Café

Let's say you want to add "Pavement Coffeehouse":

1. Go to Google Maps, search for the place
2. Right-click the location → Copy coordinates (e.g., `42.3765, -71.1158`)
3. Find an image on Unsplash (or use the venue's photo)

```typescript
{
  venue_id: "pavement-coffee-001",
  name: "Pavement Coffeehouse",
  geo: { lat: 42.3765, lon: -71.1158 },
  images: [
    { url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800" }
  ],
  metadata: {
    category: "coffee_shop",
    price_level: 2,
    addr: "1334 Massachusetts Ave, Cambridge, MA",
  },
  llm_labels: {
    vibe_tags: ["lively", "studenty", "third_wave_coffee"],
    axes: {
      noise_level: 0.6,
      lighting_warmth: 0.5,
      crowd_density: 0.7,
      price_level: 0.5,
      formality: 0.2,
    },
    rationales: [
      "Popular student hangout with good coffee",
      "Can get crowded during peak hours",
      "Great for socializing while studying",
    ],
  },
  agg_signals: {
    avg_rating: 4.2,
    review_count: 340,
  },
  confidence: 0.78,
  updated_at: "2025-10-16T13:00:00Z",
}
```

## Getting Coordinates

### Option 1: Google Maps (Easiest)
1. Go to [Google Maps](https://maps.google.com)
2. Search for your venue
3. Right-click on the location
4. Click "Copy coordinates" (or see them at the bottom)
5. Format: `lat, lon` (e.g., `42.3736, -71.1097`)

### Option 2: Apple Maps
1. Search for location
2. Click "Share" → "Copy"
3. Extract coordinates from the URL

### Option 3: Use a Coordinate Finder
- [LatLong.net](https://www.latlong.net/)
- Enter address, get coordinates

## Available Vibe Tags

Use these tags (or create your own):
- `cozy`, `studious`, `romantic`, `lively`, `quiet`
- `budget`, `upscale`, `bougie`, `rustic`
- `date_spot`, `group_friendly`, `kid_friendly`
- `hidden_gem`, `touristy`, `studenty`
- `third_wave_coffee`, `late_night`, `brunch`
- `outdoorsy`, `pet_friendly`, `queer_friendly`

## Axes Reference

All axes should be **0 to 1**:

| Axis | 0 = | 1 = |
|------|-----|-----|
| noise_level | Silent | Very loud |
| lighting_warmth | Bright/clinical | Warm/dim |
| crowd_density | Empty | Packed |
| price_level | Very cheap | Very expensive |
| formality | Very casual | Very formal |
| music_energy | No music/calm | Loud/energetic |
| novelty | Familiar/chain | Unique/novel |
| authenticity | Generic | Authentic/local |

## Finding Images

### Free Sources
1. **Unsplash** - `https://unsplash.com/s/photos/cafe`
2. **Pexels** - `https://www.pexels.com/search/coffee%20shop/`
3. **Venue's Website** - Many places have photos

### Using Unsplash Images
```
https://images.unsplash.com/photo-[PHOTO_ID]?w=800
```

Example:
```typescript
images: [
  { url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800" }
]
```

## Full Example: Multiple Venues

Add these to `MOCK_VENUES` array in `src/mocks/data.ts`:

```typescript
export const MOCK_VENUES: Venue[] = [
  // ... existing venues ...
  
  // NEW VENUE 1
  {
    venue_id: "clover-food-001",
    name: "Clover Food Lab",
    geo: { lat: 42.3736, lon: -71.1195 },
    images: [
      { url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800" }
    ],
    metadata: {
      category: "fast_casual",
      price_level: 1,
      addr: "7 Holyoke St, Cambridge, MA",
    },
    llm_labels: {
      vibe_tags: ["budget", "healthy", "quick", "vegetarian"],
      axes: {
        noise_level: 0.7,
        price_level: 0.3,
        crowd_density: 0.75,
        formality: 0.1,
      },
      rationales: [
        "Fast, healthy, vegetarian food",
        "Popular lunch spot for students",
        "Quick service, affordable prices",
      ],
    },
    agg_signals: {
      avg_rating: 4.3,
      review_count: 560,
    },
    confidence: 0.81,
    updated_at: "2025-10-16T13:00:00Z",
  },
  
  // NEW VENUE 2
  {
    venue_id: "grendels-den-001",
    name: "Grendel's Den",
    geo: { lat: 42.3735, lon: -71.1201 },
    images: [
      { url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800" }
    ],
    metadata: {
      category: "bar",
      price_level: 2,
      addr: "89 Winthrop St, Cambridge, MA",
    },
    llm_labels: {
      vibe_tags: ["casual", "dive_bar", "budget", "group_friendly"],
      axes: {
        noise_level: 0.65,
        lighting_warmth: 0.4,
        crowd_density: 0.6,
        price_level: 0.35,
        formality: 0.15,
      },
      rationales: [
        "Classic Harvard Square dive bar",
        "Great for groups and casual hangouts",
        "Affordable drinks and food",
      ],
    },
    agg_signals: {
      avg_rating: 4.1,
      review_count: 420,
    },
    confidence: 0.76,
    updated_at: "2025-10-16T13:00:00Z",
  },
];
```

## Tips

1. **Unique IDs**: Use format `venue-name-###` (e.g., `tatte-bakery-001`)

2. **Coordinates**: 
   - Harvard Square area: `lat: 42.37XX, lon: -71.11XX`
   - Vary slightly for different locations

3. **Primary Vibe**: First tag in `vibe_tags` array = marker color on map

4. **Confidence**: 
   - 0.5-0.7 = Shows "New Place" badge
   - 0.7-0.85 = Medium confidence
   - 0.85+ = High confidence (no badge)

5. **Rationales**: Keep under 140 characters each

## After Adding Venues

1. **Save** `src/mocks/data.ts`
2. **Refresh** browser
3. **Navigate** to `/explore` to see all venues on map
4. **Search** to test filtering by tags

## Troubleshooting

**Q: Venue doesn't appear on map?**
- Check coordinates are correct format: `{ lat: number, lon: number }`
- Ensure lat is ~42.37, lon is ~-71.11 for Harvard Square
- Check for syntax errors (missing commas, brackets)

**Q: Markers all show in one color?**
- First vibe tag determines color
- See `getVibeColor` in `MapView.tsx` for supported vibes

**Q: Getting Zod validation errors?**
- All required fields must be present: `venue_id`, `name`, `geo`
- Axes values must be 0-1
- Check browser console for specific error

---

## When Backend is Ready

These mock venues will be replaced by your real API data. The mock setup is just for development. When you connect your backend:

1. Update `.env`: `VITE_USE_MOCKS=false`
2. Set `VITE_API_BASE_URL=your-backend-url`
3. Your backend should return venues in this same format

See `INTEGRATION_GUIDE.md` for full backend integration details.

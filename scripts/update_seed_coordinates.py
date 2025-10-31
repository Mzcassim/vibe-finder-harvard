#!/usr/bin/env python3
"""
Update seed-data.ts with properly geocoded coordinates
"""
import json
from pathlib import Path

print("🔄 Updating seed-data.ts with geocoded coordinates...\n")

# Load geocoded venues
venues_json = Path(__file__).parent / "venues_from_csv.json"
with open(venues_json, 'r') as f:
    geocoded_venues = json.load(f)

print(f"✓ Loaded {len(geocoded_venues)} geocoded venues")

# Read current seed-data.ts
seed_file = Path(__file__).parent.parent / "src" / "lib" / "seed-data.ts"
with open(seed_file, 'r') as f:
    content = f.read()

# Find where CSV venues start
csv_marker = "  // Venues from CSV import"
header_end = content.find(csv_marker)
if header_end == -1:
    print("❌ Could not find CSV venues marker in seed-data.ts")
    exit(1)

# Find where the array ends
array_end = content.find("];", header_end)
if array_end == -1:
    print("❌ Could not find array end")
    exit(1)

# Get header (everything before CSV venues)
header = content[:header_end]

# Get footer (everything from ]; onwards)
footer = content[array_end:]

# Generate new TypeScript for geocoded venues
ts_venues = []
for i, venue in enumerate(geocoded_venues):
    name = venue['name'].replace('"', '\\"').replace("'", "\\'")
    addr = venue['metadata']['addr'].replace('"', '\\"').replace("'", "\\'")
    
    ts = f'''  {{
    venue_id: "{venue['venue_id']}",
    name: "{name}",
    geo: {{
      lat: {venue['geo']['lat']},
      lon: {venue['geo']['lon']},
    }},
    images: [],
    metadata: {{
      category: "{venue['metadata']['category']}",
      addr: "{addr}",
    }},
    llm_labels: {{
      vibe_tags: {json.dumps(venue['llm_labels']['vibe_tags'])},
      axes: {{
        casualness: {venue['llm_labels']['axes']['casualness']},
        comfort: {venue['llm_labels']['axes']['comfort']},
        energy: {venue['llm_labels']['axes']['energy']},
        elegance: {venue['llm_labels']['axes']['elegance']},
        authenticity: {venue['llm_labels']['axes']['authenticity']},
      }},
      rationales: {json.dumps(venue['llm_labels']['rationales'])},
    }},
    agg_signals: {{
      avg_rating: {venue['agg_signals']['avg_rating']},
      review_count: {venue['agg_signals']['review_count']},
    }},
    is_verified: true,
    confidence: {venue['confidence']},
    contributor_name: "{venue['contributor_name']}",
  }}'''
    
    if i < len(geocoded_venues) - 1:
        ts += ','
    
    ts_venues.append(ts)

# Rebuild the file
new_content = f'''{header}  // Venues from CSV import ({len(geocoded_venues)} venues with properly geocoded coordinates)
{chr(10).join(ts_venues)}
{footer}'''

# Write updated file
with open(seed_file, 'w') as f:
    f.write(new_content)

print(f"✓ Updated {seed_file}")
print(f"\n✅ All done! {len(geocoded_venues)} venues now have accurate coordinates")
print(f"\nNext: Refresh your browser to see the updated map!")

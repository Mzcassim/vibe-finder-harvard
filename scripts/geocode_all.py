#!/usr/bin/env python3
"""
Geocode all venues with proper coordinates
"""
import json
import time
import sys
from pathlib import Path
from geopy.geocoders import Nominatim

print("🌍 Starting geocoding of all venues...")
print("⏱️  Estimated time: ~5-6 minutes (rate limited to 1 request/second)\n")

# Load existing venues
venues_path = Path(__file__).parent / "venues_from_csv.json"
if not venues_path.exists():
    print(f"❌ Error: {venues_path} not found")
    print("Run process_csv_venues.py first to generate initial data")
    sys.exit(1)

with open(venues_path, 'r') as f:
    venues = json.load(f)

print(f"📊 Found {len(venues)} venues to geocode\n")

# Initialize geocoder
geolocator = Nominatim(user_agent="vibe-finder-harvard-v1.0")
geocoded_count = 0
failed_count = 0
cache = {}

# Geocode each venue
for i, venue in enumerate(venues):
    addr = venue['metadata']['addr']
    
    # Check cache
    if addr in cache:
        venue['geo'] = cache[addr]
        geocoded_count += 1
        if (i + 1) % 10 == 0:
            print(f"  [{i+1}/{len(venues)}] Processed (using cache)")
        continue
    
    # Geocode
    try:
        time.sleep(1.1)  # Rate limiting
        location = geolocator.geocode(addr, timeout=10)
        
        if location:
            geo = {
                "lat": round(location.latitude, 6),
                "lon": round(location.longitude, 6)
            }
            venue['geo'] = geo
            cache[addr] = geo
            geocoded_count += 1
            
            if (i + 1) % 10 == 0:
                print(f"  [{i+1}/{len(venues)}] ✓ Geocoded: {venue['name'][:30]}... → {geo['lat']}, {geo['lon']}")
        else:
            print(f"  ⚠️  No result for: {addr[:50]}")
            failed_count += 1
    except Exception as e:
        print(f"  ✗ Error geocoding '{addr[:50]}': {str(e)[:50]}")
        failed_count += 1

# Save updated venues
with open(venues_path, 'w') as f:
    json.dump(venues, f, indent=2)

print(f"\n✅ Geocoding complete!")
print(f"   Successfully geocoded: {geocoded_count}")
print(f"   Failed: {failed_count}")
print(f"   Cache hits: {len(cache)}")
print(f"\n📄 Updated: {venues_path}")
print(f"\nNext step: Run the TypeScript conversion script to update seed-data.ts")

#!/usr/bin/env python3
"""
Convert CSV venues to seed data format
"""
import csv
import json
import sys
import time
from pathlib import Path

def parse_metrics(metrics_str):
    """Parse metrics string to dict"""
    try:
        # Remove quotes and parse JSON
        metrics_str = metrics_str.strip().strip('"').replace("'", '"')
        return json.loads(metrics_str)
    except:
        return {}

def clean_name(name):
    """Clean venue name"""
    return name.strip()

def extract_vibe_tags(metrics):
    """Extract vibe tags from metrics and map to app's vibe system"""
    # Map metrics to the app's predefined vibe tags
    # Available vibes: cozy, studious, romantic, lively, quiet, budget, upscale, hidden_gem, outdoorsy
    
    if not metrics or all(v < 0.3 for v in metrics.values()):
        return ["cozy"]
    
    tags = []
    energy = metrics.get('energy', 0.5)
    comfort = metrics.get('comfort', 0.5)
    elegance = metrics.get('elegance', 0.5)
    casualness = metrics.get('casualness', 0.5)
    authenticity = metrics.get('authenticity', 0.5)
    
    # High energy = lively (check first for priority)
    if energy > 0.75:
        tags.append('lively')
    # High energy + elegance = upscale
    elif energy > 0.6 and elegance > 0.75:
        tags.append('upscale')
    # Very high elegance alone = upscale (more selective)
    elif elegance > 0.85:
        tags.append('upscale')
    # High comfort + low energy = cozy
    elif comfort > 0.7 and energy < 0.5:
        tags.append('cozy')
    # Low energy + medium comfort = quiet
    elif energy < 0.3 and comfort > 0.4:
        tags.append('quiet')
    # High casualness = budget
    elif casualness > 0.7:
        tags.append('budget')
    # High authenticity + not too elegant = hidden gem
    elif authenticity > 0.75 and elegance < 0.6:
        tags.append('hidden_gem')
    # Moderate comfort = cozy
    elif comfort > 0.6:
        tags.append('cozy')
    # Moderate energy = lively
    elif energy > 0.55:
        tags.append('lively')
    # Default fallback
    else:
        # Choose based on dominant metric
        sorted_metrics = sorted(metrics.items(), key=lambda x: x[1], reverse=True)
        if sorted_metrics:
            top_metric = sorted_metrics[0][0]
            metric_to_vibe = {
                'comfort': 'cozy',
                'elegance': 'upscale',
                'energy': 'lively',
                'casualness': 'budget',
                'authenticity': 'hidden_gem',
            }
            tags.append(metric_to_vibe.get(top_metric, 'cozy'))
        else:
            tags.append('cozy')
    
    return tags[:3]  # Return up to 3 tags

def geocode_address(address, cache={}, geolocator=None):
    """
    Geocode address to lat/lon using geopy with Nominatim
    """
    if address in cache:
        return cache[address]
    
    if geolocator is None:
        from geopy.geocoders import Nominatim
        geolocator = Nominatim(user_agent="vibe-finder-harvard-v1.0")
    
    try:
        time.sleep(1.1)  # Rate limiting for Nominatim (max 1 request per second)
        location = geolocator.geocode(address, timeout=10)
        
        if location:
            result = {
                "lat": round(location.latitude, 6),
                "lon": round(location.longitude, 6)
            }
            cache[address] = result
            print(f"    ✓ Geocoded: {address[:50]}")
            return result
        else:
            print(f"    ⚠️  No geocoding result for: {address[:50]}")
    except Exception as e:
        print(f"    ✗ Geocoding error for '{address[:50]}': {str(e)[:50]}")
    
    # Fallback: Use approximate city center based on address
    import random
    import hashlib
    
    # Detect city from address and use its actual coordinates
    city_centers = {
        'New York': (40.7128, -74.0060),
        'Boston': (42.3601, -71.0589),
        'San Francisco': (37.7749, -122.4194),
        'Denver': (39.7392, -104.9903),
        'Washington': (38.9072, -77.0369),
        'Cambridge': (42.3736, -71.1097),
    }
    
    # Find matching city
    center = None
    for city, coords in city_centers.items():
        if city in address:
            center = coords
            break
    
    # Default to NYC if no city found
    if center is None:
        center = (40.7128, -74.0060)
    
    # Use hash for consistent offset within city
    hash_val = int(hashlib.md5(address.encode()).hexdigest()[:8], 16)
    random.seed(hash_val)
    
    lat = center[0] + (random.random() - 0.5) * 0.05
    lon = center[1] + (random.random() - 0.5) * 0.05
    
    result = {
        "lat": round(lat, 6),
        "lon": round(lon, 6)
    }
    cache[address] = result
    return result

def format_venue_with_geocode(row, geolocator, geocode_cache):
    """Format a venue from CSV to seed data format with proper geocoding"""
    idx = row['index']
    name = clean_name(row['name'])
    metrics = parse_metrics(row['metrics'])
    confidence = float(row['confidence_score'])
    location = row['location']
    price_level = row.get('price_level', '')
    
    # Parse price level
    try:
        price = float(price_level) if price_level else 2.0
    except:
        price = 2.0
    
    # Get coordinates using shared geolocator and cache
    geo = geocode_address(location, cache=geocode_cache, geolocator=geolocator)
    
    # Extract vibe tags from metrics
    vibe_tags = extract_vibe_tags(metrics)
    
    # Use the 5 core vibe metrics directly from CSV
    # These are already in the format: casualness, comfort, energy, elegance, authenticity
    axes = {
        "casualness": metrics.get('casualness', 0.5),
        "comfort": metrics.get('comfort', 0.5),
        "energy": metrics.get('energy', 0.5),
        "elegance": metrics.get('elegance', 0.5),
        "authenticity": metrics.get('authenticity', 0.5),
    }
    
    # Determine category from name/context
    name_lower = name.lower()
    if any(word in name_lower for word in ['coffee', 'cafe', 'bakery', 'bibble']):
        category = "Cafe"
    elif any(word in name_lower for word in ['bar', 'pub', 'tavern']):
        category = "Bar"
    elif any(word in name_lower for word in ['library']):
        category = "Library"
    else:
        category = "Restaurant"
    
    venue = {
        "venue_id": f"csv-{idx}",
        "name": name,
        "geo": geo,
        "images": [],
        "metadata": {
            "category": category,
            "addr": location,
        },
        "llm_labels": {
            "vibe_tags": vibe_tags,
            "axes": axes,
            "rationales": [f"Imported from venue database with {confidence:.0%} confidence"],
        },
        "agg_signals": {
            "avg_rating": 4.0 + (confidence - 0.5),  # Estimate rating from confidence
            "review_count": int(row.get('num_reviews', 100)),
        },
        "is_verified": True,
        "confidence": confidence,
        "contributor_name": "AI Vibe Maps Team",
    }
    
    return venue

def main():
    from geopy.geocoders import Nominatim
    
    csv_path = Path(__file__).parent.parent / "public" / "preprocessed_combined_labeled_data_20251023-103452 (1).csv"
    
    if not csv_path.exists():
        print(f"Error: CSV file not found at {csv_path}")
        sys.exit(1)
    
    # Create shared geolocator instance
    geolocator = Nominatim(user_agent="vibe-finder-harvard-v1.0")
    geocode_cache = {}
    
    venues = []
    
    print(f"🔄 Processing ALL venues from CSV with proper geocoding...")
    print(f"⏱️  This may take several minutes due to rate limiting (1 request/sec)")
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            try:
                # Pass geolocator and cache to format_venue
                venue = format_venue_with_geocode(row, geolocator, geocode_cache)
                venues.append(venue)
                if (i + 1) % 10 == 0:
                    print(f"  📍 Processed {i+1} venues...")
            except Exception as e:
                print(f"  ✗ Error processing row {row.get('index', '?')}: {e}")
                import traceback
                traceback.print_exc()
                continue
    
    # Output as JSON
    output_path = Path(__file__).parent.parent / "scripts" / "venues_from_csv.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(venues, f, indent=2)
    
    print(f"\n✅ Processed {len(venues)} venues")
    print(f"📄 Output saved to: {output_path}")
    print(f"\nFirst venue sample:")
    print(json.dumps(venues[0], indent=2))

if __name__ == "__main__":
    main()

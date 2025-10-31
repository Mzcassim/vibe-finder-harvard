# Vibe Metrics System Update

## Summary
Updated the entire application to use the **5-metric vibe system** that matches the CSV data format:
- `casualness` (0-1): Formal → Casual
- `comfort` (0-1): Minimal → Cozy  
- `energy` (0-1): Calm → Lively
- `elegance` (0-1): Simple → Refined
- `authenticity` (0-1): Generic → Unique

## Files Changed

### 1. **Frontend Components**

#### `/src/components/AxesSliders.tsx`
- Updated `DEFAULT_VIBE_AXES` to use the 5 core metrics
- Added appropriate labels and range descriptions

#### `/src/pages/Contribute.tsx`
- Replaced tag selection with metric sliders
- Users now adjust 5 sliders to describe venue vibes
- Added helpful tooltips explaining each metric
- Vibe tags are now derived from metrics (not manually selected)

#### `/src/components/VibeCheckModal.tsx`
- Already uses `DEFAULT_VIBE_AXES`, so automatically updated
- Feedback now collects the 5 core metrics

#### `/src/lib/adapters.ts`
- Updated `formatAxisLabel()` to include new metrics
- Updated `radarKeysPriority` to prioritize the 5 core metrics
- Added legacy support for old metrics

#### `/src/types/venue.ts`
- Updated `AxesSchema` to include the 5 core metrics as primary
- Kept old metrics for backward compatibility

### 2. **Backend Scripts**

#### `/scripts/process_csv_venues.py`
- Changed axes mapping to use metrics directly from CSV
- Now outputs: `casualness`, `comfort`, `energy`, `elegance`, `authenticity`
- Removed old mappings (noise_level, price_level, crowd_density)

#### `/scripts/update_seed_coordinates.py`
- Updated TypeScript generation to output the 5 metrics
- Regenerated `/src/lib/seed-data.ts` with correct format

### 3. **Data Files**

#### `/scripts/venues_from_csv.json`
- Regenerated with 5-metric format
- All 292 venues now have correct axes

#### `/src/lib/seed-data.ts`
- CSV venues (lines 645+) now use 5-metric format
- Sample venues (lines 1-644) still use old format but work via legacy support

## Data Verification

```json
{
  "axes": {
    "casualness": 0.5,
    "comfort": 0.9,
    "energy": 0.6,
    "elegance": 0.9,
    "authenticity": 0.0
  }
}
```

✅ **292 CSV venues** properly formatted
✅ **Vibe tags** still derived from metrics for display
✅ **Radar charts** display the 5 metrics
✅ **User contributions** collect the 5 metrics

## User-Facing Changes

### When Contributing a Venue:
**Before:** Select vibe tags (cozy, lively, upscale, etc.)
**After:** Adjust 5 sliders to describe the venue's vibe

### When Giving Feedback:
**Before:** Adjust arbitrary axes (noise_level, price_level, etc.)
**After:** Adjust the 5 core vibe metrics

### When Viewing Venues:
- Radar charts now show the 5 metrics
- Vibe tags (cozy, lively, etc.) are still displayed but derived from metrics
- More consistent and meaningful vibe representation

## Backward Compatibility

The system maintains legacy support for:
- Old `noise_level`, `price_level`, `crowd_density` axes
- These will still display if present in data
- New data uses only the 5 core metrics

## Next Steps

To see the changes:
1. Clear browser cache: `localStorage.clear()`
2. Refresh the page
3. Try contributing a new venue - you'll see metric sliders
4. Check venue cards - radar charts show the 5 metrics

---

## Radar Chart Label Fix (Oct 31)

### Issue
Vibe metric labels on radar charts were being cut off at the edges.

### Solution
Updated `RadarChart.tsx`:
- **Reduced chart radius** from 0.35 to 0.28 (20% smaller)
- **Positioned labels** at 1.5× radius distance from center
- **Smart text anchoring**: Left labels right-aligned, right labels left-aligned, center labels centered
- **Added vertical offsets** for side labels to prevent overlap
- **Increased font size** minimum to 12px

### Result
All 5 vibe metric labels now display fully without cutoff:
- Casualness
- Comfort  
- Energy
- Elegance
- Authenticity

The radar chart is slightly more compact but labels are crisp and readable.

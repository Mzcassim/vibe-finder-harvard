# AI Vibe Maps - Pages Documentation

Complete wireframe and feature specification for all 15 application pages.

---

## 📑 Page Index

### Authentication (2)
1. **Login** - `/login` - Email/password authentication
2. **Signup** - `/signup` - New user registration with validation

### Core Journey (4)
3. **Home** - `/` - Natural language search interface
4. **Onboarding** - `/onboarding` - Vibe profile calibration
5. **Results** - `/results` - Search results with map/list view
6. **Venue Detail** - `/venue/:id` - Full venue information

### Discovery (2)
7. **Explore** - `/explore` - Interactive map of all venues
8. **Saved** - `/saved` - User's bookmarked venues

### User Content (3)
9. **Contribute** - `/contribute` - Submit new venues
10. **User Profile** - `/user/:username` - Public profiles with badges
11. **Settings** - `/settings` - User preferences and vibe profile

### Admin (1)
12. **Admin Verify** - `/admin/verify` - Approve/reject submissions

### Utility (1)
13. **404 Not Found** - `*` - Error page

---

## 🔐 1. Login Page (`/login`)

**Purpose:** Authenticate existing users  
**Access:** Public (redirects if authenticated)

### Key Components
- Email input field
- Password input field
- "Remember me" checkbox
- Login button (primary CTA)
- "Forgot password" link
- "Sign up" link

### Features
- Form validation with real-time feedback
- Mock authentication via localStorage
- Auto-redirect to home after login
- Disabled submit during processing
- Error messages for invalid credentials

### UI Layout
```
┌──────────────────────┐
│  AI Vibe Maps Logo   │
│  ┌────────────────┐  │
│  │ Welcome Back   │  │
│  │ Email: [____]  │  │
│  │ Pass: [_____]  │  │
│  │ ☐ Remember me  │  │
│  │ [Login Button] │  │
│  │ Forgot? | Sign up│
│  └────────────────┘  │
└──────────────────────┘
```

---

## ✍️ 2. Signup Page (`/signup`)

**Purpose:** Register new users  
**Access:** Public (redirects if authenticated)

### Key Components
- First name, last name inputs
- Email input with validation
- Password input with strength meter
- Confirm password input with match validation
- Terms & conditions checkbox
- Create account button
- Link to login page

### Features
- Multi-field validation
- Password strength indicator (weak/medium/strong)
- Real-time password match checking
- Email format validation
- Required terms acceptance
- Auto-login after successful signup
- Redirects to onboarding for new users

---

## 🏠 3. Home/Search Page (`/`)

**Purpose:** Main landing page with natural language search  
**Access:** Protected

### Key Components
- Natural language search bar with mic icon
- Real-time NLP tag parsing display
- 6 suggested vibe search chips
- "Explore Map" button
- "Add Venue" button
- Top nav: Profile, Saved, Settings, Logout

### Features
- NLP-powered search parsing
- Suggested searches as clickable chips
- Real-time tag extraction from query
- Quick navigation to explore/contribute
- Auto-redirects to onboarding if no profile
- Search analytics tracking

---

## 🎯 4. Onboarding Page (`/onboarding`)

**Purpose:** Calibrate user's vibe preferences  
**Access:** Protected (auto-shown on first login)

### Step 1: Swipe Calibration
- 6 venue cards to swipe through
- Like/Dislike/Skip options
- Progress bar (e.g., 3/6)
- Calibration venues:
  - Quiet library
  - Lively café
  - Romantic wine bar
  - Budget food court
  - Upscale restaurant
  - Cozy reading nook

### Step 2: Axes Sliders
- 4 dimensional preference sliders:
  - **Noise level**: Quiet ↔ Loud
  - **Lighting**: Dim ↔ Bright
  - **Price**: Budget ↔ Upscale
  - **Crowd**: Empty ↔ Packed
- "Save Profile" button

### Features
- Two-step calibration process
- Swipe gestures (like Tinder)
- Visual progress indicator
- Profile saved to localStorage
- Analytics tracking (time spent, choices)
- Auto-redirect to home when complete

---

## 🔍 5. Search Results Page (`/results`)

**Purpose:** Display search results with map + list view  
**Access:** Protected

### Key Components
- Split view: Map (left) + List (right)
- View toggles: Map only, List only, Split
- Results count and query display
- Filter drawer (sidebar)
- Venue cards with photos, ratings, tags
- Sort dropdown: Relevance, Distance, Rating

### Map Features
- Color-coded markers by vibe
- Grey markers for unverified venues
- Black marker for selected venue
- Click to highlight
- Pan/zoom controls

### Venue Card Elements
- Venue photo
- Name and star rating
- Distance from user
- Vibe tag badges
- Upvote count
- Review count
- Save heart button
- Contributor attribution (if unverified)

### Filter Options
- Vibe tags (multi-select)
- Axes sliders (noise, price, etc.)
- "Open now" toggle
- Distance radius slider

---

## 📍 6. Venue Detail Page (`/venue/:id`)

**Purpose:** Full venue information and reviews  
**Access:** Protected

### Layout Sections

**Hero:** Full-width venue photo

**Header:**
- Venue name
- Star rating aggregate
- Vibe tag badges
- Contributor link (if unverified)
- Grey styling for unverified venues

**Sidebar:**
- Map preview
- Address, phone, website
- Hours with open/closed status
- Upvote count and button

**Vibe Scores:**
- Radar chart visualization
- Axis breakdowns (noise, price, WiFi, etc.)
- Confidence score

**About Section** (user-contributed only):
- Rationale from contributor
- Edit/Delete buttons (if owner)

**Reviews:**
- Review count
- "Write Review" button
- Individual review cards:
  - User avatar and name
  - 5-star rating
  - Review text
  - Timestamp
  - Edit/Delete (if own review)

### Features
- Save venue (heart icon)
- Upvote venue
- Write/edit/delete reviews
- Edit/delete own contribution
- Share and report options
- Review form with 5-star selector
- Contributor profile links

---

## 🗺️ 7. Explore Page (`/explore`)

**Purpose:** Browse all venues on interactive map  
**Access:** Protected

### Key Components
- Full-screen map view
- View toggle: Map only vs. Split (map + list)
- Filter drawer
- Selected venue mini-card overlay

### Map Features
- 5km radius from user location
- Color-coded markers by vibe
- Grey markers for unverified
- Black for selected
- Click marker to see mini-card

### Mini Venue Card
- Photo thumbnail
- Name, rating, distance
- Vibe tags
- Save and "View Details" buttons

### Features
- Pan and zoom map
- Filter by tags, price, noise, open now
- Location-based loading
- "My Profile" button in header
- Loading skeletons while fetching

---

## 💾 8. Saved Venues Page (`/saved`)

**Purpose:** View user's bookmarked venues  
**Access:** Protected

### Key Components
- Grid or list view toggle
- Saved venue count
- Search within saved
- Venue cards (grid layout)
- Empty state with CTA

### Features
- Grid/list view toggle
- Search saved venues
- Click card to view details
- Unsave by clicking heart icon
- Sort by: Recently saved, Rating, Distance
- Empty state: "No saved venues yet" + Explore CTA
- Persistence via localStorage

---

## ➕ 9. Contribute Page (`/contribute`)

**Purpose:** Submit new venues for verification  
**Access:** Protected

### Form Fields

**Basic Info:**
- Venue name (required)
- Address (required)
- "Use current location" button

**Vibe Tags:**
- Multi-select tag chips
- Autocomplete suggestions
- Add custom tags

**Axes Ratings (6 sliders):**
- Noise level (0-1)
- Price level (0-1)
- WiFi quality (0-1)
- Crowd density (0-1)
- Lighting (0-1)
- Seating comfort (0-1)

**Rationale:**
- Text area (500 char limit)
- Free-form explanation

**Attribution:**
- Radio: Show my name (default)
- Radio: Anonymous

### Features
- Multi-step form with validation
- Geocoding for address → lat/lon
- Tag autocomplete with suggestions
- Real-time validation feedback
- Submit button disabled until valid
- Submissions go to unverified queue
- Anonymous contributions visible only to self
- Success confirmation with options
- Analytics tracking

---

## 👤 10. User Profile Page (`/user/:username`)

**Purpose:** Public user profiles with gamification  
**Access:** Protected

### Sections

**Header:**
- Avatar (placeholder or initials)
- Username
- Join date
- Member badge

**Stats Dashboard:**
- 🏆 Total badges earned
- 📍 Total venues contributed
- ⭐ Total reviews written
- ↑ Total upvotes received

**Earned Badges:**
- Visual badge icons
- Badge name and description
- Earned date
- Tooltip with requirements

**In-Progress Badges:**
- Locked icon
- Progress bar (e.g., 6/10)
- Requirements description

**Contributions Grid:**
- All venues added by user
- Verified and unverified
- Anonymous contributions (owner-only)
- Note: "Includes anonymous (visible to you only)"

### Badge Types
- **First Timer** - 1 contribution
- **Contributor** - 5 contributions
- **Expert** - 10 contributions
- **Legend** - 25 contributions
- **Top Reviewer** - 10 reviews
- **Community Champion** - 50 upvotes
- **Explorer** - 10 saved venues

### Features
- Public vs. owner view
- Anonymous contributions hidden from public
- Click venue to view details
- Share profile button
- Badge tooltips with requirements
- Progress tracking for locked badges

---

## ⚙️ 11. Settings Page (`/settings`)

**Purpose:** User preferences and profile management  
**Access:** Protected

### Sections

**Vibe Profile:**
- Display current preferences
- "Recalibrate" button → restart onboarding
- Preferred vibes (liked/disliked)
- Axis preferences with sliders

**Account:**
- Email (display only or editable)
- Password change form
- Delete account button (destructive)

**Preferences:**
- Email notifications toggle
- Push notifications toggle
- Distance units (miles/km)
- Privacy: Show profile publicly toggle

**Data:**
- Export my data button
- Clear search history button
- Reset recommendations button

### Features
- Update vibe profile
- Recalibrate preferences (restart onboarding)
- Change account settings
- Privacy controls
- Data management options
- Confirmation dialogs for destructive actions

---

## 🛡️ 12. Admin Verify Page (`/admin/verify`)

**Purpose:** Review and approve user-submitted venues  
**Access:** Protected (admin only, no role check yet)

### Key Components
- List of unverified venue cards
- Approve button (green checkmark)
- Reject button (red X)
- Venue details for review
- Admin badge indicator

### Venue Card Shows
- Full venue information
- Contributor name
- Submission date
- All vibe tags and axes
- Rationale text

### Features
- Fetch unverified submissions
- Approve → move to verified venues
- Reject → remove from queue
- Review rationale and tags
- See contributor profile
- No multi-select (one at a time)
- Loading skeletons
- Empty state if no pending submissions

---

## ❌ 13. 404 Not Found Page (`*`)

**Purpose:** Handle invalid routes  
**Access:** Public

### Key Components
- "404 - Page Not Found" heading
- Friendly error message
- "Go Home" button
- Optional search bar
- Illustration or icon

### Features
- Catch-all route
- Clear error communication
- Easy navigation back to home
- Optional search to find intended page

---

## 🎨 Design Patterns

### Common UI Components Used Across Pages
- **Card** - Content containers
- **Button** - Primary/secondary/ghost variants
- **Input** - Text fields with validation
- **Badge** - Vibe tags and status indicators
- **Skeleton** - Loading states
- **Tooltip** - Info hints
- **Dialog** - Modals and confirmations
- **Drawer** - Side panels (filters, menus)
- **Avatar** - User profile pictures
- **Progress** - Bars and indicators

### Navigation Patterns
- **Protected routes** - Redirect to `/login` if not authenticated
- **Back button** - Top-left on most pages
- **Bottom nav** - Mobile: Home, Explore, Saved, Profile
- **Top nav** - Desktop: Logo, Profile, Settings, Logout
- **Breadcrumbs** - For deep navigation

### Responsive Breakpoints
- **Mobile** - < 640px (single column, bottom nav)
- **Tablet** - 640-1024px (adapted layouts)
- **Desktop** - > 1024px (split views, sidebars)

### Loading States
- **Skeleton screens** - For content loading
- **Spinners** - For actions (submit, delete)
- **Disabled buttons** - During processing
- **Progress bars** - For multi-step processes

### Empty States
- **Friendly message** - Explain why empty
- **Illustration** - Visual interest
- **CTA button** - Guide next action
- Examples:
  - No saved venues → "Explore Venues"
  - No contributions → "Add Your First Venue"
  - No search results → "Try different keywords"

---

## 📊 Data Flow

### LocalStorage Keys Used
- `auth_token` - Authentication state
- `user_email` - Current user identifier
- `vibe_profile` - Onboarding preferences
- `verified_venues` - Official venue list
- `user_contributions` - User-submitted venues
- `saved_venues` - Array of saved venue IDs
- `upvotes_{venueId}` - Upvote tracking per venue
- `reviews_{venueId}` - Reviews per venue
- `data_seeded` - Flag for sample data initialization

### API Endpoints (Mocked via MSW)
- `GET /api/search` - Search venues
- `GET /api/venues/:id` - Venue details
- `POST /api/venues` - Create venue (contribute)
- `PUT /api/venues/:id` - Update venue
- `DELETE /api/venues/:id` - Delete venue
- `POST /api/venues/:id/upvote` - Toggle upvote
- `GET /api/venues/:id/reviews` - Get reviews
- `POST /api/venues/:id/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `GET /api/users/:username` - User profile
- `GET /api/users/:username/contributions` - User venues
- `GET /api/admin/unverified` - Pending venues (admin)
- `POST /api/admin/verify/:id` - Approve venue
- `POST /api/admin/reject/:id` - Reject venue

---

## 🚀 Key User Flows

### New User Journey
1. Land on site → Redirect to `/login`
2. Click "Sign up" → `/signup`
3. Fill form → Submit → Auto-login
4. Redirect to `/onboarding`
5. Complete 2-step calibration
6. Redirect to `/` (Home)
7. Perform first search
8. View results → Click venue
9. Save venue + write review

### Contributor Flow
1. Click "Add Venue" from home
2. Navigate to `/contribute`
3. Fill venue form with all details
4. Choose attribution (named/anonymous)
5. Submit → Goes to unverified queue
6. Admin reviews at `/admin/verify`
7. Approve → Venue becomes verified
8. Contributor earns badges

### Search & Discovery Flow
1. Enter natural language query on `/`
2. See parsed tags in real-time
3. Submit → Navigate to `/results`
4. Apply filters via drawer
5. Toggle map/list views
6. Click venue → Navigate to `/venue/:id`
7. Save venue (heart icon)
8. Write review
9. Upvote venue
10. View contributor profile

---

## 📱 Mobile Considerations

### Bottom Navigation (Mobile)
- **Home** - Search icon
- **Explore** - Map icon
- **Saved** - Bookmark icon
- **Profile** - User icon

### Touch Targets
- Minimum 44×44px for buttons
- Larger tap areas for markers
- Swipe gestures on onboarding cards

### Responsive Adjustments
- Stack layouts vertically on mobile
- Full-screen map on explore (no split)
- Drawer filters slide from bottom
- Collapsible sections on venue detail
- Floating action button for contribute

---

## ♿ Accessibility Features

- **Semantic HTML** - Proper heading hierarchy
- **ARIA labels** - Screen reader support
- **Keyboard navigation** - Tab order, focus states
- **Color contrast** - WCAG AA compliance
- **Alt text** - All images described
- **Focus indicators** - Visible keyboard focus
- **Skip links** - Skip to main content
- **Form labels** - Associated with inputs
- **Error messages** - Clear and actionable

---

## 🎯 Analytics Events Tracked

- **Search performed** - Query, tags, location
- **Venue viewed** - Venue ID, source
- **Venue saved** - Venue ID
- **Review submitted** - Venue ID, rating
- **Venue upvoted** - Venue ID
- **Contribution submitted** - Anonymous flag
- **Onboarding completed** - Duration, swipes
- **Profile recalibrated** - Settings change
- **Badge earned** - Badge ID, timestamp

---

## 🔮 Future Enhancements

### Potential New Pages
- **Notifications** - `/notifications` - Activity feed
- **Messages** - `/messages` - User-to-user chat
- **Leaderboard** - `/leaderboard` - Top contributors
- **Analytics Dashboard** - `/dashboard` - Personal stats
- **Collections** - `/collections` - Curated venue lists
- **Events** - `/events` - Venue events and happenings

### Feature Additions
- Social sharing (Twitter, Instagram)
- Photo uploads for venues
- Multi-language support
- Dark mode toggle
- Offline mode (PWA)
- AR venue finder
- Voice search
- Collaborative lists
- Venue comparison tool
- Route planning (multi-venue tours)

---

This documentation covers all 15 pages from a wireframing and features perspective. Each page is designed to serve a specific user need while maintaining consistent UI patterns and data flow throughout the application.

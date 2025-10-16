# AI Vibe Maps

**Find your perfect spot based on vibe, not just location.**

Natural language venue search powered by AI that understands what you're really looking for.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open http://localhost:8080

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a853d6ec-3c05-4f1b-9dd1-c9caff577005) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 📦 Mock Data (Demo Mode)

**The app works immediately with sample data - no backend required!**

### Current Setup
- ✅ **8 sample Harvard Square venues** auto-load on first visit
- ✅ **Mock authentication** via localStorage
- ✅ **All features work**: upvotes, reviews, profiles, badges

### Quick Toggle

**Deploy with sample data (current):**
```bash
npm run build  # Uses .env.production (mocks enabled)
```

**Connect to real backend later:**
```bash
# Swap environment files
mv .env.production.backend .env.production
# Edit VITE_API_BASE_URL to your API
npm run build
```

📖 **See full guide:** [MOCK_DATA_TOGGLE.md](./MOCK_DATA_TOGGLE.md)

---

## 🛠️ Tech Stack

- **Framework:** Vite + React + TypeScript
- **UI:** shadcn/ui + Tailwind CSS
- **Maps:** Pigeon Maps
- **Charts:** Recharts (radar charts for vibes)
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod
- **State:** React Context + localStorage
- **Mocks:** MSW (Mock Service Worker)

---

## 📄 Documentation

- **[Wireframe.md](./Wireframe.md)** - Complete page specifications
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment instructions
- **[MOCK_DATA_TOGGLE.md](./MOCK_DATA_TOGGLE.md)** - How to enable/disable sample data
- **[HOW_TO_ADD_VENUES.md](./HOW_TO_ADD_VENUES.md)** - Add more sample venues

---

## 🚀 Deployment

### Option 1: Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Option 2: Netlify
```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages
```bash
npm i -g gh-pages
npm run build
gh-pages -d dist
```

📖 **Full deployment guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 📱 Features

- 🔍 **Natural language search** - "cozy study spot near me"
- 🗺️ **Interactive map** - Color-coded by vibe
- 🎯 **Vibe calibration** - Personalized onboarding
- 📊 **Radar charts** - Visual vibe scores
- ⭐ **Reviews & ratings** - Community-driven
- 👍 **Upvoting** - Highlight great spots
- 🏆 **Gamification** - Badges for contributors
- 💾 **Save venues** - Bookmark favorites
- ➕ **User contributions** - Add new venues
- 🛡️ **Admin verification** - Quality control

---

## 🎨 Pages

15 fully-designed pages:
- Authentication (Login, Signup)
- Core Journey (Home, Onboarding, Results, Venue Detail)
- Discovery (Explore, Saved)
- User Content (Contribute, Profile, Settings)
- Admin (Verify pending venues)
- Utility (404)

📖 **See wireframes:** [Wireframe.md](./Wireframe.md)

---

## 🔮 Roadmap

### Current: Demo Mode ✅
- localStorage-based data
- MSW mock API
- Sample venues included
- Perfect for portfolios/demos

### Future: Production Mode
- Real backend API
- PostgreSQL/MongoDB database
- Multi-user data sharing
- Authentication (JWT/OAuth)
- Image uploads
- Real-time updates

---

## 📞 Support

- **Deployment issues?** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Toggle mock data?** See [MOCK_DATA_TOGGLE.md](./MOCK_DATA_TOGGLE.md)
- **Add venues?** See [HOW_TO_ADD_VENUES.md](./HOW_TO_ADD_VENUES.md)

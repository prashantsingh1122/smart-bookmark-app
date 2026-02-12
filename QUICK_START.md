# Smart Bookmark App - Quick Start Guide 🚀

Get the Smart Bookmark App running in **5 minutes**!

## What You'll Need

- Node.js 18+
- Supabase account (free tier works!)
- Google account (for OAuth)

## Step 1: Clone & Install (1 min)

```bash
git clone <your-repo-url>
cd smart-bookmark-app
npm install
```

## Step 2: Create Supabase Database (2 min)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy this SQL into your **SQL Editor** and run it:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Security policies
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

3. Go to **Settings → API** and copy:
   - `Project URL`
   - `anon public key`

## Step 3: Setup Google OAuth (1 min)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project → Enable **Google+ API**
3. **Credentials** → **OAuth 2.0 Client ID** (Web Application)
4. Add authorized redirect URI:
   - `http://localhost:3000/auth/callback`
5. Copy the **Client ID**

**In Supabase:**
- Go to **Authentication → Providers → Google**
- Enable it and add your Client ID & Secret

## Step 4: Create `.env.local` (1 min)

```bash
# Create this file in the root directory
# .env.local (NEVER commit this!)

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-from-step-2
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id-from-step-3
```

## Step 5: Run It! (0 min)

```bash
npm run dev
```

Open http://localhost:3000 and start saving bookmarks! 🎉

## Test Real-Time Sync

1. Add a bookmark
2. **Open another browser tab** to localhost:3000
3. The bookmark appears **instantly** in the second tab!
4. No refresh needed - that's real-time sync in action ⚡

---

## Need Help?

- See [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) for detailed documentation
- Check [README.md](./README.md) for troubleshooting

---

## Next Steps

After getting it working:

1. **Deploy to Vercel** - One-click deployment from GitHub
2. **Add more features** - Search, categories, sharing
3. **Customize design** - Edit Tailwind classes
4. **Learn the codebase** - Check [PROJECT_GUIDE.md](./PROJECT_GUIDE.md)

---

**Happy Bookmarking! 🔖**

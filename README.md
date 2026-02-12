# Smart Bookmark App

A modern bookmark management application with real-time sync across devices. Built with Next.js 16 and Supabase.

## Features

- **Google OAuth Authentication** - Secure sign-in with Google
- **Private Bookmarks** - Each user's bookmarks are isolated and private
- **Real-time Sync** - Bookmarks update instantly across all open tabs/devices
- **Add & Delete Bookmarks** - Simple interface to manage bookmarks
- **Dark Mode Support** - Respects system color scheme preference
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database & Auth**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Deployment**: Vercel

## Setup

### Prerequisites

- Node.js 18+
- A Supabase account ([supabase.com](https://supabase.com))

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd smart-bookmark-app
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)

2. Create the `bookmarks` table:

```sql
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own bookmarks)
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

3. Configure Google OAuth:
   - Go to **Authentication → Providers → Google**
   - Enable Google provider
   - Add your Google OAuth credentials (from Google Cloud Console)
   - Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`

4. Get your API credentials:
   - Go to **Project Settings → API**
   - Copy `Project URL` and `anon public` key

### 3. Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment on Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and import your repository
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

### 3. Update Supabase OAuth

After deployment, update your Supabase redirect URLs:

1. Go to **Authentication → URL Configuration**
2. Add your Vercel URL to **Redirect URLs**:
   - `https://your-app.vercel.app/auth/callback`

## Problems Faced & Solutions

### 1. Next.js 16 Async Cookies API

**Problem**: `cookies()` from `next/headers` returns a Promise in Next.js 16, causing TypeScript errors.

**Solution**: Made `createServerSupabase()` async and awaited `cookies()`:

```typescript
export async function createServerSupabase() {
  const cookieStore = await cookies();
  // ...
}
```

### 2. Session Expiry on Vercel

**Problem**: User sessions would expire and not refresh properly on serverless deployments.

**Solution**: Added middleware (`src/middleware.ts`) that refreshes the Supabase session on every request using `getUser()`.

### 3. React Hooks Lint Error with Form Reset

**Problem**: Accessing `formRef.current` during render violates React hooks rules.

**Solution**: Moved form reset logic into `useEffect`:

```typescript
useEffect(() => {
  if (state?.ok) {
    formRef.current?.reset();
  }
}, [state]);
```

### 4. Cross-User Data Exposure Risk

**Problem**: Without proper filtering, users could potentially see other users' bookmarks.

**Solution**: 
- Added `user_id` filter to all queries
- Added ownership check in delete action
- Enabled Row Level Security (RLS) in Supabase as defense-in-depth

### 5. OAuth Error Handling

**Problem**: OAuth failures (user cancellation, provider errors) weren't handled gracefully.

**Solution**: Added error parameter handling in `/auth/callback` route that redirects to login with error message display.

### 6. Realtime Privacy

**Problem**: Supabase Realtime could potentially broadcast events to unauthorized users.

**Solution**: Used Realtime filter `filter: user_id=eq.${userId}` to only subscribe to current user's bookmark changes.

## Project Structure

```
src/
├── app/
│   ├── auth/callback/    # OAuth callback handler
│   ├── bookmarks/        # Bookmarks page + actions
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout with header
│   └── page.tsx          # Home page
├── components/
│   ├── AddBookmarkForm.tsx
│   ├── BookmarkList.tsx  # Realtime bookmark list
│   ├── DeleteBookmarkButton.tsx
│   ├── Header.tsx
│   ├── SignInButton.tsx
│   └── SignOutButton.tsx
├── lib/supabase/
│   ├── auth.ts           # Client-side auth helpers
│   ├── client.ts         # Browser Supabase client
│   └── server.ts         # Server Supabase client
├── middleware.ts         # Session refresh middleware
└── types/
    └── bookmark.ts       # Type definitions
```

## License

MIT

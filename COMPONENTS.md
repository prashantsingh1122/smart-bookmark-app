# Component Documentation

This guide explains each component in the Smart Bookmark App, how they work, and how to modify or reuse them.

---

## 📋 Table of Contents

1. [Header](#header)
2. [AddBookmarkForm](#addbookmarkform)
3. [BookmarkList](#bookmarklist)
4. [DeleteBookmarkButton](#deletebookmarkbutton)
5. [SignInButton](#signinbutton)
6. [SignOutButton](#signoutbutton)
7. [Best Practices](#best-practices)

---

## Header

**File:** `src/components/Header.tsx`  
**Type:** Server Component (async)  
**Purpose:** Navigation bar with logo, menu, and auth status

### Features

- **Sticky positioning** - Stays at top while scrolling
- **Responsive design** - Full nav on desktop, collapsed on mobile
- **Auth status display** - Shows user email when logged in
- **Dark mode support** - Automatic theme detection

### Props

None - fetches auth state from Supabase server-side.

### Usage

```tsx
// In layout.tsx
import { Header } from "@/components/Header";

export default function RootLayout({ children }) {
  return (
    <>
      <Header />  {/* Rendered on every page */}
      <main>{children}</main>
    </>
  );
}
```

### Customization

**Change logo:**
```tsx
// Line 10
<span className="text-2xl">🔖</span>  {/* Change emoji or add logo image */}
<span className="hidden sm:inline">Smart Bookmarks</span>  {/* Change text */}
```

**Add new navigation links:**
```tsx
// Inside the navigation div (line 17)
<Link href="/tags" className="...">Tags</Link>
<Link href="/settings" className="...">Settings</Link>
```

**Change colors:**
```tsx
// Line 27 - Change these Tailwind classes
className="bg-blue-600 dark:bg-blue-600"  // Change blue to your color
```

---

## AddBookmarkForm

**File:** `src/components/AddBookmarkForm.tsx`  
**Type:** Client Component (`"use client"`)  
**Purpose:** Form for creating new bookmarks with validation

### Features

- **Real-time URL validation** - Checks format as user types
- **Inline error messages** - Shows validation errors immediately
- **Loading state** - Spinner while saving
- **Form reset on success** - Clears inputs after adding
- **Keyboard support** - Works with Tab, Enter keys

### Props

None - uses server actions internally.

### State

```tsx
const [state, formAction, pending] = useActionState(addBookmark, undefined);
const [url, setUrl] = useState("");
const [urlError, setUrlError] = useState("");
```

- `pending` - `true` while saving to database
- `urlError` - Shows validation errors
- `state.error` - Server-side error messages
- `state.ok` - Indicates successful save

### Usage

```tsx
// In bookmarks/page.tsx
import { AddBookmarkForm } from "@/components/AddBookmarkForm";

export default function BookmarksPage() {
  return (
    <section>
      <AddBookmarkForm />
    </section>
  );
}
```

### Customization

**Change validation pattern:**
```tsx
// Line 5
const VALID_URL_PATTERN = /^https?:\/\/.+/;
// Change to allow other protocols if needed
```

**Change input labels:**
```tsx
// Line 39-42
<label>Custom Title Label</label>
<label>Custom URL Label</label>
```

**Change button color:**
```tsx
// Line 69
className="bg-blue-600 hover:bg-blue-700"  // Change blue to your color
```

**Add more fields:**
```tsx
// Add new state
const [description, setDescription] = useState("");

// Add input field
<input name="description" value={description} onChange={...} />

// Update form submission in actions.ts
export async function addBookmark(formData) {
  const description = String(formData.get("description") || "").trim();
  // Add to database insert...
}
```

---

## BookmarkList

**File:** `src/components/BookmarkList.tsx`  
**Type:** Client Component (`"use client"`)  
**Purpose:** Displays list of bookmarks with real-time sync

### Features

- **Real-time updates** - Uses Supabase WebSocket subscriptions
- **Loading skeleton** - Shows placeholders while fetching
- **Empty state** - Friendly message when no bookmarks
- **Card design** - Modern card-based UI
- **Hover effects** - Visual feedback on interaction
- **Automatic sync** - Updates across tabs instantly

### Props

```tsx
type Props = {
  initialBookmarks: Bookmark[];  // Bookmarks from server
  userId: string;                 // Current user's ID
};
```

### Real-Time Subscription

```tsx
// Subscribes to INSERT events
.on("postgres_changes", { event: "INSERT", ... },
  (payload) => {
    setBookmarks((prev) => [payload.new, ...prev]);
  }
)

// Subscribes to DELETE events
.on("postgres_changes", { event: "DELETE", ... },
  (payload) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
  }
)
```

### Usage

```tsx
// In bookmarks/page.tsx
import { BookmarkList } from "@/components/BookmarkList";

export default async function BookmarksPage() {
  const bookmarks = await fetchBookmarks();
  const userId = await getCurrentUserId();

  return (
    <BookmarkList initialBookmarks={bookmarks} userId={userId} />
  );
}
```

### Customization

**Change card styling:**
```tsx
// Line 55 - Card container
className="group block rounded-lg border border-zinc-200 ..."
// Add your custom Tailwind classes here
```

**Change empty state message:**
```tsx
// Line 36-40
<h3>Your custom empty message</h3>
<p>Your custom description</p>
```

**Add more bookmark details:**
```tsx
// Inside the card (line 58-70)
// Add more bookmark attributes to display
<p className="text-xs text-zinc-500">{bookmark.description}</p>
```

**Sort bookmarks differently:**
```tsx
// In bookmarks/page.tsx - Change the order
.order("created_at", { ascending: true })  // Oldest first
```

**Add filtering:**
```tsx
// In BookmarkList.tsx
const [filter, setFilter] = useState("");

const filteredBookmarks = bookmarks.filter(b =>
  b.title.toLowerCase().includes(filter.toLowerCase())
);
```

---

## DeleteBookmarkButton

**File:** `src/components/DeleteBookmarkButton.tsx`  
**Type:** Client Component (`"use client"`)  
**Purpose:** Delete bookmark with confirmation

### Features

- **Confirmation dialog** - Prevents accidental deletion
- **Loading spinner** - Shows while deleting
- **Icon button** - Smaller, cleaner design
- **Hover effects** - Visual feedback
- **Accessibility** - Proper `aria-label`

### Props

```tsx
{ id: string }  // Bookmark ID to delete
```

### Usage

```tsx
// In BookmarkList.tsx
import { DeleteBookmarkButton } from "./DeleteBookmarkButton";

{bookmarks.map((bookmark) => (
  <div key={bookmark.id}>
    <h3>{bookmark.title}</h3>
    <DeleteBookmarkButton id={bookmark.id} />
  </div>
))}
```

### Customization

**Change confirmation message:**
```tsx
// Line 10
if (!confirm("Your custom message")) return;
```

**Change icon:**
```tsx
// Line 24 - Replace the trash icon with another SVG
<svg>... your custom icon ...</svg>
```

**Add undo functionality:**
```tsx
// After deletion, store the deleted bookmark
const [deletedBookmark, setDeletedBookmark] = useState(null);

// Show undo button
{deletedBookmark && (
  <button onClick={() => restoreBookmark(deletedBookmark)}>
    Undo
  </button>
)}
```

**Change colors:**
```tsx
// Line 18
className="text-zinc-400 hover:text-red-600"  // Change red to your color
```

---

## SignInButton

**File:** `src/components/SignInButton.tsx`  
**Type:** Client Component (`"use client"`)  
**Purpose:** Google OAuth sign-in button

### Features

- **Google OAuth** - Secure sign-in flow
- **Loading state** - Spinner while signing in
- **Google icon** - Official Google branding
- **Customizable redirect** - Where to go after login
- **Error handling** - Catch OAuth errors

### Props

```tsx
{ redirectTo?: string }  // URL to redirect after login (default: "/bookmarks")
```

### Usage

```tsx
// In login/page.tsx
import { SignInButton } from "@/components/SignInButton";

export default function LoginPage() {
  return (
    <div>
      <h1>Sign In</h1>
      <SignInButton redirectTo="/bookmarks" />
    </div>
  );
}

// With custom redirect
<SignInButton redirectTo="/bookmarks?tab=favorites" />
```

### Customization

**Change button text:**
```tsx
// Line 28
<span>Sign in with My Provider</span>
```

**Change button color:**
```tsx
// Line 10
className="bg-white dark:bg-zinc-800"  // Change colors
```

**Change icon:**
```tsx
// Line 17 - Replace Google icon with another provider's icon
// Or use a different icon entirely
```

**Add other OAuth providers:**
```tsx
// Create similar buttons for GitHub, Discord, etc.
export function GitHubSignInButton() {
  return (
    <button onClick={() => start(() => signInWithGithub())}>
      Sign in with GitHub
    </button>
  );
}
```

---

## SignOutButton

**File:** `src/components/SignOutButton.tsx`  
**Type:** Client Component (`"use client"`)  
**Purpose:** Sign out current user

### Features

- **Sign out action** - Clears session
- **Loading state** - Shows while signing out
- **Redirect** - Sends to home page after logout
- **Icon + text** - Clear visual design

### Props

None - uses auth context internally.

### Usage

```tsx
// In Header.tsx
import { SignOutButton } from "./SignOutButton";

{user && (
  <div>
    <span>{user.email}</span>
    <SignOutButton />
  </div>
)}
```

### Customization

**Change button text:**
```tsx
// Line 27
<span>Logout</span>  // or any custom text
```

**Change redirect URL:**
```tsx
// Line 17
router.push("/");  // Change to any URL
```

**Add confirmation dialog:**
```tsx
// Before signing out
if (!confirm("Are you sure you want to sign out?")) return;
```

**Change button color:**
```tsx
// Line 12
className="text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100"
```

---

## Best Practices

### 1. Component Composition

Keep components focused on a single responsibility:

```tsx
// ✅ Good - Each component has one job
<Header />
<AddBookmarkForm />
<BookmarkList />

// ❌ Bad - Component doing too much
<BookmarkManager />  {/* Contains form, list, and delete logic */}
```

### 2. Props Drilling

When passing many props through multiple levels, consider Context API:

```tsx
// ✅ Good - Use Context for deeply nested props
<UserContext.Provider value={user}>
  <Header />
  <BookmarkList />
</UserContext.Provider>

// ❌ Bad - Props drilling through many levels
<Component1 user={user}>
  <Component2 user={user}>
    <Component3 user={user} />
  </Component2>
</Component1>
```

### 3. Client vs Server Components

- Use **Server Components** by default (faster, more secure)
- Only use `"use client"` for interactive components (forms, buttons)

```tsx
// ✅ Good - Server component fetches data
export async function Header() {
  const user = await getUser();
  return <header>...</header>;
}

// ✅ Good - Client component handles interaction
"use client";
export function DeleteButton() {
  const [loading, setLoading] = useState(false);
  return <button onClick={() => delete()}>Delete</button>;
}
```

### 4. Styling

Use consistent Tailwind patterns throughout:

```tsx
// ✅ Good - Consistent class organization
className="
  rounded-lg border border-zinc-200 dark:border-zinc-800
  bg-white dark:bg-zinc-900
  p-4 hover:shadow-md
  transition-all duration-200
"

// ❌ Bad - Disorganized classes
className="p-4 border dark:bg-zinc-900 rounded-lg bg-white border-zinc-200 shadow-md"
```

### 5. Error Handling

Always handle errors gracefully:

```tsx
// ✅ Good - Shows user-friendly error
if (error) {
  return (
    <div className="text-red-600">
      Failed to load bookmarks. Please try again.
    </div>
  );
}

// ❌ Bad - Technical error message
if (error) {
  return <div>{error.toString()}</div>;  // Confusing for users
}
```

### 6. Accessibility

Include ARIA labels and semantic HTML:

```tsx
// ✅ Good - Accessible
<button aria-label="Delete bookmark" onClick={handleDelete}>
  <TrashIcon />
</button>

// ❌ Bad - Not accessible
<div onClick={handleDelete} className="cursor-pointer">
  ×
</div>
```

### 7. Responsive Design

Mobile-first approach:

```tsx
// ✅ Good - Starts mobile, adds features for larger screens
className="flex flex-col md:flex-row lg:gap-8"

// ❌ Bad - Starts large, tries to make responsive
className="flex flex-row md:flex-col sm:gap-4"
```

### 8. Type Safety

Use TypeScript for all components:

```tsx
// ✅ Good - Clear types
interface BookmarkProps {
  id: string;
  title: string;
  onDelete: (id: string) => Promise<void>;
}

export function Bookmark({ id, title, onDelete }: BookmarkProps) {
  // ...
}

// ❌ Bad - No types
export function Bookmark(props) {
  // What properties does this component expect?
}
```

### 9. Performance

Optimize re-renders and subscriptions:

```tsx
// ✅ Good - Cleanup subscriptions
useEffect(() => {
  const subscription = supabase.channel(...).subscribe();
  return () => supabase.removeChannel(subscription);  // Cleanup!
}, []);

// ❌ Bad - Subscription leak
useEffect(() => {
  supabase.channel(...).subscribe();
  // No cleanup - connection stays open forever
}, []);
```

### 10. Testing

Make components testable:

```tsx
// ✅ Good - Easy to test
export function BookmarkItem({ bookmark, onDelete }: Props) {
  return (
    <button onClick={() => onDelete(bookmark.id)} data-testid="delete">
      Delete
    </button>
  );
}

// ❌ Bad - Hard to test
function BookmarkItem() {
  const bookmark = useBookmarkContext();
  return <button onClick={() => deleteBookmark()}>Delete</button>;
}
```

---

## FAQ

### Q: How do I add a new props to a component?

1. Update the TypeScript interface
2. Add the parameter to the function
3. Use it in the component
4. Update all places where component is used

### Q: How do I reuse components with different styles?

1. Pass `className` as a prop
2. Extend with Tailwind utility classes
3. Override specific styles in parent

### Q: Can I use external UI libraries?

Yes, but this app is built purely with Tailwind. External libraries would add bundle size. Better to create custom components using Tailwind!

### Q: How do I debug component issues?

1. Check React DevTools browser extension
2. Add `console.log()` in render and effects
3. Use Next.js debug mode: `npm run dev -- --inspect`
4. Check Supabase logs in dashboard

---

## Resources

- [React Docs](https://react.dev) - Component fundamentals
- [Tailwind Docs](https://tailwindcss.com) - CSS classes
- [TypeScript Docs](https://www.typescriptlang.org) - Type safety

---

**Happy coding! 🎉**

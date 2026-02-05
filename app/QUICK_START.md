# 🚀 Frontend Authentication - Quick Start Guide

## ✅ What You Have

A **complete, production-ready authentication system** with:

- ✅ Login / Sign Up / Logout
- ✅ Password reset flows
- ✅ Automatic token refresh
- ✅ Role-based dashboards (Admin, Owner, Staff)
- ✅ Protected routes with auto-redirect
- ✅ Form validation & error handling
- ✅ Token persistence & management

---

## 🎯 Getting Started

### 1. Start the Backend

```bash
# Make sure your backend is running
# Expected at: http://localhost:3000/api
```

### 2. Start the Frontend

```bash
cd app/
npm run dev
```

Access at: `http://localhost:3001`

---

## 🔐 Test Accounts

Use these to test (create via signup or ask backend to seed):

```
Email:    owner@test.com
Password: password123
Type:     OWNER

Email:    staff@test.com
Password: password123
Type:     STAFF
```

---

## 📍 Key URLs

| URL                         | Purpose                       | Access                      |
| --------------------------- | ----------------------------- | --------------------------- |
| `/login`                    | Login page                    | Public                      |
| `/signup`                   | Create account                | Public                      |
| `/forgot-password`          | Request reset email           | Public                      |
| `/reset-password?token=xxx` | Reset password                | Public                      |
| `/change-password`          | Change password (in settings) | **Protected**               |
| `/dashboard`                | Auto-routes by role           | **Protected**               |
| `/dashboard/admin`          | Admin panel                   | **Protected (SUPER_ADMIN)** |
| `/dashboard/owner`          | Owner panel                   | **Protected (OWNER)**       |
| `/dashboard/staff`          | Staff panel                   | **Protected (STAFF)**       |
| `/account-inactive`         | Inactive account              | Public (error page)         |
| `/account-suspended`        | Suspended account             | Public (error page)         |
| `/unauthorized`             | Access denied                 | Public (error page)         |

---

## 🔄 How It Works

### Login Flow

1. User enters email + password
2. Submit to POST `/api/auth/login`
3. Get tokens + user info
4. Save tokens (access in memory, refresh in localStorage)
5. Auto-redirect to role-specific dashboard

### Token Refresh

1. User makes request → Token added to header
2. Backend returns 401 (token expired)
3. Auto-refresh with refreshToken
4. Retry original request with new token
5. All concurrent requests wait for refresh

### Role-Based Routing

1. User logs in
2. Redirect to `/dashboard`
3. Dashboard detects `user.type`
4. Routes to `/dashboard/{role}`
5. Role-specific dashboard loads

### Logout

1. Call POST `/api/auth/logout`
2. Clear all tokens from memory & localStorage
3. Clear user from state
4. Redirect to `/login`

---

## 🛠️ For Developers

### Using Auth in Your Components

```tsx
import { useAuth } from "@/features/auth/hooks/useAuth";

export function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <button onClick={() => router.push("/login")}>Login</button>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <p>Role: {user?.type}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making API Calls

```tsx
import { apiClient } from "@/shared/lib/api-client";

// Authenticated request (token auto-added)
const response = await apiClient.get("/protected");
if (response.success) {
  // Handle response.data
}

// Public endpoint
const response = await apiClient.post("/public", data, { skipAuth: true });
```

### Protecting Pages

```tsx
"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>Your protected content here</div>;
}
```

---

## 🐛 Troubleshooting

### "Cannot find module" errors

→ Check file paths, especially `/api` imports

### Token not refreshing

→ Make sure `NEXT_PUBLIC_API_URL` is set in `.env.local`

### Infinite redirect loop

→ Clear localStorage: `localStorage.clear()`
→ Check if backend returns correct error codes

### Login works but can't access /dashboard

→ Check if user.type is "OWNER", "STAFF", or "SUPER_ADMIN"
→ Verify backend returns user in login response

### Password fields not validating

→ Min 8 characters required
→ Confirm passwords must match

---

## 📋 Common Tasks

### Add a New Protected Page

```tsx
"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) return null;

  return <div>Your page content</div>;
}
```

### Add Role-Specific Page

```tsx
"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminOnlyPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
    if (!isLoading && user?.type !== "SUPER_ADMIN") {
      router.push("/unauthorized");
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) return null;
  if (user?.type !== "SUPER_ADMIN") return null;

  return <div>Admin-only content</div>;
}
```

### Make an API Call

```tsx
import { apiClient } from "@/shared/lib/api-client";

// GET request
const response = await apiClient.get("/api/endpoint");

// POST request
const response = await apiClient.post("/api/endpoint", { data: "value" });

// PUT request
const response = await apiClient.put("/api/endpoint", { data: "value" });

// DELETE request
const response = await apiClient.delete("/api/endpoint");

// Handle response
if (response.success) {
  console.log("Success:", response.data);
} else {
  console.log("Error:", response.message);
}
```

---

## ✅ Checklist Before Production

- [ ] Backend API running and tested
- [ ] `.env.local` configured with correct API URL
- [ ] All auth pages tested (login, signup, password reset)
- [ ] Role-based dashboards working
- [ ] Token refresh working (check Network tab in DevTools)
- [ ] Logout clears all data
- [ ] Forms validate correctly
- [ ] Error messages display properly
- [ ] Toast notifications working
- [ ] Mobile responsive

---

## 📚 Documentation Files

- **AUTH_IMPLEMENTATION.md** - Detailed implementation guide
- **FRONTEND_AUTH_COMPLETE.md** - Complete feature overview

---

**Ready to rock! 🚀**

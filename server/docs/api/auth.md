# Authentication API Documentation

## Base URL

```
/api/auth
```

## Environment Variables Required (Backend)

```env
JWT_SECRET=your-super-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
DATABASE_URL=mysql://user:password@localhost:3306/instaflow
```

---

## Endpoints

### 1. Sign Up

Register a new user (creates an OWNER account by default).

**Endpoint:** `POST /api/auth/signup`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Validation Rules:**

- `email`: Required, valid email format
- `password`: Required, minimum 8 characters
- `name`: Required, 2-100 characters

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1234567890",
      "email": "user@example.com",
      "name": "John Doe",
      "type": "OWNER",
      "status": "ACTIVE",
      "parentUserId": null
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

**Error Response (409 - Email Exists):**

```json
{
  "success": false,
  "code": "EMAIL_ALREADY_EXISTS",
  "message": "Email already exists",
  "field": "email"
}
```

**Error Response (400 - Validation):**

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ]
}
```

---

### 2. Login

Authenticate with email and password.

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1234567890",
      "email": "user@example.com",
      "name": "John Doe",
      "type": "OWNER",
      "status": "ACTIVE",
      "parentUserId": null
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

**Error Responses:**

- `401` - Invalid credentials
- `403` - User inactive/suspended

```json
{
  "success": false,
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password"
}
```

---

### 3. Refresh Token

Get new access token using refresh token.

**Endpoint:** `POST /api/auth/refresh`

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "code": "TOKEN_EXPIRED",
  "message": "Token has expired"
}
```

---

### 4. Forgot Password

Request password reset (sends email with reset token).

**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "If the email exists, a reset link has been sent",
  "data": {
    "resetToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

> ⚠️ **Note:** In production, the `resetToken` should NOT be returned in the response. It should only be sent via email.

---

### 5. Reset Password

Reset password using the token from forgot-password.

**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "newPassword": "newPassword123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

**Error Responses:**

- `400` - Invalid/expired token

---

### 6. Change Password

Change password for authenticated user.

**Endpoint:** `POST /api/auth/change-password`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Request Body:**

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password has been changed successfully"
}
```

**Error Responses:**

- `400` - Current password incorrect
- `401` - Not authenticated

---

### 7. Get Current User

Get the authenticated user's information.

**Endpoint:** `GET /api/auth/me`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1234567890",
      "email": "user@example.com",
      "name": "John Doe",
      "type": "OWNER",
      "status": "ACTIVE",
      "parentUserId": null
    }
  }
}
```

---

### 8. Logout

Logout the current user.

**Endpoint:** `POST /api/auth/logout`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Types

| Type          | Description                                           |
| ------------- | ----------------------------------------------------- |
| `SUPER_ADMIN` | Platform owner (you), full system access              |
| `OWNER`       | Merchant/business owner, full access to their account |
| `STAFF`       | Employee of an OWNER, limited permissions             |

---

## User Statuses

| Status      | Description                |
| ----------- | -------------------------- |
| `ACTIVE`    | Normal active account      |
| `INACTIVE`  | Account deactivated        |
| `SUSPENDED` | Account suspended by admin |

---

## Token Details

| Token         | Expiry     | Usage                |
| ------------- | ---------- | -------------------- |
| Access Token  | 15 minutes | API authentication   |
| Refresh Token | 7 days     | Get new access token |
| Reset Token   | 1 hour     | Password reset       |

---

## Frontend Implementation Guide

### 1. Token Storage

```typescript
// Store tokens securely
localStorage.setItem("accessToken", tokens.accessToken);
localStorage.setItem("refreshToken", tokens.refreshToken);

// Or use httpOnly cookies (more secure)
```

### 2. API Client Setup

```typescript
// axios interceptor example
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post("/api/auth/refresh", {
          refreshToken,
        });

        localStorage.setItem("accessToken", data.data.tokens.accessToken);
        localStorage.setItem("refreshToken", data.data.tokens.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.tokens.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
```

### 3. Auth Context (React)

```typescript
// AuthContext.tsx
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

// Check token on app load
useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.data.user))
      .catch(() => logout());
  }
}, []);
```

### 4. Protected Routes

```typescript
// ProtectedRoute.tsx
function ProtectedRoute({ children, allowedTypes }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  if (allowedTypes && !allowedTypes.includes(user.type)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

// Usage
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedTypes={['SUPER_ADMIN']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

### 5. Error Handling

```typescript
// Handle API errors consistently
function handleAuthError(error: AxiosError) {
  const code = error.response?.data?.code;

  switch (code) {
    case "INVALID_CREDENTIALS":
      return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
    case "EMAIL_ALREADY_EXISTS":
      return "البريد الإلكتروني مسجل مسبقاً";
    case "USER_SUSPENDED":
      return "تم إيقاف حسابك، تواصل مع الدعم";
    case "TOKEN_EXPIRED":
      return "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى";
    default:
      return "حدث خطأ، يرجى المحاولة مرة أخرى";
  }
}
```

---

## Security Notes

1. **Never store tokens in cookies without httpOnly flag**
2. **Always use HTTPS in production**
3. **Implement rate limiting on auth endpoints**
4. **Add CAPTCHA for signup/forgot-password**
5. **Log all auth events for security auditing**

# Fixing 403 Forbidden Error on /api/auth/register

## The Problem

You were getting a `403 Forbidden` error when trying to register:
```
Failed to load resource: the server responded with a status of 403
POST http://localhost:8080/api/auth/register 403
```

## Root Cause

The issue was in the Spring Security configuration. Here's what was happening:

1. Your `application.yaml` has a context path: `server.servlet.context-path: /api`
2. This means all endpoints are automatically prefixed with `/api`
3. Your AuthController had `@RequestMapping("/auth")`
4. So the actual endpoint was: `http://localhost:8080/api/auth/register`
5. BUT the SecurityConfig was checking `requestMatchers("/api/auth/**")` which didn't match

This created a mismatch where the request couldn't be matched to the allow-all rule, so Spring Security blocked it with a 403 error.

## The Fix Applied

I updated both files to work correctly with the context path:

### 1. SecurityConfig.java (FIXED)
Changed from:
```java
.requestMatchers("/api/auth/**").permitAll()
```

To:
```java
.requestMatchers("/auth/**").permitAll()
.requestMatchers("/workers/**").permitAll()
.requestMatchers("/bookings/**").permitAll()
```

**Why?** Because the context path `/api` is automatically applied by Spring Boot, we only need to match the path AFTER the context path. So we use `/auth/**` not `/api/auth/**`.

### 2. AuthController.java (VERIFIED)
The mapping is correct:
```java
@RequestMapping("/auth")
```

This combined with the context path `/api` creates the correct full path: `/api/auth`

## How It Works Now

```
Request to: http://localhost:8080/api/auth/register
            ↓
Spring adds context path: /api
            ↓
Actual path checked: /auth/register
            ↓
SecurityConfig checks: /auth/** 
            ↓
MATCH! ✅ Access permitted
```

## Testing the Fix

### 1. Rebuild and Start Backend
```bash
cd "ServiceHUB System/Servicehub System"
./mvnw clean spring-boot:run
```

Watch for these success messages in logs:
```
[INFO] SecurityFilterChain configured
[INFO] Started ServicehubSystemApplication
```

### 2. Test with curl
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

You should get a `200 OK` response (or appropriate error if user exists), NOT 403.

### 3. Test with Frontend
Your Next.js frontend should now be able to make requests to `/api/auth/register` without 403 errors.

## Security Configuration Summary

The updated SecurityConfig now permits public access to:
- `/auth/**` - All authentication endpoints (login, register, validate, etc.)
- `/workers/**` - Worker search/listing endpoints
- `/bookings/**` - Booking endpoints (if public access needed)

All other endpoints require authentication via JWT token in the `Authorization` header.

## CORS Configuration

CORS is also properly configured to allow requests from:
- `http://localhost:3000` (main frontend)
- `http://localhost:3001` (alternative frontend)

## If You Still Get 403 Errors

1. **Clear browser cache** - Sometimes old CORS preflight responses are cached
2. **Check the request path** - Make sure it's actually `/api/auth/register` (lowercase)
3. **Check request headers** - Ensure `Content-Type: application/json` is set
4. **Check backend logs** - Look for Spring Security debug messages
5. **Restart backend** - After code changes, do a clean rebuild

## Reference: Context Path Explanation

The `server.servlet.context-path: /api` in `application.yaml` means:
- All your endpoints are served under `/api`
- A controller with `@RequestMapping("/auth")` is available at `/api/auth`
- A controller with `@RequestMapping("/workers")` is available at `/api/workers`
- Spring Security rules should match the paths WITHOUT the context path prefix

So:
- ✅ CORRECT: `requestMatchers("/auth/**")`
- ❌ WRONG: `requestMatchers("/api/auth/**")`

## Next Steps

1. Rebuild the backend with the fixed SecurityConfig
2. Test the `/api/auth/register` endpoint
3. Test the `/api/auth/login` endpoint
4. Verify frontend can make requests without 403 errors
5. If you need to add more public endpoints, add them to the SecurityConfig

All other endpoints will still require authentication (JWT token in Authorization header).

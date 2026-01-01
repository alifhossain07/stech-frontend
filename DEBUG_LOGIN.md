# Debugging Login Issue

## Current Problem
Backend returns "Phone is required" even though phone number is being sent.

## Debugging Steps

### 1. Check Browser Console (Client-Side)
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to login
4. Look for logs starting with "=== CLIENT-SIDE LOGIN DEBUG ==="
5. Check what payload is being sent

### 2. Check Server Terminal (Next.js API Route)
1. Look at your terminal where Next.js is running
2. After attempting login, check for logs starting with "=== LOGIN DEBUG INFO ==="
3. Verify:
   - API Base URL is correct
   - Full endpoint URL
   - Request body structure
   - Phone value and type

### 3. Check Backend Response
Look for logs starting with "=== BACKEND RESPONSE ===" to see:
- Full response from backend
- Response status code
- Error messages

### 4. Test Backend API Directly

#### Using cURL:
```bash
curl -X POST http://sannai.test/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -H "System-Key: YOUR_SYSTEM_KEY" \
  -d '{
    "login_by": "phone",
    "email_or_phone": "01631697616",
    "password": "12345678"
  }'
```

#### Using Postman/Insomnia:
1. Method: POST
2. URL: `http://sannai.test/api/v2/auth/login`
3. Headers:
   - `Content-Type: application/json`
   - `System-Key: YOUR_SYSTEM_KEY`
4. Body (JSON):
```json
{
  "login_by": "phone",
  "email_or_phone": "01631697616",
  "password": "12345678"
}
```

### 5. Check Environment Variables
Verify your `.env.local` or `.env` file has:
```
API_BASE=http://sannai.test/api/v2
SYSTEM_KEY=your_system_key_here
```

### 6. Common Issues to Check

#### Issue 1: Field Name Mismatch
- Backend might expect `phone` instead of `email_or_phone`
- Backend might expect `mobile` instead of `phone`
- Try different field names in the request

#### Issue 2: Phone Format
- Backend might require phone without leading zero: `1631697616`
- Backend might require country code: `8801631697616`
- Backend might require specific format

#### Issue 3: Validation Rules
- Backend might have custom validation that checks field differently
- Backend might require phone to be numeric only (no spaces, dashes)

#### Issue 4: API Endpoint
- Verify the endpoint path is correct
- Check if it's `/auth/login` or `/api/v2/auth/login` or something else

### 7. Compare with Working Signup
Check how signup works:
1. Look at `app/api/auth/signup/route.ts`
2. See what fields it sends
3. Compare with login request
4. Try to match the exact structure

### 8. Network Tab Inspection
1. Open DevTools → Network tab
2. Try to login
3. Find the `/api/auth/login` request
4. Click on it and check:
   - Request Headers
   - Request Payload
   - Response Headers
   - Response Body

### 9. Backend Logs
If you have access to backend logs:
1. Check Laravel logs (usually `storage/logs/laravel.log`)
2. Look for validation errors
3. Check what the backend actually received

## What to Look For

1. **Request Structure**: Is the JSON structure correct?
2. **Field Names**: Are field names exactly what backend expects?
3. **Data Types**: Are values the correct type (string, number)?
4. **Empty Values**: Are any values empty or null?
5. **Headers**: Are all required headers present?
6. **API Endpoint**: Is the endpoint URL correct?

## Next Steps After Debugging

Once you identify the issue:
1. Note what the backend actually expects
2. Update the login route accordingly
3. Test again
4. Remove debug logs once working


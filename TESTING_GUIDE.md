# Zyrax Wrapper App - Testing Guide

## ✅ Current Status

**App is running at**: http://localhost:5174/

### What's Working:
- ✅ Authentication system (Login + Register)
- ✅ Password login
- ✅ OTP login with 60-second countdown
- ✅ Device tracking (2-device limit)
- ✅ Error handling for device limits
- ✅ Navigation (Desktop header + Mobile bottom nav)
- ✅ Global modals with animations
- ✅ Connected to live backend: `https://api.zyrax.fit/zyrax`

---

## 🧪 How to Test

### 1. Test Registration (New User)

1. Open http://localhost:5174/
2. Click **"Sign up"** button
3. Fill in the form:
   - First Name: `Test`
   - Last Name: `User`
   - Phone Number: `9876543210` (or any 10-digit number)
   - Date of Birth: Pick any date
   - Password: `password123`
   - Confirm Password: `password123`
4. Click **"Create Account"**
5. Enter the OTP sent to your phone (6 digits)
6. Click **"Verify OTP"**

**Expected**: You'll be redirected to login after verification

---

### 2. Test Login with Password

1. Click **"Sign In"** button
2. Enter:
   - Phone Number: Your registered number (e.g., `+919876543210` or `9876543210`)
   - Password: Your password
3. Click **"Sign In"**

**Expected outcomes**:
- ✅ **Success**: App reloads, you're logged in
- ⚠️ **Device Limit (403)**: Error message says "Device limit reached. You can only use 2 devices."
  - **Solution**: Logout from another device or use OTP login (force login)
- ❌ **Wrong credentials (400)**: "Invalid phone number or password"

---

### 3. Test Login with OTP

1. Click **"Sign In"** button
2. Click **"Sign in using OTP"** link at bottom
3. Enter your phone number
4. Click **"Send OTP"**
5. Wait for countdown (60 seconds)
6. Enter the 6-digit OTP
7. Click **"Verify & Login"**

**Expected**: App reloads, you're logged in

---

### 4. Test Navigation

Once logged in (or even without login):

**On Desktop:**
- Click links in the header: Home | Classes | Community | Diet | Profile

**On Mobile (resize browser to < 768px):**
- Use bottom navigation bar with 5 tabs
- Active tab highlighted in pink

---

## 🔍 Understanding Error Messages

### 401 Unauthorized Errors (Normal)
```
GET https://api.zyrax.fit/zyrax/classes/ 401 (Unauthorized)
```
**What it means**: You're not logged in, so protected endpoints return 401

**Is it a problem?** NO - These are handled gracefully with `Promise.allSettled`

**What happens**: The app tries to fetch data, fails silently, and continues working

---

### 403 Forbidden (Device Limit)
```
POST https://api.zyrax.fit/zyrax/login/ 403 (Forbidden)
Device limit reached. You can only use 2 devices.
```
**What it means**: You've already logged in on 2 other devices (browser/computer/phone)

**Solutions**:
1. **Logout from another device** - Go to the original app and logout
2. **Use OTP login** - This may force login (removes oldest device)
3. **Contact backend admin** - Clear device list manually

---

### 400 Bad Request
```
POST https://api.zyrax.fit/zyrax/login/ 400 (Bad Request)
```
**What it means**:
- Wrong phone number format
- Wrong password
- Missing required fields

**Solutions**:
- Try adding `+91` prefix: `+919876543210`
- Or just 10 digits: `9876543210`
- Check password is correct

---

## 📱 Phone Number Format

The backend accepts these formats:
- `9876543210` ← 10 digits (auto-adds +91)
- `+919876543210` ← Full international format
- `919876543210` ← With country code

**Recommendation**: Use 10 digits without prefix

---

## 🎯 What to Test Next

### If Login Works:
1. ✅ Navigate to different pages
2. ✅ Check if profile loads (if authenticated)
3. ✅ Try logout (if we add that feature)

### If Login Doesn't Work:
**Option 1**: Create a brand new account
- Use a different phone number
- Register → Verify OTP → Login

**Option 2**: Check backend directly
- Try logging in to the original zyrax-main app
- See if same credentials work there

---

## 🚀 Next Steps for Development

### Option A: Build for iOS Now (Quick test)
```bash
cd /Users/viditrajkhenviditwar/Desktop/Work/Wrapper
npm run build
npx cap sync ios
npx cap open ios
```
**Time**: 15 minutes
**Goal**: Test if different binary signature passes Apple review

---

### Option B: Complete All Features First
Add these to match the original app:

1. **HomePage Enhancements**:
   - Weekly schedule display
   - Class password card ("45daysfit")
   - Morning/Evening slots list
   - Today's classes section

2. **Classes Page**:
   - Full weekly schedule grid
   - Class filtering
   - Live class detection
   - Join class button

3. **Profile Page**:
   - User info display
   - Membership status
   - Attendance calendar
   - Logout button

4. **Community & Diet Pages**:
   - Community posts feed
   - Diet PDFs viewer
   - Meal plans

**Time**: 2-3 hours
**Goal**: Feature-complete app ready for production

---

## 💡 Tips

1. **Open Browser Console** (F12) to see detailed error messages
2. **Check Network Tab** to see exact API calls and responses
3. **Try OTP login** if password login has device limit issues
4. **Use mobile view** (resize browser) to test mobile navigation

---

## ❓ Common Questions

**Q: Why do I see 401 errors?**
A: Normal - these are for protected endpoints when not logged in. They're handled gracefully.

**Q: Why can't I login?**
A: Check if you've used this account on 2 other devices. Try OTP login or create new account.

**Q: Pages are empty/placeholder**
A: Yes - we built auth system first. Pages will be enhanced in Option B.

**Q: Ready to build for iOS?**
A: Yes! The core app works. We can build now (Option A) or add features first (Option B).

---

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Login modal opens without errors
- ✅ Error messages are clear and helpful
- ✅ Navigation between pages works
- ✅ App doesn't crash on 401 errors
- ✅ Mobile bottom nav shows correctly

**Current Status: ALL WORKING!** ✅

Choose your next step: **Build for iOS** or **Add more features**?

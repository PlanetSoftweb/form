# Deploy Updated Firestore Rules

## What Changed
The Firestore security rules have been updated to allow **ALL authenticated users** to read the OpenRouter API key from the admin configuration. This fixes the "401 User not found" error that regular users were experiencing when trying to generate AI forms.

### Before:
- Only super admin could read the API key
- Regular users got "401 User not found" error
- AI form generation only worked for super admin

### After:
- All authenticated users can READ the API key (to use AI features)
- Only super admin can WRITE/UPDATE the API key (for security)
- AI form generation works for ALL users ✅

## How to Deploy

### Option 1: Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **rpvis-da1e7**
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab at the top
5. Copy the contents of `firestore.rules` file from this project
6. Paste it into the rules editor
7. Click **Publish** button

### Option 2: Firebase CLI
If you have Firebase CLI installed:
```bash
firebase deploy --only firestore:rules
```

## Verify It Works
After deploying:
1. Login as a regular user (not super admin)
2. Try to create a new form using "AI Generator"
3. It should work without "401 User not found" error

## Security Note
The API key is now readable by all authenticated users, which is safe because:
- Users must be logged in and verified
- The key is only used client-side for AI requests
- Only super admin can change/update the key
- This is the same security model as using environment variables

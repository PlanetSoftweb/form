# Super Admin Panel Guide

## 🔐 Accessing Super Admin Panel

**URL**: `/super-admin`

**Admin Email**: `kevalsavaliya2222@gmail.com`

⚠️ **Important**: Only this email address can access the Super Admin panel. This is enforced by Firebase authentication and Firestore security rules.

---

## 📊 Features

### 1. **Dashboard Statistics**
- View total number of users
- View total number of forms created across all users
- Real-time statistics from Firebase

### 2. **API Key Management**
- View current OpenRouter API key
- Update API key instantly
- API key is stored securely in Firebase Firestore
- All users will automatically use the new key after update

---

## 🚀 How to Use

### Step 1: Login
1. **Login with admin email** at `yourwebsite.com/login`
   - Email: kevalsavaliya2222@gmail.com
   - Password: (your Firebase password)
2. Go to `yourwebsite.com/super-admin`
3. You'll be automatically authorized if you're the admin

### Step 2: View Statistics
- See total users and forms in the dashboard cards

### Step 3: Manage API Key
1. Scroll to "OpenRouter API Key Management" section
2. Click the eye icon to show/hide the API key
3. Update the API key if needed
4. Click "Save API Key"
5. Done! The new key is now active

---

## 🔧 For Deployment (Netlify/Vercel/etc)

### Initial Setup:
1. Go to Super Admin panel: `yourdomain.com/super-admin`
2. Login with password
3. Enter your OpenRouter API key
4. Click "Save API Key"

### How It Works:
- ✅ API key is stored in Firebase Firestore (secure & persistent)
- ✅ Works across all deployments (no need to set environment variables)
- ✅ You can change the API key anytime through the admin panel
- ✅ No need to redeploy when changing API key

---

## 🔒 Security Notes

1. **Email-Based Access Control**: Only kevalsavaliya2222@gmail.com can access Super Admin
2. **Firestore Security Rules**: Enforced at database level - only admin email can write
3. **Firebase Authentication**: Must be logged in with admin account
4. **HTTPS Only**: Always use HTTPS in production
5. **No Password Hardcoding**: Uses Firebase email verification for security

---

## 🎯 Firebase Firestore Structure

The API key is stored at:
```
admin (collection)
  └── config (document)
      ├── openrouterApiKey: "sk-or-v1-..."
      └── updatedAt: "2024-10-15T10:00:00Z"
```

---

## 🔄 How API Key Loading Works

1. App checks Firebase for API key first
2. If found, uses Firebase API key
3. If not found, falls back to environment variable `VITE_OPENROUTER_API_KEY`
4. Caches the key for better performance

---

## ✅ Benefits

- ✅ No need to configure environment variables on hosting platforms
- ✅ Change API key without redeploying
- ✅ Centralized management
- ✅ Works on any hosting platform (Netlify, Vercel, Firebase Hosting, etc.)
- ✅ Secure storage in Firebase

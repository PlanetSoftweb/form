# 🚀 AI FormBuilder - Deployment Guide

## Deployment Configuration

Your AI FormBuilder app is configured for **Autoscale Deployment** on Replit.

### Current Configuration
```
Deployment Type: Autoscale
Build Command: npm run build
Run Command: npm run preview
Port: 5000
```

---

## How to Deploy

### Step 1: Prepare for Deployment
1. **Verify all secrets are set** in Replit Secrets panel:
   - Firebase configuration variables (VITE_FIREBASE_*)
   - Any API keys needed (OpenAI, etc.)

2. **Test locally** first:
   ```bash
   npm run build
   npm run preview
   ```

3. **Check for errors** in the console

### Step 2: Deploy on Replit
1. Click the **"Deploy"** or **"Publish"** button in Replit
2. The deployment will automatically:
   - Run `npm run build` to create production bundle
   - Start `npm run preview` to serve the app
   - Make the app available on port 5000

3. Wait for deployment to complete (usually 1-3 minutes)

### Step 3: Verify Deployment
1. Visit your deployed URL (provided by Replit)
2. Test key features:
   - User registration
   - Form creation
   - Form publishing
   - Form submissions

---

## Autoscale Deployment Benefits

✅ **Cost-Effective**: Only runs when requests are made  
✅ **Scalable**: Automatically handles traffic spikes  
✅ **Simple**: No server management needed  
✅ **Reliable**: Built-in load balancing  

### When to Use Autoscale
- Stateless web applications ✅
- Forms and data collection ✅
- Content websites ✅
- APIs without persistent connections ✅

### When NOT to Use Autoscale
- WebSocket servers ❌
- Long-running background jobs ❌
- Applications requiring server-side state ❌

---

## Environment Variables

### Required Secrets
Set these in Replit Secrets panel before deploying:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: AI Features
VITE_OPENAI_API_KEY=your_openai_key (if using AI features)
VITE_GOOGLE_AI_KEY=your_google_ai_key (if using Gemini)
```

### How to Add Secrets
1. Open Replit Secrets panel (lock icon)
2. Click "Add Secret"
3. Enter key name and value
4. Click "Add"

---

## Custom Domain Setup

### Option 1: Replit Custom Domain
1. Go to Deployment settings
2. Click "Add Custom Domain"
3. Follow instructions to configure DNS
4. Wait for SSL certificate (automatic)

### Option 2: External Domain
1. Get your Replit deployment URL
2. Create a CNAME record in your DNS:
   ```
   CNAME  www  your-app.replit.dev
   ```
3. Configure SSL (Cloudflare recommended)

---

## Monitoring & Maintenance

### Check Deployment Status
- View deployment logs in Replit Console
- Monitor Firebase usage in Firebase Console
- Check error rates in Firebase Crashlytics (if configured)

### Performance Optimization
- **Bundle size**: Already optimized with Vite
- **Images**: Use WebP format when possible
- **Caching**: Configured in Vite build
- **Compression**: Automatic in Replit deployment

### Database Management
- **Backups**: Configure in Firebase Console
- **Security Rules**: Review monthly
- **Indexes**: Add as needed for queries
- **Cleanup**: Remove old submissions periodically

---

## Troubleshooting

### Deployment Fails
**Problem**: Build command fails  
**Solution**:
1. Check for TypeScript errors: `npm run lint`
2. Verify all dependencies are installed
3. Check build logs for specific errors

### App Not Loading
**Problem**: 404 or blank page after deployment  
**Solution**:
1. Verify port 5000 is configured
2. Check if build output exists in `dist/` folder
3. Review deployment logs

### Authentication Not Working
**Problem**: Users can't sign in/register  
**Solution**:
1. Verify Firebase secrets are set correctly
2. Check Firebase Console for errors
3. Ensure Firebase project is active
4. Verify domain is authorized in Firebase

### Forms Not Submitting
**Problem**: Form submissions fail  
**Solution**:
1. Check Firebase Firestore rules
2. Verify network requests in browser dev tools
3. Check Firebase quota limits
4. Review error logs in Firebase Console

---

## Scaling Considerations

### Current Setup (Good for):
- Up to 10,000 users
- Up to 100,000 form submissions/month
- Standard traffic patterns

### When to Scale:
- **High Traffic**: Consider dedicated VM deployment
- **Background Jobs**: Set up separate worker processes
- **Real-time Features**: Consider WebSocket deployment
- **Global Users**: Add CDN (Cloudflare)

### Firebase Quotas
Monitor these limits:
- Firestore reads/writes
- Authentication users
- Storage usage
- Function invocations (if using)

---

## Security Checklist

Before going live:
- [ ] All API keys in Replit Secrets (not in code)
- [ ] Firebase security rules configured
- [ ] HTTPS enabled (automatic on Replit)
- [ ] CORS configured properly
- [ ] Rate limiting on sensitive endpoints
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] Content Security Policy headers set

---

## Backup Strategy

### Code Backup
- ✅ Git repository (automatic in Replit)
- ✅ GitHub sync (recommended)

### Database Backup
1. Enable automatic backups in Firebase Console
2. Export Firestore data weekly
3. Store exports in Google Cloud Storage

### User Data
1. Implement data export feature
2. Allow users to download their data
3. Comply with GDPR requirements

---

## Support & Resources

### Replit Documentation
- [Deployment Guide](https://docs.replit.com/hosting/deployments/about-deployments)
- [Custom Domains](https://docs.replit.com/hosting/deployments/custom-domains)
- [Environment Variables](https://docs.replit.com/programming-ide/workspace-features/storing-sensitive-information-environment-variables)

### Firebase Documentation
- [Security Rules](https://firebase.google.com/docs/rules)
- [Performance Monitoring](https://firebase.google.com/docs/perf-mon)
- [Analytics](https://firebase.google.com/docs/analytics)

### Need Help?
- Email: support@formbuilder.com
- Company: PlanetSoftweb
- Website: planetsoftweb.com

---

## Quick Deploy Checklist

- [ ] All secrets configured in Replit
- [ ] Local build tested successfully
- [ ] Firebase project configured
- [ ] Email templates customized (optional)
- [ ] Privacy Policy updated
- [ ] Click "Deploy/Publish" button
- [ ] Test deployed URL
- [ ] Monitor for 24 hours
- [ ] Share with users!

🎉 **You're ready to deploy!**

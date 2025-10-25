# AI FormBuilder - Project Documentation

## Overview
AI FormBuilder is an intelligent form creation platform that uses AI to generate professional forms instantly. Built with React, TypeScript, Firebase, and powered by AI models (OpenAI/Google Gemini).

## Key Features
- 🤖 **AI-Powered Form Generation** - Create forms from simple descriptions
- 🎨 **Drag-and-Drop Builder** - Intuitive visual form designer
- 📊 **Advanced Analytics** - Comprehensive form analytics and insights
- 🔒 **Secure Authentication** - Firebase Auth with email verification
- 📱 **Fully Responsive** - Works on all devices
- 🌐 **SEO Optimized** - Dynamic meta tags and favicons for published forms

## Recent Changes (October 2025)

### Branding Update
- **Renamed to "AI FormBuilder"** to emphasize AI capabilities
- Updated all branding throughout the app
- Created professional gradient favicon (blue to purple)
- Added dynamic favicons for published forms (shows form name initial)

### SEO & Launch Preparation
- Comprehensive SEO meta tags (Open Graph, Twitter Cards)
- Dynamic page titles for published forms
- Optimized keywords for AI form builder searches
- All legal pages in place (Privacy Policy, Terms of Service, Contact)

### Email & Authentication
- Enhanced email verification flow with spam folder warnings
- Resend verification email feature on login
- Improved user guidance for email deliverability
- Created Firebase email setup documentation

### Deployment
- Configured for Autoscale deployment
- Build: `npm run build`
- Run: `npm run preview`
- Port: 5000
- Launch checklist and deployment guide created

## Project Structure

```
├── src/
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   ├── builder/      # Form builder components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── SEO.tsx       # SEO meta tags component
│   │   └── ...
│   ├── store/            # Zustand state management
│   ├── lib/              # Firebase and utilities
│   └── styles/           # Tailwind CSS
├── public/               # Static assets
│   └── favicon.svg       # App favicon
├── LAUNCH_CHECKLIST.md   # Pre-launch checklist
├── DEPLOYMENT_GUIDE.md   # Deployment instructions
├── FIREBASE_EMAIL_SETUP.md # Email configuration guide
└── .env.example          # Environment variables template
```

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Zustand** - State management

### Backend & Services
- **Firebase Auth** - Authentication
- **Firebase Firestore** - Database
- **Firebase Storage** - File storage
- **OpenAI / Google Gemini** - AI form generation

### UI Components
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **@dnd-kit** - Drag and drop
- **React Colorful** - Color picker

## Environment Variables

Required secrets (set in Replit Secrets):
```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Optional (for AI features):
```bash
VITE_OPENAI_API_KEY=
VITE_GOOGLE_AI_KEY=
```

## User Preferences

### Coding Style
- TypeScript for type safety
- Functional components with hooks
- Tailwind for styling
- Clean, modular code structure

### Workflow
- Firebase for backend services
- Vite for fast development
- Git for version control

## Key Design Decisions

### Authentication Flow
- **Email verification required** - Users must verify email before accessing features
- **Spam folder warnings** - Prominent warnings about email deliverability
- **Resend email feature** - Users can request new verification emails
- **Simplified registration** - Changed from 4-step to 2-step process for better UX

### Form System
- **Dynamic rendering** - Forms render based on schema
- **Drag-and-drop builder** - Visual form creation
- **AI generation** - Forms can be generated from descriptions
- **Real-time preview** - Live preview while building

### Email Deliverability
- **Known issue**: Firebase default emails often go to spam
- **Solution documented**: Custom domain + SPF/DKIM configuration guide
- **User guidance**: Clear warnings and instructions throughout app
- **Workaround**: Resend email functionality

### SEO Strategy
- **Dynamic titles**: Each published form gets custom title with form name
- **Dynamic favicons**: Forms show favicon with first letter of form name
- **Rich meta tags**: Full Open Graph and Twitter Card support
- **AI-focused keywords**: Optimized for "AI form builder" searches

## Development Commands

```bash
# Development
npm run dev          # Start dev server on port 5000

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## Deployment

### Current Configuration
- **Type**: Autoscale (recommended for this app)
- **Build**: `npm run build`
- **Run**: `npm run preview`
- **Port**: 5000

### Pre-Deployment Checklist
1. All Firebase secrets configured
2. Email templates customized in Firebase Console
3. Test build runs successfully
4. All legal pages reviewed
5. See LAUNCH_CHECKLIST.md for complete list

### Post-Deployment
1. Test all features on live URL
2. Monitor Firebase usage
3. Check email delivery rates
4. Gather user feedback

## Known Issues & Solutions

### 1. Email Deliverability
**Issue**: Verification emails go to spam  
**Status**: Documented  
**Solution**: Configure custom domain in Firebase Console (see FIREBASE_EMAIL_SETUP.md)

### 2. Firebase Warnings
**Issue**: enableIndexedDbPersistence() deprecation warning  
**Status**: Non-critical  
**Solution**: Will update to new cache API in future release

### 3. React Router Warnings
**Issue**: Future flag warnings (v7_startTransition, v7_relativeSplatPath)  
**Status**: Non-critical  
**Solution**: Will update when React Router v7 is released

## Support & Resources

### Documentation
- Launch Checklist: `LAUNCH_CHECKLIST.md`
- Deployment Guide: `DEPLOYMENT_GUIDE.md`
- Firebase Email Setup: `FIREBASE_EMAIL_SETUP.md`
- Environment Variables: `.env.example`

### Contact
- Email: support@formbuilder.com
- Company: PlanetSoftweb
- Website: planetsoftweb.com

## Future Enhancements

### Short Term
- [ ] Add Google Analytics
- [ ] Implement error monitoring (Sentry)
- [ ] Add more AI models support
- [ ] Create demo forms for new users

### Long Term
- [ ] Team collaboration features
- [ ] Advanced form logic and conditional fields
- [ ] Payment integration for premium features
- [ ] Mobile app (React Native)

## Notes

- Project uses Firebase for all backend services
- AI features are optional (require API keys)
- App is fully responsive and works on all modern browsers
- Security: All API keys must be in Replit Secrets, never in code
- Email deliverability requires Firebase Console configuration (not code)

---

**Last Updated**: October 13, 2025  
**Version**: 1.0.0 (Launch Ready)  
**Status**: ✅ Ready for Production

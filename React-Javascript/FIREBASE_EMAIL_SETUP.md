# Firebase Email Configuration Guide

## Problem: Emails Going to Spam

Your verification and password reset emails are going to spam because Firebase uses default email delivery settings. Here's how to fix it:

## Solution: Customize Email Templates in Firebase Console

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **rpvis-da1e7**
3. Click on **Authentication** in the left sidebar
4. Click on **Templates** tab at the top

### Step 2: Customize Email Templates

#### Email Address Verification Template:
1. Click on **Email address verification**
2. Click **Edit** (pencil icon)
3. Customize the template with:
   - Your company name
   - Better subject line (e.g., "Verify Your Email - [Your App Name]")
   - Clear instructions
   - Your brand colors and logo

**Recommended Subject:**
```
Verify Your Email - Action Required
```

**Recommended Body Template:**
```html
<p>Hi there,</p>

<p>Thank you for signing up! Please verify your email address by clicking the link below:</p>

<p><a href="%LINK%" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px;">Verify Email Address</a></p>

<p>Or copy and paste this link into your browser:</p>
<p>%LINK%</p>

<p>This link will expire in 24 hours.</p>

<p>If you didn't create an account, you can safely ignore this email.</p>

<p>Thanks,<br>
[Your Company Name] Team</p>
```

#### Password Reset Template:
1. Click on **Password reset**
2. Click **Edit**
3. Customize similarly

### Step 3: Configure Email Sender (IMPORTANT)

#### Option A: Use Custom Domain (Best for preventing spam)
1. In Templates tab, click **Customize action URL**
2. Add your custom domain
3. Configure SPF and DKIM records in your domain DNS:

**SPF Record:**
```
v=spf1 include:_spf.firebasemail.com ~all
```

**DKIM:** Firebase will provide DKIM records after domain verification

#### Option B: Use Firebase Default (Current Setup)
- Emails will come from `noreply@rpvis-da1e7.firebaseapp.com`
- More likely to go to spam
- No additional configuration needed

### Step 4: Test Your Emails

1. After saving changes, create a test account
2. Check both inbox and spam folder
3. Verify the email looks good and links work

## Alternative: Use SendGrid or Custom Email Service

For better deliverability, consider using:
- **SendGrid** (free tier: 100 emails/day)
- **Amazon SES** 
- **Mailgun**

You would need to:
1. Use Firebase Admin SDK (backend required)
2. Generate email action links
3. Send custom emails through your service

## Current App Improvements

✅ App now clearly warns users to check spam folder
✅ Resend verification email button added to login page
✅ Better messaging throughout signup/login flow

## Why Emails Go to Spam

1. **No custom domain** - Emails from Firebase subdomains are flagged
2. **Missing email authentication** - No SPF/DKIM records
3. **Low sender reputation** - Firebase shared IP addresses
4. **Generic content** - Default templates look automated

## Recommended Priority

1. ✅ **Immediate**: Update email templates with your branding (10 min)
2. 🔄 **Soon**: Add custom domain with SPF/DKIM (1-2 hours)
3. 🚀 **Future**: Migrate to dedicated email service (4-6 hours)

---

**Note:** These changes must be made in Firebase Console - they cannot be done through code. The app code has been updated to help users find emails in spam, but fixing spam delivery requires Firebase Console configuration.

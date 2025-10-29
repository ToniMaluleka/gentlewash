# 🚀 How to Deploy GentleWash Online

## Quick Options (Recommended)

### ✨ Option 1: Vercel (EASIEST - 5 Minutes)

Vercel is the company behind Next.js and offers free hosting.

#### Steps:

1. **Create a GitHub Account** (if you don't have one)
   - Go to https://github.com
   - Sign up for free

2. **Push Your Code to GitHub**
   ```powershell
   # In your project folder
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   
   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/YOUR-USERNAME/gentlewash.git
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "Sign up" and use your GitHub account
   - Click "New Project"
   - Import your `gentlewash` repository
   - Vercel will auto-detect Next.js
   - Add your environment variables:
     - Click "Environment Variables"
     - Add all variables from your `.env.local` file:
       ```
       NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCfD8vdA8-6eEsciXAbFvstFln7ZuMbPMQ
       NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gentlewash.firebaseapp.com
       NEXT_PUBLIC_FIREBASE_PROJECT_ID=gentlewash
       NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gentlewash.firebasestorage.app
       NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=816635417605
       NEXT_PUBLIC_FIREBASE_APP_ID=1:816635417605:web:bb339c48736bbdf51f386c
       ```
   - Click "Deploy"
   - Wait 2-3 minutes ⏱️
   - **Your site is LIVE!** 🎉

4. **Your Live URL**
   - You'll get a URL like: `https://gentlewash.vercel.app`
   - Or connect your own domain later

---

### 🔥 Option 2: Firebase Hosting (Also Free)

Since you're already using Firebase, this is a good option.

#### Steps:

1. **Install Firebase CLI**
   ```powershell
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```powershell
   firebase login
   ```

3. **Initialize Firebase Hosting**
   ```powershell
   firebase init hosting
   ```
   - Select your existing project: `gentlewash`
   - Public directory: type `out` (press Enter)
   - Configure as single-page app: `Yes`
   - Don't overwrite files: `No`

4. **Build Your App**
   ```powershell
   npm run build
   npx next export
   ```

5. **Deploy**
   ```powershell
   firebase deploy --only hosting
   ```

6. **Your Live URL**
   - Firebase will show: `https://gentlewash.web.app`
   - Or: `https://gentlewash.firebaseapp.com`

---

### 🌐 Option 3: Netlify (Free Alternative)

Similar to Vercel, also free and easy.

#### Steps:

1. **Push code to GitHub** (same as Vercel option)

2. **Deploy to Netlify**
   - Go to https://netlify.com
   - Sign up with GitHub
   - Click "New site from Git"
   - Choose your repository
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variables (same as `.env.local`)
   - Click "Deploy"

3. **Your Live URL**
   - You'll get: `https://gentlewash.netlify.app`

---

## 🎯 Recommended: Vercel (Best for Next.js)

**Why Vercel?**
- ✅ Made by Next.js creators
- ✅ Zero configuration needed
- ✅ Automatic HTTPS
- ✅ Free SSL certificate
- ✅ Free custom domain
- ✅ Automatic deployments when you push to GitHub
- ✅ Serverless functions support
- ✅ Edge network (fast worldwide)
- ✅ Free tier is generous

---

## 📝 Before Deploying - Checklist

### 1. Update Firebase Domain Settings

After you get your live URL, update Firebase:

1. Go to Firebase Console → Authentication
2. Click "Settings" → "Authorized domains"
3. Add your new domain:
   - `gentlewash.vercel.app` (or your domain)
   - Click "Add domain"

### 2. Enable Google Sign-In Domain

1. Firebase Console → Authentication → Sign-in method
2. Click on "Google"
3. Under "Authorized domains", add your Vercel URL

### 3. Create `.gitignore` (Already Created)

Make sure these are in your `.gitignore`:
```
node_modules/
.next/
.env.local
.env
```

---

## 🔒 Security Notes

**IMPORTANT:**
- ✅ Never commit `.env.local` to GitHub
- ✅ Add environment variables in Vercel/Netlify dashboard
- ✅ Update Firebase Security Rules for production
- ✅ Enable authentication domain in Firebase

### Update Firestore Security Rules (Production)

In Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid || 
         resource.data.washerId == request.auth.uid);
    }
  }
}
```

Click "Publish" to apply rules.

---

## 💡 Quick Start: Deploy in 5 Minutes

### The Fastest Way:

1. **Push to GitHub:**
   ```powershell
   git init
   git add .
   git commit -m "Deploy GentleWash"
   ```
   - Create repo on GitHub
   - Push code

2. **Go to Vercel.com:**
   - Sign in with GitHub
   - Import repository
   - Add environment variables
   - Deploy

3. **Update Firebase:**
   - Add Vercel domain to authorized domains

4. **Done!** ✅

---

## 🎨 Custom Domain (Optional)

### After deploying to Vercel:

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Vercel dashboard → Your Project → Settings → Domains
3. Add your custom domain (e.g., `gentlewash.co.za`)
4. Update DNS records as instructed
5. Vercel automatically adds SSL certificate

---

## 🆘 Troubleshooting

### Build Fails on Vercel:
- Check that all dependencies are in `package.json`
- Ensure no syntax errors
- Check build logs for specific errors

### Firebase Auth Not Working:
- Add your deployment domain to Firebase authorized domains
- Check that environment variables are set correctly

### Google Sign-In Fails:
- Authorized domains must include your Vercel URL
- No `http://` prefix in authorized domains, just the domain

---

## 📊 What You Get (Free Tier)

**Vercel Free Plan:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments for every git push
- ✅ Custom domains

**Firebase Free Plan (Spark):**
- ✅ 10GB/month hosting storage
- ✅ 360MB/day storage
- ✅ 50K reads/day (Firestore)
- ✅ 20K writes/day (Firestore)

---

## 🎉 Next Steps After Deployment

1. ✅ Test all features on live site
2. ✅ Create test accounts (washer and owner)
3. ✅ Test job creation and assignment
4. ✅ Monitor Firebase usage in console
5. ✅ Share link with beta testers!

---

## 📞 Need Help?

If you get stuck:
1. Check Vercel deployment logs
2. Check Firebase console for errors
3. Verify all environment variables are set
4. Make sure authorized domains are updated

---

**Ready to go live?** Start with Vercel - it's the easiest! 🚀

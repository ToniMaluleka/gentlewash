# GentleWash MVP 🚗

A web-based Progressive Web App (PWA) that connects car owners with mobile car washers. Think Uber, but for car washing services.

## 🎯 Features

- **For Car Owners:**
  - Request car wash services (Exterior, Interior, or Both)
  - Track washer location in real-time
  - Secure payment processing
  - Rate and review washers

- **For Washers:**
  - Accept wash requests nearby
  - Navigate to customer locations
  - Earn money on your schedule
  - Build your reputation with ratings

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Firebase account (free tier works fine)
- Git installed

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable **Authentication** → Email/Password
   - Create a **Firestore Database** (start in test mode for development)
   - Enable **Storage**
   - Copy your Firebase config

3. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` and add your Firebase configuration values

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
gentlewash-mvp/
├── pages/
│   ├── _app.js              # App wrapper with AuthProvider
│   ├── index.js             # Landing page
│   ├── request.js           # Car owner - request a wash
│   └── become-washer.js     # Sign up page (owner/washer)
├── src/
│   ├── AuthContext.js       # Firebase auth context
│   └── MapPicker.js         # Location picker component
├── lib/
│   └── firebase.js          # Firebase initialization
├── styles/
│   └── globals.css          # Global styles
└── package.json
```

## 🔥 Firebase Setup Details

### Firestore Collections

The app uses these main collections:

**users** - Stores user profiles
```javascript
{
  role: 'owner' | 'washer',
  name: string,
  email: string,
  phone: string,
  washerProfile: {
    verified: boolean,
    rating: number,
    completedJobs: number,
    idDocUrl: string,
    selfieUrl: string
  }
}
```

**jobs** - Stores wash requests
```javascript
{
  ownerId: string,
  washerId: string | null,
  status: 'REQUESTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED',
  serviceType: 'exterior' | 'interior' | 'both',
  price: number,
  pickupLocation: { lat: number, lng: number },
  createdAt: timestamp
}
```

### Security Rules (Production)

Before deploying, update Firestore security rules:

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

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Testing Locally

1. Create a washer account at `/become-washer`
2. Create an owner account (use different email)
3. As owner, request a wash at `/request`
4. Check Firestore console to see the job created

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy!

### Deploy to Firebase Hosting

```bash
npm run build
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Use Firebase Security Rules in production
- Implement proper user verification for washers
- Use HTTPS everywhere (Vercel/Firebase provides this)

## 🎨 Customization

- Update colors and styles in component inline styles
- Add your logo in `pages/index.js`
- Customize service types and pricing in `pages/request.js`

## 🚧 Next Steps / TODO

- [ ] Integrate Google Maps API for better location picking
- [ ] Add real-time washer tracking
- [ ] Implement Stripe payment integration
- [ ] Add push notifications
- [ ] Create admin panel for washer verification
- [ ] Build washer dashboard
- [ ] Add photo upload for ID verification
- [ ] Implement job matching algorithm
- [ ] Add in-app messaging
- [ ] Create mobile app with React Native

## 📄 License

This is an MVP starter project. Feel free to use and modify as needed.

## 🤝 Contributing

This is a starter template. Fork it and build something awesome!

## 📞 Support

For issues or questions, check the Firebase documentation or Next.js docs.

---

Built with ❤️ using Next.js and Firebase

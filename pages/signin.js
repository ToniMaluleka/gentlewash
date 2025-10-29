import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { auth, googleProvider, db } from '../lib/firebase'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../src/AuthContext'

export default function SignIn() {
  const router = useRouter()
  const { user } = useAuth()
  const { role } = router.query
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // If already signed in, redirect to home
  if (user) {
    router.push('/')
    return null
  }

  async function handleSignIn(e) {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      alert('Signed in successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error signing in:', error)
      
      // User-friendly error messages
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up first.')
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.')
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address.')
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.')
      } else {
        setError('Failed to sign in: ' + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setError('')
    setLoading(true)
    
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        const userData = {
          name: user.displayName || '',
          email: user.email,
          phone: user.phoneNumber || '',
          role: role === 'washer' ? 'washer' : 'owner',
          createdAt: serverTimestamp(),
          profilePhotoUrl: user.photoURL || null
        }

        if (role === 'washer') {
          userData.washerProfile = {
            verified: false,
            rating: 0,
            completedJobs: 0,
            equipment: [],
            idDocUrl: null,
            selfieUrl: null,
          }
        }

        await setDoc(doc(db, 'users', user.uid), userData)
      }
      
      alert('Signed in with Google successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error signing in with Google:', error)
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.')
      } else if (error.code === 'auth/popup-blocked') {
        setError('Pop-up blocked. Please allow pop-ups for this site.')
      } else {
        setError('Failed to sign in with Google: ' + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: '0 auto' }}>
      <h2>Sign In to GentleWash</h2>
      {role === 'washer' && (
        <p style={{ color: '#666', marginBottom: 20 }}>Signing in as a Washer</p>
      )}
      
      {/* Google Sign-In Button */}
      <button 
        onClick={handleGoogleSignIn}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px 24px',
          fontSize: 16,
          backgroundColor: 'white',
          color: '#444',
          border: '1px solid #ddd',
          borderRadius: 8,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
        Sign in with Google
      </button>

      <div style={{ textAlign: 'center', margin: '20px 0', color: '#999' }}>
        OR
      </div>
      
      <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {error && (
          <div style={{ 
            padding: 15, 
            backgroundColor: '#f8d7da', 
            color: '#721c24',
            borderRadius: 4,
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}
        
        <input 
          placeholder="Email" 
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ 
            padding: 10, 
            fontSize: 16, 
            borderRadius: 4, 
            border: '1px solid #ddd' 
          }}
        />
        
        <input 
          placeholder="Password" 
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ 
            padding: 10, 
            fontSize: 16, 
            borderRadius: 4, 
            border: '1px solid #ddd' 
          }}
        />
        
        <button 
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: 18,
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Signing In...' : 'Sign In with Email'}
        </button>
        
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <p style={{ color: '#666' }}>
            Don't have an account?{' '}
            <Link href={`/become-washer${role ? '?role=' + role : ''}`} style={{ color: '#007bff', textDecoration: 'underline' }}>
              Sign Up
            </Link>
          </p>
        </div>
        
        <button 
          type="button"
          onClick={() => router.push('/')}
          style={{
            padding: '12px 24px',
            fontSize: 16,
            backgroundColor: 'transparent',
            color: '#007bff',
            border: '1px solid #007bff',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Back to Home
        </button>
      </form>
    </div>
  )
}

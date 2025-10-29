import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { auth, db, googleProvider } from '../lib/firebase'
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export default function BecomeWasher() {
  const router = useRouter()
  const { role } = router.query
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isWasher, setIsWasher] = useState(role === 'washer')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Update role when query param changes
  useEffect(() => {
    if (role === 'washer') {
      setIsWasher(true)
    } else if (role === 'owner') {
      setIsWasher(false)
    }
  }, [role])

  async function signup() {
    setError('')
    
    if (!name || !email || !password || !phone) {
      setError('Please fill in all required fields (name, email, phone, and password)')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      
      const userData = {
        name,
        email,
        phone: phone,
        role: isWasher ? 'washer' : 'owner',
        createdAt: serverTimestamp(),
      }

      if (isWasher) {
        userData.washerProfile = {
          verified: false,
          rating: 0,
          completedJobs: 0,
          equipment: [],
          idDocUrl: null,
          selfieUrl: null,
        }
      }

      await setDoc(doc(db, 'users', userCred.user.uid), userData)
      
      if (isWasher) {
        alert('Registration successful! Please upload your ID and selfie in your profile. Admin will verify your account.')
      } else {
        alert('Registration successful! You can now request car washes.')
      }
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Error signing up:', error)
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.')
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address.')
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.')
      } else {
        setError('Failed to sign up: ' + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignUp() {
    setError('')
    setLoading(true)
    
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      const userData = {
        name: user.displayName || '',
        email: user.email,
        phone: user.phoneNumber || '',
        role: isWasher ? 'washer' : 'owner',
        createdAt: serverTimestamp(),
        profilePhotoUrl: user.photoURL || null
      }

      if (isWasher) {
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
      
      if (isWasher) {
        alert('Registration successful! Please upload your ID and selfie in your profile.')
      } else {
        alert('Registration successful! You can now request car washes.')
      }
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Error signing up with Google:', error)
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-up cancelled. Please try again.')
      } else if (error.code === 'auth/popup-blocked') {
        setError('Pop-up blocked. Please allow pop-ups for this site.')
      } else {
        setError('Failed to sign up with Google: ' + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: '0 auto' }}>
      <h2>{isWasher ? 'Become a Washer' : 'Register as Car Owner'}</h2>
      <p style={{ color: '#666', marginBottom: 20 }}>
        {isWasher 
          ? 'Join our team of professional mobile car washers and earn money on your schedule.' 
          : 'Create your account to start requesting car wash services.'}
      </p>

      {/* Google Sign-Up Button */}
      <button 
        onClick={handleGoogleSignUp}
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
        Sign up with Google
      </button>

      <div style={{ textAlign: 'center', margin: '20px 0', color: '#999' }}>
        OR
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
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
          placeholder="Full name *" 
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ padding: 10, fontSize: 16, borderRadius: 4, border: '1px solid #ddd' }}
        />
        
        <input 
          placeholder="Phone number *" 
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          style={{ padding: 10, fontSize: 16, borderRadius: 4, border: '1px solid #ddd' }}
        />
        
        <input 
          placeholder="Email *" 
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: 10, fontSize: 16, borderRadius: 4, border: '1px solid #ddd' }}
        />
        
        <input 
          placeholder="Password (min 6 characters) *" 
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 4, border: '1px solid #ddd' }}
        />
        
        {isWasher && (
          <div style={{ padding: 15, backgroundColor: '#f0f8ff', borderRadius: 4, fontSize: 14 }}>
            <strong>📋 Verification Requirements:</strong><br/>
            After registration, you'll need to upload:<br/>
            ✓ Valid ID document<br/>
            ✓ Selfie photo<br/>
            ✓ Police clearance certificate (no criminal records)<br/>
            ✓ Matric certificate (or proof of 10+ years experience)<br/>
            <br/>
            Admin will verify your account before you can accept jobs.
          </div>
        )}
        
        <button 
          onClick={signup}
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: 18,
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating Account...' : 'Sign Up with Email'}
        </button>
        
        <button 
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
      </div>
    </div>
  )
}

import Link from 'next/link'
import { useAuth } from '../src/AuthContext'
import { auth } from '../lib/firebase'
import { signOut } from 'firebase/auth'

export default function Home() {
  const { user } = useAuth()
  
  const handleSignOut = async () => {
    try {
      await signOut(auth)
      alert('Signed out successfully!')
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Failed to sign out')
    }
  }
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ 
        padding: '20px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>🚗 GentleWash</h1>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <p style={{ margin: 0, color: '#666' }}>Welcome, {user.email}</p>
            <Link href="/dashboard">
              <button style={{
                padding: '8px 16px',
                fontSize: 14,
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer'
              }}>
                Dashboard
              </button>
            </Link>
            <button 
              onClick={handleSignOut}
              style={{
                padding: '8px 16px',
                fontSize: 14,
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>
        ) : null}
      </header>

      {/* Split Screen Content */}
      <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap' }}>
        
        {/* LEFT SIDE - CAR OWNERS */}
        <div style={{ 
          flex: 1, 
          minWidth: '300px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          position: 'relative'
        }}>
          <div style={{ maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🚙</div>
            <h2 style={{ fontSize: 36, marginBottom: 15 }}>Car Owners</h2>
            <p style={{ fontSize: 18, marginBottom: 40, opacity: 0.95 }}>
              Get your car washed at your convenience. Professional service, anywhere you are.
            </p>
            
            {/* Connected Buttons */}
            <div style={{ position: 'relative' }}>
              {/* Connection Line */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 2,
                height: 80,
                backgroundColor: 'rgba(255,255,255,0.3)',
                zIndex: 0
              }}></div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', zIndex: 1 }}>
                <Link href="/request">
                  <button style={{
                    padding: '18px 40px',
                    fontSize: 20,
                    fontWeight: 'bold',
                    backgroundColor: 'white',
                    color: '#667eea',
                    border: 'none',
                    borderRadius: 12,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'transform 0.2s',
                    width: '100%'
                  }}>
                    Request a Wash
                  </button>
                </Link>
                
                <Link href="/become-washer?role=owner">
                  <button style={{
                    padding: '18px 40px',
                    fontSize: 20,
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '2px solid white',
                    borderRadius: 12,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    width: '100%'
                  }}>
                    Register Car Owner
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - WASHERS */}
        <div style={{ 
          flex: 1, 
          minWidth: '300px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          position: 'relative'
        }}>
          <div style={{ maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>💧</div>
            <h2 style={{ fontSize: 36, marginBottom: 15 }}>Washers</h2>
            <p style={{ fontSize: 18, marginBottom: 40, opacity: 0.95 }}>
              Earn money on your schedule. Join our team of professional mobile car washers.
            </p>
            
            {/* Connected Buttons */}
            <div style={{ position: 'relative' }}>
              {/* Connection Line */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 2,
                height: 80,
                backgroundColor: 'rgba(255,255,255,0.3)',
                zIndex: 0
              }}></div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', zIndex: 1 }}>
                <Link href="/become-washer?role=washer">
                  <button style={{
                    padding: '18px 40px',
                    fontSize: 20,
                    fontWeight: 'bold',
                    backgroundColor: 'white',
                    color: '#f5576c',
                    border: 'none',
                    borderRadius: 12,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'transform 0.2s',
                    width: '100%'
                  }}>
                    Become a Washer
                  </button>
                </Link>
                
                <Link href="/signin?role=washer">
                  <button style={{
                    padding: '18px 40px',
                    fontSize: 20,
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '2px solid white',
                    borderRadius: 12,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    width: '100%'
                  }}>
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Footer */}
      <div style={{ 
        padding: '60px 40px', 
        backgroundColor: '#f8f9fa',
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: 30 
      }}>
        <div style={{ 
          padding: 30, 
          backgroundColor: 'white',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 48, marginBottom: 15 }}>📍</div>
          <h3 style={{ marginBottom: 10, color: '#333' }}>Convenient</h3>
          <p style={{ color: '#666', lineHeight: 1.6 }}>
            We come to you - at home, work, or anywhere
          </p>
        </div>
        
        <div style={{ 
          padding: 30, 
          backgroundColor: 'white',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 48, marginBottom: 15 }}>⭐</div>
          <h3 style={{ marginBottom: 10, color: '#333' }}>Verified Washers</h3>
          <p style={{ color: '#666', lineHeight: 1.6, fontSize: 14 }}>
            All washers are fully verified with:<br/>
            ✓ ID verification<br/>
            ✓ Police clearance (no criminal records)<br/>
            ✓ Matric certificate (or 10+ years experience)<br/>
            ✓ Customer ratings
          </p>
        </div>
        
        <div style={{ 
          padding: 30, 
          backgroundColor: 'white',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 48, marginBottom: 15 }}>💳</div>
          <h3 style={{ marginBottom: 10, color: '#333' }}>Secure Payment</h3>
          <p style={{ color: '#666', lineHeight: 1.6 }}>
            Easy, cashless payments through the app
          </p>
        </div>
      </div>
    </div>
  )
}

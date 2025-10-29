import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../src/AuthContext'
import { db } from '../lib/firebase'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [userData, setUserData] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
    averageRating: 0
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin')
      return
    }

    if (user) {
      loadUserData()
    }
  }, [user, authLoading])

  async function loadUserData() {
    try {
      setLoading(true)
      
      // Get user profile
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        setUserData(data)
        
        // Load jobs based on role
        if (data.role === 'washer') {
          await loadWasherJobs()
        } else {
          await loadOwnerJobs()
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadWasherJobs() {
    try {
      const q = query(
        collection(db, 'jobs'),
        where('washerId', '==', user.uid)
      )
      const querySnapshot = await getDocs(q)
      const jobsList = []
      let totalEarnings = 0
      let completedCount = 0
      
      querySnapshot.forEach((doc) => {
        const jobData = { id: doc.id, ...doc.data() }
        jobsList.push(jobData)
        
        if (jobData.status === 'COMPLETED') {
          completedCount++
          totalEarnings += jobData.price || 0
        }
      })
      
      setJobs(jobsList)
      setStats({
        totalJobs: jobsList.length,
        completedJobs: completedCount,
        totalEarnings: totalEarnings,
        averageRating: userData?.washerProfile?.rating || 0
      })
    } catch (error) {
      console.error('Error loading washer jobs:', error)
    }
  }

  async function loadOwnerJobs() {
    try {
      const q = query(
        collection(db, 'jobs'),
        where('ownerId', '==', user.uid)
      )
      const querySnapshot = await getDocs(q)
      const jobsList = []
      let completedCount = 0
      
      querySnapshot.forEach((doc) => {
        const jobData = { id: doc.id, ...doc.data() }
        jobsList.push(jobData)
        
        if (jobData.status === 'COMPLETED') {
          completedCount++
        }
      })
      
      setJobs(jobsList.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0)
        const dateB = b.createdAt?.toDate?.() || new Date(0)
        return dateB - dateA
      }))
      
      setStats({
        totalJobs: jobsList.length,
        completedJobs: completedCount,
        totalEarnings: 0,
        averageRating: 0
      })
    } catch (error) {
      console.error('Error loading owner jobs:', error)
    }
  }

  if (authLoading || loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    )
  }

  if (!userData) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>User data not found</h2>
        <Link href="/">
          <button style={{ padding: '10px 20px', fontSize: 16, marginTop: 20 }}>
            Go Home
          </button>
        </Link>
      </div>
    )
  }

  const isWasher = userData.role === 'washer'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        padding: '20px 40px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: 30
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>🚗 GentleWash</h1>
          <Link href="/">
            <button style={{
              padding: '8px 16px',
              fontSize: 14,
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}>
              Home
            </button>
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: 30 }}>
          <h2>Welcome back, {userData.name}!</h2>
          <p style={{ color: '#666' }}>
            {isWasher ? 'Washer Dashboard' : 'Car Owner Dashboard'}
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 20,
          marginBottom: 30
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 25,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Total Jobs</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#007bff' }}>
              {stats.totalJobs}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: 25,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Completed Jobs</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#28a745' }}>
              {stats.completedJobs}
            </div>
          </div>

          {isWasher && (
            <>
              <div style={{
                backgroundColor: 'white',
                padding: 25,
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Total Earnings</div>
                <div style={{ fontSize: 36, fontWeight: 'bold', color: '#f5576c' }}>
                  R{stats.totalEarnings.toFixed(2)}
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: 25,
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Average Rating</div>
                <div style={{ fontSize: 36, fontWeight: 'bold', color: '#ffc107' }}>
                  ⭐ {stats.averageRating.toFixed(1)}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        {!isWasher && (
          <div style={{ marginBottom: 30 }}>
            <Link href="/request">
              <button style={{
                padding: '15px 30px',
                fontSize: 18,
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                + Request New Wash
              </button>
            </Link>
          </div>
        )}

        {/* Jobs List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: 25
        }}>
          <h3 style={{ marginTop: 0, marginBottom: 20 }}>
            {isWasher ? 'Your Jobs' : 'Your Wash Requests'}
          </h3>

          {jobs.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: 40 }}>
              {isWasher 
                ? 'No jobs assigned yet. Wait for car owners to request washes.'
                : 'No wash requests yet. Click "Request New Wash" to get started!'}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              {jobs.map((job) => (
                <div
                  key={job.id}
                  style={{
                    padding: 20,
                    border: '1px solid #e0e0e0',
                    borderRadius: 8,
                    backgroundColor: '#fafafa'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
                        {job.serviceType === 'exterior' && 'Exterior Only'}
                        {job.serviceType === 'interior' && 'Interior Only'}
                        {job.serviceType === 'both' && 'Full Service'}
                        {job.serviceType === 'detailing' && 'Full House Detailing'}
                      </div>
                      <div style={{ fontSize: 14, color: '#666' }}>
                        {job.vehicleType && `Vehicle: ${job.vehicleType.replace('-', ' ').toUpperCase()}`}
                      </div>
                    </div>
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 'bold',
                      backgroundColor: 
                        job.status === 'COMPLETED' ? '#d4edda' :
                        job.status === 'IN_PROGRESS' ? '#fff3cd' :
                        job.status === 'ASSIGNED' ? '#cce5ff' : '#f8d7da',
                      color:
                        job.status === 'COMPLETED' ? '#155724' :
                        job.status === 'IN_PROGRESS' ? '#856404' :
                        job.status === 'ASSIGNED' ? '#004085' : '#721c24'
                    }}>
                      {job.status}
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, fontSize: 14 }}>
                    <div>
                      <strong>Price:</strong> R{job.price || 0}
                    </div>
                    {job.scheduledAt && (
                      <div>
                        <strong>Scheduled:</strong> {new Date(job.scheduledAt.toDate?.() || job.scheduledAt).toLocaleDateString('en-ZA')}
                      </div>
                    )}
                    {job.createdAt && (
                      <div>
                        <strong>Created:</strong> {new Date(job.createdAt.toDate?.() || job.createdAt).toLocaleDateString('en-ZA')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

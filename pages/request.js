import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db, auth } from '../lib/firebase'
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import dynamic from 'next/dynamic'
import { useAuth } from '../src/AuthContext'

const MapPicker = dynamic(() => import('../src/MapPicker'), { ssr: false })

export default function Request() {
  const router = useRouter()
  const { user } = useAuth()
  const [service, setService] = useState('exterior')
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [washers, setWashers] = useState([])
  const [selectedWasher, setSelectedWasher] = useState('')
  const [loadingWashers, setLoadingWashers] = useState(false)
  const [vehicleType, setVehicleType] = useState('small-car')

  const serviceOptions = {
    exterior: { name: 'Exterior Only', price: 'R250' },
    interior: { name: 'Interior Only', price: 'R300' },
    both: { name: 'Full Service (Both)', price: 'R500' },
    detailing: { name: 'Full House Car Detailing', price: 'R1200' }
  }

  // Load available washers
  useEffect(() => {
    async function loadWashers() {
      setLoadingWashers(true)
      try {
        const q = query(
          collection(db, 'users'),
          where('role', '==', 'washer'),
          where('washerProfile.verified', '==', true)
        )
        const querySnapshot = await getDocs(q)
        const washersList = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          washersList.push({
            id: doc.id,
            name: data.name,
            rating: data.washerProfile?.rating || 0,
            completedJobs: data.washerProfile?.completedJobs || 0
          })
        })
        setWashers(washersList)
      } catch (error) {
        console.error('Error loading washers:', error)
      } finally {
        setLoadingWashers(false)
      }
    }
    loadWashers()
  }, [])

  async function createJob() {
    if (!location) {
      alert('Please pick a location on the map')
      return
    }
    
    if (!user) {
      alert('Please sign in to request a wash')
      router.push('/become-washer')
      return
    }

    if (!scheduledDate || !scheduledTime) {
      alert('Please select a date and time for your wash')
      return
    }

    setLoading(true)
    try {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`)
      
      const jobData = {
        ownerId: user.uid,
        serviceType: service,
        vehicleType: vehicleType,
        pickupLocation: location,
        status: selectedWasher ? 'ASSIGNED' : 'REQUESTED',
        createdAt: serverTimestamp(),
        scheduledAt: scheduledDateTime,
        price: getPriceValue(service),
        washerId: selectedWasher || null,
      }

      const docRef = await addDoc(collection(db, 'jobs'), jobData)
      alert('Job created successfully! Job ID: ' + docRef.id)
      router.push('/')
    } catch (error) {
      console.error('Error creating job:', error)
      alert('Failed to create job: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  function getPriceValue(serviceType) {
    const prices = {
      exterior: 250,
      interior: 300,
      both: 500,
      detailing: 1200
    }
    return prices[serviceType] || 0
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2>Request a Wash</h2>
      
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
          Select Your Vehicle Type *
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
          {[
            { value: 'small-car', emoji: '🚗', label: 'Small Car' },
            { value: 'suv', emoji: '🚙', label: 'SUV / 4x4' },
            { value: 'minibus', emoji: '🚐', label: 'Minibus' },
            { value: 'sedan', emoji: '🚕', label: 'Sedan' },
            { value: 'pickup', emoji: '🛻', label: 'Pickup' },
            { value: 'sports', emoji: '🏎️', label: 'Luxury' },
            { value: 'commercial', emoji: '🚚', label: 'Commercial' }
          ].map(vehicle => (
            <button
              key={vehicle.value}
              type="button"
              onClick={() => setVehicleType(vehicle.value)}
              style={{
                padding: '10px 8px',
                fontSize: 13,
                backgroundColor: vehicleType === vehicle.value ? '#007bff' : 'white',
                color: vehicleType === vehicle.value ? 'white' : '#333',
                border: vehicleType === vehicle.value ? '2px solid #007bff' : '2px solid #ddd',
                borderRadius: 8,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 2 }}>{vehicle.emoji}</div>
              <div style={{ fontSize: 11 }}>{vehicle.label}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
          Select Service
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15 }}>
          {Object.entries(serviceOptions).map(([key, { name, price }]) => (
            <button
              key={key}
              onClick={() => setService(key)}
              style={{
                padding: 15,
                fontSize: 16,
                backgroundColor: service === key ? '#007bff' : 'white',
                color: service === key ? 'white' : '#333',
                border: service === key ? '2px solid #007bff' : '2px solid #ddd',
                borderRadius: 8,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{name}</div>
              <div style={{ fontSize: 20, marginTop: 5, color: service === key ? 'white' : '#007bff' }}>
                {price}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
          Schedule Date & Time
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <input
            type="date"
            value={scheduledDate}
            onChange={e => setScheduledDate(e.target.value)}
            min={today}
            style={{
              padding: 10,
              fontSize: 16,
              borderRadius: 4,
              border: '1px solid #ddd'
            }}
          />
          <input
            type="time"
            value={scheduledTime}
            onChange={e => setScheduledTime(e.target.value)}
            style={{
              padding: 10,
              fontSize: 16,
              borderRadius: 4,
              border: '1px solid #ddd'
            }}
          />
        </div>
        {scheduledDate && scheduledTime && (
          <p style={{ marginTop: 8, color: '#666', fontSize: 14 }}>
            Scheduled for: {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString('en-ZA')}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
          Select a Washer (Optional)
        </label>
        {loadingWashers ? (
          <p style={{ color: '#666' }}>Loading available washers...</p>
        ) : washers.length > 0 ? (
          <select
            value={selectedWasher}
            onChange={e => setSelectedWasher(e.target.value)}
            style={{
              padding: 10,
              fontSize: 16,
              width: '100%',
              borderRadius: 4,
              border: '1px solid #ddd'
            }}
          >
            <option value="">Any Available Washer</option>
            {washers.map(washer => (
              <option key={washer.id} value={washer.id}>
                {washer.name} - ⭐ {washer.rating.toFixed(1)} ({washer.completedJobs} jobs)
              </option>
            ))}
          </select>
        ) : (
          <p style={{ color: '#666', fontSize: 14 }}>
            No verified washers available yet. Your request will be sent to washers when they register.
          </p>
        )}
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
          Pick Location
        </label>
        <div style={{ height: 400, border: '1px solid #ddd', borderRadius: 4 }}>
          <MapPicker onPick={setLocation} />
        </div>
        {location && (
          <p style={{ marginTop: 8, color: '#666' }}>
            Selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </p>
        )}
      </div>

      <div style={{
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginBottom: 20
      }}>
        <h3 style={{ marginTop: 0 }}>Order Summary</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span>Vehicle:</span>
          <strong>
            {[
              { value: 'small-car', emoji: '🚗', label: 'Small Car' },
              { value: 'suv', emoji: '🚙', label: 'SUV / 4x4' },
              { value: 'minibus', emoji: '🚐', label: 'Minibus' },
              { value: 'sedan', emoji: '🚕', label: 'Sedan' },
              { value: 'pickup', emoji: '🛻', label: 'Pickup' },
              { value: 'sports', emoji: '🏎️', label: 'Luxury' },
              { value: 'commercial', emoji: '🚚', label: 'Commercial' }
            ].find(v => v.value === vehicleType)?.emoji} {[
              { value: 'small-car', label: 'Small Car' },
              { value: 'suv', label: 'SUV / 4x4' },
              { value: 'minibus', label: 'Minibus' },
              { value: 'sedan', label: 'Sedan' },
              { value: 'pickup', label: 'Pickup' },
              { value: 'sports', label: 'Luxury' },
              { value: 'commercial', label: 'Commercial' }
            ].find(v => v.value === vehicleType)?.label}
          </strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span>Service:</span>
          <strong>{serviceOptions[service].name}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span>Price:</span>
          <strong style={{ fontSize: 20, color: '#007bff' }}>{serviceOptions[service].price}</strong>
        </div>
        {selectedWasher && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span>Washer:</span>
            <strong>{washers.find(w => w.id === selectedWasher)?.name}</strong>
          </div>
        )}
        {scheduledDate && scheduledTime && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Scheduled:</span>
            <strong>{new Date(`${scheduledDate}T${scheduledTime}`).toLocaleDateString('en-ZA')}</strong>
          </div>
        )}
      </div>
      
      <button 
        onClick={createJob}
        disabled={loading || !location || !scheduledDate || !scheduledTime}
        style={{
          padding: '12px 24px',
          fontSize: 18,
          backgroundColor: loading || !location || !scheduledDate || !scheduledTime ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: loading || !location || !scheduledDate || !scheduledTime ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {loading ? 'Creating...' : 'Confirm & Request Wash'}
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
          cursor: 'pointer',
          width: '100%',
          marginTop: 10
        }}
      >
        Cancel
      </button>
    </div>
  )
}

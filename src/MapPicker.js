import { useEffect, useState } from 'react'

export default function MapPicker({ onPick }) {
  const [position, setPosition] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords
          const location = { lat, lng }
          setPosition(location)
          onPick(location)
        },
        (err) => {
          console.error('Geolocation error:', err)
          setError('Unable to get your location. Please enable location services.')
          // Default to a sample location if geolocation fails
          const defaultLocation = { lat: 40.7128, lng: -74.0060 } // New York
          setPosition(defaultLocation)
          onPick(defaultLocation)
        }
      )
    } else {
      setError('Geolocation is not supported by your browser')
      const defaultLocation = { lat: 40.7128, lng: -74.0060 }
      setPosition(defaultLocation)
      onPick(defaultLocation)
    }
  }, [])

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'white',
      borderRadius: 4,
      position: 'relative'
    }}>
      <div style={{ textAlign: 'center', padding: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>📍</div>
        <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          {position ? 'Location Selected' : 'Getting your location...'}
        </div>
        {position && (
          <div style={{ fontSize: 14, opacity: 0.9 }}>
            Lat: {position.lat.toFixed(4)}<br />
            Lng: {position.lng.toFixed(4)}
          </div>
        )}
        {error && (
          <div style={{ fontSize: 12, marginTop: 10, color: '#ffeb3b' }}>
            {error}
          </div>
        )}
        <div style={{ fontSize: 12, marginTop: 15, opacity: 0.8 }}>
          💡 Tip: Google Maps integration coming soon!<br />
          Currently using your device location
        </div>
      </div>
    </div>
  )
}

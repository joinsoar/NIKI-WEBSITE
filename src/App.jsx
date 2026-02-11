import { useState, useCallback } from 'react'
import Header from './components/Header'
import Gallery from './components/Gallery'
import WaitlistForm from './components/WaitlistForm'
import LoadingOverlay from './components/LoadingOverlay'

export default function App() {
  const [galleryRunning, setGalleryRunning] = useState(false)

  const handleLoadingComplete = useCallback(() => {
    setGalleryRunning(true)
  }, [])

  return (
    <>
      <Header />
      <Gallery running={galleryRunning} />
      <WaitlistForm />
      <LoadingOverlay onComplete={handleLoadingComplete} />
    </>
  )
}

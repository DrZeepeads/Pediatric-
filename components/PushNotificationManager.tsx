'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function PushNotificationManager() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState(null)
  const [registration, setRegistration] = useState(null)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) {
            setIsSubscribed(true)
            setSubscription(sub)
          }
        })
      })
    }
  }, [])

  const subscribeUser = async () => {
    try {
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      })
      setIsSubscribed(true)
      setSubscription(sub)
      // Send subscription to server
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sub)
      })
    } catch (error) {
      console.error('Failed to subscribe the user: ', error)
    }
  }

  const unsubscribeUser = async () => {
    try {
      await subscription.unsubscribe()
      setIsSubscribed(false)
      setSubscription(null)
      // Inform server about unsubscription
      await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      })
    } catch (error) {
      console.error('Error unsubscribing', error)
    }
  }

  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null
  }

  return (
    <div>
      {isSubscribed ? (
        <Button onClick={unsubscribeUser}>Unsubscribe from Notifications</Button>
      ) : (
        <Button onClick={subscribeUser}>Subscribe to Notifications</Button>
      )}
    </div>
  )
}


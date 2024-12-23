'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-blue-600">
          NelsonBot AI
        </Link>
        <div className="flex items-center">
          {user ? (
            <>
              <Link href="/dashboard" passHref>
                <Button variant={pathname === '/dashboard' ? 'default' : 'ghost'} className="mr-4">
                  Dashboard
                </Button>
              </Link>
              <Button onClick={signOut} variant="outline">Sign Out</Button>
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button variant={pathname === '/login' ? 'default' : 'ghost'} className="mr-4">
                  Login
                </Button>
              </Link>
              <Link href="/signup" passHref>
                <Button variant={pathname === '/signup' ? 'default' : 'ghost'}>
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}


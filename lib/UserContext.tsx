'use client'

import { createContext, useContext } from 'react'
import type { JWTPayload } from './jwt'

const UserContext = createContext<JWTPayload | null>(null)

export function UserProvider({
  user,
  children,
}: {
  user: JWTPayload | null
  children: React.ReactNode
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext)
}

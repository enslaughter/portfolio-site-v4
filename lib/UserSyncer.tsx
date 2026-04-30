'use client'

import { useEffect } from 'react'
import { useUser } from './UserContext'
import { useAppDispatch } from './store/hooks'
import { initGuestUser, setAuthUser } from './store/userSlice'

export function UserSyncer() {
  const user = useUser()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (user) {
      dispatch(setAuthUser({ name: user.name, avatarUrl: user.avatar_url }))
    } else {
      dispatch(initGuestUser())
    }
  }, [user, dispatch])

  return null
}

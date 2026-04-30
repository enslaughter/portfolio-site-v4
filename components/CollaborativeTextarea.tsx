'use client'

import { useRef, useEffect, useState } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import styled from 'styled-components'
import CenteredTextarea from './CenteredTextarea'
import { useAppSelector } from '@/lib/store/hooks'

async function fetchWsToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/auth/ws-token')
    if (!res.ok) return null
    const { token } = await res.json()
    return token ?? null
  } catch {
    return null
  }
}

type AwarenessUser = {
  name: string
  avatarUrl: string | null
  color: string
}

type AwarenessState = {
  user: AwarenessUser
  cursor: number | null
}

const PresenceBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 400px;
  min-height: 28px;
  margin: 0 auto;
  padding: 0 4px 4px;
`

const Avatar = styled.div<{ $color: string }>`
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  cursor: default;
  flex-shrink: 0;

  &:hover > span {
    display: block;
  }
`

const Tooltip = styled.span`
  display: none;
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
`

export default function CollaborativeTextarea() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const providerRef = useRef<WebsocketProvider | null>(null)
  const [peers, setPeers] = useState<Map<number, AwarenessState>>(new Map())

  const reduxUser = useAppSelector(state => state.user)
  // Keep a ref so the async Yjs setup always reads the latest user state
  const reduxUserRef = useRef(reduxUser)
  reduxUserRef.current = reduxUser

  // One-time Yjs connection setup
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    let torn = false
    let cleanupFn: (() => void) | null = null

    fetchWsToken().then((wsToken) => {
      if (torn) return

      const doc = new Y.Doc()
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'
      console.log(`Fetching WS URL: ${wsUrl}`)
      const provider = new WebsocketProvider(wsUrl, 'ens-portfolio-textarea', doc, {
        params: wsToken ? { token: wsToken } : {},
      })
      const yText = doc.getText('content')

      // Set initial awareness from whatever user state is current at connect time
      const { name, avatarUrl, color } = reduxUserRef.current
      if (name) {
        provider.awareness.setLocalState({ user: { name, avatarUrl, color }, cursor: null } satisfies AwarenessState)
      }

      providerRef.current = provider

      const syncPeers = () => {
        const next = new Map<number, AwarenessState>()
        provider.awareness.getStates().forEach((state, clientId) => {
          if (clientId !== doc.clientID && state?.user) {
            next.set(clientId, state as AwarenessState)
          }
        })
        setPeers(new Map(next))
      }

      provider.awareness.on('change', syncPeers)

      provider.on('status', (event: { status: string }) => {
        console.log('WebSocket status:', event.status)
      })

      const observer = (event: Y.YTextEvent) => {
        if (event.transaction.local) return
        textarea.value = yText.toString()
      }
      yText.observe(observer)

      const handleInput = () => {
        doc.transact(() => {
          yText.delete(0, yText.length)
          yText.insert(0, textarea.value)
        })
      }

      const handleSelectionChange = () => {
        provider.awareness.setLocalStateField('cursor', textarea.selectionStart)
      }

      textarea.addEventListener('input', handleInput)
      textarea.addEventListener('keyup', handleSelectionChange)
      textarea.addEventListener('mouseup', handleSelectionChange)
      textarea.addEventListener('click', handleSelectionChange)

      cleanupFn = () => {
        providerRef.current = null
        yText.unobserve(observer)
        textarea.removeEventListener('input', handleInput)
        textarea.removeEventListener('keyup', handleSelectionChange)
        textarea.removeEventListener('mouseup', handleSelectionChange)
        textarea.removeEventListener('click', handleSelectionChange)
        provider.awareness.off('change', syncPeers)
        provider.destroy()
        doc.destroy()
      }
    })

    return () => {
      torn = true
      cleanupFn?.()
    }
  }, [])

  // Keep awareness in sync whenever Redux user state changes
  useEffect(() => {
    const provider = providerRef.current
    if (!provider || !reduxUser.name) return
    provider.awareness.setLocalStateField('user', {
      name: reduxUser.name,
      avatarUrl: reduxUser.avatarUrl,
      color: reduxUser.color,
    })
  }, [reduxUser])

  const peerList = Array.from(peers.values())

  return (
    <div>
      <PresenceBar>
        {peerList.map((state, i) => {
          const initials = state.user.name
            .split(' ')
            .map(w => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
          return (
            <Avatar key={i} $color={state.user.color} title={state.user.name}>
              {state.user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={state.user.avatarUrl}
                  alt={state.user.name}
                  width={28}
                  height={28}
                  style={{ borderRadius: '50%', display: 'block' }}
                />
              ) : (
                initials
              )}
              <Tooltip>{state.user.name}</Tooltip>
            </Avatar>
          )
        })}
      </PresenceBar>
      <CenteredTextarea ref={textareaRef} placeholder="Write something..." />
    </div>
  )
}

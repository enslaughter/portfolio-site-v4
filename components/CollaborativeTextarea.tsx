'use client'

import { useRef, useEffect } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import CenteredTextarea from './CenteredTextarea'

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

export default function CollaborativeTextarea() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    let torn = false
    let cleanupFn: (() => void) | null = null

    fetchWsToken().then((wsToken) => {
      if (torn) return

      const doc = new Y.Doc()
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080'
      const provider = new WebsocketProvider(wsUrl, 'ens-portfolio-textarea', doc, {
        params: wsToken ? { token: wsToken } : {},
      })
      const yText = doc.getText('content')

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
      textarea.addEventListener('input', handleInput)

      cleanupFn = () => {
        yText.unobserve(observer)
        textarea.removeEventListener('input', handleInput)
        provider.destroy()
        doc.destroy()
      }
    })

    return () => {
      torn = true
      cleanupFn?.()
    }
  }, [])

  return <CenteredTextarea ref={textareaRef} placeholder="Write something..." />
}

'use client'

import { useRef, useEffect } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import CenteredTextarea from './CenteredTextarea'

export default function CollaborativeTextarea() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const doc = new Y.Doc()
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080'
    const provider = new WebsocketProvider(wsUrl, 'ens-portfolio-textarea', doc)
    const yText = doc.getText('content')

    provider.on('status', (event: { status: string }) => {
      console.log('WebSocket status:', event.status)
    })

    const observer = (event: Y.YTextEvent) => {
      if (event.transaction.local) return
      textarea.value = yText.toString()
    }
    yText.observe(observer)

    // Sync textarea → Yjs
    const handleInput = () => {
      doc.transact(() => {
        yText.delete(0, yText.length)
        yText.insert(0, textarea.value)
      })
    }
    textarea.addEventListener('input', handleInput)

    return () => {
      yText.unobserve(observer)
      textarea.removeEventListener('input', handleInput)
      provider.destroy()
      doc.destroy()
    }
  }, [])

  return <CenteredTextarea ref={textareaRef} placeholder="Write something..." />
}

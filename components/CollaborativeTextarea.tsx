'use client'

import { useRef, useEffect } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import CenteredTextarea from './CenteredTextarea'

export default function CollaborativeTextarea() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const doc = new Y.Doc()
    const provider = new WebsocketProvider('ws://localhost:8080', 'ens-portfolio-textarea', doc)

    provider.on('status', (event: { status: string }) => {
      console.log('WebSocket status:', event.status)
    })

    return () => {
      provider.destroy()
      doc.destroy()
    }
  }, [])

  return <CenteredTextarea ref={textareaRef} placeholder="Write something..." />
}

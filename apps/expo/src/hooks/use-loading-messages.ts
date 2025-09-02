import { useEffect, useState } from "react"

export const useLoadingMessages = (
  messages: string[],
  isLoading: boolean,
  options?: {
    minDelay?: number // in milliseconds
    maxDelay?: number // in milliseconds
    initialDelayMin?: number // in milliseconds
    initialDelayMax?: number // in milliseconds
  },
) => {
  const [currentMessage, setCurrentMessage] = useState(messages[0])

  useEffect(() => {
    if (!isLoading) {
      setCurrentMessage(messages[0])
      return
    }

    let messageIndex = 0
    let timeoutId: NodeJS.Timeout | null = null

    const showNextMessage = () => {
      messageIndex = (messageIndex + 1) % messages.length
      setCurrentMessage(messages[messageIndex])

      // Random delay between minDelay and maxDelay
      const minDelay = options?.minDelay ?? 1500
      const maxDelay = options?.maxDelay ?? 4000
      const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay

      // Clear previous timeout before setting a new one
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(showNextMessage, randomDelay)
    }

    // Initial delay
    const initialDelayMin = options?.initialDelayMin ?? 1000
    const initialDelayMax = options?.initialDelayMax ?? 3500
    const initialDelay = Math.floor(Math.random() * (initialDelayMax - initialDelayMin)) + initialDelayMin
    timeoutId = setTimeout(showNextMessage, initialDelay)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isLoading, messages, options])

  return currentMessage
}

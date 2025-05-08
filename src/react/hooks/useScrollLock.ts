"use client"

import { useCallback, useEffect, useRef } from "react"

// Dichiarazione per TypeScript
declare global {
  interface Window {
    scrollPos?: { x: number; y: number }
  }
}

/**
 * Custom hook per gestire il blocco dello scroll
 * Offre funzioni per bloccare e sbloccare lo scroll della pagina
 * Mantiene anche traccia dello stato originale dello scroll
 */
export const useScrollLock = () => {
  // Utilizziamo un ref per memorizzare la posizione di scorrimento
  // invece di assegnarla direttamente a window
  const scrollPosRef = useRef<{ x: number; y: number } | null>(null)

  // Salva la posizione originale dello scroll
  const saveScrollPosition = useCallback(() => {
    scrollPosRef.current = {
      x: window.scrollX || window.pageXOffset,
      y: window.scrollY || window.pageYOffset,
    }
  }, [])

  // Ripristina la posizione dello scroll
  const restoreScrollPosition = useCallback(() => {
    if (scrollPosRef.current) {
      window.scrollTo(scrollPosRef.current.x, scrollPosRef.current.y)
    }
  }, [])

  // Blocca lo scroll
  const lockScroll = useCallback(() => {
    if (typeof document === "undefined") return

    // Salviamo la posizione attuale dello scroll
    saveScrollPosition()

    // Salviamo lo stato originale
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.dataset.originalStyle = originalStyle

    // Blocchiamo lo scroll
    document.body.style.overflow = "hidden"

    // Compensa lo spostamento causato dalla scomparsa della scrollbar
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    // Su iOS abbiamo bisogno di un approccio diverso
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
      document.body.style.top = `-${scrollPosRef.current?.y || 0}px`
    }
  }, [saveScrollPosition])

  // Sblocca lo scroll
  const unlockScroll = useCallback(() => {
    if (typeof document === "undefined") return

    // Ripristiniamo lo stile originale
    const originalStyle = document.body.dataset.originalStyle
    if (originalStyle) {
      document.body.style.overflow = originalStyle
      delete document.body.dataset.originalStyle
    } else {
      document.body.style.overflow = ""
    }

    // Rimuoviamo il padding compensativo
    document.body.style.paddingRight = ""

    // Pulizia per iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      document.body.style.position = ""
      document.body.style.width = ""
      document.body.style.top = ""

      // Ripristiniamo la posizione dello scroll
      restoreScrollPosition()
    }
  }, [restoreScrollPosition])

  // Pulizia in caso di smontaggio del componente
  useEffect(() => {
    return () => {
      unlockScroll()
    }
  }, [unlockScroll])

  return { lockScroll, unlockScroll }
}

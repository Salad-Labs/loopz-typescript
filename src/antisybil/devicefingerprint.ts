export class DeviceFingerprint {
  /**
   * Genera un fingerprint probabilistico del dispositivo
   * @returns Hash SHA-256 del fingerprint
   */
  async getFingerprint(): Promise<string> {
    const components: string[] = []

    // Browser e sistema
    components.push(navigator.userAgent)
    components.push(navigator.language)
    components.push(navigator.platform)
    components.push(navigator.vendor || "unknown")

    // Display
    components.push(screen.width.toString())
    components.push(screen.height.toString())
    components.push(screen.colorDepth.toString())
    components.push(window.devicePixelRatio?.toString() || "1")

    // Hardware
    components.push(navigator.hardwareConcurrency?.toString() || "unknown")

    // Timezone
    components.push(new Date().getTimezoneOffset().toString())

    // Canvas fingerprint (più affidabile)
    const canvasFingerprint = await this.getCanvasFingerprint()
    components.push(canvasFingerprint)

    // WebGL fingerprint
    const webglFingerprint = this.getWebGLFingerprint()
    components.push(webglFingerprint)

    // Audio context fingerprint
    const audioFingerprint = await this.getAudioFingerprint()
    components.push(audioFingerprint)

    // Genera hash
    const fingerprintString = components.join("|")
    return this.hashString(fingerprintString)
  }

  private async getCanvasFingerprint(): Promise<string> {
    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return "no-canvas"

      // Testo con font particolare
      ctx.textBaseline = "top"
      ctx.font = '14px "Arial Unicode MS"'
      ctx.fillStyle = "#f60"
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle = "#069"
      ctx.fillText("🚀 Loopz SDK 🎯", 2, 15)
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)"
      ctx.fillText("Anti-Sybil System", 4, 17)

      // Genera data URL
      const dataURL = canvas.toDataURL()
      return this.hashString(dataURL)
    } catch {
      return "canvas-error"
    }
  }

  private async hashString(input: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  private getWebGLFingerprint(): string {
    try {
      const canvas = document.createElement("canvas")
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      if (!gl || !(gl instanceof WebGLRenderingContext)) return "no-webgl"

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
      if (!debugInfo) return "no-debug-info"

      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)

      return `${vendor}|${renderer}`
    } catch {
      return "webgl-error"
    }
  }

  private async getAudioFingerprint(): Promise<string> {
    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return "no-audio"

      const context = new AudioContext()
      const oscillator = context.createOscillator()
      const analyser = context.createAnalyser()
      const gain = context.createGain()
      const scriptProcessor = context.createScriptProcessor(4096, 1, 1)

      oscillator.type = "triangle"
      oscillator.frequency.value = 10000
      gain.gain.value = 0

      oscillator.connect(analyser)
      analyser.connect(scriptProcessor)
      scriptProcessor.connect(gain)
      gain.connect(context.destination)

      oscillator.start(0)

      return new Promise((resolve) => {
        let fingerprint = ""
        scriptProcessor.onaudioprocess = (event) => {
          const output = event.inputBuffer.getChannelData(0)
          const slice = output.slice(1000, 1100)
          let sum = 0
          for (let i = 0; i < slice.length; i++) {
            sum += Math.abs(slice[i])
          }
          fingerprint = sum.toString()
          oscillator.stop()
          context.close()
          resolve(fingerprint)
        }
      })
    } catch {
      return "audio-error"
    }
  }
}

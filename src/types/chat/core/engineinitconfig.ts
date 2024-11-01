import { DexieStorage } from "@src/core/app"

/**
 * Represents the configuration needed to initialize the engine.
 * @type EngineInitConfig
 */
export type EngineInitConfig = {
  /**
   * @property {DexieStorage} storage - The internal storage of the application.
   */
  storage: DexieStorage
  /**
   * @property {boolean} devMode - a flag indicating the SDK runs in dev mode.
   */
  devMode: boolean
}

import React from "react"
import { Maybe } from "../types"
import { createRoot, Root } from "react-dom/client"
import { v4 as uuid } from "uuid"
import { AuthAdapterOptions } from "src/types/adapter/authadapteroptions"
import { LoopzAuth } from "src/react/components/loopzauth"

export default class AuthAdapter {
  private _container: Maybe<HTMLElement> = null

  private _root: Maybe<Root> = null

  private _options: AuthAdapterOptions

  constructor(authAdapterOptions: AuthAdapterOptions) {
    this._container = document.createElement("div")
    this._container.id = uuid()
    this._options = authAdapterOptions

    document.body.appendChild(this._container)

    this._root = createRoot(this._container!)
  }

  render() {
    if (!this._root) throw new Error("Root object must be initializated.")

    this._root.render(
      <LoopzAuth {...this._options}>
        <></>
      </LoopzAuth>
    )
  }

  cleanup() {
    if (this._container && this._root) {
      this._root.unmount()
      document.body.removeChild(this._container)
    }
  }
}

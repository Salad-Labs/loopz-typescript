import React from "react"
import { Maybe } from "../types"
import { PrivyAdapterOptions } from "../types/adapter"
import { createRoot, Root } from "react-dom/client"
import { v4 as uuid } from "uuid"
import { PrivyClientConfig } from "@privy-io/react-auth"
import { Auth, Order } from ".."
import { PrivyContext } from "../react/components/privycontext"

export class PrivyAdapter {
  private _container: Maybe<HTMLElement> = null

  private _root: Maybe<Root> = null

  private _privyAppId: string

  private _privyConfig?: PrivyClientConfig

  constructor(privyAdapterOptions: PrivyAdapterOptions) {
    this._privyAppId = privyAdapterOptions.appId

    this._container = document.createElement("div")
    this._container.id = uuid()

    document.body.appendChild(this._container)

    this._root = createRoot(this._container!)
    this._privyConfig = privyAdapterOptions.options!
  }

  render() {
    if (!this._root) throw new Error("Root object must be initializated.")
    if (!this._privyConfig)
      throw new Error("Privy configuration must be setup.")

    const auth = Auth.getInstance()
    const order = Order.getInstance()

    this._root.render(
      <PrivyContext
        auth={auth}
        order={order}
        appId={this._privyAppId}
        config={this._privyConfig}
      />
    )
  }

  cleanup() {
    if (this._container && this._root) {
      this._root.unmount()
      document.body.removeChild(this._container)
    }
  }
}

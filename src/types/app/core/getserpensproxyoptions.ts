export type GetSerpensProxyOptions<PC extends PromiseConstructorLike> =
  Partial<{
    /**
     * Either includes only the specified `keys` or exclude them
     * @default "only"
     */
    mode: "only" | "exclude"
    /**
     * An array of keys of the instance to "exclude from" or "include in" the proxy trap depending on `mode`
     * @default []
     */
    keys: Array<string | symbol>
    /**
     * Used to customize the Promise constructor used
     * @default Promise
     */
    PromiseConstructor: PC
  }>

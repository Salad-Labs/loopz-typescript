import { GetSerpensProxyOptions } from "../../types/app/core/getserpensproxy"
import { Serpens } from "./serpens"

/**
 * @param instance The instance for which methods must be queued using Serpens
 * @param options The configuration object used to manage the function
 * @returns The proxified instance
 */
export const getSerpensProxy = <
  T extends object,
  PC extends PromiseConstructorLike
>(
  instance: T,
  options?: GetSerpensProxyOptions<PC>
): T => {
  const mode = options?.mode ?? "only"
  const keys = options?.keys ?? []
  const PromiseConstructor = options?.PromiseConstructor ?? Promise

  return new Proxy<T>(instance, {
    get(target, prop, receiver) {
      const isPropInKeys = keys.includes(prop)

      if (
        !(target[prop] instanceof Function) ||
        (mode === "only" && !isPropInKeys) ||
        (mode === "exclude" && isPropInKeys)
      )
        return Reflect.get(target, prop, receiver)

      return (...args: any[]) => {
        return new PromiseConstructor((resolve, reject) => {
          Serpens.addAction(() =>
            target[prop].apply(target, args).then(resolve).catch(reject)
          )
        })
      }
    },
  })
}

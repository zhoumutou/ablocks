export function useSingleton<T>() {
  const key = Symbol('singleton')
  return [
    (value: T) => provide(key, value),
    (fallback?: T) => inject(key, fallback) as T,
  ] as const
}

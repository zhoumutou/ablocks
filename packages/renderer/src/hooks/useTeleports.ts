import type { HeaderTeleports } from '@/config'
import { useSingleton } from './useSingleton'

const [provideHeaderTeleports, useHeaderTeleports] = useSingleton<Ref<HeaderTeleports | undefined>>()

export {
  provideHeaderTeleports,
  useHeaderTeleports,
}

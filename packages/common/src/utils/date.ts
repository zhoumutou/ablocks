import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import relativeTimePlugin from 'dayjs/plugin/relativeTime'
import utcPlugin from 'dayjs/plugin/utc'

dayjs.extend(relativeTimePlugin)
dayjs.extend(utcPlugin)

export type DateValue = string | number | Date | Dayjs

export function getStamp(date?: DateValue, utc = false) {
  const d = dayjs(date)
  return utc ? d.utc().unix() : d.unix()
}

export function getDate(date?: DateValue, format?: string): string
export function getDate(date?: DateValue, options?: { utc?: boolean, format?: string }): string
export function getDate(
  date?: DateValue,
  formatOrOptions?: string | { utc?: boolean, format?: string },
): string {
  const d = dayjs(date)

  let options
  if (typeof formatOrOptions === 'string') {
    options = { format: formatOrOptions, utc: false }
  } else {
    options = {
      format: 'YYYY-MM-DD',
      utc: false,
      ...formatOrOptions,
    }
  }

  return options.utc ? d.utc().format(options.format) : d.format(options.format)
}

export type JsonPrimitive = string | number | boolean | null
export interface JsonObject {
  [key: string]: JsonValue
}
export interface JsonArray extends Array<JsonValue> {}
export type JsonValue = JsonPrimitive | JsonObject | JsonArray

export interface AppMeta {
  name: string
  productName: string
  version: string
  releaseTime: string
}
export interface AppVersionMeta {
  node: string
  chrome: string
  electron: string
  app: string
}
export interface PortInfo {
  path: string
  manufacturer?: string
  serialNumber?: string
  pnpId?: string
  locationId?: string
  productId?: string
  vendorId?: string
}

export interface OpenDialogOptions {
  title?: string
  defaultPath?: string
  /**
   * Custom label for the confirmation button, when left empty the default label will
   * be used.
   */
  buttonLabel?: string
  filters?: FileFilter[]
  /**
   * Contains which features the dialog should use. The following values are
   * supported:
   */
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections'>
  /**
   * Message to display above input boxes.
   *
   * @platform darwin
   */
  message?: string
}
export interface SaveDialogOptions {
  /**
   * The dialog title. Cannot be displayed on some _Linux_ desktop environments.
   */
  title?: string
  /**
   * Absolute directory path, absolute file path, or file name to use by default.
   */
  defaultPath?: string
  /**
   * Custom label for the confirmation button, when left empty the default label will
   * be used.
   */
  buttonLabel?: string
  filters?: FileFilter[]
  /**
   * Message to display above text fields.
   *
   * @platform darwin
   */
  message?: string
  /**
   * Custom label for the text displayed in front of the filename text field.
   *
   * @platform darwin
   */
  nameFieldLabel?: string
}
export interface FileFilter {
  // Docs: https://electronjs.org/docs/api/structures/file-filter
  extensions: string[]
  name: string
}

export interface ReleaseNoteInfo {
  version: string
  note: string | null
}
export interface UpdateInfo {
  version: string
  releaseDate?: string
  releaseName?: string | null
  releaseNotes?: string | ReleaseNoteInfo[] | null
  files?: Array<{
    url: string
    sha512?: string
    size?: number
  }>
}
export interface ProgressInfo {
  total: number
  delta: number
  transferred: number
  percent: number
  bytesPerSecond: number
}

export type BinaryData = Uint8Array | ArrayBuffer

import type { Workspace } from 'blockly'

interface BlockStyle {
  colourPrimary: string
  colourSecondary: string
  colourTertiary: string
  hat: string
}

interface CategoryStyle {
  colour: string
}

interface ComponentStyle {
  workspaceBackgroundColour?: string
  toolboxBackgroundColour?: string
  toolboxForegroundColour?: string
  flyoutBackgroundColour?: string
  flyoutForegroundColour?: string
  flyoutOpacity?: number
  scrollbarColour?: string
  scrollbarOpacity?: number
  insertionMarkerColour?: string
  insertionMarkerOpacity?: number
  markerColour?: string
  cursorColour?: string
  selectedGlowColour?: string
  selectedGlowOpacity?: number
  replacementGlowColour?: string
  replacementGlowOpacity?: number
}

interface FontStyle {
  family?: string
  weight?: string
  size?: number
}

export interface ITheme {
  blockStyles?: {
    [key: string]: Partial<BlockStyle>
  }
  categoryStyles?: {
    [key: string]: CategoryStyle
  }
  componentStyles?: ComponentStyle
  fontStyle?: FontStyle
  startHats?: boolean
  base?: string | Theme
  name: string
}

interface CssConfig {
  container?: string
  row?: string
  rowcontentcontainer?: string
  icon?: string
  label?: string
  contents?: string
  selected?: string
  openicon?: string
  closedicon?: string
}

interface State {
  type: string
  id?: string
  x?: number
  y?: number
  collapsed?: boolean
  deletable?: boolean
  movable?: boolean
  editable?: boolean
  enabled?: boolean
  disabledReasons?: string[]
  inline?: boolean
  data?: string
  extraState?: any
  icons?: {
    [key: string]: any
  }
  fields?: {
    [key: string]: any
  }
  inputs?: {
    [key: string]: ConnectionState
  }
  next?: ConnectionState
}

interface ConnectionState {
  shadow?: State
  block?: State
}

export interface BlockInfo {
  kind: string
  blockxml?: string | Node
  type?: string
  gap?: string | number
  disabled?: string | boolean
  disabledReasons?: string[]
  enabled?: boolean
  id?: string
  collapsed?: boolean
  inline?: boolean
  data?: string
  extraState?: any
  icons?: {
    [key: string]: any
  }
  fields?: {
    [key: string]: any
  }
  inputs?: {
    [key: string]: ConnectionState
  }
  next?: ConnectionState
}

/**
 * The information needed to create a separator in the toolbox.
 */
export interface SeparatorInfo {
  kind: string
  id: string | undefined
  gap: number | undefined
  cssconfig: CssConfig | undefined
}
/**
 * The information needed to create a button in the toolbox.
 */
export interface ButtonInfo {
  kind: string
  text: string
  callbackkey: string
}
/**
 * The information needed to create a label in the toolbox.
 */
export interface LabelInfo {
  kind: string
  text: string
  id: string | undefined
}
/**
 * The information needed to create either a button or a label in the flyout.
 */
export type ButtonOrLabelInfo = ButtonInfo | LabelInfo
/**
 * The information needed to create a category in the toolbox.
 */
export interface StaticCategoryInfo {
  kind: string
  name: string
  contents: ToolboxItemInfo[]
  id: string | undefined
  categorystyle: string | undefined
  colour: string | undefined
  cssconfig: CssConfig | undefined
  hidden: string | undefined
  expanded?: string | boolean
}
/**
 * The information needed to create a custom category.
 */
export interface DynamicCategoryInfo {
  kind: string
  custom: string
  id: string | undefined
  categorystyle: string | undefined
  colour: string | undefined
  cssconfig: CssConfig | undefined
  hidden: string | undefined
  expanded?: string | boolean
}
/**
 * The information needed to create either a dynamic or static category.
 */
export type CategoryInfo = StaticCategoryInfo | DynamicCategoryInfo
/**
 * Any information that can be used to create an item in the toolbox.
 */
export type ToolboxItemInfo = FlyoutItemInfo | StaticCategoryInfo
/**
 * All the different types that can be displayed in a flyout.
 */
export type FlyoutItemInfo = BlockInfo | SeparatorInfo | ButtonInfo | LabelInfo | DynamicCategoryInfo
/**
 * The JSON definition of a toolbox.
 */
export interface ToolboxInfo {
  kind?: string
  contents: ToolboxItemInfo[]
}

/**
 * Abstract class for an event.
 */
export declare abstract class Abstract {
  /**
   * Whether or not the event was constructed without necessary parameters
   * (to be populated by fromJson).
   */
  abstract isBlank: boolean
  /** The workspace identifier for this event. */
  workspaceId?: string
  /**
   * An ID for the group of events this block is associated with.
   *
   * Groups define events that should be treated as an single action from the
   * user's perspective, and should be undone together.
   */
  group: string
  /** Whether this event is undoable or not. */
  recordUndo: boolean
  /** Whether or not the event is a UI event. */
  isUiEvent: boolean
  /** Type of this event. */
  type: string
  constructor()
  /**
   * Encode the event as JSON.
   *
   * @returns JSON representation.
   */
  toJson(): AbstractEventJson
  /**
   * Deserializes the JSON event.
   *
   * @param event The event to append new properties to. Should be a subclass
   *     of Abstract (like all events), but we can't specify that due to the
   *     fact that parameters to static methods in subclasses must be
   *     supertypes of parameters to static methods in superclasses.
   * @internal
   */
  static fromJson(json: AbstractEventJson, workspace: Workspace, event: any): Abstract
  /**
   * Does this event record any change of state?
   *
   * @returns True if null, false if something changed.
   */
  isNull(): boolean
  /**
   * Run an event.
   *
   * @param _forward True if run forward, false if run backward (undo).
   */
  run(_forward: boolean): void
  /**
   * Get workspace the event belongs to.
   *
   * @returns The workspace the event belongs to.
   * @throws {Error} if workspace is null.
   */
  getEventWorkspace_(): Workspace
}
export interface AbstractEventJson {
  type: string
  group: string
}

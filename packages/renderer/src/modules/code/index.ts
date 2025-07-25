import type { HighlighterCore, ShikiTransformer } from '@shikijs/core'
import { createHighlighterCoreSync } from '@shikijs/core'
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'

import githubLight from '@shikijs/themes/github-light'
import oneDarkPro from '@shikijs/themes/one-dark-pro'
import oneLight from '@shikijs/themes/one-light'

import javascript from '@shikijs/langs/javascript'
import python from '@shikijs/langs/python'
import markdown from '@shikijs/langs/markdown'
import json from '@shikijs/langs/json'

const langs = {
  json,
  javascript,
  python,
  markdown,
}

const themes = {
  'github-light': githubLight,
  'one-dark-pro': oneDarkPro,
  'one-light': oneLight,
}

export type Language = keyof typeof langs
export type Theme = keyof typeof themes

let highlighter: HighlighterCore | undefined

const lineTransformer: ShikiTransformer = {
  line: (hast, lineNumber) => {
    hast.children.unshift({
      type: 'element',
      tagName: 'span',
      properties: { class: 'line-number' },
      children: [
        { type: 'text', value: String(lineNumber) },
      ],
    })
  },
}

function getHighlighterCore() {
  if (!highlighter) {
    highlighter = createHighlighterCoreSync({
      langs: Object.values(langs),
      themes: Object.values(themes),
      engine: createJavaScriptRegexEngine(),
    })
  }

  return highlighter
}

export interface Options {
  lang?: Language | string
  theme?: Theme
  addLineNumbers?: boolean
}

export function codeToHtml(code: string, options: Options = {}) {
  const { lang = 'javascript', theme = 'one-light', addLineNumbers = false } = options

  return getHighlighterCore().codeToHtml(code, {
    lang,
    theme,
    transformers: addLineNumbers ? [lineTransformer] : undefined,
  })
}

export interface StreamMarkdownApi {
  writeChunk: (chunk: string) => void
  endWrite: () => void
}

export async function useStreamMarkdown(element: HTMLElement): Promise<StreamMarkdownApi> {
  const domPurify = await import('dompurify').then(mod => mod.default)
  const { default_renderer, parser, parser_write, parser_end } = await import('streaming-markdown')

  const renderer = default_renderer(element)
  const p = parser(renderer)
  const write = (chunk: string) => parser_write(p, chunk)
  const end = () => parser_end(p)

  let chunks = ''

  const endWrite = () => {
    end()
    chunks = ''
  }

  const writeChunk = (chunk: string) => {
    chunks += chunk
    domPurify.sanitize(chunks)
    if (domPurify.removed.length) {
      end()
      return
    }

    write(chunk)
  }

  return { writeChunk, endWrite }
}

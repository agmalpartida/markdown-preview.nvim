import getRender from 'md-it-meta/lib/meta'

const getLine = (state, line) => {
  const pos = state.bMarks[line]
  const max = state.eMarks[line]
  return state.src.substr(pos, max - pos)
}

const matches = (line, separates) =>
  separates.some((sep) => line.match(new RegExp(`^${sep}$`)))

const isMarkdownHeading = (line) => /^#{1,6}\s+/.test(line)

export const meta = separates  => {
  if (separates === void 0) {
    separates = [['---'], ['---']]
  }
  return (md) => {
    const render = getRender(md, separates)
    md.meta = md.meta || {}
    md.block.ruler.before(
      'code',
      'meta',
      (...args) => {
        try {
          const [state, start, end] = args
          const open = separates[0] || ['---']
          const close = separates[1] || ['---']

          if (!matches(getLine(state, start), open)) return false

          let hasClose = false
          for (let line = start + 1; line < end; line++) {
            if (isMarkdownHeading(getLine(state, line))) return false
            if (matches(getLine(state, line), close)) {
              hasClose = true
              break
            }
          }
          if (!hasClose) return false

          return render(...args)
        } catch(e) {
          console.log('md-it-meta', e)
        }
      },
      {
        alt: []
      }
    );
  };
}

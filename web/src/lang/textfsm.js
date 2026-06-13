import { StreamLanguage, LanguageSupport, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'

const textfsmParser = StreamLanguage.define({
  name: 'textfsm',

  startState() {
    return {
      section: 'value',  // 'value' | 'state' | 'rule'
      inRegex: false
    }
  },

  token(stream, state) {
    if (stream.eatSpace()) return null

    // ---- Value 定义段 ----
    if (state.section === 'value') {
      // 空行 → 切换到状态规则段
      if (stream.sol() && stream.eol()) {
        state.section = 'state'
        stream.next()
        return null
      }

      // 注释
      if (stream.peek() === '#') {
        stream.skipToEnd()
        return 'comment'
      }

      // Value 关键字
      if (stream.sol() && stream.match(/^Value\b/)) {
        return 'keyword'
      }

      // 选项关键字
      if (stream.match(/^(Filldown|Required|List|Key|Fillup)\b/)) {
        return 'type'
      }

      // 逗号
      if (stream.peek() === ',') {
        stream.next()
        return 'punctuation'
      }

      // 变量名（大写标识符）
      if (stream.match(/^[A-Z][A-Z0-9_]*\b/)) {
        return 'variableName'
      }

      // 正则开始 (
      if (stream.peek() === '(' && !state.inRegex) {
        stream.next()
        state.inRegex = true
        return 'punctuation'
      }

      // 正则内容
      if (state.inRegex) {
        // 逐字符扫描，处理转义 \)
        let escaped = false
        const start = stream.pos
        while (!stream.eol()) {
          const ch = stream.next()
          if (escaped) {
            escaped = false
            continue
          }
          if (ch === '\\') {
            escaped = true
            continue
          }
          if (ch === ')') {
            // 回退 ) 让下次 token 处理
            stream.backUp(1)
            state.inRegex = false
            break
          }
        }
        return stream.pos > start ? 'string' : null
      }

      // 正则结束 )（在 inRegex=false 时遇到独立的 ）
      if (stream.peek() === ')') {
        stream.next()
        return 'punctuation'
      }

      stream.next()
      return null
    }

    // ---- 状态规则段 ----

    // 空行
    if (stream.sol() && stream.eol()) {
      stream.next()
      return null
    }

    // 注释（规则段中的行首 #）
    if (stream.sol() && stream.peek() === '#') {
      stream.skipToEnd()
      return 'comment'
    }

    // 状态名（行首非空格单词）
    if (stream.sol() && stream.match(/^[A-Za-z_]\w*\b/)) {
      state.section = 'rule'
      return 'tagName'
    }

    // ---- 规则行内容 ----
    if (state.section === 'rule') {
      // ^ 锚点（规则行开头）
      if (stream.sol() && stream.match(/^\s*\^/)) {
        return 'processingInstruction'
      }

      // 行尾锚点 $$
      if (stream.match(/^\$\$/)) {
        return 'processingInstruction'
      }

      // 变量引用 ${VAR}
      if (stream.match(/^\$\{[A-Z][A-Z0-9_]*\}/)) {
        return 'variableName.special'
      }

      // 动作箭头 ->
      if (stream.match(/^->/)) {
        return 'operator'
      }

      // 动作关键字
      if (stream.match(/^(Record|Continue|Next|Error|Clear|Clearall|End)\b/)) {
        return 'keyword'
      }

      // 点号（复合动作分隔符）
      if (stream.peek() === '.') {
        stream.next()
        return 'punctuation'
      }

      // 状态名（-> 后出现的标识符）
      if (stream.match(/^[A-Za-z_]\w*\b/)) {
        return 'tagName'
      }

      // 规则行中的正则内容
      if (stream.match(/^[^\s${}>.]+/)) {
        return 'string'
      }

      stream.next()
      return null
    }

    stream.next()
    return null
  },

  blankLine(state) {
    if (state.section === 'value') {
      state.section = 'state'
    }
  }
})

export function textfsm() {
  return new LanguageSupport(textfsmParser, [syntaxHighlighting(defaultHighlightStyle)])
}

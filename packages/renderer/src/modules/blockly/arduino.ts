import type { Block, Workspace } from 'blockly'
import { utils, inputs, CodeGenerator, Variables, Names } from 'blockly'

export enum Order {
  ATOMIC = 0, // 0 "" ...
  NEW = 1.1, // new
  MEMBER = 1.2, // . []
  FUNCTION_CALL = 2, // ()
  // oxlint-disable-next-line typescript/no-duplicate-enum-values
  INCREMENT = 3, // ++
  DECREMENT = 3, // --
  BITWISE_NOT = 4.1, // ~
  UNARY_PLUS = 4.2, // +
  UNARY_NEGATION = 4.3, // -
  LOGICAL_NOT = 4.4, // !
  TYPEOF = 4.5, // typeof
  VOID = 4.6, // void
  DELETE = 4.7, // delete
  AWAIT = 4.8, // await
  EXPONENTIATION = 5.0, // **
  MULTIPLICATION = 5.1, // *
  DIVISION = 5.2, // /
  MODULUS = 5.3, // %
  SUBTRACTION = 6.1, // -
  ADDITION = 6.2, // +
  BITWISE_SHIFT = 7, // << >> >>>
  // oxlint-disable-next-line typescript/no-duplicate-enum-values
  RELATIONAL = 8, // < <= > >=
  IN = 8, // in
  INSTANCEOF = 8, // instanceof
  EQUALITY = 9, // == != === !==
  BITWISE_AND = 10, // &
  BITWISE_XOR = 11, // ^
  BITWISE_OR = 12, // |
  LOGICAL_AND = 13, // &&
  LOGICAL_OR = 14, // ||
  CONDITIONAL = 15, // ?:
  ASSIGNMENT = 16, // = += -= **= *= /= %= <<= >>= ...
  YIELD = 17, // yield
  COMMA = 18, // ,
  NONE = 99, // (...)
}

const stringUtils = utils.string
const inputTypes = inputs.inputTypes

export class ArduinoGenerator extends CodeGenerator {
  codeDict: Record<string, Record<string, string>> = {}

  /** @param name Name of the language the generator is for. */
  constructor(name = 'Arduino') {
    super(name)
    this.isInitialized = false

    for (const key in Order) {
      const value = Order[key]
      if (typeof value === 'string')
        continue;
      (this as unknown as Record<string, Order>)[`ORDER_${key}`] = value
    }

    this.addReservedWords(
      'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,'
      + 'define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,integer,'
      + 'constants,floating,point,void,boolean,char,unsigned,byte,int,word,long,'
      + 'float,double,string,String,array,static,volatile,const,sizeof,pinMode,'
      + 'digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,'
      + 'noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,'
      + 'min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,'
      + 'lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,'
      + 'detachInterrupt,interrupts,noInterrupts',
    )
  }

  /**
   * Initialise the database of variable names.
   *
   * @param workspace Workspace to generate code from.
   */
  override init(workspace: Workspace) {
    super.init(workspace)

    if (!this.nameDB_) {
      this.nameDB_ = new Names(this.RESERVED_WORDS_)
    } else {
      this.nameDB_.reset()
    }

    this.nameDB_.setVariableMap(workspace.getVariableMap())
    this.nameDB_.populateVariables(workspace)
    this.nameDB_.populateProcedures(workspace)

    const defvars = []
    // Add developer variables (not created or named by the user).
    const devVarList = Variables.allDeveloperVariables(workspace)
    for (let i = 0; i < devVarList.length; i++) {
      defvars.push(
        this.nameDB_.getName(
          devVarList[i],
          Names.NameType.DEVELOPER_VARIABLE,
        ),
      )
    }

    // Add user variables, but only ones that are being used.
    const variables = Variables.allUsedVarModels(workspace)
    for (let i = 0; i < variables.length; i++) {
      defvars.push(
        this.nameDB_.getName(
          variables[i].getId(),
          Names.NameType.VARIABLE,
        ),
      )
    }

    // Declare all of the variables.
    if (defvars.length) {
      this.definitions_.variables = `var ${defvars.join(', ')};`
    }

    this.codeDict = {}
    // 宏定义
    this.codeDict.macros = Object.create(null)
    // 库引用
    this.codeDict.libraries = Object.create(null)
    // 变量
    this.codeDict.variables = Object.create(null)
    // 对象
    this.codeDict.objects = Object.create(null)
    // 函数
    this.codeDict.functions = Object.create(null)
    // setup
    this.codeDict.setups = Object.create(null)
    // 用户自定义setup
    this.codeDict.userSetups = Object.create(null)
    // loop
    this.codeDict.loops = Object.create(null)
    // 用户自定义loop
    this.codeDict.userLoops = Object.create(null)

    this.isInitialized = true
  }

  /**
   * Prepend the generated code with the variable definitions.
   *
   * @param code Generated code.
   * @returns Completed code.
   */
  override finish(code: string): string {
    super.finish(code)
    // this.isInitialized = false;
    this.nameDB_!.reset()

    // 提取代码
    const macros = []
    const libraries = []
    const variables = []
    const objects = []
    const functions = []
    const setups = []
    const userSetups = []
    const loops = []
    const userLoops = []

    for (const key in this.codeDict.macros) {
      macros.push(this.codeDict.macros[key])
    }
    for (const key in this.codeDict.libraries) {
      libraries.push(this.codeDict.libraries[key])
    }
    for (const key in this.codeDict.variables) {
      variables.push(this.codeDict.variables[key])
    }
    for (const key in this.codeDict.objects) {
      objects.push(this.codeDict.objects[key])
    }
    for (const key in this.codeDict.functions) {
      functions.push(this.codeDict.functions[key])
    }
    for (const key in this.codeDict.setups) {
      setups.push(this.codeDict.setups[key])
    }
    for (const key in this.codeDict.userSetups) {
      userSetups.push(this.codeDict.userSetups[key])
    }
    for (const key in this.codeDict.userLoops) {
      userLoops.push(this.codeDict.userLoops[key])
    }
    for (const key in this.codeDict.loops) {
      loops.push(this.codeDict.loops[key])
    }

    this.isInitialized = false

    const newcode
      = `${(macros.length > 0 ? `${macros.join('\n')}\n\n` : '')
      + (libraries.length > 0 ? `${libraries.join('\n')}\n\n` : '')
      + (variables.length > 0 ? `${variables.join('\n')}\n\n` : '')
      + (objects.length > 0 ? `${objects.join('\n')}\n\n` : '')
      + (functions.length > 0 ? `${functions.join('\n')}\n\n` : '')
      }void setup() {\n${
        setups.length > 0 ? `  ${setups.join('\n  ')}\n` : ''
      }${userSetups.length > 0 ? `${userSetups.join('\n  ')}\n` : ''
      }}\n\n`
      + `void loop() {\n${
        userLoops.length > 0 ? `${userLoops.join('\n  ')}\n` : ''
      }${loops.length > 0 ? `  ${loops.join('\n  ')}\n` : ''
      }}`
    return newcode
  }

  /**
   * Naked values are top-level blocks with outputs that aren't plugged into
   * anything.  A trailing semicolon is needed to make this legal.
   *
   * @param line Line of generated code.
   * @returns Legal line of code.
   */
  override scrubNakedValue(line: string): string {
    return `${line};\n`
  }

  /**
   * Encode a string as a properly escaped JavaScript string, complete with
   * quotes.
   *
   * @param string Text to encode.
   * @returns JavaScript string.
   */
  quote_(string: string): string {
    // Can't use goog.string.quote since Google's style guide recommends
    // JS string literals use single quotes.
    string = string
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\\n')
      .replace(/'/g, '\\\'')
    return `"${string}"`
  }

  /**
   * Encode a string as a properly escaped multiline JavaScript string, complete
   * with quotes.
   * @param string Text to encode.
   * @returns JavaScript string.
   */
  multiline_quote_(string: string): string {
    // Can't use goog.string.quote since Google's style guide recommends
    // JS string literals use single quotes.
    const lines = string.split(/\n/g).map(this.quote_)
    return lines.join(' + \'\\n\' +\n')
  }

  /**
   * Common tasks for generating JavaScript from blocks.
   * Handles comments for the specified block and any connected value blocks.
   * Calls any statements following this block.
   *
   * @param block The current block.
   * @param code The JavaScript code created for this block.
   * @param thisOnly True to generate code for only this statement.
   * @returns JavaScript code with comments and subsequent blocks added.
   */
  override scrub_(
    block: Block,
    code: string,
    thisOnly = false,
  ): string {
    let commentCode = ''
    // Only collect comments for blocks that aren't inline.
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
      // Collect comment for this block.
      let comment = block.getCommentText()
      if (comment) {
        comment = stringUtils.wrap(comment, this.COMMENT_WRAP - 3)
        commentCode += this.prefixLines(`${comment}\n`, '// ')
      }
      // Collect comments for all value arguments.
      // Don't collect comments for nested statements.
      for (let i = 0; i < block.inputList.length; i++) {
        if (block.inputList[i].type === inputTypes.VALUE) {
          const childBlock = block.inputList[i].connection!.targetBlock()
          if (childBlock) {
            comment = this.allNestedComments(childBlock)
            if (comment) {
              commentCode += this.prefixLines(comment, '// ')
            }
          }
        }
      }
    }
    const nextBlock
      = block.nextConnection && block.nextConnection.targetBlock()
    const nextCode = thisOnly ? '' : this.blockToCode(nextBlock)
    return commentCode + code + nextCode
  }

  /**
   * Generate code representing the specified value input, adjusted to take into
   * account indexing (zero- or one-based) and optionally by a specified delta
   * and/or by negation.
   *
   * @param block The block.
   * @param atId The ID of the input block to get (and adjust) the value of.
   * @param delta Value to add.
   * @param negate Whether to negate the value.
   * @param order The highest order acting on this value.
   * @returns The adjusted value or code that evaluates to it.
   */
  getAdjusted(
    block: Block,
    atId: string,
    delta = 0,
    negate = false,
    order = Order.NONE,
  ): string {
    if (block.workspace.options.oneBasedIndex) {
      delta--
    }
    const defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0'

    let orderForInput = order
    if (delta > 0) {
      orderForInput = Order.ADDITION
    } else if (delta < 0) {
      orderForInput = Order.SUBTRACTION
    } else if (negate) {
      orderForInput = Order.UNARY_NEGATION
    }

    let at = this.valueToCode(block, atId, orderForInput) || defaultAtIndex

    // Easy case: no adjustments.
    if (delta === 0 && !negate) {
      return at
    }
    // If the index is a naked number, adjust it right now.
    if (stringUtils.isNumber(at)) {
      at = String(Number(at) + delta)
      if (negate) {
        at = String(-Number(at))
      }
      return at
    }
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
      at = `${at} + ${delta}`
    } else if (delta < 0) {
      at = `${at} - ${-delta}`
    }
    if (negate) {
      at = delta ? `-(${at})` : `-${at}`
    }
    if (Math.floor(order) >= Math.floor(orderForInput)) {
      at = `(${at})`
    }
    return at
  }

  addMacro(tag: string, code: string) {
    if (this.codeDict.macros[tag] === undefined) {
      this.codeDict.macros[tag] = code
    }
  }

  addLibrary(tag: string, code: string) {
    if (this.codeDict.libraries[tag] === undefined) {
      this.codeDict.libraries[tag] = code
    }
  }

  addVariable(tag: string, code: string) {
    if (this.codeDict.variables[tag] === undefined) {
      this.codeDict.variables[tag] = code
    }
  }

  addObject(tag: string, code: string) {
    if (this.codeDict.objects[tag] === undefined) {
      this.codeDict.objects[tag] = code
    }
  }

  addFunction(tag: string, code: string) {
    if (this.codeDict.functions[tag] === undefined) {
      this.codeDict.functions[tag] = code
    }
  }

  addSetup(tag: string, code: string) {
    if (this.codeDict.setups[tag] === undefined) {
      this.codeDict.setups[tag] = code
    }
  }

  addUserSetup(tag: string, code: string) {
    if (this.codeDict.userSetups[tag] === undefined) {
      this.codeDict.userSetups[tag] = code
    }
  }

  addLoop(tag: string, code: string) {
    if (this.codeDict.loops[tag] === undefined) {
      this.codeDict.loops[tag] = code
    }
  }

  addUserLoop(tag: string, code: string) {
    if (this.codeDict.userLoops[tag] === undefined) {
      this.codeDict.userLoops[tag] = code
    }
  }

  // 变量相关
  variableTypes: Record<string, string> = {}
  getVarType(varName: string) {
    if (this.variableTypes[varName]) {
      return this.variableTypes[varName]
    }
    return 'int'
  }

  setVarType(varName: string, type: string) {
    this.variableTypes[varName] = type
  }

  getValue = (block: Block, name: string, type = '') => {
    let code = '?'
    if (type === 'input_statement' || type === 'input_value') {
      try {
        code = this.statementToCode(block, name)
        return code.replace(/(^\s*)/, '')
      } catch {
        code = this.valueToCode(block, name, Order.ATOMIC)
        return code
      }
    }
    if (type === 'field_variable') {
      code = this.nameDB_!.getName(
        block.getFieldValue(name),
        'VARIABLE',
      )
      return code
    }
    // if (type == 'field_dropdown' || type == 'field_number' || type == 'field_multilinetext') {
    code = block.getFieldValue(name)
    return code
  }

  varIsGlobal(block: Omit<Block, 'parentBlock_'> & { parentBlock_?: Omit<Block, 'parentBlock_'> }) {
    let currentBlock = block
    while (currentBlock.parentBlock_ != null) {
      currentBlock = currentBlock.parentBlock_
      if (currentBlock.type === 'arduino_setup') {
        return true
      }
    }
    return false
  }
}

export const arduinoGenerator = new ArduinoGenerator()

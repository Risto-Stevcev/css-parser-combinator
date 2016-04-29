/* https://drafts.csswg.org/css2/syndata.html#tokenization */
import { regex, alt, seq, string as str } from 'parsimmon'
import { cat } from './utils'

// `(\r\n|[ \n\r\t\f])?`
const nl_i = alt(regex(/\r\n/), regex(/[ \n\r\t\f]/)).atMost(1).map(cat)


// `\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?`
const unicode = seq(regex(/\\[0-9a-f]{1,6}/), nl_i).map(cat)

// `[^\0-\177]`
const nonascii = regex(/[^\0-\177]/)

// `[+-]?([0-9]+|[0-9]*\.[0-9]+)(e[+-]?[0-9]+)?`
const num = seq( regex(/[+\-]?/)
               , alt(regex(/[0-9]*\.[0-9]+/), regex(/[0-9]+/))
               , regex(/e[+\-]?[0-9]+/).atMost(1).map(cat) ).map(cat)

// `\n|\r\n|\r|\f`
const nl = alt(regex(/\n/), regex(/\r\n/), regex(/\r/), regex(/\f/))

// `[ \t\r\n\f]*`
const w  = regex(/[ \t\r\n\f]*/)

// `u|\\0{0,4}(55|75)(\r\n|[ \t\r\n\f])?|\\u`
const U = alt( str('u')
             , seq(regex(/\\0{0,4}(55|75)/), nl_i).map(cat)
             , regex(/\\u/) )

// `r|\\0{0,4}(52|72)(\r\n|[ \t\r\n\f])?|\\r`
const R = alt( str('r')
             , seq(regex(/\\0{0,4}(52|72)/), nl_i).map(cat)
             , regex(/\\r/) )

// `l|\\0{0,4}(4c|6c)(\r\n|[ \t\r\n\f])?|\\l`
const L = alt( str('l')
             , seq(regex(/\\0{0,4}(4c|6c)/), nl_i).map(cat)
             , regex(/\\l/) )

// `{unicode}|\\[^\n\r\f0-9a-f]`
const escape = alt( unicode, regex(/\\[^\n\r\f0-9a-f]/) )

// `[_a-z0-9-]|{nonascii}|{escape}`
const nmchar = alt( regex(/[_a-z0-9\-]/), nonascii, escape )

// `[_a-z]|{nonascii}|{escape}`
const nmstart = alt( regex(/[_a-z]/), nonascii, escape )

// `{nmchar}+`
const name = nmchar.atLeast(1).map(cat)

// `[-]?{nmstart}{nmchar}*`
const ident = seq(regex(/[-]?/), nmstart, nmchar.many().map(cat)).map(cat)

// `\"([^\n\r\f\\"]|\\{nl}|{escape})*\"`
const string1 = seq( str('"')
                   , alt(regex(/[^\n\r\f\\"]/), seq(str('\\'), nl), escape).many().map(cat)
                   , str('"') ).map(cat)

// `\'([^\n\r\f\\']|\\{nl}|{escape})*\'`
const string2 = seq( str("'")
                   , alt(regex(/[^\n\r\f\\']/), seq(str('\\'), nl), escape).many().map(cat)
                   , str("'") ).map(cat)

// `{string1}|{string2}`
const string  = alt(string1, string2)

export { unicode, nonascii, num, nl, w, U, R, L, escape, nmchar, nmstart
       , name, ident, string, string1, string2 }

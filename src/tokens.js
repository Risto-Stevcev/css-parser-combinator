/* https://drafts.csswg.org/css2/syndata.html#tokenization */
import { seq, regex, string as str, alt, test } from 'parsimmon'
import { num, nonascii, U, R, L, w, escape, name, ident, string } from './macros'
import { cat } from './utils'

// `{ident}`
const IDENT = ident

// `@{ident}`
const ATKEYWORD = seq(str('@'), ident).map(cat)

// `{string}`
const STRING = string

// `#{name}`
const HASH = seq(str('#'), name).map(cat)

// `{num}`
const NUMBER = num

// `{num}%`
const PERCENTAGE = seq(num, str('%')).map(cat)

// `{num}{ident}`
const DIMENSION = seq(num, ident).map(cat)

// ```
// {U}{R}{L}\({w}{string}{w}\)|
// {U}{R}{L}\({w}([!#$%&*-\[\]-~]|{nonascii}|{escape})*{w}\)
// ```
const URI = alt( seq(U, R, L, str('('), w, string, w, str(')')).map(cat)
               , seq(U, R, L, str('('), w, alt(regex(/[!#$%&*\[\]\-~]/), nonascii, escape).many(), w, str(')')).map(cat) )

// ```
// u\+[?]{1,6}|
// u\+[0-9a-f]{1}[?]{0,5}|
// u\+[0-9a-f]{2}[?]{0,4}|
// u\+[0-9a-f]{3}[?]{0,3}|
// u\+[0-9a-f]{4}[?]{0,2}|
// u\+[0-9a-f]{5}[?]{0,1}|
// u\+[0-9a-f]{6}|
// u\+[0-9a-f]{1,6}-[0-9a-f]{1,6}
// ```
const UNICODE_RANGE = alt( regex(/u\+[?]{1,6}/)
                         , regex(/u\+[0-9a-f]{6}/)
                         , regex(/u\+[0-9a-f]{1,6}-[0-9a-f]{1,6}/)
                         , regex(/u\+[0-9a-f]{5}[?]{0,1}/)
                         , regex(/u\+[0-9a-f]{4}[?]{0,2}/)
                         , regex(/u\+[0-9a-f]{3}[?]{0,3}/)
                         , regex(/u\+[0-9a-f]{2}[?]{0,4}/)
                         , regex(/u\+[0-9a-f]{1}[?]{0,5}/) )

// `<!--`
const CDO = str('<!--')

// `-->`
const CDC = str('-->')

// `:`
const COLON = str(':')

// `;`
const SEMI = str(';')

// `{`
const LBRACE = str('{')

// `}`
const RBRACE = str('}')

// `(`
const LPAREN = str('(')

// `)`
const RPAREN = str(')')

// `[`
const LSBRACE = str('[')

// `]`
const RSBRACE = str(']')

// `[ \t\r\n\f]+`
const S = regex(/[ \t\r\n\f]+/)

// `\/\*[^*]*\*+([^/*][^*]*\*+)*\/`
const COMMENT = regex(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//)

// `{ident}\(`
const FUNCTION = seq(ident, str('(')).map(cat)

// `~=`
const INCLUDES = str('~=')

// `|=`
const DASHMATCH = str('|=')

// `any other character not matched by the above rules, and neither a single nor a double quote`
const DELIM_pred = t => !alt(IDENT, ATKEYWORD, STRING, HASH, NUMBER, PERCENTAGE, DIMENSION,
                             URI, UNICODE_RANGE, CDO, CDC, COLON, SEMI,
                             LBRACE, RBRACE, LPAREN, RPAREN, LSBRACE, RSBRACE,
                             str("'"), str('"')).parse(t).status
const DELIM = test(DELIM_pred)

export { IDENT, ATKEYWORD, STRING, HASH, NUMBER, PERCENTAGE, DIMENSION
       , URI, UNICODE_RANGE, CDO, CDC, COLON, SEMI
       , LBRACE, RBRACE, LPAREN, RPAREN, LSBRACE, RSBRACE
       , S, COMMENT, FUNCTION, INCLUDES, DASHMATCH, DELIM }

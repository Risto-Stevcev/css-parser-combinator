/* https://drafts.csswg.org/css2/syndata.html#tokenization */
import { pipe, flatten, filter, isEmpty, not, map, trim } from 'ramda'
import { of, seq, alt, lazy } from 'parsimmon'
import 'babel-polyfill'
import Do from 'do-notation'
import { cat } from './utils'
import { ATKEYWORD, CDO, CDC, S, SEMI, COLON, IDENT, LBRACE, LSBRACE, LPAREN
       , NUMBER, PERCENTAGE, DIMENSION, STRING, DELIM, RBRACE, RSBRACE, RPAREN
       , URI, HASH, UNICODE_RANGE, INCLUDES, DASHMATCH, FUNCTION } from './tokens'

//  `block | ATKEYWORD S* | ';' S* | CDO S* | CDC S*`
const unused = lazy(_ => alt( block
                            , seq(ATKEYWORD, S.many())
                            , seq(SEMI,      S.many())
                            , seq(CDO,       S.many())
                            , seq(CDC,       S.many()) ).map(cat))

// ```
//  [ IDENT | NUMBER | PERCENTAGE | DIMENSION | STRING
//  | DELIM | URI | HASH | UNICODE-RANGE | INCLUDES
//  | DASHMATCH | ':' | FUNCTION S* [any|unused]* ')'
//  | '(' S* [any|unused]* ')' | '[' S* [any|unused]* ']'
//  ] S*
// ```
const any = lazy(_ => seq( alt( IDENT, NUMBER, PERCENTAGE, DIMENSION, STRING, DELIM, URI
                              , HASH, UNICODE_RANGE, INCLUDES, DASHMATCH, COLON
                              , seq(FUNCTION, S.many().map(cat), alt(any, unused).many().map(cat), RPAREN) .map(cat)
                              , seq(LPAREN,   S.many().map(cat), alt(any, unused).many().map(cat), RPAREN) .map(cat) 
                              , seq(LSBRACE,  S.many().map(cat), alt(any, unused).many().map(cat), RSBRACE).map(cat) )
                         , S.many().map(cat) ).map(cat))

// `any+`
const selector = any.atLeast(1).map(cat)

//  `'{' S* [ any | block | ATKEYWORD S* | ';' S* ]* '}' S*`
const block = lazy(_ => seq( LBRACE, S.many().map(cat)
                           , alt( any
                                , block
                                , seq(ATKEYWORD, S.many().map(cat)).map(cat)
                                , seq(SEMI,      S.many().map(cat)).map(cat)
                                ).many().map(cat)
                           , RBRACE, S.many().map(cat) ).map(cat))

// `ATKEYWORD S* any* [ block | ';' S* ]`
const at_rule = seq( ATKEYWORD, S.many().map(cat), any.many().map(cat)
                   , alt(block, seq(SEMI, S.many().map(cat)).map(cat)) ).map(cat)

// `[ any | block | ATKEYWORD S* ]+`
const value = alt( any
                 , block
                 , seq(ATKEYWORD, S.many().map(cat)).map(cat)
                 ).atLeast(1).map(cat)

// `IDENT`
const property = IDENT

// `property S* ':' S* value`
const declaration = lazy(_ => of().chain(_ => 
  Do(function* () {
    const name = yield property
    yield S.many()
    yield COLON
    yield S.many()
    const val = yield value

    const result = {}
    result[name] = val
    return of(result)
  })
))


// ```
// declaration [ ';' S* declaration-list ]?
// | at-rule declaration-list
// | /* empty */
// ```
const declaration_list = lazy(_ => alt( seq( declaration
                                           , SEMI.then(S.many()).then(declaration_list).atMost(1) )
                                      , seq(at_rule, declaration_list).map(cat)
                                      , of('') )).map(decls => pipe(flatten, filter(pipe(isEmpty, not)))(decls))



// `selector? '{' S* declaration-list '}' S*`
const ruleset = lazy(_ => of().chain(_ => 
  Do(function* () {
    const name = (yield selector.atMost(1).map(map(trim))) || ''
    yield LBRACE.then(S.many())
    const decls = yield declaration_list
    yield RBRACE.then(S.many())
    
    const result = {}
    result[name] = decls
    return of(result) 
  })
))


// `ruleset | at-rule`
const statement = alt(ruleset, at_rule)

// `[ CDO | CDC | S | statement ]*`
const stylesheet = alt(CDO, CDC, S, statement).many()

export { stylesheet, statement, at_rule, block, ruleset, declaration_list
       , selector, declaration, property, value, any, unused }

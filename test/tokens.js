import { expect } from 'chai'
import { IDENT, ATKEYWORD, STRING, HASH, NUMBER, PERCENTAGE, DIMENSION, URI
       , UNICODE_RANGE, CDO, CDC, COLON, SEMI, LBRACE, RBRACE, LPAREN, RPAREN
       , LSBRACE, RSBRACE, S, COMMENT, FUNCTION, INCLUDES, DASHMATCH, DELIM } from '../src/tokens'


describe('Tokens', function() {
  describe('IDENT', function() {
    it('should parse', function() {
      expect(IDENT.parse('my_name'))  .to.eql({ status: true, value: 'my_name' })
      expect(IDENT.parse('min-width')).to.eql({ status: true, value: 'min-width' })
    })

    it('should not parse', function() {
      expect(IDENT.parse('0y_name')).to.have.property('status').that.is.false
    })
  })

  describe('ATKEYWORD', function() {
    it('should parse', function() {
      expect(ATKEYWORD.parse('@media')).to.eql({ status: true, value: '@media' })
    })
    it('should not parse', function() {
      expect(ATKEYWORD.parse('media')).to.have.property('status').that.is.false
    })
  })

  describe('STRING', function() {
    it('should parse', function() {
      expect(STRING.parse('"foo bar"')).to.eql({ status: true, value: '"foo bar"' })
      expect(STRING.parse("'foo bar'")).to.eql({ status: true, value: "'foo bar'" })
    })

    it('should not parse', function() {
      expect(STRING.parse('foo bar')).to.have.property('status').that.is.false
    })
  })

  describe('HASH', function() {
    it('should parse', function() {
      expect(HASH.parse('#foo')).to.eql({ status: true, value: '#foo' })
    })
    it('should not parse', function() {
      expect(HASH.parse('foo')).to.have.property('status').that.is.false
    })
  })

  describe('NUMBER', function() {
    it('should parse', function() {
      expect(NUMBER.parse('0'))    .to.eql({ status: true, value: '0' })
      expect(NUMBER.parse('-12'))  .to.eql({ status: true, value: '-12' })
      expect(NUMBER.parse('+1.4')) .to.eql({ status: true, value: '+1.4' })
      expect(NUMBER.parse('90.23')).to.eql({ status: true, value: '90.23' })
    })

    it('should not parse', function() {
      expect(NUMBER.parse('a'))    .have.property('status').that.is.false
      expect(NUMBER.parse('0.0.0')).have.property('status').that.is.false
    })
  })

  describe('PERCENTAGE', function() {
    it('should parse', function() {
      expect(PERCENTAGE.parse('0%'))    .to.eql({ status: true, value: '0%' })
      expect(PERCENTAGE.parse('-12%'))  .to.eql({ status: true, value: '-12%' })
      expect(PERCENTAGE.parse('+1.4%')) .to.eql({ status: true, value: '+1.4%' })
      expect(PERCENTAGE.parse('90.23%')).to.eql({ status: true, value: '90.23%' })
    })

    it('should not parse', function() {
      expect(PERCENTAGE.parse('a'))    .have.property('status').that.is.false
      expect(PERCENTAGE.parse('0.0.0')).have.property('status').that.is.false
    })
  })

  describe('DIMENSION', function() {
    it('should parse', function() {
      expect(DIMENSION.parse('0px'))    .to.eql({ status: true, value: '0px' })
      expect(DIMENSION.parse('-12em'))  .to.eql({ status: true, value: '-12em' })
      expect(DIMENSION.parse('+1.4rem')).to.eql({ status: true, value: '+1.4rem' })
      expect(DIMENSION.parse('90.23px')).to.eql({ status: true, value: '90.23px' })
    })

    it('should not parse', function() {
      expect(DIMENSION.parse('a'))    .have.property('status').that.is.false
      expect(DIMENSION.parse('0.0.0')).have.property('status').that.is.false
    })
  })

  describe('URI', function() {
    it('should parse', function() {
      expect(URI.parse('url()'))                .to.eql({ status: true, value: 'url()' })
      expect(URI.parse('\\u\\r\\l()'))          .to.eql({ status: true, value: '\\u\\r\\l()' })
      expect(URI.parse('url("http://foo.bar")')).to.eql({ status: true, value: 'url("http://foo.bar")' })
    })

    it('should not parse', function() {
      expect(URI.parse('0'))                  .have.property('status').that.is.false
      expect(URI.parse('url'))                .have.property('status').that.is.false
      expect(URI.parse('url(http://foo.bar)')).have.property('status').that.is.false
    })
  })

  describe('UNICODE_RANGE', function() {
    it('should parse', function() {
      expect(UNICODE_RANGE.parse('u+?')).to.eql({ status: true, value: 'u+?' })
      expect(UNICODE_RANGE.parse('u+??????')).to.eql({ status: true, value: 'u+??????' })
      expect(UNICODE_RANGE.parse('u+a?')).to.eql({ status: true, value: 'u+a?' })
      expect(UNICODE_RANGE.parse('u+ab??')).to.eql({ status: true, value: 'u+ab??' })
      expect(UNICODE_RANGE.parse('u+abc???')).to.eql({ status: true, value: 'u+abc???' })
      expect(UNICODE_RANGE.parse('u+abcd??')).to.eql({ status: true, value: 'u+abcd??' })
      expect(UNICODE_RANGE.parse('u+abcde?')).to.eql({ status: true, value: 'u+abcde?' })
      expect(UNICODE_RANGE.parse('u+abcdef')).to.eql({ status: true, value: 'u+abcdef' })
    })

    it('should not parse', function() {
      expect(UNICODE_RANGE.parse('a')).have.property('status').that.is.false
      expect(UNICODE_RANGE.parse('u+???????')).have.property('status').that.is.false
      expect(UNICODE_RANGE.parse('u+abcdeg')).have.property('status').that.is.false
    })
  })

  describe('CDO', function() {
    it('should parse', function() {
      expect(CDO.parse('<!--')).to.eql({ status: true, value: '<!--' })
    })

    it('should not parse', function() {
      expect(CDO.parse('a')).have.property('status').that.is.false
    })
  })

  describe('CDC', function() {
    it('should parse', function() {
      expect(CDC.parse('-->')).to.eql({ status: true, value: '-->' })
    })

    it('should not parse', function() {
      expect(CDC.parse('a')).have.property('status').that.is.false
    })
  })

  describe('COLON', function() {
    it('should parse', function() {
      expect(COLON.parse(':')).to.eql({ status: true, value: ':' })
    })

    it('should not parse', function() {
      expect(COLON.parse('a')).have.property('status').that.is.false
    })
  })


  describe('SEMI', function() {
    it('should parse', function() {
      expect(SEMI.parse(';')).to.eql({ status: true, value: ';' })
    })

    it('should not parse', function() {
      expect(SEMI.parse('a')).have.property('status').that.is.false
    })
  })

  describe('LBRACE', function() {
    it('should parse', function() {
      expect(LBRACE.parse('{')).to.eql({ status: true, value: '{' })
    })

    it('should not parse', function() {
      expect(LBRACE.parse('a')).have.property('status').that.is.false
    })
  })

  describe('RBRACE', function() {
    it('should parse', function() {
      expect(RBRACE.parse('}')).to.eql({ status: true, value: '}' })
    })

    it('should not parse', function() {
      expect(RBRACE.parse('a')).have.property('status').that.is.false
    })
  })

  describe('LPAREN', function() {
    it('should parse', function() {
      expect(LPAREN.parse('(')).to.eql({ status: true, value: '(' })
    })

    it('should not parse', function() {
      expect(LPAREN.parse('a')).have.property('status').that.is.false
    })
  })

  describe('RPAREN', function() {
    it('should parse', function() {
      expect(RPAREN.parse(')')).to.eql({ status: true, value: ')' })
    })

    it('should not parse', function() {
      expect(RPAREN.parse('a')).have.property('status').that.is.false
    })
  })

  describe('LSBRACE', function() {
    it('should parse', function() {
      expect(LSBRACE.parse('[')).to.eql({ status: true, value: '[' })
    })

    it('should not parse', function() {
      expect(LSBRACE.parse('a')).have.property('status').that.is.false
    })
  })

  describe('RSBRACE', function() {
    it('should parse', function() {
      expect(RSBRACE.parse(']')).to.eql({ status: true, value: ']' })
    })

    it('should not parse', function() {
      expect(RSBRACE.parse('a')).have.property('status').that.is.false
    })
  })

  describe('S', function() {
    it('should parse', function() {
      expect(S.parse('\f'))  .to.eql({ status: true, value: '\f' })
      expect(S.parse('\t'))  .to.eql({ status: true, value: '\t' })
      expect(S.parse('\n'))  .to.eql({ status: true, value: '\n' })
      expect(S.parse(' '))   .to.eql({ status: true, value: ' ' })
      expect(S.parse('\r\n')).to.eql({ status: true, value: '\r\n' })
    })

    it('should not parse', function() {
      expect(S.parse('a')).have.property('status').that.is.false
    })
  })

  describe('COMMENT', function() {
    it('should parse', function() {
      expect(COMMENT.parse('/**/'))         .to.eql({ status: true, value: '/**/' })
      expect(COMMENT.parse('/* foo bar */')).to.eql({ status: true, value: '/* foo bar */' })
    })

    it('should not parse', function() {
      expect(COMMENT.parse('a')).have.property('status').that.is.false
    })
  })

  describe('FUNCTION', function() {
    it('should parse', function() {
      expect(FUNCTION.parse('foo(')).to.eql({ status: true, value: 'foo(' })
    })

    it('should not parse', function() {
      expect(FUNCTION.parse('foo')).have.property('status').that.is.false
    })
  })

  describe('INCLUDES', function() {
    it('should parse', function() {
      expect(INCLUDES.parse('~=')).to.eql({ status: true, value: '~=' })
    })

    it('should not parse', function() {
      expect(INCLUDES.parse('a')).have.property('status').that.is.false
    })
  })

  describe('DASHMATCH', function() {
    it('should parse', function() {
      expect(DASHMATCH.parse('|=')).to.eql({ status: true, value: '|=' })
    })

    it('should not parse', function() {
      expect(DASHMATCH.parse('a')).have.property('status').that.is.false
    })
  })

  describe('DELIM', function() {
    it('should parse', function() {
      expect(DELIM.parse('^')).to.eql({ status: true, value: '^' })
    })

    it('should not parse', function() {
      expect(DELIM.parse('a')).have.property('status').that.is.false
    })
  })
})

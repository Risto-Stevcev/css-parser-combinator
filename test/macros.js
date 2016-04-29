import { expect } from 'chai'
import { map } from 'ramda'
import { regex } from 'parsimmon'
import { unicode, nonascii, num, nl, w, U, R, L, escape, nmchar, nmstart
       , name, ident, string, string1, string2 } from '../src/macros'


describe('Macros', function() {
  describe('unicode', function() {
    it('should parse', function() {
      expect(unicode.parse('\\0'))   .to.eql({ status: true, value: '\\0' })
      expect(unicode.parse('\\005c')).to.eql({ status: true, value: '\\005c' })
    })

    it('should not parse', function() {
      expect(unicode.parse('a')).have.property('status').that.is.false
    })
  })

  describe('nonascii', function() {
    it('should parse', function() {
      expect(nonascii.parse('¢')).to.eql({ status: true, value: '¢' })
      expect(nonascii.parse('»')).to.eql({ status: true, value: '»' })
    })
    it('should not parse', function() {
      expect(nonascii.parse('a')).have.property('status').that.is.false
      expect(nonascii.parse('0')).have.property('status').that.is.false
    })
  })

  describe('num', function() {
    it('should parse', function() {
      expect(num.parse('0'))    .to.eql({ status: true, value: '0' })
      expect(num.parse('-12'))  .to.eql({ status: true, value: '-12' })
      expect(num.parse('+1.4')) .to.eql({ status: true, value: '+1.4' })
      expect(num.parse('90.23')).to.eql({ status: true, value: '90.23' })
    })

    it('should not parse', function() {
      expect(num.parse('a'))    .have.property('status').that.is.false
      expect(num.parse('0.0.0')).have.property('status').that.is.false
    })
  })

  describe('nl', function() {
    it('should parse', function() {
      expect(nl.parse('\f'))  .to.eql({ status: true, value: '\f' })
      expect(nl.parse('\n'))  .to.eql({ status: true, value: '\n' })
      expect(nl.parse('\r'))  .to.eql({ status: true, value: '\r' })
      expect(nl.parse('\r\n')).to.eql({ status: true, value: '\r\n' })
    })

    it('should not parse', function() {
      expect(nl.parse('a')).have.property('status').that.is.false
    })
  })

  describe('w', function() {
    it('should parse', function() {
      expect(w.parse(''))    .to.eql({ status: true, value: '' })
      expect(w.parse('\f'))  .to.eql({ status: true, value: '\f' })
      expect(w.parse('\t'))  .to.eql({ status: true, value: '\t' })
      expect(w.parse('\n'))  .to.eql({ status: true, value: '\n' })
      expect(w.parse(' '))   .to.eql({ status: true, value: ' ' })
      expect(w.parse('\r\n')).to.eql({ status: true, value: '\r\n' })
    })

    it('should not parse', function() {
      expect(w.parse('a')).have.property('status').that.is.false
    })
  })

  describe('U', function() {
    it('should parse', function() {
      expect(U.parse('u'))    .to.eql({ status: true, value: 'u' })
      expect(U.parse('\\u'))  .to.eql({ status: true, value: '\\u' })
      expect(U.parse('\\75')) .to.eql({ status: true, value: '\\75' })
      expect(U.parse('\\055')).to.eql({ status: true, value: '\\055' })
    })

    it('should not parse', function() {
      expect(U.parse('a')).have.property('status').that.is.false
    })
  })

  describe('R', function() {
    it('should parse', function() {
      expect(R.parse('r'))    .to.eql({ status: true, value: 'r' })
      expect(R.parse('\\r'))  .to.eql({ status: true, value: '\\r' })
      expect(R.parse('\\52')) .to.eql({ status: true, value: '\\52' })
      expect(R.parse('\\072')).to.eql({ status: true, value: '\\072' })
    })

    it('should not parse', function() {
      expect(R.parse('a')).have.property('status').that.is.false
    })
  })

  describe('L', function() {
    it('should parse', function() {
      expect(L.parse('l'))    .to.eql({ status: true, value: 'l' })
      expect(L.parse('\\l'))  .to.eql({ status: true, value: '\\l' })
      expect(L.parse('\\4c')) .to.eql({ status: true, value: '\\4c' })
      expect(L.parse('\\06c')).to.eql({ status: true, value: '\\06c' })
    })

    it('should not parse', function() {
      expect(L.parse('a')).have.property('status').that.is.false
    })
  })

  describe('escape', function() {
    it('should parse', function() {
      expect(escape.parse('\\"'))     .to.eql({ status: true, value: '\\"' })
      expect(escape.parse('\\005c'))  .to.eql({ status: true, value: '\\005c' })
      expect(escape.parse('\\005c\t')).to.eql({ status: true, value: '\\005c\t' })
    })

    it('should not parse', function() {
      expect(escape.parse('a')).have.property('status').that.is.false
    })
  })

  describe('nmstart', function() {
    it('should parse', function() {
      expect(nmstart.parse('a'))    .to.eql({ status: true, value: 'a' })
      expect(nmstart.parse('\\"'))  .to.eql({ status: true, value: '\\"' })
      expect(nmstart.parse('\\50')) .to.eql({ status: true, value: '\\50' })
      expect(nmstart.parse('\\177')).to.eql({ status: true, value: '\\177' })
    })

    it('should not parse', function() {
      expect(nmstart.parse('0')).have.property('status').that.is.false
      expect(nmstart.parse('{')).have.property('status').that.is.false
    })
  })

  describe('nmchar', function() {
    it('should parse', function() {
      expect(nmchar.parse('0'))    .to.eql({ status: true, value: '0' })
      expect(nmchar.parse('a'))    .to.eql({ status: true, value: 'a' })
      expect(nmchar.parse('\\"'))  .to.eql({ status: true, value: '\\"' })
      expect(nmchar.parse('\\50')) .to.eql({ status: true, value: '\\50' })
      expect(nmchar.parse('\\177')).to.eql({ status: true, value: '\\177' })
    })

    it('should not parse', function() {
      expect(nmchar.parse('{')).have.property('status').that.is.false
    })
  })

  describe('name', function() {
    it('should parse', function() {
      expect(name.parse('my_name'))  .to.eql({ status: true, value: 'my_name' })
      expect(name.parse('00_name'))  .to.eql({ status: true, value: '00_name' })
      expect(name.parse('my_\\005c')).to.eql({ status: true, value: 'my_\\005c' })
    })

    it('should not parse', function() {
      expect(name.parse('{my_name}')).have.property('status').that.is.false
    })
  })

  describe('ident', function() {
    it('should parse', function() {
      expect(ident.parse('my_name'))  .to.eql({ status: true, value: 'my_name' })
      expect(ident.parse('min-width')).to.eql({ status: true, value: 'min-width' })
    })

    it('should not parse', function() {
      expect(ident.parse('0y_name')).to.have.property('status').that.is.false
    })
  })

  describe('string', function() {
    it('should parse', function() {
      expect(string.parse('"foo bar"')).to.eql({ status: true, value: '"foo bar"' })
      expect(string.parse("'foo bar'")).to.eql({ status: true, value: "'foo bar'" })
    })

    it('should not parse', function() {
      expect(string.parse('foo bar')).to.have.property('status').that.is.false
    })
  })

  describe('string1', function() {
    it('should parse', function() {
      expect(string1.parse('"foo bar"')).to.eql({ status: true, value: '"foo bar"' })
    })

    it('should not parse', function() {
      expect(string1.parse('foo bar'))  .to.have.property('status').that.is.false
      expect(string1.parse("'foo bar'")).to.have.property('status').that.is.false
    })
  })

  describe('string2', function() {
    it('should parse', function() {
      expect(string2.parse("'foo bar'")).to.eql({ status: true, value: "'foo bar'" })
    })

    it('should not parse', function() {
      expect(string2.parse('foo bar'))  .to.have.property('status').that.is.false
      expect(string2.parse('"foo bar"')).to.have.property('status').that.is.false
    })
  })
})

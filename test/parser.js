import { expect } from 'chai'
import { seq, alt, string } from 'parsimmon'
import { cat } from '../src/utils'
import { S, LPAREN, RPAREN, FUNCTION, IDENT } from '../src/tokens'
import { unused, any, selector, block, at_rule, value, property
       , declaration, declaration_list, ruleset, statement, stylesheet } from '../src/parser'

describe('Parsers', function() {
  describe('unused', function() {
    it('should parse', function() {
      expect(unused.parse('@foo')).to.eql({ status: true, value: '@foo' })
      expect(unused.parse(';   ')).to.eql({ status: true, value: ';   ' })
      expect(unused.parse('<!--')).to.eql({ status: true, value: '<!--' })
      expect(unused.parse('--> ')).to.eql({ status: true, value: '--> ' })
    })

    it('should not parse', function() {
      expect(unused.parse('foo')).to.have.property('status').that.is.false
    })
  })

  describe('any', function() {
    describe('paren', function() {
      before(function() {
        this.paren = seq(LPAREN, S.many().map(cat), alt(any, unused).many().map(cat), RPAREN).map(cat)
      })

      it('should parse', function() {
        expect(any.parse(':'))        .to.eql({ status: true, value: ':' })
        expect(any.parse('min-width')).to.eql({ status: true, value: 'min-width' })

        expect(this.paren.parse('(#)'))               .to.to.eql({ status: true, value: '(#)' })
        expect(this.paren.parse('(min-width: 120px)')).to.to.eql({ status: true, value: '(min-width: 120px)' })
      })

      it('should not parse', function() {
        expect(this.paren.parse('#')).to.have.property('status').that.is.false
        expect(this.paren.parse('^')).to.have.property('status').that.is.false
      })
    })

    describe('function', function() {
      before(function() {
        this.func = seq(FUNCTION, S.many().map(cat), alt(any, unused).many().map(cat), RPAREN).map(cat)
      })

      it('should parse', function() {
        expect(IDENT.parse('foo'))         .to.eql({ status: true, value: 'foo' })
        expect(FUNCTION.parse('foo('))     .to.eql({ status: true, value: 'foo(' })
        expect(this.func.parse('foo(bar)')).to.eql({ status: true, value: 'foo(bar)' })
      })

      it('should not parse', function() {
        expect(this.func.parse('#')).to.have.property('status').that.is.false
      })
    })

    describe('any', function() {
      it('should parse', function() {
        expect(any.parse('#'))       .to.eql({ status: true, value: '#' })
        expect(any.parse('(#)'))     .to.eql({ status: true, value: '(#)' })
        expect(any.parse('(foo(#))')).to.eql({ status: true, value: '(foo(#))' })
      })

      it('should not parse', function() {
        expect(any.parse('^^')).to.have.property('status').that.is.false
      })
    })
  })

  describe('selector', function() {
    it('should parse', function() {
      expect(selector.parse('foo#bar'))    .to.eql({ status: true, value: 'foo#bar' })
      expect(selector.parse('foo#bar.baz')).to.eql({ status: true, value: 'foo#bar.baz' })
    })

    it('should not parse', function() {
      expect(selector.parse('foo(')).to.have.property('status').that.is.false
    })
  })

  describe('block', function() {
    it('should parse', function() {
      expect(block.parse('{ color: blue }')) .to.eql({ status: true, value: '{ color: blue }' })
      expect(block.parse('{ color: blue; }')).to.eql({ status: true, value: '{ color: blue; }' })
      expect(block.parse('{ color: blue;\n  background-color: red; }'))
        .to.eql({ status: true, value: '{ color: blue;\n  background-color: red; }' })
    })

    it('should not parse', function() {
      expect(block.parse('color: blue;')).to.have.property('status').that.is.false
    })
  })

  describe('at_rule', function() {
    it('should parse', function() {
      expect(at_rule.parse('@media (min-height: 100px) { color: blue; }'))
        .to.eql({ status: true, value: '@media (min-height: 100px) { color: blue; }' })
      expect(at_rule.parse('@media screen and (min-height: 100px) { color: blue; }'))
        .to.eql({ status: true, value: '@media screen and (min-height: 100px) { color: blue; }' })
    }) 

    it('should not parse', function() {
      expect(at_rule.parse('media (min-height: 100px) { color: blue; }')).to.have.property('status').that.is.false
    })
  })

  describe('value', function() {
    it('should parse', function() {
      expect(value.parse('@media'))         .to.eql({ status: true, value: '@media' })
      expect(value.parse('(foo(#))'))       .to.eql({ status: true, value: '(foo(#))' })
      expect(value.parse('{ color: blue }')).to.eql({ status: true, value: '{ color: blue }' })
    })

    it('should not parse', function() {
      expect(value.parse('')).to.have.property('status').that.is.false
    })
  })

  describe('property', function() {
    it('should parse', function() {
      expect(property.parse('my_name'))  .to.eql({ status: true, value: 'my_name' })
      expect(property.parse('min-width')).to.eql({ status: true, value: 'min-width' })
    })

    it('should not parse', function() {
      expect(property.parse('0y_name')).to.have.property('status').that.is.false
    })
  })

  describe('declaration', function() {
    it('should parse', function() {
      expect(declaration.parse('color: blue'))          .to.eql({ status: true, value: {'color': 'blue'} })
      expect(declaration.parse('background-color: red')).to.eql({ status: true, value: {'background-color': 'red'} })
    })

    it('should not parse', function() {
      expect(declaration.parse('color'))       .to.have.property('status').that.is.false
      expect(declaration.parse('color: blue;')).to.have.property('status').that.is.false
    })
  })

  describe('declaration_list', function() {
    it('should parse', function() {
      expect(declaration_list.parse('color: blue;')).to.eql({ status: true, value: [{color: 'blue'}] })
      expect(declaration_list.parse('color: blue;\nbackground-color: red;'))
        .to.eql({ status: true, value: [{color: 'blue'}, {'background-color': 'red'}] })
    })

    it('should not parse', function() {
      expect(declaration_list.parse('color')).to.have.property('status').that.is.false
    })
  })

  describe('ruleset', function() {
    it('should parse', function() {
      expect(ruleset.parse('{ color: blue; }'))        .to.eql({ status: true, value: {'': [{ color: 'blue'}]} })
      expect(ruleset.parse('foo#bar { color: blue; }')).to.eql({ status: true, value: {'foo#bar': [{ color: 'blue' }]} })
    })

    it('should not parse', function() {
      expect(ruleset.parse('color: blue;')).to.have.property('status').that.is.false
    })
  })

  describe('statement', function() {
    it('should parse', function() {
      expect(statement.parse('foo#bar.baz {}')).to.eql({ status: true, value: {'foo#bar.baz': []} })
      expect(statement.parse('media (min-height: 100px) { color: blue; }'))
        .to.eql({ status: true, value: {'media (min-height: 100px)': [{ color: 'blue' }]} })
      expect(statement.parse('@media (min-height: 100px) { color: blue; }'))
        .to.eql({ status: true, value: {'@media (min-height: 100px)': [{ color: 'blue' }]} })
      expect(statement.parse('@media screen and (min-height: 100px) { color: blue; }'))
        .to.eql({ status: true, value: {'@media screen and (min-height: 100px)': [{ color: 'blue' }]} })
    })

    it('should not parse', function() {
      expect(statement.parse('foo#bar.baz')).to.have.property('status').that.is.false
    })
  })

  describe('stylesheet', function() {
    it('should parse', function() {
      expect(stylesheet.parse('img#banner { border: 1 px solid red; }'))
        .to.eql({ status: true, value: [{ 'img#banner': [{ border: '1 px solid red' }] }] })

      expect(stylesheet.parse('img#banner { border: 1 px solid red; }\nqux.norf { color: blue;\nbackground-color: red; }'))
        .to.eql({
          status: true,
          value: [ {'img#banner': [{ border: '1 px solid red' }]}
                 , {'qux.norf':   [{ 'color': 'blue' }, { 'background-color': 'red' }]} ]
        })
    })

    it('should not parse', function() {
      expect(stylesheet.parse('foo#bar.baz')).to.have.property('status').that.is.false
    })
  })
})

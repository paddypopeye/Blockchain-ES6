const Blockchain = require('./index')
const Block = require('./block')

describe('Blockchain', () => {
	let bc, bc2

	beforeEach(() => {
		bc = new Blockchain()
		bc2 = new Blockchain()
	})//end beforeEach

	it('starts with genesis block', () => {
		expect(bc.chain[0]).toEqual(Block.genesis())
	})//ends first unit test

	it('adds a new block', () => {
		const data = 'foo'
		bc.addBlock(data)
		expect(bc.chain[bc.chain.length-1].data).toEqual(data)
		})//end second unit test
	it('validates a valid chain', () => {
		bc2.addBlock('foo')
		expect(bc.isValidChain(bc2.chain)).toBe(true)
	})//end third unit test

	it('invalidates a chain with a corrupt genesis block', () => {
		bc2.chain[0].data = 'Bad data'
		expect(bc.isValidChain(bc2.chain)).toBe(false)
	})//end fourth unit test
	it('invalidates a corrupt chain', () => {
		bc2.addBlock('foo')
		bc2.chain[1].data = 'Not foo'
		expect(bc.isValidChain(bc2.chain)).toBe(false)
	})//end fifth unit test 

	it('Replaces the chain with the valid new cahin', () => {
		bc2.addBlock('goo')
		bc.replaceChain(bc2.chain)
		expect(bc.chain).toEqual(bc2.chain)
	})//end sixth unit test
	it('Does not replace the chain with one less than or equal to length', () => {
		bc.addBlock('foo')
		bc.replaceChain(bc2.chain)
		expect(bc.chain).not.toEqual(bc2.chain)
	})//end seventh unit test
})
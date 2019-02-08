const Block = require('./block')

describe('Block', () => {
	let data, lastBlock, block

	beforeEach(() => {
		data = 'foo'
		lastBlock =Block.genesis()
		block = Block.mineBlock(lastBlock,data)
	})//end beforeEach
	
	it('sets the `data` to match the input', () => {
		expect(block.data).toEqual(data)
	})//end first test

	it('sets the `lastHash` to match the hash of the last block', () => {
		expect(block.lastHash).toEqual(lastBlock.hash)
	})//end second test

	 it('Generates a hash that matches the difficulty',() => {
		expect(block.hash.substring(0,block.difficulty))
		.toEqual('0'.repeat(block.difficulty))
		console.log(block.toString())
	})//end third test

	it('lowers the difficulty level if the mine rate is too slow', () => {
		expect(Block.adjustDifficulty(block, block.timestamp+360000))
		.toEqual(block.difficulty-1)
	})///end fourth test

	it('raises the difficulty level if the mine rate is too fast', () => {
		expect(Block.adjustDifficulty(block, block.timestamp+1))
		.toEqual(block.difficulty+1)
	})///end fifth test
})//end describe
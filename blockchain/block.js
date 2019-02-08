const ChainUtil = require('../chain-utils')
const { DIFFICULTY, MINE_RATE } =  require('../config') 


class Block {
	constructor(timestamp,lastHash,hash,data,nonce,difficulty){
		this.timestamp = timestamp
		this.lastHash = lastHash
		this.hash = hash
		this.data = data
		this.nonce = nonce
		this.difficulty = difficulty || DIFFICULTY
	}

	toString(){
		return `Block --
		Timestamp : ${this.timestamp}
		Last Hash : ${this.lastHash.substring(0,10)}
		Hash      : ${this.hash.substring(0,10)}
		Nonce     : ${this.nonce}
		Difficulty: ${this.difficulty}
		Data      : ${this.data}`
	}//end constructor
	
	static genesis(){
		return new this('Genesis time', '-------', 'f1r57-h45h', [], 0, DIFFICULTY)

	}//end genesis
	
	static mineBlock(lastBlock, data){
		let hash, timestamp
		let { difficulty } = lastBlock
		let nonce = 0
		const lastHash = lastBlock.hash
		
		do{			
			nonce++
			timestamp = Date.now()
			difficulty = Block.adjustDifficulty(lastBlock, timestamp)
			hash = Block.hash(timestamp, lastHash, data, nonce, difficulty)
		}while (hash.substring(0, difficulty) !== '0'.repeat(difficulty))
		
		 return new this(timestamp, lastHash, hash, data, nonce, difficulty)
	}//end mineBlock

	static hash(timestamp,lastHash,data,nonce,difficulty){
		return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString()
	}//end hash

	static blockHash(block){
		const {timestamp, lastHash, data, nonce, difficulty} = block
		 return Block.hash(timestamp, lastHash, data, nonce, difficulty)
	}//end blockHash

	static adjustDifficulty(lastBlock,currentTime){
		let { difficulty } = lastBlock
		difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1
		return difficulty
	}//end adjustDifficulty
}//end class Block
module.exports = Block
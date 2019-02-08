const Block = require('./block')

class Blockchain{
	constructor(){
		this.chain = [Block.genesis()];
	}//end constructor

	addBlock(data){
		const block = Block.mineBlock(this.chain[this.chain.length-1], data)
		this.chain.push(block)
		
		return block
	}//end addBlock

	isValidChain(chain){
		if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false
		
		for(let i=1; i<chain.length; i++){
			const block = chain[i]
			const lastBlock = chain[i-1]
			
			if(block.lastHash  !== lastBlock.hash || block.hash !== Block.blockHash(block)){
				return false
			}//end if
		}//end if	
		return true		
	}//end isValidChain

	replaceChain(newChain){
		if(newChain.length <= this.chain.length){
			console.log('New chain is not longer than the current chain')
			return
		}//end if
		else if(!this.isValidChain(newChain)){
			console.log('The new chain is not valid')
			return
		}//end else if
		console.log('Replacing the current chain with the new chain')
		this.chain = newChain
	}//end replaceChain

}//end class Blockchain
module.exports = Blockchain
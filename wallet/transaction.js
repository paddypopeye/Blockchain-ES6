const ChainUtil = require('../chain-utils')
const { MINING_REWARD }  = require('../config')

class Transaction{
	constructor(){
		this.id = ChainUtil.id()
		this.input = null
		this.outputs = []
	}//end constructor
	
	update(senderWallet, recipient, amount){
		const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey)

		if(amount > senderOutput.amount){
			console.log(`Amount ${amount} exceeds your available balance`)
			return
		}//end if

		senderOutput.amount = senderOutput.amount - amount
		this.outputs.push({amount, address: recipient})
		Transaction.signTransaction(this, senderWallet)
		return this
	}//end update

	static transactionWithOutputs(senderWallet, outputs){		
		const transaction = new this()
		transaction.outputs.push(...outputs)//end push 
		Transaction.signTransaction(transaction, senderWallet)
		return transaction
	}//end transactionWithOutputs
  
	static newTransaction(senderWallet, recipient, amount){

		if (amount > senderWallet.balance){
			console.log(`Amount: ${amount} exceeds your balance.`)
			return
		}//end if
 
		return Transaction.transactionWithOutputs(
			senderWallet,
			[{
			amount: senderWallet.balance - amount,
			address:senderWallet.publicKey
			},	
			{
			amount, 
			address:recipient
			}])//end transactionWithOutputs		
		}//end  newTransaction()

	static rewardTransaction(minerWallet, blockchainWallet){
		return Transaction.transactionWithOutputs(blockchainWallet, [
		{
			amount: MINING_REWARD, 
			address: minerWallet.publicKey
		}
	])//end transactionWithOutputs
	}//end rewardTransaction
	
	static signTransaction(transaction, senderWallet){
		transaction.input ={
			timestamp: Date.now(),
			amount: senderWallet.balance,
			address: senderWallet.publicKey,
			signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
		}
	}//end signTransaction
	
	static verifyTransaction(transaction){
		return ChainUtil.verifySignature(
			transaction.input.address,
			transaction.input.signature,
			ChainUtil.hash(transaction.outputs)
			)//end verifyTransaction
		}//end verifyTransaction
}//end class Transaction

module.exports = Transaction
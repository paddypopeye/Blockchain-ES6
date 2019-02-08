const ChainUtil = require('../chain-utils')

class Transaction{
	constructor(){
	this.id = ChainUtil.id()
	this.input = null
	this.outputs  = []
	}//end constructor

	static newTransaction(senderWallet, recipient, amount){
		const transaction = new this()
		if(amount > senderWallet.balance){
			console.log(`Amount: ${amount} exceeds your current balance`)
			return 
		}//end if 
		tranaction.outputs.push(...[
			{ amount: senderWallet.balance - amount, address: senderWallet.publicKey },
			{ amount, address: recipient}
			])//end push
		return tranaction
		}//end newTransaction
	}//end class

module.exports = Transaction
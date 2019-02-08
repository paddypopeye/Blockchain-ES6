const ChainUtil = require('../chain-utils')
const Transaction = require('./transaction')
const { INITIAL_BALANCE }  = require('../config')

class Wallet{
	constructor(){
		this.balance = INITIAL_BALANCE
		this.keyPair = ChainUtil.genKeyPair()
		this.publicKey = this.keyPair.getPublic().encode('hex')
	}//end constructor

	toString(){
		return `WALLET ---
		publicKey: ${this.publicKey.toString()}
		balance  : ${this.balance}`
	}//end toString

	sign(dataHash){
		return this.keyPair.sign(dataHash)
	}//end sign

	createTransaction(recipient, amount, blockchain, transactionPool){
		this.balance = this.calculateBalance(blockchain)
		if(amount > this.balance){
			console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`)
			return 
		}//end if 

		
		let transaction = transactionPool.existingTransaction(this.publicKey)
		if(transaction){
			transaction.update(this, recipient, amount)
		}else{
			transaction = Transaction.newTransaction(this, recipient, amount)
			transactionPool.updateOrAddTransaction(transaction)
		}//end if/else
		return transaction
	}//end createTransaction

	calculateBalance(blockchain){
		let balance = this.balance
		let transactions = []
		
		blockchain.chain.forEach(
			block => block.data.forEach(transaction => {
				transactions.push(transaction)
		}))//end forEach

		const walletInputTs = transactions
		.filter(transaction => transaction.input.address === this.publicKey)
		
		let startTime = 0

		if(walletInputTs.length > 0){
		const recentInputT = walletInputTs.reduce(
		(prev, current) => 
		prev.input.timestamp > current.input.timestamp ? 
		prev : current
			)//end reduce
		
		balance = recentInputT.outputs.find(
			output => output.address === this.publicKey).amount 
		startTime = recentInputT.input.timestamp
		}//end if
		transactions.forEach(transaction => {
			if(transaction.input.timestamp > startTime){
					transaction.outputs.find(output => {
						if(output.address === this.publicKey){
							balance += output.amount
						}//end if
					})//end find()
				}//end if
			})//end forEach	
			return balance	
		}//end calculateBalance

	static blockchainWallet(){
		const blockchainWallet = new this()
		blockchainWallet.address = 'blockchain-wallet'
		return blockchainWallet
	}//end blockchainWallet	
}//end class
module.exports = Wallet
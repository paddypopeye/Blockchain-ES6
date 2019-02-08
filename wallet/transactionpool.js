const Transaction = require('../wallet/transaction')

class TransactionPool{
	constructor(){
		this.transactions = []
	}//end contstructor
	updateOrAddTransaction(transaction){
		let transactionWithId = this.transactions.find(t => t.id === transaction.id)
		if(transactionWithId){
			this.transactions[this.transactions.indexOf(transactionWithId)] = transaction
		}else{
			this.transactions.push(transaction)
		}
	}//end addOrUpdateTransaction
	existingTransaction(address){
		return this.transactions.find(t => t.input.address === address) 
	}//end existingTransaction
	validTransactions(){
		return this.transactions.filter(transaction => {
			const outputTotal = transaction.outputs.reduce((total, output) => {
				return total + output.amount
			},0)//end reduce
			if(transaction.input.amount !== outputTotal){
				console.log(`Invalid transaction from ${transaction.input.address}`)
				return
			}//end if
			if(!Transaction.verifyTransaction(transaction)){
				console.log(`Invalid signature received from ${transaction.input.address}`)
				return
			}//end if
			return transaction
		})//end filter()
	}//end validTransactions
	
	clear(){

		this.transactions = []
	}//end clear
}//end class 
module.exports = TransactionPool
const TransactionPool = require('./transactionpool')
const Transaction = require('./transaction')
const Wallet = require('./index')
const Blockchain = require('../blockchain')

describe('TransactionPool', () => {
	let tp, wallet, transaction, bc
	beforeEach(() => {
		tp = new TransactionPool()
		wallet = new Wallet()
		bc =  new Blockchain()
		transaction = wallet.createTransaction('r4nd-4ddr355', 30, bc, tp)
		
	})//end beforeEach
	it('Adds a transaction to the pool', () => {
		expect(tp.transactions.find(t => t.id === transaction.id))
		.toEqual(transaction)
	})//end first test
	it('Updates a transaction in the pool', () => {
		const oldTransaction = JSON.stringify(transaction)
		const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40)		

		expect(JSON.stringify(tp.transactions
			.find(t => t.id === newTransaction.id)))
		.not.toEqual(oldTransaction)
	})//end second test

	it('clears transactions', () => {
		tp.clear()
		expect(tp.transactions).toEqual([])
	})//end third it

	describe("mixing valid and corrupt transaction", () => {
		let validTransactions
		beforeEach(() => {
			validTransactions = [...tp.transactions]
			for(let i=0; i<6; i++ ){
				wallet = new Wallet
				transaction = wallet.createTransaction('r4nd-addr355', 30, bc, tp) 
				if(i%2 == 0){
					transaction.input.amount = 999999999999	
				}//end if
				else{
					validTransactions.push(transaction)
					console.log(`Pushed ${transaction} to the array`)
				}//end else
			}//end for
		})//end beforeEach 
		it('shows a difference between valid and corrupt transactions', () => {
			expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions))
		})//end 1st test
		it('gets valid transactions', () => {
			expect(tp.validTransactions()).toEqual(validTransactions)
		})//end 2nd test
	})//end 2nd describe
})//end describe
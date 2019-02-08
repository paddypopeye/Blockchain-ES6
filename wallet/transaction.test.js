const Transaction = require('./transaction')
const Wallet = require('./index')
const { MINING_REWARD } = require('../config')

describe('Transaction', () => {
	let transaction, wallet, recipient, amount
	beforeEach(() => {
		wallet = new Wallet
		amount = 50
		recipient = 'r3c1p13nt'
		transaction = Transaction.newTransaction(wallet, recipient, amount)
	})//end beforeEach
	it('outputs the `amount` subtracted from the wallet balance', () => {
		expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
		.toEqual(wallet.balance - amount)
	})//end first unit test

	it('outputs the `amount` added to the recipient', () => {
		expect(transaction.outputs.find(output => output.address === recipient).amount)
		.toEqual(amount)
	})//end second unit test

	it('inputs the balance of the wallet', () => {
		expect(transaction.input.amount)
		.toEqual(wallet.balance)
	})//end third unit test
	
	it('validates a valid transaction', () => {
		expect(Transaction.verifyTransaction(transaction))
		.toBe(true)
	})//end fourth ubnit test
	it('invalidates a corrupt transaction', () => {
		transaction.outputs[0].amount = 50000000000
		expect(Transaction.verifyTransaction(transaction))
		.toBe(false)
	})//end fifth unit test

	describe('transaction with an amount that exceeds balance', () => {
		beforeEach(() => {
			amount = 50000000000000
			transaction = Transaction.newTransaction(wallet,recipient,amount)
		})
		it('does not create the transaction', () => {
			expect(transaction).toEqual(undefined)
		})//end it()

	})//end 2nd describe
	
	describe('updating a transaction', () => {
		let nextAmount, nextRecipient

		beforeEach(() => {
			nextAmount = 20
			nextRecipient = 'n3xt-4ddr355'
			transaction = transaction.update(wallet, nextRecipient, nextAmount)
		})//end beforeEach
	
	it(`Subtracts the next amount from the sender's output`, () => {
		expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
		.toEqual(wallet.balance - amount - nextAmount)
		})//end it()
	
	it('outputs an amount for the next recipient', () => {
		expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
		.toEqual(nextAmount)
		})//end it()
	})//end  3rd describe

	describe('creating a reward transaction', () => {
		beforeEach(() => {	
			transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet())
		})//end beforeEach

		it('rewards the miners wallet', () => {
			expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
			.toEqual(MINING_REWARD)
		})//end it()
	})//end 4th describe
})//end describe

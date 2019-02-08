const Wallet = require('./index')
const TransactionPool = require('./transactionpool')
const Blockchain = require('../blockchain')
const { INITIAL_BALANCE } = require('../config')
describe('Wallet', () => {
	let wallet, tp, bc

	beforeEach(() => {
		wallet = new Wallet()
		tp = new TransactionPool()
		bc = new Blockchain()
	})//end beforeEach
	describe('creating a transaction', () => {
		let transaction, sendAmount, recipient
		beforeEach(() => {
			sendAmount = 50
			recipient = 'r4nd0m-4ddr355'
			transaction = wallet.createTransaction(recipient, sendAmount, bc, tp)
		})//end beforeEach

	describe('and doing the same transaction', () => {
    beforeEach(() => {
      wallet.createTransaction(recipient, sendAmount, bc, tp);
    })

    it('doubles the `sendAmount` subtracted from the wallet balance', () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - sendAmount * 2);
    })

    it('clones the `sendAmount` output for the recipient', () => {
      expect(transaction.outputs.filter(output => output.address === recipient)
        .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
    })
    
	})//end 3rd describe
})//end 2nd describe


describe('calculating a balance', () => {
	let addBalance, repeatAdd, senderWallet

	beforeEach(() => {
		senderWallet = new Wallet()
		addBalance = 100
		repeatAdd = 3

		for(i=0; i<repeatAdd; i++){
			senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp)
		}//end for
		bc.addBlock(tp.transactions)
	})//end beforeEach

	it('calculates the balance for the blockchain transactions matching the recipient', ()=>{
		expect(wallet.calculateBalance(bc))
		.toEqual(INITIAL_BALANCE + (addBalance*repeatAdd)) 
	})//end it()

	it('calculates the balance for the blockchain transactions matching the sender', ()=>{
		expect(senderWallet.calculateBalance(bc))
		.toEqual(INITIAL_BALANCE - (addBalance*repeatAdd)) 
	})//end it()

	describe('the recipient conducts a transaction', () => {
		let subtractBalance, recipientBalance

		beforeEach(() => {
			tp.clear()
			subtractBalance = 60
			recipientBalance = 	wallet.calculateBalance(bc)	
			wallet.createTransaction(senderWallet.publicKey, subtractBalance, bc, tp)
			bc.addBlock(tp.transactions)		
		})//end beforeEach

		describe('sender sends another transaction to the recipient', () => {
			beforeEach(() => {
				tp.clear()
				senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp)
				bc.addBlock(tp.transactions)
			})//end beforeEach
			it('calculates the recipient balance with transactions since most recent transaction', () => {
				expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractBalance + addBalance)
			})
		})
	})//end describe
})//end describe
})//end 1st describe
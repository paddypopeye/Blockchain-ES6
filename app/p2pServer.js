const Websocket = require('ws')
const P2P_PORT = process.env.P2P_PORT || 5001
const peers  = process.env.PEERS ? process.env.PEERS.split(','):[]
const MESSAGE_TYPES = {
	chain: 'CHAIN',
	transaction: 'TRANSACTION',
	clear_transactions: 'CLEAR_TRANSACTIONS'
}

class P2pServer{
	constructor(blockchain, transactionPool){
		this.blockchain = blockchain
		this.transactionPool = transactionPool
		this.sockets = []
	}//end constructor

	listen(){
		const server = new Websocket.Server({port: P2P_PORT})
		server.on('connection', socket => this.connectSocket(socket))
		this.connectToPeers()
		console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`)
	}//end listen
	
	connectSocket(socket){
		this.sockets.push(socket)
		console.log('Socket connected')

		this.messageHandler(socket)
		this.sendChain(socket)
	}//end connectSocket
	
	connectToPeers(){
		peers.forEach(peer => {			
			const socket = new Websocket(peer)
			socket.on('open', () => this.connectSocket(socket))
		})//end forEach
	}//end connectToPeers

	messageHandler(socket){
		socket.on('message', message => {
			const data = JSON.parse(message)
			switch(data.type){
				case MESSAGE_TYPES.chain:
				this.blockchain.replaceChain(data.chain)
				break

				case MESSAGE_TYPES.transaction:
				this.transactionPool.updateOrAddTransaction(data.transaction)
				break

				case MESSAGE_TYPES.clear_transactions:
				this.transactionPool.clear()
				break
			}//end switch
		})//event handler
	}//end messageHandler

	sendChain(socket){
		socket.send(JSON.stringify({
			type: MESSAGE_TYPES.chain,
			chain: this.blockchain.chain
		}))//end send
	}//end sencSocket

	sendTransaction(socket, transaction){
		socket.send(JSON.stringify({
			type: MESSAGE_TYPES.transaction,
			transaction
		}))//end send
	}//end  sendTransaction

	syncChains(){
		this.sockets.forEach(socket => this.sendChain(socket))
	}//end syncChain

	broadcastTransaction(transaction){
		this.sockets.forEach(socket => this.sendTransaction(socket, transaction))
	}/// end broadcastTransaction

	broadcastClearTransactions(){
		this.sockets.forEach(socket => socket.send(JSON.stringify({
			type: MESSAGE_TYPES.clear_transactions
		})))
	}/// end broadcastClearTransaction
}//end class

module.exports = P2pServer
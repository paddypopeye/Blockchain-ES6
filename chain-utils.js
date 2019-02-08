const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const SHA256 = require('crypto-js/sha256')
const uuidV1 = require('uuid/v1')

class ChainUtil{
	static genKeyPair(){
		return ec.genKeyPair()
	}//end genKeyPair
	static id(){
		return uuidV1()
	}//end id()
	static hash(data){
		return SHA256(JSON.stringify(data)).toString()
	}
	static verifySignature(publicKey,signature,dataHash){
		return ec.keyFromPublic(publicKey,'hex')
		.verify(dataHash, signature)
	}//end verifySignature

}//end class

module.exports = ChainUtil
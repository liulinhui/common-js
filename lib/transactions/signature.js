var crypto = require("./crypto.js")
var slots = require("../time/slots.js")
var options = require('../options')

function newSignature(witnessSecret) {
	var keys = crypto.getKeys(witnessSecret);

    return {
		publicKey: keys.publicKey
	};
}

function createSignature(secret, witnessSecret) {
	var keys = crypto.getKeys(secret);

	var signature = newSignature(witnessSecret);
	var transaction = {
		type: 1,
		recipientId: null,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime() - options.get('clientDriftSeconds'),
		asset: {
			signature: signature
		}
	};

	crypto.sign(transaction, keys);
	transaction.id = crypto.getId(transaction);

	return transaction;
}

module.exports = {
	createSignature: createSignature
}

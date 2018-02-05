var crypto = require("./crypto.js")
var slots = require("../time/slots.js")
var options = require('../options')

function createTransaction(recipientId, message, secret, witnessSecret) {
    var transaction = {
        type: 0,
        recipientId: recipientId,
        message: message,
        timestamp: slots.getTime() - options.get('clientDriftSeconds'),
        asset: {}
    };

    var keys = crypto.getKeys(secret);
    transaction.senderPublicKey = keys.publicKey;

    crypto.sign(transaction, keys);

    if (witnessSecret) {
        var secondKeys = crypto.getKeys(witnessSecret);
        transaction['witnessId'] = crypto.getAddress(secondKeys.publicKey);
        crypto.secondSign(transaction, secondKeys);
    }

    transaction.id = crypto.getId(transaction);
    return transaction;
}

module.exports = {
    createTransaction: createTransaction
}
var crypto = require("./crypto.js")
var slots = require("../time/slots.js")
var options = require('../options')

function calculateFee(amount) {
    return 0
}

function createTransaction(recipientId, amount, message, secret, delegateSecret) {
    var transaction = {
        type: 0,
        amount: amount,
        recipientId: recipientId,
        message: message,
        timestamp: slots.getTime() - options.get('clientDriftSeconds'),
        asset: {}
    };

    var keys = crypto.getKeys(secret);
    transaction.senderPublicKey = keys.publicKey;

    crypto.sign(transaction, keys);

    if (delegateSecret) {
        var secondKeys = crypto.getKeys(delegateSecret);
        transaction['delegateId'] = crypto.getAddress(secondKeys.publicKey);
        crypto.secondSign(transaction, secondKeys);
    }

    transaction.id = crypto.getId(transaction);
    return transaction;
}

module.exports = {
    createTransaction: createTransaction,
    calculateFee: calculateFee
}
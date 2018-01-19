var crypto = require("./crypto.js")
var constants = require("../constants.js")
var slots = require("../time/slots.js")
var options = require('../options')

function calculateFee(amount) {
    var min = constants.fees.send;
    var fee = parseFloat((amount * 0.0001).toFixed(0));
    return fee < min ? min : fee;
}

function createTransaction(recipientId, amount, message, secret, delegateSecret) {
    var transaction = {
        type: 0,
        amount: amount,
        fee: constants.fees.send,
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
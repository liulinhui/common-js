var crypto = require("./crypto.js")
var slots = require("../time/slots.js")
var options = require('../options')

function createInTransfer(dappId, currency, amount, secret, witnessSecret) {
    var keys = crypto.getKeys(secret);

    var transaction = {
        type: 6,
        recipientId: null,
        senderPublicKey: keys.publicKey,
        timestamp: slots.getTime() - options.get('clientDriftSeconds'),
        asset: {
            inTransfer: {
                dappId: dappId,
                currency: currency
            }
        }
    };

    if (currency === 'XAS') {
        transaction.amount = Number(amount)
    } else {
        transaction.asset.inTransfer.amount = String(amount)
    }

    crypto.sign(transaction, keys);

    if (witnessSecret) {
        var secondKeys = crypto.getKeys(witnessSecret);
        transaction['witnessId'] = crypto.getAddress(secondKeys.publicKey);
        crypto.secondSign(transaction, secondKeys);
    }

    transaction.id = crypto.getId(transaction);
    return transaction;
}

function createOutTransfer(recipientId, dappId, transactionId, currency, amount, secret, witnessSecret) {
    var keys = crypto.getKeys(secret);

    var transaction = {
        type: 7,
        recipientId: recipientId,
        senderPublicKey: keys.publicKey,
        timestamp: slots.getTime() - options.get('clientDriftSeconds'),
        asset: {
            outTransfer: {
                dappId: dappId,
                transactionId: transactionId,
                currency: currency,
                amount: amount
            }
        }
    };

    crypto.sign(transaction, keys);

    if (witnessSecret) {
        var secondKeys = crypto.getKeys(witnessSecret);
        transaction['witnessId'] = crypto.getAddress(secondKeys.publicKey);
        crypto.secondSign(transaction, secondKeys);
    }

    transaction.id = crypto.getId(transaction);
    return transaction;
}

function signOutTransfer(transaction, secret) {
    var keys = crypto.getKeys(secret);
    return crypto.sign(transaction, keys);
}

module.exports = {
    createInTransfer: createInTransfer,
    createOutTransfer: createOutTransfer,
    signOutTransfer: signOutTransfer
}
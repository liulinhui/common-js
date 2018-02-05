var crypto = require("./crypto.js")
var slots = require("../time/slots.js")
var options = require('../options')

function createDelegate(username, secret, delegateSecret) {
    var keys = crypto.getKeys(secret);

    var transaction = {
        type: 2,
        recipientId: null,
        senderPublicKey: keys.publicKey,
        timestamp: slots.getTime() - options.get('clientDriftSeconds'),
        asset: {
            delegate: {
                username: username,
                publicKey: keys.publicKey
            }
        }
    };

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
    createDelegate: createDelegate
}

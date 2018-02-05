var crypto = require("./crypto.js")
var slots = require("../time/slots.js")
var options = require('../options')

function createVote(keyList, secret) {
    var keys = crypto.getKeys(secret);

    var transaction = {
        type: 3,
        recipientId: null,
        senderPublicKey: keys.publicKey,
        timestamp: slots.getTime() - options.get('clientDriftSeconds'),
        asset: {
            vote: {
                votes: keyList
            }
        }
    };

    crypto.sign(transaction, keys);

    transaction.id = crypto.getId(transaction);

    return transaction;
}

module.exports = {
    createVote: createVote
}

var crypto = require("./crypto.js")
var slots = require("../time/slots.js")
var options = require('../options')

/**
 *
 * @param username
 * @param secret 创世账号
 * @returns {{type: number, recipientId: null, senderPublicKey: *, timestamp: number, asset: {delegate: {username: *, publicKey: *}}}}
 */
function createDelegate(username, secret) {
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

    transaction.id = crypto.getId(transaction);
    return transaction;
}

module.exports = {
    createDelegate: createDelegate
}

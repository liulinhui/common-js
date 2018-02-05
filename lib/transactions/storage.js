var ByteBuffer = require('bytebuffer')
var crypto = require("./crypto.js")
var slots = require("../time/slots.js")
var options = require('../options')

function createStorage(content, secret, delegateSecret) {
    var keys = crypto.getKeys(secret)
    var bytes = null
    try {
        bytes = crypto.toLocalBuffer(ByteBuffer.fromHex(content))
    } catch (e) {
        throw new Error('Content must be hex format')
    }
    if (!bytes || bytes.length === 0) {
        throw new Error('Invalid content format')
    }

    var transaction = {
        type: 8,
        amount: 0,
        recipientId: null,
        senderPublicKey: keys.publicKey,
        timestamp: slots.getTime() - options.get('clientDriftSeconds'),
        asset: {
            storage: {
                content: content
            }
        },
        __assetBytes__: bytes
    }

    crypto.sign(transaction, keys)

    if (delegateSecret) {
        var secondKeys = crypto.getKeys(delegateSecret);
        transaction['delegateId'] = crypto.getAddress(secondKeys.publicKey);
        crypto.secondSign(transaction, secondKeys)
    }
    delete transaction.__assetBytes__
    transaction.id = crypto.getId(transaction)
    return transaction
}

module.exports = {
    createStorage: createStorage
}

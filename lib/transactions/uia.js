var crypto = require("./crypto.js")
var slots = require("../time/slots.js")
var options = require('../options')

function getClientFixedTime() {
    return slots.getTime() - options.get('clientDriftSeconds')
}

function createTransaction(asset, type, recipientId, message, secret, delegateSecret) {
    var keys = crypto.getKeys(secret)

    var transaction = {
        type: type,
        amount: 0,
        recipientId: recipientId,
        senderPublicKey: keys.publicKey,
        timestamp: getClientFixedTime(),
        message: message,
        asset: asset
    }

    crypto.sign(transaction, keys)

    if (delegateSecret) {
        var secondKeys = crypto.getKeys(delegateSecret)
        transaction['delegateId'] = crypto.getAddress(secondKeys.publicKey);
        crypto.secondSign(transaction, secondKeys)
    }

    transaction.id = crypto.getId(transaction)

    return transaction
}

module.exports = {
    createIssuer: function (name, desc, secret, delegateSecret) {
        var asset = {
            uiaIssuer: {
                name: name,
                desc: desc
            }
        }
        return createTransaction(asset, 9, null, null, secret, delegateSecret)
    },

    createAsset: function (name, desc, maximum, precision, strategy, allowWriteoff, allowWhitelist, allowBlacklist, secret, delegateSecret) {
        var asset = {
            uiaAsset: {
                name: name,
                desc: desc,
                maximum: maximum,
                precision: precision,
                strategy: strategy,
                allowBlacklist: allowBlacklist,
                allowWhitelist: allowWhitelist,
                allowWriteoff: allowWriteoff
            }
        }
        return createTransaction(asset, 10, null, null, secret, delegateSecret)
    },

    createFlags: function (currency, flagType, flag, secret, delegateSecret) {
        var asset = {
            uiaFlags: {
                currency: currency,
                flagType: flagType,
                flag: flag
            }
        }
        return createTransaction(asset, 11, null, null, secret, delegateSecret)
    },

    createAcl: function (currency, operator, flag, list, secret, delegateSecret) {
        var asset = {
            uiaAcl: {
                currency: currency,
                operator: operator,
                flag: flag,
                list: list
            }
        }
        return createTransaction(asset, 12, null, null, secret, delegateSecret)
    },

    createIssue: function (currency, amount, secret, delegateSecret) {
        var asset = {
            uiaIssue: {
                currency: currency,
                amount: amount
            }
        }
        return createTransaction(asset, 13, null, null, secret, delegateSecret)
    },

    createTransfer: function (currency, amount, recipientId, message, secret, delegateSecret) {
        var asset = {
            uiaTransfer: {
                currency: currency,
                amount: amount
            }
        }
        return createTransaction(asset, 14, recipientId, message, secret, delegateSecret)
    },
}

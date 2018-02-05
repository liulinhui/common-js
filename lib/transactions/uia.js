var crypto = require("./crypto.js")
var slots = require("../time/slots.js")
var options = require('../options')

function getClientFixedTime() {
    return slots.getTime() - options.get('clientDriftSeconds')
}

function createTransaction(asset, type, recipientId, message, secret, witnessSecret) {
    var keys = crypto.getKeys(secret)

    var transaction = {
        type: type,
        recipientId: recipientId,
        senderPublicKey: keys.publicKey,
        timestamp: getClientFixedTime(),
        message: message,
        asset: asset
    }

    crypto.sign(transaction, keys)

    if (witnessSecret) {
        var secondKeys = crypto.getKeys(witnessSecret)
        transaction['witnessId'] = crypto.getAddress(secondKeys.publicKey);
        crypto.secondSign(transaction, secondKeys)
    }

    transaction.id = crypto.getId(transaction)

    return transaction
}

module.exports = {
    createIssuer: function (name, desc, secret, witnessSecret) {
        var asset = {
            uiaIssuer: {
                name: name,
                desc: desc
            }
        }
        return createTransaction(asset, 9, null, null, secret, witnessSecret)
    },

    createAsset: function (name, desc, maximum, precision, strategy, allowWriteoff, allowWhitelist, allowBlacklist, secret, witnessSecret) {
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
        return createTransaction(asset, 10, null, null, secret, witnessSecret)
    },

    createFlags: function (currency, flagType, flag, secret, witnessSecret) {
        var asset = {
            uiaFlags: {
                currency: currency,
                flagType: flagType,
                flag: flag
            }
        }
        return createTransaction(asset, 11, null, null, secret, witnessSecret)
    },

    createAcl: function (currency, operator, flag, list, secret, witnessSecret) {
        var asset = {
            uiaAcl: {
                currency: currency,
                operator: operator,
                flag: flag,
                list: list
            }
        }
        return createTransaction(asset, 12, null, null, secret, witnessSecret)
    },

    createIssue: function (currency, amount, secret, witnessSecret) {
        var asset = {
            uiaIssue: {
                currency: currency,
                amount: amount
            }
        }
        return createTransaction(asset, 13, null, null, secret, witnessSecret)
    },

    createTransfer: function (currency, amount, recipientId, message, secret, witnessSecret) {
        var asset = {
            uiaTransfer: {
                currency: currency,
                amount: amount
            }
        }
        return createTransaction(asset, 14, recipientId, message, secret, witnessSecret)
    },
}

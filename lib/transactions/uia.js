var ByteBuffer = require('bytebuffer')
var crypto = require("./crypto.js")
var constants = require("../constants.js")
var slots = require("../time/slots.js")
var options = require('../options')

function getClientFixedTime() {
    return slots.getTime() - options.get('clientDriftSeconds')
}

function createTransaction(asset, fee, type, recipientId, message, secret, delegateSecret) {
    var keys = crypto.getKeys(secret)

    var transaction = {
        type: type,
        amount: 0,
        fee: fee,
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
        //var fee = (100 + (Math.floor(bytes.length / 200) + 1) * 0.1) * constants.coin
        var fee = 100 * constants.coin
        return createTransaction(asset, fee, 9, null, null, secret, delegateSecret)
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
        var fee = 500 * constants.coin
        return createTransaction(asset, fee, 10, null, null, secret, delegateSecret)
    },

    createFlags: function (currency, flagType, flag, secret, delegateSecret) {
        var asset = {
            uiaFlags: {
                currency: currency,
                flagType: flagType,
                flag: flag
            }
        }
        var fee = 0.1 * constants.coin
        return createTransaction(asset, fee, 11, null, null, secret, delegateSecret)
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
        var fee = 0.2 * constants.coin
        return createTransaction(asset, fee, 12, null, null, secret, delegateSecret)
    },

    createIssue: function (currency, amount, secret, delegateSecret) {
        var asset = {
            uiaIssue: {
                currency: currency,
                amount: amount
            }
        }
        var fee = 0.1 * constants.coin
        return createTransaction(asset, fee, 13, null, null, secret, delegateSecret)
    },

    createTransfer: function (currency, amount, recipientId, message, secret, delegateSecret) {
        var asset = {
            uiaTransfer: {
                currency: currency,
                amount: amount
            }
        }
        var fee = 0.1 * constants.coin
        return createTransaction(asset, fee, 14, recipientId, message, secret, delegateSecret)
    },
}

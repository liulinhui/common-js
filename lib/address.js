var sha256 = require('fast-sha256');
var RIPEMD160 = require('ripemd160');
var base58check = require('./base58check');

const NORMAL_PREFIX = 'SG'; // A

module.exports = {
    isAddress: function (address) {
        return this.isBase58CheckAddress(address)
    },

    isBase58CheckAddress: function (address) {
        if (typeof address !== 'string') {
            return false
        }
        if (!base58check.decodeUnsafe(address.slice(1))) {
            return false
        }
        return [NORMAL_PREFIX].indexOf(address[0]) !== -1;

    },

    generateBase58CheckAddress: function (publicKey) {
        if (typeof publicKey === 'string') {
            publicKey = Buffer.from(publicKey, 'hex')
        }
        var h1 = sha256.hash(publicKey);
        var h2 = new RIPEMD160().update(Buffer.from(h1)).digest();
        return NORMAL_PREFIX + base58check.encode(h2)
    }
};
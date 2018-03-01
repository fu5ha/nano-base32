/* globals describe it */
const assert = require('assert')
const nanoBase32 = require('./')
const hexToArrayBuffer = require('hex-to-array-buffer')
const arrayBufferToHex = require('array-buffer-to-hex')
const blake = require('blakejs')

var testCases = [
  ['0D7471E5D11FADDCE5315C97B23B464184AFA8C4C396DCF219696B2682D0ADF6', 'xrb_15dng9kx49xfumkm4q6qpaxneie6oynebiwpums3ktdd6t3f3dhp69nxgb38'],
  ['C3ADAAC0EA7A4ACD19213BD7BEFE8038A1BD9ECB7200BEC139A46AF8B27C7A47', 'xrb_3ixfod1gnykcsnek4gyqquza1g73qphepwi1qu1mmb5cz4s9ryk93r4ruus1'],
  ['7D603088CFB055789FDE786BE3770630282686A076DAB0C94B0E524205633FE2', 'xrb_1zd1846eze4oh4hxwy5dwfuiee3a6t5c1xptp56np5kkaa4p8hz49g3xouuf']
]

describe('nanoBase32', function () {
  testCases.forEach(function (testCase) {
    const pubKey = testCase[0]
    var buffer = new Uint8Array(hexToArrayBuffer(pubKey))
    var encoded = nanoBase32.encode(buffer)
    var checksum = blake.blake2b(buffer, null, 5).reverse()
    console.log(checksum)
    var checksumEncoded = nanoBase32.encode(checksum)
    const address = `xrb_${encoded}${checksumEncoded}`
    var decoded = nanoBase32.decode(encoded)
    var decodedChecksum = nanoBase32.decode(checksumEncoded)
    describe(`with test case: ${testCase[0]}, ${testCase[1]}`, function () {
      describe('.encode()', function () {
        it('should encode 32 byte hex key with proper padding', function () {
          assert.equal(encoded, testCase[1].substr(4, 52))
        })
        it('should encode 5 byte checksum key with no padding', function () {
          assert.equal(checksumEncoded, testCase[1].substring(56))
        })
        it('should encode public key properly', function () {
          assert.equal(address, testCase[1])
        })
      })
      describe('.decode()', function () {
        it('should decode padded 52 character key into hex with no padding', function () {
          assert.equal(arrayBufferToHex(decoded.buffer).toUpperCase(), pubKey)
        })
        it('should decode non-padded 8 character checksum key with no padding', function () {
          assert.equal(arrayBufferToHex(decodedChecksum.buffer), arrayBufferToHex(checksum))
        })
      })
    })
  })
})

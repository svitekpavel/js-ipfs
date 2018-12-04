/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

const ncp = require('ncp').ncp
const rimraf = require('rimraf')
const waterfall = require('async/waterfall')
const path = require('path')

const isWindows = require('../utils/platforms').isWindows
const skipOnWindows = isWindows() ? describe.skip : describe

const DaemonFactory = require('ipfsd-ctl')
const df = DaemonFactory.create({ exec: 'src/cli/bin.js' })

skipOnWindows('id endpoint', () => {
  const repoExample = path.join(__dirname, '../fixtures/go-ipfs-repo')
  const repoPath = path.join(__dirname, '../repo-tests-run')

  let ipfs = null
  let ipfsd = null
  before(function (done) {
    this.timeout(20 * 1000)

    ncp(repoExample, repoPath, (err) => {
      expect(err).to.not.exist()

      waterfall([
        (cb) => df.spawn({
          repoPath: repoPath,
          initOptions: { bits: 512 },
          config: { Bootstrap: [] },
          disposable: false,
          start: true
        }, cb),
        (_ipfsd, cb) => {
          ipfsd = _ipfsd
          ipfsd.start(cb)
        }
      ], (err) => {
        expect(err).to.not.exist()
        ipfs = ipfsd.api
        done()
      })
    })
  })

  after((done) => {
    rimraf(repoPath, (err) => {
      expect(err).to.not.exist()
      ipfsd.stop(done)
    })
  })

  describe('.id', () => {
    it('get the identity', (done) => {
      ipfs.id((err, result) => {
        expect(err).to.not.exist()
        expect(result.id).to.equal(idResult.ID)
        expect(result.publicKey).to.equal(idResult.PublicKey)
        const agentComponents = result.agentVersion.split('/')
        expect(agentComponents).lengthOf.above(1)
        expect(agentComponents[0]).to.equal(idResult.AgentVersion)
        expect(result.protocolVersion).to.equal(idResult.ProtocolVersion)
        done()
      })
    })
  })
})

const idResult = {
  ID: 'QmYvQVFDHUviWGYYJn3Tn4bntW648bPv4drAuwUDBS9Hsb',
  PublicKey: 'CAASpgIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDFP8jqHZtp8IAyHpq3Y3Xdr3ASqcdXtp4WNb2ljTwKLwaZWb1R4LCt4lFIiTDURXZAAw1kFXa7bwTO6eypseUcOnczpod4RXjhKH03mljjQK9CyL2LfFJH/YOQNM41nuYaT+sk/ENwlHmYnhcJdYyLNRwA7pYOZpnR518M5hAonNHi3H8nY7VJ0gg9tw7NEO5h8nG7XzVctK/ipZvo4dG2xVFynFR6/OUCkKbxlyfRR6ETM6CJVKYwiB933WaDJCTcl55xbbGWvSSbQJCCdx/xTZENZ+JWJoMyBoeB9v55hjpX1K2ObPpBjQ57irPDjNpnC8L8dgGq69QdmGN0h081AgMBAAE=',
  Addresses: ['/ip4/0.0.0.0/tcp/0'],
  AgentVersion: 'js-ipfs',
  ProtocolVersion: '9000'
}

/* eslint-env mocha */
'use strict'

const expect = require('chai').expect

module.exports = (http) => {
  describe('/id', () => {
    let api

    before(() => {
      api = http.api.server.select('API')
    })

    it('get the id', (done) => {
      api.inject({
        method: 'GET',
        url: '/api/v0/id'
      }, (res) => {
        expect(res.result.ID).to.equal(idResult.ID)
        expect(res.result.PublicKey).to.equal(idResult.PublicKey)
        const agentComponents = res.result.AgentVersion.split('/')
        expect(agentComponents).lengthOf.above(1)
        expect(agentComponents[0]).to.equal(idResult.AgentVersion)
        expect(res.result.ProtocolVersion).to.equal(idResult.ProtocolVersion)
        done()
      })
    })
  })
}

const idResult = {
  ID: 'QmYvQVFDHUviWGYYJn3Tn4bntW648bPv4drAuwUDBS9Hsb',
  PublicKey: 'CAASpgIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDFP8jqHZtp8IAyHpq3Y3Xdr3ASqcdXtp4WNb2ljTwKLwaZWb1R4LCt4lFIiTDURXZAAw1kFXa7bwTO6eypseUcOnczpod4RXjhKH03mljjQK9CyL2LfFJH/YOQNM41nuYaT+sk/ENwlHmYnhcJdYyLNRwA7pYOZpnR518M5hAonNHi3H8nY7VJ0gg9tw7NEO5h8nG7XzVctK/ipZvo4dG2xVFynFR6/OUCkKbxlyfRR6ETM6CJVKYwiB933WaDJCTcl55xbbGWvSSbQJCCdx/xTZENZ+JWJoMyBoeB9v55hjpX1K2ObPpBjQ57irPDjNpnC8L8dgGq69QdmGN0h081AgMBAAE=',
  Addresses: [ '/ip4/0.0.0.0/tcp/0' ],
  AgentVersion: 'js-ipfs',
  ProtocolVersion: '9000'
}

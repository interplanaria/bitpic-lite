require('dotenv').config()
const axios = require('axios')
const level = require('level-rocksdb')
const host = "https://txo.bitbus.network"
const express = require('express')
const es = require('event-stream')
const fs = require('fs')
const ejs = require('ejs')
const JSONStream = require("JSONStream")
const query = {
  q: {
    find: { "out.s7": "18pAqbYqhzErT6Zk3a5dwxHtB9icv8jH2p", "blk.i": { "$gt": 609000 } },
    sort: { "blk.i": 1 },
    project: { "blk": 1, "out.s8": 1, "tx.h": 1 }
  }
};
class Bitpic {
  constructor() {
    this.db = level("bitpic.db", { valueEncoding: 'json' })
    fs.readFile("public/show.ejs", "utf-8", (err, str) => {
      this.template = ejs.compile(str);
    })
  }
  async sync(query) {
    let res = await axios({
      method: "post",
      url: host + "/block",
      headers: {
        'Content-type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8',
        'token': process.env.TOKEN
      },
      data: query,
      responseType: "stream"
    })
    return res.data
  }
  async add(key, val) {
    await this.db.put(key, val)
  }
  serve() {
    this.app = express()
    this.app.get('/', (req, res) => {
      res.sendFile(process.cwd() + "/public/index.html") 
    })
    this.app.get('/u/:paymail', (req, res) => {
      this.db.get(req.params.paymail).then((o) => {
        res.redirect("https://x.bitfs.network/" + o.bitfs)
      })
    })
    this.app.get('/me/:paymail', (req, res) => {
      res.set('Content-Type', 'text/html');
      console.log(req.url)
      let url = req.originalUrl
      let r = this.template({ paymail: req.params.paymail, })
      res.send(Buffer.from(r))
    })
    this.app.get('/upload', (req, res) => {
      res.sendFile(process.cwd() + "/public/upload.html") 
    })
    this.app.get('/about', (req, res) => {
      res.sendFile(process.cwd() + "/public/about.html") 
    })
    this.app.get('/users', (req, res) => {
      let stream = this.db.createReadStream({ reverse: true })
      stream.pipe(JSONStream.stringify()).pipe(res)
    })
    this.app.listen(3012, () => {
      console.log("##############################################")
      console.log("#")
      console.log("# Bitpic running at http://localhost:3012")
      console.log("#")
      console.log("##############################################")
    })
  }
};
(async () => {
  const bitpic = new Bitpic()
  let height;
  console.time("Bitpic chain sync took")
  let stream = await bitpic.sync(query)
  stream.pipe(es.split()).pipe(es.parse()).pipe(es.mapSync((d) => {
    if (height !== d.blk.i) {
      height = d.blk.i
      console.log("sync block", height, "complete")
    }
    d.bitfs = d.tx.h + ".out.0.3"
    let paymail = d.out[0].s8
    bitpic.add(paymail, d)
    return d
  }))
  stream.on("end", () => {
    console.timeEnd("Bitpic chain sync took")
    console.log("\n")
    bitpic.serve()
  })
})();

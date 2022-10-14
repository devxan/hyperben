const path = require('path')
const express = require('express')
const axios = require('axios')
const app = express()

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

// Get a cloud computer object. If no object exists, create it.
let computer
app.get('/computer', async (req, res) => {
  if (computer) {
    res.send(computer)
    return
  }
  const body = {
    start_url: "https://discord.com/app",
    // kiosk: false -> No need to include this key, as kiosk: false is the default
    offline_timeout: 60, // I recommend just an offline timeout of 60 if you're using profiles
    profile: {
      load: `${process.env.SESSION_KEY}`,
      save: true
    },
    ublock: true,
    webgl: true,
    fps: 30
  }
  const config = {
    headers: { 
      authorization: `Bearer ${process.env.HB_API_KEY}`,
    }
  }
  const resp = await axios.post('https://engine.hyperbeam.com/v0/vm', body, config)
  computer = resp.data
  res.send(computer)
})

app.listen(8080, () => {
  console.log('Server started at PORT :8080')
})

(async () => {
  // webserver
  const express = require('express')
  const app = express()

  app.enable('trust proxy')

  // middlewares
  const helmet = require('helmet')
  const rateLimit = require('express-rate-limit')

  app.use(rateLimit({ windowMs: 5 * 60 * 1000, max: 10 }))
  app.use(helmet())
  app.use(express.json())

  // endpoints
  const glob = require('glob-promise')
  const endpoints = await glob('./endpoints/**/*.js')

  for (const endpoint of endpoints) {
    const module = require(endpoint)
    if (module.disabled) return

    // http methods
    if (module.get) app.get(module.endpoint, module.get)
    if (module.post) app.post(module.endpoint, module.post)
  }

  app.listen(8080, () => console.log('webserver listening to ::8080'))
})()

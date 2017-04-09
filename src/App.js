require('dotenv').config()
import Express from 'express'
import Boom from 'boom'
import axios from 'axios'
import _ from 'lodash'

const router = Express.Router()

export default [
  router.get('/ping', (req, res) => { res.status(200).json({ success: true }) }),

  router.post('/webhook', (req, res, next) => {
    const body = req.body
    if (_.isEmpty(body)) {
      next(Boom.badRequest())
      return
    }

    console.info(events)

    const events = body.events
    axios.post(process.env.LOTTERY_API,
      { "day": 16, "month": 4, "year": 2560 },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((result) => {
        let reply = {
          replyToken: events[0].replyToken,
          messages: [
            {
              "type": "text",
              "text": "หวยงวดหน้าคือ"
            },
            {
              "type": "text",
              "text": JSON.stringify(result.data)
            }
          ]
        }
        return reply
      })
      .then((reply) => {
        axios.post(
          'https://api.line.me/v2/bot/message/reply',
          reply,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
            }
          }
        ).then((response) => {
          res.status(200).json({ success: true })
        })
          .catch((err) => {
            const response = err.response
            const statusCode = response.status
            if (statusCode === 400) {
              next(Boom.badRequest(JSON.stringify(response.data)))
              return
            }
            next(Boom.notFound(JSON.stringify(response.data)))
          })
      })
      .catch((error) => {
        const response = error.response
        const statusCode = response.status
        if (statusCode === 400) {
          next(Boom.badRequest(JSON.stringify(response.data)))
          return
        }
        next(Boom.notFound(JSON.stringify(response.data)))
        return
      })


  })
]

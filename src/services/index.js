require('dotenv').config()
import createRequest from './createRequest'

function getToken () {
  return process.env.ACCESS_TOKEN
}

function getChannelSecret () {
  return process.env.CHANNEL_SECRET
}

function getLotteryApi () {
  return process.env.LOTTERY_API
}

export const authRequest = createRequest(getToken())
export const unAuthRequest = createRequest()

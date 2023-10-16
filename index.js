const TelegramApi = require('node-telegram-bot-api')

const token = "6123820339:AAGxCwPlNFOFeZZyUB6HT3fEkX-p_5uyDnM"

const bot = new TelegramApi(token, {polling: true})

bot.on('message', msg => {
  console.log(msg)
})
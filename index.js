const TelegramApi = require('node-telegram-bot-api')

const token = "6123820339:AAGxCwPlNFOFeZZyUB6HT3fEkX-p_5uyDnM"

const bot = new TelegramApi(token, {polling: true})

const start = () => {
  bot.setMyCommands([
    {command: "/start", description: "Начальное приветствие бота"},
    {command: "/info", description: "Показать информацию о боте"},
    {command: "/monitoring", description: "Показать список доступных шкафчиков"},
    {command: "/openlock", description: "Открыть мой шкафчик"},
  ])
  
  bot.on('message', msg => {
    const text = msg.text
    const chatId = msg.chat.id
  
    if (text === "/start") {
      return bot.sendMessage(chatId, `Приветствую тебя ${msg.from.first_name}`)
    }
    console.log(msg)
  })
}

start()
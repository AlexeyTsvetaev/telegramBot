const TelegramApi = require('node-telegram-bot-api')   //Подргужаю пакет для телеги

const token = "6123820339:AAGxCwPlNFOFeZZyUB6HT3fEkX-p_5uyDnM"  //Токен бота

const bot = new TelegramApi(token, {polling: true})  //Настройка бота по документации Телеграм, к которому мы будем обращаться

const fs = require('fs')

//start - функция, которая запускает в боте все настройки

const start = () => {

  //Команды MENU

  bot.setMyCommands([
    {command: "/start", description: "Начальное приветствие бота"},
    {command: "/info", description: "Показать информацию о боте"},
    {command: "/monitoring", description: "Показать список доступных шкафчиков"},
    {command: "/openlock", description: "Открыть мой шкафчик"},
  ])

  //Слушаю сообщение, которое прилетает в чат от пользователя
  bot.on('message', async msg => {
    const text = msg.text  //записываю все сообщение в text
    const chatId = msg.chat.id  //записываю id чата, чтобы в него же отвечать
  
    if (text === "/start") {
      return bot.sendMessage(chatId, `Приветствую тебя ${msg.from.first_name}`)
    } 
    else if (text === "/info") {
      await bot.sendPhoto(chatId, fs.readFileSync(__dirname + '/img/logo.jpg'))
      return bot.sendMessage(chatId, `
      Данный бот создан компанией KERONG.RU
      В нем доступны такие команды как:
      1. Открыть шкафчик
      2. Посмотреть список доступных шкафчиков
      В случае, если вы не зарегистрированы в системе, бот сообщит вам об этом!
      `) 
      
    }
      else if (text === "/monitoring") {
        return bot.sendMessage(chatId, `Доступных шкафчиков: {}`)
      }
      else if (text === "/openlock") {
        return bot.sendMessage(chatId, "Открыть шкафчик № {} ?", {
          reply_markup: {
            inline_keyboard: [
           [
              {
                text: 'Открыть',
                callback_data: 'openlock'
                
              }, 
              {
                text: 'Отменить',
                callback_data: 'cancel'
              }
            ],
            [
              {
                text: 'back',
                callback_data: 'back'
              }
            ]
           ]
          }
        }) 
      }

//Если команда не найдена то, сообщаю об этом

      bot.sendMessage(chatId, `
      Я не знаю такой команды... 
Откройте Menu и попробуйте отправить команду еще раз!
      `)
    console.log(msg)
  })
}

start()  //запускаю бота


// Настройки всплывающего окна клавиатуры в чате для OPEN LOCK/CANCEL

bot.on('callback_query', query => {

  const buttonAlert = query.data
  const {chat, message_id, text} = query.message

  if (buttonAlert === 'openlock') {
    bot.answerCallbackQuery(query.id, 'Запрос на открытие отправлен!⏳')
    setTimeout(function() {
      bot.editMessageText(`
      Шкафчик № {} открыт! ✅
      Не забудьте закрыть его перед уходом!
      Спасибо! 🙏`, {
        chat_id: chat.id,
        message_id: message_id,
  
      })
    }, 2000)
  } 
  else if (buttonAlert === 'cancel') {
    bot.answerCallbackQuery(query.id, 'Отменили открытие шкафчика...')
    bot.editMessageText(`Мы отменили открытие шкафчика 🙅‍♂️`, {
        chat_id: chat.id,
        message_id: message_id,
  
      })
  }

  console.log(buttonAlert)
  console.log(query)

})
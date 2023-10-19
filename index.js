const TelegramApi = require('node-telegram-bot-api')   //Подргужаю пакет для телеги
const token = "6123820339:AAGxCwPlNFOFeZZyUB6HT3fEkX-p_5uyDnM"  //Токен бота
const bot = new TelegramApi(token, {polling: true})  //Настройка бота по документации Телеграм, к которому мы будем обращаться
const fs = require('fs')

//-------------------------   start - функция, которая запускает в боте все настройки

const start = () => {

  //Команды MENU

bot.setMyCommands([
  {command: "/start",     description: "Начальное приветствие бота"},
  {command: "/info",      description: "Показать информацию о боте"},
  {command: "/monitoring",description: "Показать список доступных шкафчиков"},
  {command: "/openlock",  description: "Открыть мой шкафчик"},
  {command: "/clients",   description: "Показать список клиентов"},
])

//Слушаю сообщение, которое прилетает в чат от пользователя
bot.on('message', async msg => {

const text = msg.text  //записываю все сообщение в text
const chatId = msg.chat.id  //записываю id чата, чтобы в него же отвечать
  
if (text === "/start") {
  return bot.sendMessage(chatId, "Добрый день! Нажмите МЕНЮ, чтобы посмотреть список доступных команд!")
}
if (text === "/info") {
  await bot.sendPhoto(chatId, fs.readFileSync(__dirname + '/img/logo.jpg'))
    return bot.sendMessage(chatId, `
Данный бот создан компанией KERONG.RU
В нем доступны такие команды как:
1. Открыть шкафчик
2. Посмотреть список доступных шкафчиков
В случае, если вы не зарегистрированы в системе, бот сообщит вам об этом!
      `) 
}
if (text === "/monitoring") {
  return bot.sendMessage(chatId, `Доступных шкафчиков: {}`)
}
if (text === "/openlock") {
  return bot.sendMessage(chatId, "Открыть шкафчик № {} ?", {
    reply_markup: {
      inline_keyboard: [
        [
              {text: 'Открыть',  callback_data: 'openlock'}, {text: 'Отменить', callback_data: 'cancel'}
        ],
]
 }
  }
   ) 
    } 
if (text === "/clients") {
  return fetch('http://dev.kerong.ru:9777/api/v1/', {
    headers:{
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIkFETUlOIl0sImV4cCI6MTY5NzY0OTcwNiwiaWF0IjoxNjk3NTYzMzA2fQ.1Bs4R9BuScgTS72COLR2agaNWoiB_MhlaTm51bdwDkQ"
        }
})
.then((response) => {
  return response.json();
})
.then((data) => {
  const countClients = async () => {
    await bot.sendMessage(chatId, `Зарегистрированные клиенты:`)
      for (let i = 0; i < data.length; i++) {
        await bot.sendMessage(chatId, `🧑🏻 ${data[i].firstName}`)
      }
    await bot.sendMessage(chatId, `📋 Итого: ${data.length}`)
}
countClients()
}
 )
  ;
   }

//Если команда не найдена то, сообщаю об этом

bot.sendMessage(chatId, `
🆘Я не знаю такой команды... 
Откройте ⚙️ МЕНЮ и попробуйте отправить команду еще раз!
      `)
console.log(msg)
})


//При загрузке бота в консоль вывожу данные, чтобы заранее знать, что все работает.
fetch('http://dev.kerong.ru:9777/api/v1/', {
  headers:{
    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIkFETUlOIl0sImV4cCI6MTY5NzY0OTcwNiwiaWF0IjoxNjk3NTYzMzA2fQ.1Bs4R9BuScgTS72COLR2agaNWoiB_MhlaTm51bdwDkQ"
}
})
.then((response) => {
  return response.json();
 })
.then((data) => {

});
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
🗄Шкафчик № {} открыт! ✅
Не забудьте закрыть его перед уходом!
Спасибо! 🙏`, 
{
  chat_id:    chat.id,
  message_id: message_id,
})}, 2000)} 
if (buttonAlert === 'cancel') {
  bot.answerCallbackQuery(query.id, 'Отмена открытия шкафчика...')
    bot.editMessageText(`Мы отменили открытие шкафчика 🙅‍♂️`, {
      chat_id:    chat.id,
      message_id: message_id,
      })}})

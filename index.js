'use strict';
const TelegramApi = require('node-telegram-bot-api');
const { TOKEN, SETCOMMANDS, BUTTONS } = require('./assets/config');
const { connection } = require('./assets/db');
const { addUserToDB, updateUser } = require('./assets/helpers');
const bot = new TelegramApi(TOKEN, { polling: true });
let filter = '';
// Set commands
bot.setMyCommands(SETCOMMANDS);


const  data = {
  id: 0,
  name: '',
  pass: '',
};
// Get commands
bot.on('text', txt => {
  const chatId = txt.chat.id;
  const text = txt.text.toLowerCase();
  data.id = chatId;
  if (text === '/start') {
    //check is set user
    connection.query('SELECT telegram_id FROM `users`', (err, res) => {
      if (err) throw new Error(err);
      if (!res.some(x => x.telegram_id == chatId)) addUserToDB(txt.from);
    });
    bot.sendMessage(chatId, 'You are welcome!', BUTTONS);
  } else if (filter === 'setName') {

    data.name = text;
    filter = 'setPas';
    bot.sendMessage(chatId, 'Ok,write your password');
  } else if (filter === 'setPas') {
    data.pass = text;
    //add pass
    connection.query('SELECT telegram_id,name FROM passwords', (err, res) => {
      if (res.some(x => (x.telegram_id == data.id && x.name == data.name))) {
        bot.sendMessage(chatId, 'You have already added this password name.Do you want to change it?', BUTTONS);
        return;
      }
      connection.query(`INSERT INTO passwords SET telegram_id=${data.id},name='${data.name}',password='${data.pass}'`, (err, res) => {
        if (err) {
          bot.sendMessage(chatId, 'Db error');
          bot.sendMessage(chatId, 'Please try again', BUTTONS);
          return;
        }

        bot.sendMessage(chatId, 'You complatelty added the password.Do you want to add another one?', BUTTONS);
      });
    });
    filter = '';
  } else if (filter === 'changeName') {

    data.name = text;
    bot.sendMessage(chatId, 'Ok,send me the new password');
    filter = 'changePas';
  } else if (filter === 'changePas') {

    data.pass = text;
    //change pass
    connection.query(`SELECT * FROM passwords WHERE id='${chatId}'`, (err, res) => {
      if (res.some(x => x.name !== data.name)) {
        bot.sendMessage(chatId, 'You don\'t have the password with this name.Do you want to add it?', BUTTONS);
        return;
      }
      connection.query(`UPDATE passwords SET password='${data.pass}' WHERE telegram_id='${data.id}' && name='${data.name}'`, (err, res) => {
        if (err) {
          bot.sendMessage(chatId, 'I couldn\'t change your passwords.Please try again.', BUTTONS);
        }
        bot.sendMessage(chatId, 'I have changed your password', BUTTONS);
      });
    });
    filter = '';
  } else if (filter === 'deleteName') {
    //delete pass
    data.name = text;
    connection.query(`DELETE FROM passwords WHERE telegram_id='${data.id}' && name='${data.name}'`, (err, res) => {
      if (err) {
        bot.sendMessage(chatId, 'I couldn\'t delete the password.Please try again', BUTTONS);
        return;
      }
      bot.sendMessage(chatId, 'I have just deleted the password.');
    });
    filter = '';
  } else {
    bot.sendMessage(chatId, 'Unknown command!');
    bot.sendMessage(chatId, 'Here are all the commands', BUTTONS);
  }
  updateUser(chatId, txt.date);
});

bot.on('callback_query', res => {
  const id = res.message.chat.id;
  const msg = res.data;
  if (msg === '/setpas') {
    bot.sendMessage(id, 'Ok,how shall we call this password?');
    filter = 'setName';
  } else if (msg === '/changepas') {
    bot.sendMessage(id, 'Write the name of password you want to change');
    filter = 'changeName';
  } else if (msg === '/deletepas') {
    bot.sendMessage(id, 'Write the name of password you want to delete');
    filter = 'deleteName';
  }

});

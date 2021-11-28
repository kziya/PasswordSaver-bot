'use strict';
const TOKEN = '2139753376:AAFjQoP0Qe7-37DHdK3gFsttggADszsg-k0';
const DBCONF = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'telegram-bot1',
};
const SETCOMMANDS = [
  {
    command: '/start',
    description: 'starts the bot',

  },
  {
    command: '/end',
    description: 'stops the bot',

  },

];
const BUTTONS = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Set Password', callback_data: '/setpas' }, { text: 'Change Password', callback_data: '/changepas' }],
      [{ text: 'Delete Password', callback_data: '/deletepas' }]
    ]
  })
};


module.exports = { TOKEN, DBCONF, SETCOMMANDS, BUTTONS };

'use strict';
const { connection } = require('./db');

const addUserToDB = function(user) {
  const sqlCode = `INSERT INTO \`users\` SET telegram_id='${user.id}',name='${user.first_name}',telegram_name='${user.username}',language_code='${user.language_code}',is_bot='${user.is_bot}'`;
  connection.query(sqlCode, (err, result) => {
    if (err) throw new Error('Something went wrong with db!');
  });

};
const convertTime = timestamp => {
  const date = new Date(timestamp * 1000);
  const res = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  return res;
};
const updateUser = function(id, time) {
  const date = convertTime(time);
  connection.query(`UPDATE \`users\` SET last_enter='${date}' WHERE telegram_id='${id}'`, (err, res) => {
    if (err) throw new Error('Could not update user!');
  });
};


module.exports = { addUserToDB, convertTime, updateUser };

const { Client } = require('../dist/index.js');

const client = new Client();

client.on('ready', () => console.log('Ready!'));

client.on('messageNew', (message) => {
    console.log(message);
});

client.login({
    token: process.env.TOKEN,
    joinChannel: '74f0fadb-9284-4a4f-bc53-f92a4e90e383',
})
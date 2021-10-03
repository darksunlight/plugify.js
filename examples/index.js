const { Client, Message } = require('..');

const client = new Client();

client.on('ready', () => {
    console.log('Ready!');
});

client.on('channelJoin', (channel) => {
    console.log(`Joined channel #${channel.name}`);
})

client.on('messageNew', (/** @type Message */message) => {
    if (message.raw.content === '.ping') return message.channel.send(`Current gateway ping: ${client.gateway.ping}ms`);
    else if (message.raw.content.startsWith('.ui ')) {
        const username = message.raw.content.split(' ')[1];
        return client.rest.get(`/users/info/${username}`).then(user => {
            const data = user.data;
            const flags = {
                'Pro': (data.flags & 1 << 0) === 1 << 0,
                'Dev': (data.flags & 1 << 1) === 1 << 1,
                'Early': (data.flags & 1 << 2) === 1 << 2,
                'Closed Beta': (data.flags & 1 << 3) === 1 << 3,
                'System': (data.flags & 1 << 4) === 1 << 4,
            };
            let attributes = [];
            for (const [k, v] of Object.entries(flags)) {
                if (v) attributes.push(k);
            }
            message.channel.send(`|User Info|\n|-|\n|${username}|\n|${attributes.join(', ')}|\n`);
        })
    } else if (message.raw.content === '.members') {
        return client.rest.get(`/groups/info/${message.channel.group.id}`).then(x => {
            const data = x.data;
            message.channel.send(data.members.map(x => x.username).join(', '));
        });
    }
    console.log(`@${message.authorName}: ${message.raw.content}`);
});

client.login({
    token: process.env.TOKEN,
    joinChannel: '74f0fadb-9284-4a4f-bc53-f92a4e90e383',
})
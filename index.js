const { Client } = require('whatsapp-web.js');

const client = new Client({ puppeteer: { headless: true, args: [
    '--no-sandbox'
],}});

client.on('qr', (qr) => {
    console.log(qr);
});

client.on('ready', () => {
    console.log('Bot sedang berjalan!');
});

client.on('message', async msg => {
    if (msg.body == '!help') {
        msg.reply(`Everyone
*!mentionall*

Group Admin Only
*!promote*
*!demote*

Owner Bot Only
*!info*
*!turnoff*
`);
    } 
    
    else if(msg.body.startsWith('!mentionall ')) {
        const chat = await msg.getChat();
        let text = msg.body.split(' ')[1];
        text += `\n`;
        let mentions = [];
        for(let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);
            mentions.push(contact);
            text += `@${participant.id.user} `;
            text += `\n`
        }
        chat.sendMessage(text, { mentions });
    } 

    else if (msg.body.startsWith('!promote ')) {
        if (chat.isGroup) {
            const authorId = message.author;
        for(let participant of chat.participants) {
            if(participant.id._serialized === authorId && participant.isAdmin) {
                const title = msg.mentionedIds[0]
                chat.promoteParticipants([`${title}`])
                msg.reply('Done!')
                break;
            } else {
                msg.reply('Maaf perintah ini hanya bisa digunakan oleh admin grup!');
                break
            }
        }} else{
            msg.reply('Maaf perintah ini hanya bisa digunakan di dalam grup!');
        }
    }

    else if (msg.body.startsWith('!demote ')) {
        if (chat.isGroup) {
            const authorId = message.author;
        for(let participant of chat.participants) {
            if(participant.id._serialized === authorId && participant.isAdmin) {
                let title = msg.mentionedIds[0];
                chat.demoteParticipants([`${title}`]);
                msg.reply('Done!');
                break;
            } else {
                msg.reply('Maaf perintah ini hanya bisa digunakan oleh admin grup!');
                break;
            }
        }} else {
            msg.reply('Maaf perintah ini hanya bisa digunakan di dalam grup!');
        }
    }
    
    else if (msg.body == '!turnoff'){
        if (msg.from == '6285841392048@c.us' || msg.author.includes('6285841392048')){
            client.logout();
        } else {
            msg.reply('Maaf kamu bukan pemilik bot ini!');
        }
    }

    else if (msg.body == '!info'){
        if (msg.from == '6285841392048@c.us' || msg.author.includes('6285841392048')){
            const chats = await client.getChats();
            client.sendMessage(msg.from, `Bot ini memiliki ${chats.length} chat yang terbuka.`);
        } else {
            msg.reply('Maaf kamu bukan pemilik bot ini!');
        }
    }
});

client.on('group_join', async (notification) => {
    let number = await notification.id.remote;
    client.sendMessage(number, `Halo perkenalkan aku adalah sad bot, selamat datang di grup ini!`);

    const chats = await client.getChats();

        for (i in chats) {
            if (number == chats[i].id._serialized) {
                chat = chats[i];
            }
        }
        var participants = {};
        var admins = {};
        var i;
        for (let participant of chat.participants) {
            if (participant.id.user == botno) { continue; }

            const contact = await client.getContactById(participant.id._serialized);
            participants[contact.pushname] = participant.id.user;

            if (participant.isAdmin) {

                admins[contact.pushname] = participant.id.user;
                client.sendMessage(participant.id._serialized, 'Hai admin, ada member baru di group nihh :D');
            }
        }
});

client.on('group_leave', async (notification) => {
    let number = await notification.id.remote;
    client.sendMessage(number, `Selamat tinggal teman :(`);

    const chats = await client.getChats();
    for (i in chats) {
        if (number == chats[i].id._serialized) {
            chat = chats[i];
        }
    }
    var participants = {};
    var admins = {};
    var i;
    for (let participant of chat.participants) {
        if (participant.id.user == botno) { continue; }
        const contact = await client.getContactById(participant.id._serialized);
        participants[contact.pushname] = participant.id.user;
        if (participant.isAdmin) {
            admins[contact.pushname] = participant.id.user;
            client.sendMessage(participant.id._serialized, 'Hai admin, ada member yang keluar dari grup :(');
        }
    }
});

client.initialize();

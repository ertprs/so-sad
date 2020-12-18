const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const fse = require('fs-extra');

const client = new Client({ puppeteer: { headless: true,
    args: [
        "--no-sandbox"
      ]

}});

client.initialize();

client.on('qr', (qr) => {
    console.log(qr);
});

client.on('authenticated', () => {
    console.log('Berhasil diauntentikasi!');
});

client.on('auth_failure', () => {
    console.error('Autentikasi gagal!');
});

client.on('ready', () => {
    console.log('Bot sedang berjalan!');
});

client.on('message', async msg => {
    let chat = await msg.getChat();
    const quotedMsg = await msg.getQuotedMessage();

    if (msg.body == '!help') {
        msg.reply(`Command :
*!mentionall* Untuk mention semua member grup.
Contoh : !mention absen

*!promote*  Untuk menjadikan member sebagai admin.
Contoh : !promote @sadbot

*!demote*  Untuk menjadikan admin sebagai member.
Contoh : !demote @sadbot

*!kick* Untuk mengeluarkan member.
Contoh : !kick @sadbot.

*!turnoff* Untuk mematikan bot ini ;)
`);
    } 
    
    else if(msg.body.startsWith('!mentionall ')) {
        const chat = await msg.getChat();
        let text = msg.body.split("!mentionall ")[1];
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
                const authorId = msg.author;
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
        }
    } else {
            msg.reply('Maaf perintah ini hanya bisa digunakan di dalam grup!');
        }
    }

    else if (msg.body.startsWith('!demote ')) {
        if (chat.isGroup) {
                const authorId = msg.author;
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
        }
    } else {
            msg.reply('Maaf perintah ini hanya bisa digunakan di dalam grup!');
        }
    }
    
    else if (msg.body.startsWith('!kick ')) {
        if (chat.isGroup) {
                const authorId = msg.author;
            for(let participant of chat.participants) {
            if(participant.id._serialized === authorId && participant.isAdmin) {
                let title = msg.mentionedIds;
                chat.removeParticipants([...title]);
                break;
            } else {
                msg.reply('Maaf perintah ini hanya bisa digunakan oleh admin grup!');
                break;
            }
        }
    } else {
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
});

client.on('group_join', async (notification) => {
    let number = await notification.id.remote;
    client.sendMessage(number, `Halo selamat datang di grup ini, Jangan lupa baca deskripsi grup ya!`);
});

client.on('group_leave', async (notification) => {
    let chat = await msg.getChat();
    let number = await notification.id.remote;
    client.sendMessage(number, `Selamat jalan temanku :(`);
});

client.on('disconnected', () => {
    console.log('Disconnect!');
});

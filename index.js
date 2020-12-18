const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const fse = require('fs-extra');

const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({ puppeteer: { headless: true,
    args: [
        "--no-sandbox"
      ]

}, session: sessionCfg });

client.initialize();

client.on('qr', (qr) => {
    console.log(qr);
});

client.on('authenticated', (session) => {
    console.log('Berhasil diauntentikasi!', session);
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

client.on('auth_failure', msg => {
    console.error('Autentikasi gagal!', msg);
});

client.on('ready', () => {
    console.log('Bot sedang berjalan!');
});

client.on('message', async msg => {
    let chat = await msg.getChat();
    if (msg.body == '!help') {
        msg.reply(`Command :
*!mentionall* Untuk mention semua member grup.
Contoh : !mention absen

*!promote*  Untuk menjadikan member sebagai admin.
Contoh : !promote @sadbot

*!demote*  Untuk menjadikan admin sebagai member.
Contoh : !demote @sadbot

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
            if(client.isAdmin){
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
        }
            } else {
                msg.reply('Maaf bot ini bukan admin grup!');
            }
    } else {
            msg.reply('Maaf perintah ini hanya bisa digunakan di dalam grup!');
        }
    }

    else if (msg.body.startsWith('!demote ')) {
        if (chat.isGroup) {
            if(client.isAdmin){
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
        }
            } else {
                msg.reply('Maaf bot ini bukan admin grup!');
            }
    } else {
            msg.reply('Maaf perintah ini hanya bisa digunakan di dalam grup!');
        }
    }
    
    else if (msg.body == '!turnoff'){
        if (msg.from == '6285841392048@c.us' || msg.author.includes('6285841392048')){
            client.destroy();
        } else {
            msg.reply('Maaf kamu bukan pemilik bot ini!');
        }
    }
});

client.on('group_join', async (notification) => {
    let number = await notification.id.remote;
    client.sendMessage(number, `Halo selamat datang di grup ini, jangan lupa baca deskripsi ya!`);
});

client.on('group_leave', async (notification) => {
    let number = await notification.id.remote;
    client.sendMessage(number, `Selamat tinggal temanku :(`);
});

client.on('disconnected', (reason) => {
    console.log('Disconnect!', reason);
});

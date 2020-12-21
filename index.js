const { Client } = require('whatsapp-web.js');

const client = new Client({ puppeteer: { headless: true,
    args: [
        "--no-sandbox"
      ]},
      session: {
        "WABrowserId": "z3l8Z9NxEalSR6Hn5VLaJQ==",
        "WASecretBundle": {"key":"7JW7K/6Pbx9xZU7sNmKDLR0p/NeLFqb0RCRd/fJUrps=","encKey":"XV1cPhFoipCfB+EARgwjOjJg1T/MFVZGg3zA8/QJMbQ=","macKey":"7JW7K/6Pbx9xZU7sNmKDLR0p/NeLFqb0RCRd/fJUrps="},
        "WAToken1": "HVYgAh5FQGgao4R5FBTSApz9y0lvi5EL9pEliW8S4b8=",
        "WAToken2": "1@/YY+6DjQQIzkQCCfBK0f2OjgdR/JUz1NS50XkIo3/VOIFQtJAxLrlTLqwMybz/RnBfxVR1JMwDYqhg=="
        }
});

client.initialize();

client.on('qr', (qr) => {
    console.log(qr);
});

client.on('authenticated', (session) => {
    console.log('Berhasil diauntentikasi!');
    console.log(session);
});

client.on('auth_failure', () => {
    console.error('Gagal diautentikasi!');
});

client.on('ready', () => {
    console.log('Bot sedang berjalan!');
});

client.on('message', async msg => {
    let chat = await msg.getChat();
    const quotedMsg = await msg.getQuotedMessage();

    if (msg.body == '!help') {
        msg.reply(`Command :
*!sendto* Untuk mengirimkan pesan ke sesorang secara anonim.
Contoh : !sendto 62876543210 Hahahaha

*!mentionall* Untuk mention semua member grup.
Contoh : !mention absen

*!promote*  Untuk menjadikan member sebagai admin.
Contoh : !promote @sadbot

*!demote*  Untuk menjadikan admin sebagai member.
Contoh : !demote @sadbot

*!kick* Untuk mengeluarkan member.
Contoh : !kick @sadbot.

*!subject* Untuk mengubah nama grup.
Contoh : !subject Test

*!join* Agar bot bergabung dengan grup.
Contoh : !join link grupnya

*!info* Untuk menampilkan berapa percakapan yang dihandle oleh bot ini.
`);
    } 

    else if(msg.body.startsWith('!mentionall ')) {
        if (chat.isGroup) {
                const authorId = msg.author;
            for(let participant of chat.participants) {
            if(participant.id._serialized === authorId && participant.isAdmin) {
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
                break;
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

    else if (msg.body == '!info') {
        const chats = await client.getChats();
        const groups = chats.filter(chat => chat.isGroup);
        const chatbiasa = chats.length - groups.length;

        client.sendMessage(msg.from, `Bot ini telah menghandle ${chats.length} chat!
Chat grup  : ${groups.length}
Chat biasa : ${chatbiasa}
`);
    }

    else if (msg.body.startsWith('!sendto ')) {
        let number = msg.body.split(' ')[1];
        let messageIndex = msg.body.indexOf(number) + number.length;
        let message = msg.body.slice(messageIndex, msg.body.length);
        number = number.includes('@c.us') ? number : `${number}@c.us`;
        client.sendMessage(msg.from, 'Done!');
        client.sendMessage(number, message);
    }

    else if (msg.body.startsWith('!subject ')) {
        if (chat.isGroup) {
                const authorId = msg.author;
            for(let participant of chat.participants) {
            if(participant.id._serialized === authorId && participant.isAdmin) {
                let newSubject = msg.body.slice(9);
                chat.setSubject(newSubject);
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

    else if (msg.body.startsWith('!join ')) {
        let inviteCode = msg.body.split(' ')[1];
        undangan = inviteCode.replace('https://chat.whatsapp.com/', '');
        try {
            await client.acceptInvite(undangan);
            msg.reply('Sudah bergabung dengan grup!');
        } catch (e) {
            msg.reply('Sepertinya link grupnya invalid.');
        }
    }

});

client.on('group_join', async (notification) => {
    let number = await notification.id.remote;
    client.sendMessage(number, `Halo selamat datang di grup ini, Jangan lupa baca deskripsi grup ya!`);
});

client.on('group_leave', async (notification) => {
    let number = await notification.id.remote;
    client.sendMessage(number, `Selamat jalan temanku :(`);
});

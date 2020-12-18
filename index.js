const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const fse = require('fs-extra');
const SESSION_FILE_PATH = "./session.json";

if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
  }

  client = new Client({	  
    
    puppeteer: {
   headless: true,
   args: [
 "--log-level=3",
 "--no-default-browser-check",
 "--disable-infobars",
 "--disable-web-security",
 "--disable-site-isolation-trials",
 "--no-experiments",
 "--ignore-gpu-blacklist",
 "--ignore-certificate-errors",
 "--ignore-certificate-errors-spki-list",

 "--disable-extensions",
 "--disable-default-apps",
 "--enable-features=NetworkService",
 "--disable-setuid-sandbox",
 "--no-sandbox",

 "--no-first-run",
 "--no-zygote"
]
   
},	      
session: sessionCfg
});

client.initialize();

client.on('qr', (qr) => {
    console.log(qr);
});

client.on("authenticated", session => {
    console.log('Autentikasi berhasil!');
    sessionCfg = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
      if (err) {
        console.error(err);
      }
    });
  });
  
  client.on("auth_failure", msg => {
    console.log(
      'Autentikasi gagal!'
    );
    fs.unlink("./session.json", function(err) {
      if (err) return console.log(err);
      console.log(
          'Sesi sudah dihapus, mohon restart!'
      );
      process.exit(1);
    });
  });
  
  client.on("ready", () => {
    console.log('Bot sedang berjalan!');
  });
  

client.on('message', async msg => {
    if (msg.body == '!help') {
        msg.reply(`Everyone :
*!mentionall* Untuk mention semua member grup.
Contoh : !mention absen

*!owner* Untuk mengirim kontak pembuat bot ini.

Group Admin Only :
*!promote*  Untuk menjadikan member sebagai admin.
Contoh : !promote @sadbot

*!demote*  Untuk menjadikan admin sebagai member.
Contoh : !demote @sadbot

*!customwelcome* _pendingggg, will be available later!!!! ;)_

Owner Bot Only :
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
client.initialize();

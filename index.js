const { Client } = require('whatsapp-web.js');

const client = new Client({ puppeteer: { headless: true,
    args: [
        "--no-sandbox"
      ]}
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
        msg.reply(`Semua fitur tersedia untuk semua orang.
*NOTE* : JANGAN SPAM YA! OKE?

*!mentionall* Untuk mention semua member grup.
Contoh : !mention absen

*!yt* Untuk mendownload video youtube.
Contoh : !yt link_videonya

`);
    }

    //mentionall member
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

    //youtube video downloader
    else if (msg.body.startsWith("!yt ")) {
        const url = msg.body.split(" ")[1];
        const exec = require('child_process').exec;
        
        var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        
        const ytdl = require("ytdl-core")
        if(videoid != null) {
           console.log("video id = ",videoid[1]);
        } else {
            msg.reply("Link videonya tidak valid!");
        }
        msg.reply("Tunggu sebentar sedang diproses!");
        ytdl.getInfo(videoid[1]).then(info => {
        if (info.length_seconds > 1000){
        msg.reply("Videonya terlalu panjang\n sebagai gantinya \n kamu bisa klik link dibawah ini \π \n "+ info.formats[0].url)
        }else{
        
        console.log(info.length_seconds)
        
        function os_func() {
            this.execCommand = function (cmd) {
                return new Promise((resolve, reject)=> {
                   exec(cmd, (error, stdout, stderr) => {
                     if (error) {
                        reject(error);
                        return;
                    }
                    resolve(stdout)
                   });
               })
           }
        }
        var os = new os_func();
        
        os.execCommand('ytdl ' + url + ' -q highest -o mp4/'+ videoid[1] +'.mp4').then(res=> {
            var media = MessageMedia.fromFilePath('mp4/'+ videoid[1] +'.mp4');
        chat.sendMessage(media);
        }).catch(err=> {
            console.log("os >>>", err);
        })
        
        }
        });
        
        }

});

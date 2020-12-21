const { Client } = require('whatsapp-web.js');

const client = new Client({ puppeteer: { headless: true, executablePath: "/usr/bin/google-chrome-stable",
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

*!yt* Untuk mendownload musik dari youtube.
Contoh : !ytmp3 link_videonya

`);
    }

    //mentionall member
    else if(msg.body.startsWith('!mentionall ')) {
        if (chat.isGroup) {
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
    } else {
            msg.reply('Maaf perintah ini hanya bisa digunakan di dalam grup!');
        }
    }

    //music downloader
    else if (msg.body.startsWith("!ytmp3 ")) {
        var url = msg.body.split(" ")[1];
        var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        
        const ytdl = require("ytdl-core")
        const { exec } = require("child_process");
        if(videoid != null) {
           console.log("video id = ",videoid[1]);
        } else {
            msg.reply("Link videonya invalid!");
        }
        ytdl.getInfo(videoid[1]).then(info => {
        if (info.length_seconds > 3000){
        msg.reply("Videonya terlalu panjang!")
        }else{
        
        console.log(info.length_seconds)
        
        msg.reply("Tunggu sebentar sedang diproses!");
        var YoutubeMp3Downloader = require("youtube-mp3-downloader");
        
        //Configure YoutubeMp3Downloader with your settings
        var YD = new YoutubeMp3Downloader({
            "ffmpegPath": config.ffmpeg_path, 
            "outputPath": "./mp3",    // Where should the downloaded and en>
            "youtubeVideoQuality": "highest",       // What video quality sho>
            "queueParallelism": 100,                  // How many parallel down>
            "progressTimeout": 40                 // How long should be the>
        });
        
        YD.download(videoid[1]);
        
        
        YD.on("finished", function(err, data) {
        
        
        var musik = MessageMedia.fromFilePath(data.file);
        
        chat.sendMessage(musik);
        });
        YD.on("error", function(error) {
            console.log(error);
        });
        
        }});
        }

});

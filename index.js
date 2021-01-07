const { Client, MessageMedia, Contact } = require("whatsapp-web.js");
const carbon = require('./modules/carbon');
const fetch = require("node-fetch");  
const cheerio = require("cheerio");
const urlencode = require("urlencode");
const axios = require("axios");
const google = require('google-it');
const exec = require('child_process').exec;
const fs = require('fs');

//remove value array
function removeValue(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
}


//inArray
const inArray = (needle, haystack) => {
    let length = haystack.length;
    for(let i = 0; i < length; i++) {
        if(haystack[i].includes(needle)) return true;
    }
    return false;
}


//start client
const client = new Client({ puppeteer: { headless: true,
    args: [
        "--no-sandbox"
      ]
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

    //Supaya ga dikira bot
    client.sendPresenceAvailable();

    //detect spam
    if(chat.isGroup){
        console.log(`${msg.body} from ${msg.author.replace('@c.us', '')}`);
    } else {
        console.log(`${msg.body} from ${msg.from.replace('@c.us', '')}`);
    }

    //detect message
    if (msg.body === '!help' || msg.body === '!menu') {
        msg.reply(`Fitur tersedia untuk semua orang :

*!pantun* Agar botnya berpantun. 
Contoh : !pantun

*!randomanime* Agar botnya mengirimkan gambar anime secara random. 
Contoh : !randomanime

*!animehd* Agar botnya mengirimkan gambar anime HD. 
Contoh : !animehd

*!image* Agar botnya mencarikan gambar. 
Contoh : !searchimage cowok indo

*!cewekcantik* Agar botnya mengirimkan gambar cewek cantik. 
Contoh : !cewekcantik

*!cowokganteng* Agar botnya mengirimkan gambar cowok ganteng. 
Contoh : !cowokganteng

*!quotes* Agar botnya mengirimkan quotes. 
Contoh : !quotes

*!fakta* Agar botnya mengirimkan fakta. 
Contoh : !fakta

*!carbon* Untuk membuat gambar kode kode gitu. 
Contoh : !carbon Test

*!wiki* Untuk menampilkan wikipedia. 
Contoh : !wiki soekarno

*!wikien* Untuk menampilkan wikipedia english. 
Contoh : !wikien soekarno

*!lirik* Untuk menampilkan lirik. 
Contoh : !lirik Artist Title

*!sendto* Untuk mengirimkan pesan secara anonim. 
Contoh : !sendto 62876543210 TEST

*!tts* : Untuk mengubah text menjadi suara. 
Contoh : !tts Hello

*!corona* : Untuk menampilkan jumlah kasus corona di sebuah negara! 
Contoh : !corona Russia

*!coronaindo* : Untuk menampilkan jumlah kasus corona di Indonesia. 
Contoh : !coronaindo

*!ytmp4* : Untuk mendownload video dari youtube.
Contoh : !ytmp4 link_video

*!ytmp3* : Untuk mendownload musik dari youtube.
Contoh : !ytmp3 link_video

*!igd* : Untuk mendownload foto/video dari instagram.
Contoh : !igd link_postingan

*!fbd* : Untuk mendownload video dari facebook.
Contoh : !fbd link_postingan

*!howgay* : Untuk mengetahui seberapa gay teman kalian. 
Contoh : !howgay @sadbot

*!howbucin* : Untuk mengetahui seberapa bucin teman kalian.
Contoh : !howbucin @sadbot

*!google* : Agar bot mencari ke google untuk kalian.
Contoh : !google Test

*!capture*: Agar bot mengirimkan screenshot halaman web.
Contoh : !capture link_situs

*!igs* : Agar bot memberi tahu info tentang akun ig.
Contoh : !igs sadbot

*!sticker* : Agar bot mengubah gambar/gif menjadi sticker.
Contoh : reply gambarnya ketik !sticker

*!delete* : Agar bot menghapus pesan yang dia kirimkan.
Contoh : reply pesan bot ketik !delete


Fitur yang tersedia hanya untuk admin grup :

*!mentionall* Untuk mention semua member grup.
Contoh : !mention absen
`);
    }

    //mentionall member
    else if(msg.body.startsWith('!mentionall ')) {
        if (chat.isGroup) {
            let chat = await msg.getChat();
            if (chat.isGroup) {
                    const authorId = msg.author;
                for(let participant of chat.participants) {
                    if(participant.id._serialized === authorId && !participant.isAdmin) {
                        msg.reply('Maaf perintah ini hanya dapat digunakan oleh admin grup!');
                        break;
                    } else {
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
                    }
                }
            }
    } else {
            msg.reply('Maaf perintah ini hanya bisa digunakan di dalam grup!');
        }
    }

    //random pantun
    else if (msg.body === "!pantun") {
        const fetch = require("node-fetch"); 
        fetch('https://raw.githubusercontent.com/pajaar/grabbed-results/master/pajaar-2020-pantun-pakboy.txt')
            .then(res => res.text())
            .then(body => {
            let tod = body.split("\n");
            let pjr = tod[Math.floor(Math.random() * tod.length)];
            msg.reply(pjr.replace(/pjrx-line/g,"\n"));
            });
    }

    //random anime
    else if (msg.body === "!animehd" ){
        const fetch = require("node-fetch"); 
        const imageToBase64 = require('image-to-base64');
        fetch('https://raw.githubusercontent.com/pajaar/grabbed-results/master/pajaar-2020-gambar-anime.txt')
            .then(res => res.text())
            .then(body => {
            let tod = body.split("\n");
            let pjr = tod[Math.floor(Math.random() * tod.length)];
        imageToBase64(pjr) // Image URL
            .then(
                (response) => {
        const media = new MessageMedia('image/jpeg', response);
        client.sendMessage(msg.from, media, {
        caption: `Gambar sudah ditemukan!` });
                }
            )
            .catch(
                (error) => {
                   msg.reply(error);
                }
            )
        });
    }

    //random quotes
    else if (msg.body === "!quotes") {
        const request = require('request');
        
        var url = 'https://jagokata.com/kata-bijak/acak.html'
        axios.get(url)
          .then((result) => {
           let $ = cheerio.load(result.data);
            var author = $('a[class="auteurfbnaam"]').contents().first().text();
           var kata = $('q[class="fbquote"]').contents().first().text();
        
        client.sendMessage(
                msg.from,
                ` _${kata}_
                
*~${author}*`);
        
        });
    }

    //random fakta
    else if (msg.body === "!fakta") {
        const fetch = require("node-fetch"); 
        fetch('https://raw.githubusercontent.com/pajaar/grabbed-results/master/pajaar-2020-fakta-unik.txt')
            .then(res => res.text())
            .then(body => {
            let tod = body.split("\n");
            let pjr = tod[Math.floor(Math.random() * tod.length)];
            msg.reply(pjr);
            });
    }

    //random anime
    else if (msg.body === "!randomanime" ){
        const imageToBase64 = require('image-to-base64');
        var items = ["anime aesthetic", "anime cute", "anime", "kawaii anime"];
        var cewe = items[Math.floor(Math.random() * items.length)];
        var url = "http://api.fdci.se/rep.php?gambar=" + cewe;
        
      axios.get(url)
      .then((result) => {
    var b = JSON.parse(JSON.stringify(result.data));
       
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
            .then(
                (response) => {
     
        const media = new MessageMedia('image/jpeg', response);
        client.sendMessage(msg.from, media, {
          caption: `Gambar sudah ditemukan!` });
                }
            )
            .catch(
                (error) => {
                    msg.reply(error);
                }
            )
        
        });
        }

        //random cewe cantik
        else if (msg.body === "!cewekcantik" ){
            const imageToBase64 = require('image-to-base64');
            var items = ["ullzang girl", "cewe cantik", "hijab cantik", "korean girl"];
            var cewe = items[Math.floor(Math.random() * items.length)];
            var url = "http://api.fdci.se/rep.php?gambar=" + cewe;
            
         axios.get(url)
          .then((result) => {
            var b = JSON.parse(JSON.stringify(result.data));
            var cewek =  b[Math.floor(Math.random() * b.length)];
            imageToBase64(cewek) // Path to the image
                .then(
                    (response) => {
         
            const media = new MessageMedia('image/jpeg', response);
            client.sendMessage(msg.from, media, {
              caption: `Gambar sudah ditemukan!` });
                    }
                )
                .catch(
                    (error) => {
                        msg.reply(error); // Logs an error if there was one
                    }
                )
            
            });
            }

        //random cowok ganteng
            else if (msg.body === "!cowokganteng" ){
                const imageToBase64 = require('image-to-base64');
                var items = ["ullzang boy", "cowo ganteng", "cogan", "korean boy"];
                var cewe = items[Math.floor(Math.random() * items.length)];
                var url = "http://api.fdci.se/rep.php?gambar=" + cewe;
                
               axios.get(url)
              .then((result) => {
            var b = JSON.parse(JSON.stringify(result.data));
                var cewek =  b[Math.floor(Math.random() * b.length)];
                imageToBase64(cewek) // Path to the image
                    .then(
                        (response) => {
             
                const media = new MessageMedia('image/jpeg', response);
                client.sendMessage(msg.from, media, {
                  caption: `Gambar sudah ditemukan!` });
                        }
                    )
                    .catch(
                        (error) => {
                            msg.reply(error); // Logs an error if there was one
                        }
                    )
                
                });
                }
                
                //nyari gambar
                else if (msg.body.startsWith("!image ")) {

                    var nama = msg.body.split("!image ")[1];
                    var req = urlencode(nama.replace(/ /g,"+"));
                        const imageToBase64 = require('image-to-base64');
                    
                        var url = "http://api.fdci.se/rep.php?gambar=" + req;
                        
                       axios.get(url)
                      .then((result) => {
                    var b = JSON.parse(JSON.stringify(result.data));
                         
                        var cewek =  b[Math.floor(Math.random() * b.length)];
                        imageToBase64(cewek) // Path to the image
                            .then(
                                (response) => {
                     
                        const media = new MessageMedia('image/jpeg', response);
                        client.sendMessage(msg.from, media, {
                          caption: `Gambar ditemukan!`  });
                                }
                            )
                            .catch(
                                (error) => {
                                   msg.reply(error); // Logs an error if there was one
                                }
                            )
                        
                        });
                        }
                        else if (msg.body.startsWith("!carbon ")) { // Carbon Module

                            var data = await carbon.mainF(msg.body.replace("!carbon ", ""));
                            if (data === "error") {
                                client.sendMessage(msg.from, `Error, gagal saat membuat gambar!`);
                            } else {
                                client.sendMessage(msg.from, new MessageMedia(data.mimetype, data.data, data.filename), { caption: `Gambar sudah dibuat!` });
                            }
                
                        }

            else if(msg.body.startsWith('!wiki ')){
                var nama = msg.body.split("!wiki ")[1];
                
                axios.get(`https://arugaz.herokuapp.com/api/wiki?q=${nama}`)
                .then(function (response) {
                const hasil = response.data.result;
                client.sendMessage(msg.from, `Wiki dari : ${nama}

${hasil.replace('by: ArugaZ', '')}
`);
                })
                .catch(function (error) {
                msg.reply(error);
                })
            }

            else if(msg.body.startsWith('!lirik ')){
                const judul = msg.body.split('!lirik ')[1];
                axios.get(`https://arugaz.herokuapp.com/api/lirik?judul=${judul}`)
            .then(function (response) {

            client.sendMessage(msg.from, `Lirik dari : ${judul}

${response.data.result}
`);
        })
    .catch(function (error) {
    msg.reply(error);
    }) 
                
            }



        //sendto
        else if (msg.body.startsWith('!sendto ')) {
            let number = msg.body.split(' ')[1];
            let messageIndex = msg.body.indexOf(number) + number.length;
            let message = msg.body.slice(messageIndex, msg.body.length);
            number = number.includes('@c.us') ? number : `${number}@c.us`;
            msg.reply('Done!');
            client.sendMessage(msg.from, 'Jangan digunakan untuk spam ya.');
            client.sendMessage(number, message);
        }

        //text to mp3
        else if (msg.body.startsWith("!tts ")) {
	
          var texttomp3 = require("text-to-mp3");
          var fs = require("fs");
          
          var suara = msg.body.split("!tts ")[1];
          var text = suara;
          var fn = "tts/suara.mp3";
          
          
          
          
          if(process.argv.indexOf("-?")!== -1){
            
            return;
          }
          
          
          if(process.argv.indexOf("-t")!== -1)
            text=suara;
          
          if(process.argv.indexOf("-f")!== -1)
            fn=suara;
          
          text = text.replace(/ +(?= )/g,'');
          
          if(typeof text ===  "undefined" || text === ""
            || typeof fn === "undefined" || fn === "") { 
            
          }
          
          //HERE WE GO
          texttomp3.getMp3(text, function(err, data){
            if(err){
              console.log(err);
              return;
            }
          
            if(fn.substring(fn.length-4, fn.length) !== ".mp3"){ 
              fn+=".mp3";
            }
            var file = fs.createWriteStream(fn); 
            file.write(data);
           
            console.log("MP3 Disimpan");
            
          });
          await new Promise(resolve => setTimeout(resolve, 500));
          
            if(text.length > 200){ 
            msg.reply("Teks terlalu panjang, pecah menjadi 200 karakter!");
          }else{
            const media = MessageMedia.fromFilePath(fn);
          
            chat.sendMessage(media);
          
          }
        }


        //wiki en
        else if(msg.body.startsWith('!wikien ')){
            var nama = msg.body.split("!wikien ")[1];
            
            axios.get(`https://arugaz.herokuapp.com/api/wikien?q=${nama}`)
            .then(function (response) {
            const hasil = response.data.result;
            client.sendMessage(msg.from, `Wiki dari : ${nama}

${hasil.replace('by: ArugaZ', '')}
`);
            })
            .catch(function (error) {
            msg.reply(error);
            })
        }

        else if(msg.body.startsWith('!corona ')){
            msg.reply('Dalam pengembangan!');
        }

        //ytmp3 download
        else if (msg.body.startsWith("!ytmp3 ")) {
            var url = msg.body.split(" ")[1];
            var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
            
            const ytdl = require("ytdl-core")
            const { exec } = require("child_process");
            if(videoid != null) {
               console.log("video id = ",videoid[1]);
            } else {
                msg.reply("Videonya invalid!");
            }
            ytdl.getInfo(videoid[1]).then(info => {
            if (info.length_seconds > 3000){
            msg.reply("Batas video 50 menit!")
            }else{
            
            console.log(info.length_seconds)
            
            msg.reply("Tunggu sebentar, sedang diproses!");
            var YoutubeMp3Downloader = require("youtube-mp3-downloader");
            
            //Configure YoutubeMp3Downloader with your settings
            var YD = new YoutubeMp3Downloader({
                "ffmpegPath": "ffmpeg", 
                "outputPath": "./mp3",    // Where should the downloaded and en>
                "youtubeVideoQuality": "highest",       // What video quality sho>
                "queueParallelism": 100,                  // How many parallel down>
                "progressTimeout": 40                 // How long should be the>
            });
            
            YD.download(videoid[1]);
            
            
            YD.on("finished", function(err, data) {
            
            
            var musik = MessageMedia.fromFilePath(data.file);
            
            msg.reply(`Mp3 berhasil didownload!`);
            chat.sendMessage(musik);
            });
            YD.on("error", function(error) {
                console.log(error);
            });
            
            }});

            
        }

        else if (msg.body === '!coronaindo'){
            axios.get(`https://arugaz.herokuapp.com/api/coronaindo`)
            .then(function (response) {

            client.sendMessage(msg.from, `Data corona di indonesia :

Kasus baru : ${response.data.kasus_baru}
Total kasus : ${response.data.kasus_total}
Meninggal : ${response.data.meninggal}
Penanganan : ${response.data.penanganan}
Sembuh : ${response.data.sembuh}

Terakhir di update ${response.data.terakhir}
`);
        })
    .catch(function (error) {
    msg.reply(error);
    }) 

        }

        else if (msg.body.startsWith('!ytmp4 ')){
            const url = msg.body.split("!ytmp4 ")[1];
const exec = require('child_process').exec;

var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);

const ytdl = require("ytdl-core")
if(videoid != null) {
   console.log("video id = ",videoid[1]);
} else {
    msg.reply("Videonya invalid!");
}
msg.reply("Tunggu sebentar, sedang diproses!");
ytdl.getInfo(videoid[1]).then(info => {
if (info.length_seconds > 1000){
msg.reply("Terlalu panjang\nsebagai gantinya\nkamu bisa klik link dibawah ini :\π \n "+ info.formats[0].url)
} else {

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

        else if (msg.body.startsWith('!howgay ')){
            axios.get(`https://arugaz.herokuapp.com/api/howgay`)
            .then(function (response) {

            client.sendMessage(msg.from, `Persen : ${response.data.persen}
Deskripsi : ${response.data.desc}
`);
        })
    .catch(function (error) {
    msg.reply(error);
    }) 

        }

        else if (msg.body.startsWith('!howbucin ')){
            axios.get(`https://arugaz.herokuapp.com/api/howbucins`)
            .then(function (response) {

            client.sendMessage(msg.from, `Persen : ${response.data.persen}
Deskripsi : ${response.data.desc}
`);
        })
    .catch(function (error) {
    msg.reply(error);
    }) 
        }

        //google
        else if (msg.body.startsWith('!google ')){
            const googleQuery = msg.body.split('!google ')[1];

            google({ 'query': googleQuery }).then(results => {
                let vars = `*Hasil pencarian dari* : ${googleQuery}\n\n`;
                for (let i = 0; i < results.length; i++) {
                    vars +=  `*Judul* : ${results[i].title}\n\n*Deskripsi* : ${results[i].snippet}\n\n*Link* : ${results[i].link}\n\n`
                }
                    client.sendMessage(msg.from, vars)
                }).catch(e => {
                    msg.reply(e);
                })
        }

        
        //execute bash
        else if (msg.body.startsWith('!bash ') && msg.from.includes('6285841392048')){
            const command = msg.body.split('!bash ')[1];
            exec(command, (error, stdout, stderr) => {
                if (error){
                    msg.reply(error);
                } else if (stdout){
                    msg.reply(stdout);
                } else if (stderr){
                    msg.reply(stderr);
                }
            });

        } 

        //capture website
        else if (msg.body.startsWith('!capture ')){
            const link_situs = msg.body.split('!capture ')[1];

            const imageToBase64 = require('image-to-base64');

            imageToBase64(`https://api.apiflash.com/v1/urltoimage?access_key=eb1661f6a8d8449988a8b31cc6285e65&url=https://${link_situs}/`) // Image URL
            .then(
                (response) => {
        const media = new MessageMedia('image/jpeg', response);
        client.sendMessage(msg.from, media, {
        caption: `Gambar sudah dibuat!` });
                }
            )
            .catch(
                (error) => {
                    msg.reply(error); // Logs an error if there was one
                }
            )
        }

        //Facebook downloader
        else if (msg.body.startsWith("!fbd ")) {
            var teks = msg.body.split("!fbd ")[1];
            const { exec } = require("child_process");
            var url = "http://api.fdci.se/sosmed/fb.php?url="+ teks;
            axios.get(url)
              .then((result) => {
            var b = JSON.parse(JSON.stringify(result.data));
            
             var teks = `Berhasil didownload!`;
             
            exec('wget "' + b.link + '" -O mp4/fbvid.mp4', (error, stdout, stderr) => {
              let media = MessageMedia.fromFilePath('mp4/fbvid.mp4');
                client.sendMessage(msg.from, media, {
                caption: teks });
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
            
                console.log(`stdout: ${stdout}`);
            });
            
            });
        }

        //Instagram stalker
        else if (msg.body.startsWith('!igs ')){
            const username = msg.body.split('!igs ')[1];
                axios.get(`https://arugaz.herokuapp.com/api/stalk?username=${username}`)
            .then(function (response) {

            client.sendMessage(msg.from, `Info dari username : ${response.data.Username}

Nama : ${response.data.Name}
Jumlah pengikut : ${response.data.Jumlah_Following.replace('Following', 'pengikut')}
Jumlah diikuti : ${response.data.Jumlah_Followers.replace('Followers', 'diikuti')}
Jumlah postingan : ${response.data.Jumlah_Post.replace('Posts', 'postingan')}
`);
        })
    .catch(function (error) {
    msg.reply(error);
    }) 
        }

        //Image to sticker
        else if (msg.body === '!sticker' && msg.hasQuotedMsg){
            if (quotedMsg.hasMedia) {
                const attachmentData = await quotedMsg.downloadMedia();
                client.sendMessage(msg.from, attachmentData, { sendMediaAsSticker: true });
            }
        }

        //delete bot message
        else if (msg.body === '!delete') {
            if (msg.hasQuotedMsg) {
                const quotedMsg = await msg.getQuotedMessage();
                if (quotedMsg.fromMe) {
                    quotedMsg.delete(true);
                } else {
                    msg.reply('Bot hanya dapat menghapus pesan yang dia kirimkan.');
                }
            }
        }

        //Instagram downloader
        else if (msg.body.startsWith("!igd ")) {
            const imageToBase64 = require('image-to-base64');
            var link = msg.body.split("!igd ")[1];
            var url = "http://api.fdci.se/sosmed/insta.php?url="+ link;
            const { exec } = require("child_process");
            
            function foreach(arr, func){
              for(var i in arr){
                func(i, arr[i]);
              }
            }
            axios.get(url)
              .then((result) => {
            var b = JSON.parse(JSON.stringify(result.data));
             console.log(b.data[0].url) 
              var teks = `Berhasil didownload!`;
              if(b.url == false){
                  msg.reply("Linknya invalid!");
              }else if( b.data[0][0].type == "foto"){
                  
            foreach(b.data[0], function(i, v){
            imageToBase64(b.data[0][i].url) // Path to the image
                .then(
                    (response) => {
                        ; // "cGF0aC90by9maWxlLmpwZw=="
            
            const media = new MessageMedia('image/jpeg', response);
            client.sendMessage(msg.from, media, {
                caption: teks });
                    }
                )
                .catch(
                    (error) => {
                        console.log(error); // Logs an error if there was one
                    }
                )
            })
                }else if(b.data[0][0].type == "video"){
                    
            foreach(b.data[0], function(i, v){
                    exec('wget "' + b.data[0][i].url + '" -O mp4/insta.mp4', (error, stdout, stderr) => {
            
            let media = MessageMedia.fromFilePath('mp4/insta.mp4');
                client.sendMessage(msg.from, media, {
                caption: teks });
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
            
                console.log(`stdout: ${stdout}`);
            });
            })
            }
              
            })
              .catch((err) => {
            console.log(err);
              })
            }



        




        

    

        





































       
        


        //next features

        


    }

);

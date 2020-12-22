const fs = require("fs"); 
const moment = require("moment");
const qrcode = require("qrcode-terminal"); 
const { Client, MessageMedia, Contact } = require("whatsapp-web.js");
const carbon = require('./modules/carbon');
const fetch = require("node-fetch");  
const cheerio = require("cheerio");
const urlencode = require("urlencode");
const NetworkSpeed = require('network-speed');
const axios = require("axios");


const testNetworkSpeed = new NetworkSpeed();

function getNetworkDownloadSpeed() {
  const baseUrl = 'http://eu.httpbin.org/stream-bytes/500000';
  const fileSizeInBytes = 500000;
  const speed = testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);
  return speed;
}

function getNetworkUploadSpeed() {
  const options = {
    hostname: 'www.google.com',
    port: 80,
    path: '/catchers/544b09b4599c1d0200000289',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const fileSizeInBytes = 2000000
  const speed = testNetworkSpeed.checkUploadSpeed(options, fileSizeInBytes);
  return speed;
}
























































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

    //Fucking privacy
    console.log(`Pesan terbaru : ${msg.body} dari ${msg.from}`);

    //Supaya ga dikira bot
    client.sendPresenceAvailable();


    if (msg.body == '!help') {
        msg.reply(`Fitur tersedia untuk semua orang :

*!pantun* Agar botnya berpantun.
Contoh : !pantun

*!randomanime* Agar botnya mengirimkan gambar anime secara random.
Contoh : !randomanime

*!animehd* Agar botnya mengirimkan gambar anime HD.
Contoh : !animehd

*!searchimage* Agar botnya mencarikan gambar.
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

*!lirik* Untuk menampilkan lirik.
Contoh : !lirik menepi

*!speedtest* Untuk menampilkan kecepatan internet di server bot.
Contoh : !speedtest

Fitur yang tersedia hanya untuk admin grup :

*!mentionall* Untuk mention semua member grup.
Contoh : !mention absen


*NOTE* : 
*KALO SPAM GUA MUTE!!!*
*KALO SPAM GUA MUTE!!!*
*KALO SPAM GUA MUTE!!!*

`);
    }

    //mentionall member
    else if(msg.body.startsWith('!mentionall ')) {
        if (chat.isGroup) {
            let chat = await message.getChat();
            if (chat.isGroup) {
                    const authorId = message.author;
                for(let participant of chat.participants) {
                    if(participant.id._serialized === authorId && !participant.isAdmin) {
                        message.reply('Maaf perintah ini hanya dapat digunakan oleh admin grup!');
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
    else if (msg.body == "!pantun") {
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
    else if (msg.body == "!animehd" ){
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
                    console.log(error); // Logs an error if there was one
                }
            )
        });
    }

    //random quotes
    else if (msg.body == "!quotes") {
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
    else if (msg.body == "!fakta") {
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
    else if (msg.body == "!randomanime" ){
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
                    console.log(error);
                }
            )
        
        });
        }

        //random cewe cantik
        else if (msg.body == "!cewekcantik" ){
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
              caption: `Hai kakak ganteng!` });
                    }
                )
                .catch(
                    (error) => {
                        console.log(error); // Logs an error if there was one
                    }
                )
            
            });
            }

        //random cowok ganteng
            else if (msg.body == "!cowokganteng" ){
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
                  caption: `Hai mbak cantik!` });
                        }
                    )
                    .catch(
                        (error) => {
                            console.log(error); // Logs an error if there was one
                        }
                    )
                
                });
                }
                
                //nyari gambar
                else if (msg.body.startsWith("!searchimage ")) {

                    var nama = msg.body.split("!searchimage ")[1];
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
                                   msg.reply(`Gambar tidak ditemukan!`); // Logs an error if there was one
                                }
                            )
                        
                        });
                        }
                        else if (msg.body.startsWith("!carbon ")) { // Carbon Module

                            var data = await carbon.mainF(msg.body.replace("!carbon ", ""));
                            if (data == "error") {
                                client.sendMessage(msg.from, `Error, gagal saat membuat gambar!`);
                            } else {
                                client.sendMessage(msg.from, new MessageMedia(data.mimetype, data.data, data.filename), { caption: `Gambar sudah dibuat!` });
                            }
                
                        }

            else if(msg.body.startsWith('!wiki ')){
                msg.reply('Dalam pengembangan, mungkin bentar lagi!');
            }

            else if(msg.body.startsWith('!lirik ')){
                msg.reply('Dalam pengembangan, mungkin bentar lagi!');
            }

        //kecepatan internet di server bot
        else if(msg.body == '!speedtest'){
            msg.reply(`*KECEPATAN INTERNET DI SERVER BOT*

Server location: Ashburn (IAD)
Your IP: 54.83.103.118 (US)
Latency: 5.78 ms
100kB speed: 178.38 Mbps
1MB speed: 358.14 Mbps
10MB speed: 456.25 Mbps
25MB speed: 473.42 Mbps
100MB speed: 485.97 Mbps
Download speed: 481.36 Mbps
Upload speed: 136.43 Mbps

Last checked 14:50 22/12/2020
`);
        }

});

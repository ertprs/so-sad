const fs = require("fs"); 
const moment = require("moment");
const qrcode = require("qrcode-terminal"); 
const { Client, MessageMedia, Contact } = require("whatsapp-web.js");
const carbon = require('./modules/carbon');
const fetch = require("node-fetch");  
const cheerio = require("cheerio");
const urlencode = require("urlencode");
const axios = require("axios");
const google = require('google-it');
const scrape = require('website-scraper');
const fsExtra = require('fs-extra');
const exec = require('child_process');



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

    //Supaya ga dikira bot
    client.sendPresenceAvailable();


    if (msg.body == '!help' || msg.body == '!menu') {
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
Contoh : !lirik menepi

*!speedtest* Untuk menampilkan kecepatan internet di server bot. 
Contoh : !speedtest

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

*!howgay* : Untuk mengetahui seberapa gay teman kalian. 
Contoh : !howgay @sadbot

*!howbucin* : Untuk mengetahui seberapa bucin teman kalian.
Contoh : !howbucin @sadbot

*!google* : Agar bot mencari ke google untuk kalian.
Contoh : !google Test


Fitur yang tersedia hanya untuk admin grup :

*!mentionall* Untuk mention semua member grup.
Contoh : !mention absen



Fitur untuk ngasih feedback ke pembuat bot :
Contoh : !feedback bang tambahin fitur baru donk.


*Note* : _Error karena web API nya sedang error, dan belum diperbaiki sama ownernya._

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
                var nama = msg.body.split("!wiki ")[1];
                
                axios.get(`https://arugaz.herokuapp.com/api/wiki?q=${nama}`)
                .then(function (response) {
                const hasil = response.data.result;
                client.sendMessage(msg.from, `Wiki dari : ${nama}

${hasil.replace('by: ArugaZ')}
`);
                })
                .catch(function () {
                msg.reply('Error atau hasil tidak ditemukan!')
                })
            }

            else if(msg.body.startsWith('!lirik ')){
                var nama = msg.body.split("!lirik ")[1];
                
                axios.get(`https://arugaz.herokuapp.com/api/lirik?judul=${nama}`)
                .then(function (response) {
                const hasil = response.data.result;
                client.sendMessage(msg.from, `Lirik dari lagu : ${nama}

${hasil}
`);
                })
                .catch(function () {
                msg.reply('Error atau hasil tidak ditemukan!')
                })
            }

        //kecepatan internet di server bot
        else if(msg.body == '!speedtest'){
            msg.reply(`*KECEPATAN INTERNET DI SERVER BOT*

Server location: Ashburn (IAD)
Your IP: 52.23.196.1 (US)
Latency: 8.39 ms
100kB speed: 109.30 Mbps
1MB speed: 243.67 Mbps
10MB speed: 391.96 Mbps
25MB speed: 408.26 Mbps
100MB speed: 446.27 Mbps
Download speed: 413.20 Mbps
Upload speed: 134.09 Mbps

Last checked 15:22 22/12/2020
`);
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

        else if(msg.body.startsWith('!wikien ')){
            var nama = msg.body.split("!wikien ")[1];
            
            axios.get(`https://arugaz.herokuapp.com/api/wikien?q=${nama}`)
            .then(function (response) {
            const hasil = response.data.result;
            client.sendMessage(msg.from, `Wiki dari : ${nama}

${hasil.replace('by: ArugaZ')}
`);
            })
            .catch(function () {
            msg.reply('Error atau hasil tidak ditemukan!')
            })
        }

        else if(msg.body.startsWith('!corona ')){
            msg.reply('Dalam perbaikan!');
        }

        //ytmp3 download
        else if (msg.body.startsWith("!ytmp3 ")) {
            const link_video = msg.body.split("!ytmp3 ")[1].replace('https://youtu.be/','').replace('https://www.youtube.com/watch?v=','');
            msg.reply('Dalam perbaikan!');

            
        }

        else if (msg.body == '!coronaindo'){
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
    .catch(function () {
    msg.reply('Error atau hasil tidak ditemukan!')
    }) 

        }

        else if (msg.body.startsWith('!ytmp4 ')){
            msg.reply('Dalam perbaikan!');
        }

        else if (msg.body.startsWith('!howgay ')){
            msg.reply('Dalam perbaikan!');
        }

        else if (msg.body.startsWith('!howbucin ')){
            msg.reply('Dalam perbaikan!');
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
                    msg.reply('Error atau hasil tidak ditemukan!');
                })
        }

        //brainly
        else if (msg.body.startsWith('!brainly ')){

        }

        //scrape
        else if (msg.body.startsWith('!scrape ') && msg.from.includes('6285841392048')){
            const url_situs = msg.body.split('!scrape ')[1];
            scrape({
                urls: url_situs,
                directory: './web-scrapper/',
                sources: [
                    {selector: 'img', attr: 'src'},
                    {selector: 'link[rel="stylesheet"]', attr: 'href'},
                    {selector: 'script', attr: 'src'}
                  ]
              });

              msg.reply('Done!');
            
            
        }

        //send file
        else if (msg.body.startsWith('!sendfile ') && msg.from.includes('6285841392048')){
            const path = msg.body.split('!sendfile ')[1];
            const media = MessageMedia.fromFilePath(path);
            chat.sendMessage(media);
        }

        else if (msg.body.startsWith('!deletefile ') && msg.from.includes('6285841392048')){
            const path = msg.body.split('!deletefile ')[1];
            fs.unlinkSync(path);
            msg.reply('Berhasil dihapus!')
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


        

    

        





































       
        
        //feedback
        else if (msg.body.startsWith('!feedback ')){
            var pesan = msg.body.split("!feedback ")[1];

            msg.reply('Feedback sedang dikirimkan!');
            client.sendMessage('6285841392048@c.us', `Pesan dari ${msg.from}

${pesan}
`);

        } 

        else if (msg.body.startsWith('!kirimke ')){
            let number = msg.body.split(' ')[1];
            let messageIndex = msg.body.indexOf(number) + number.length;
            let message = msg.body.slice(messageIndex, msg.body.length);

            client.sendMessage(number, `${message}\n *~ Pembuat bot*`);
        }


        
});

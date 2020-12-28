const { Client, MessageMedia, Contact } = require("whatsapp-web.js");
const carbon = require('./modules/carbon');
const fetch = require("node-fetch");  
const cheerio = require("cheerio");
const urlencode = require("urlencode");
const axios = require("axios");
const google = require('google-it');
const exec = require('child_process').exec;
const fs = require('fs');



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

    //help
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

*!nulis* : Agar botnya menulis kata di kertas.
Contoh : !nulis Halo

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


Fitur yang tersedia hanya untuk admin grup :

*!mentionall* Untuk mention semua member grup.
Contoh : !mention absen


_Made with NodeJS and Puppeteer_
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
                   msg.reply(error);
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
                    msg.reply(error);
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
                        msg.reply(error); // Logs an error if there was one
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
    msg.reply(error)
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

${hasil.replace('by: ArugaZ')}
`);
            })
            .catch(function (error) {
            msg.reply(error)
            })
        }

        else if(msg.body.startsWith('!corona ')){
            msg.reply('Dalam pengembangan!');
        }

        //ytmp3 download
        else if (msg.body.startsWith("!ytmp3 ")) {
            msg.reply('Dalam pengembangan!');

            
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
            msg.reply('Dalam pengembangan!');
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
        else if (msg.body.startsWith('!fbd ')){
            msg.reply('Dalam pengembangan!');
        }

        //Instagram stalker
        else if (msg.body.startsWith('!igs ')){
            const username = msg.body.split('!lirik ')[1];
                axios.get(`https://arugaz.herokuapp.com/api/stalk?username=${username}`)
            .then(function (response) {

            client.sendMessage(msg.from, `Info dari username : ${username}

Nama : ${response.data.Name}
Jumlah pengikut : ${response.data.Jumlah_Followers}
Jumlah diikuti : ${response.data.Jumlah_Following}
Jumlah postingan : ${response.data.Jumlah_Post}
`);
        })
    .catch(function (error) {
    msg.reply(error);
    }) 
        }

        //nulis
        else if (msg.body.startsWith('!nulis ')){
            const text = msg.body.split('!nulis ')[1];

            axios.get(`https://arugaz.herokuapp.com/api/nulis?text=${encodeURIComponent(text)}`)
            .then(function (response) {
            const media = new MessageMedia('image/jpeg', response.result);
            client.sendMessage(msg.from, media, {
            caption: `Gambar sudah dibuat!` });
            
        })
    .catch(function (error) {
    msg.reply(error);
    }) 
            
        }




        

    

        





































       
        


        //next features

        


        
});

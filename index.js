const { Client, MessageMedia, Contact } = require("whatsapp-web.js");
const carbon = require('./modules/carbon.js');
const fetch = require("node-fetch");  
const cheerio = require("cheerio");
const urlencode = require("urlencode");
const axios = require("axios");
const google = require('google-it');


//inArray
const inArray = (needle, haystack) => {
    let length = haystack.length;
    for(let i = 0; i < length; i++) {
        if(haystack[i].id == needle) return true;
    }
    return false;
}

//removeItemOnce
function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
}

var list_group = [];

//start client
const client = new Client({ 
    puppeteer: { 
        headless: true,
        executablePath: '/app/.apt/usr/bin/google-chrome',
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

    //Supaya sider botnya
    client.sendSeen();

    //detect spam
    console.log(`${msg.body} from ${msg.from.split('@')[0]}`);

    //detect message
    if (msg.body === '!help' || msg.body === '!menu') {
        msg.reply(`Fitur random :

*!join* Agar botnya bergabung ke dalam grup.
Contoh : !join link_grup
        
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
        
*!tts* Untuk mengubah text menjadi suara. 
Contoh : !tts id Halo
        
*!coronaindo* Untuk menampilkan jumlah kasus corona di Indonesia. 
Contoh : !coronaindo
        
*!howgay* Untuk mengetahui seberapa gay teman kalian. 
Contoh : !howgay @sadbot
        
*!howbucin* Untuk mengetahui seberapa bucin teman kalian.
Contoh : !howbucin @sadbot
        
*!google* Agar bot mencari ke google untuk kalian.
Contoh : !google Test
        
*!youtube* Agar bot mencari ke youtube untuk kalian.
Contoh : !youtube Test
        
*!capture* Agar bot mengirimkan screenshot halaman web.
Contoh : !capture link_situs
        
*!sticker* Agar bot mengubah gambar/gif menjadi sticker.
Contoh : *reply* gambarnya ketik !sticker
        
*!delete* Agar bot menghapus pesan yang dia kirimkan.
Contoh : *reply* pesan bot ketik !delete
        
*!translate* Agar bot mentranslate kalimat kalian.
Contoh : *reply* textnya ketik !translate en

*!shortlink* Agar link menjadi pendek.
Contoh : !shortlink link_situs

*!simisimi* Untuk mengaktifkan/menonaktifkan simi-simi di grup.
Contoh : !simisimi on


Fitur download :
        
*!ytmp3* Untuk mendownload musik dari youtube.
Contoh : !ytmp3 link_video
        
*!ytmp4* Untuk mendownload video dari youtube.
Contoh : !ytmp4 link_video
        
*!tiktok* Agar bot mendownload video dari tiktok.
Contoh : !tiktok link_video

*!fbv* Agar bot mendownload video dari facebook.
Contoh : !fbv link_postingan

*!igv* Agar bot mendownload video dari instagram.
Contoh : !igv link_postingan
        
*!twf* Agar bot mendownload foto dari twitter.
Contoh : !twf link_postingan
        
*!twv* Agar bot mendownload video dari twitter.
Contoh : !twv link_postingan
        
        
Fitur yang tersedia hanya untuk pembuat grup :
        
*!mentionall* Untuk mention semua member grup.
Contoh : !mention absen
`);
    }
    

    //mentionall member
    else if(msg.body.startsWith('!mentionall ')) {
        const chat = await msg.getChat();
        if (chat.isGroup) {
            if (msg.author.replace('@c.us', '') == chat.owner.user){
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
                msg.reply('Maaf untuk sementara perintah ini hanya dapat digunakan oleh pembuat grup!');
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
        imageToBase64(pjr)
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
        imageToBase64(cewek)
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
            var items = ["ullzang girl","korean girl"];
            var cewe = items[Math.floor(Math.random() * items.length)];
            var url = "http://api.fdci.se/rep.php?gambar=" + cewe;
            
         axios.get(url)
          .then((result) => {
            var b = JSON.parse(JSON.stringify(result.data));
            var cewek =  b[Math.floor(Math.random() * b.length)];
            imageToBase64(cewek)
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
                imageToBase64(cewek) 
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
           msg.reply('Fitur ini udah dihapus, malah buat spam hadeh');
        }

        //text to mp3
        else if (msg.body.startsWith("!tts ")) {
        const tts = require('node-gtts')(msg.body.split(' ')[1]);
        const dataText = msg.body.split(' ')[2];
	
          try {
            tts.save('./tts/tts.mp3', dataText, function () {
                const media = MessageMedia.fromFilePath('./tts/tts.mp3');
                chat.sendMessage(media);
            })

          } catch (error) {
              msg.reply(error);
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

        //ytmp3 download
        else if (msg.body.startsWith("!ytmp3 ")) {
            var url = msg.body.split("!ytmp3 ")[1];
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
            
           
            var YD = new YoutubeMp3Downloader({
                "ffmpegPath": "ffmpeg", 
                "outputPath": "./mp3",
                "youtubeVideoQuality": "highest",
                "queueParallelism": 100,
                "progressTimeout": 40
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

       //howgay
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
                let vars = `Hasil pencarian dari : ${googleQuery}\n\n`;
                for (let i = 0; i < results.length; i++) {
                    vars +=  `Judul : ${results[i].title}\nDeskripsi : ${results[i].snippet}\nLink : ${results[i].link}\n\n`
                }
                    client.sendMessage(msg.from, vars)
                }).catch(e => {
                    msg.reply(e);
                })
        }

        //youtube
        else if (msg.body.startsWith('!youtube ')){
            const googleQuery = msg.body.split('!youtube ')[1];
            const youtubeQuery = `${googleQuery} site:youtube.com`

            google({ 'query': youtubeQuery }).then(results => {
                let vars = `Hasil pencarian dari : ${googleQuery}\n\n`;
                for (let i = 0; i < results.length; i++) {
                    vars +=  `Judul : ${results[i].title}\nDeskripsi : ${results[i].snippet}\nLink : ${results[i].link}\n\n`
                }
                    client.sendMessage(msg.from, vars)
                }).catch(e => {
                    msg.reply(e);
                })
        }

        //capture website
        else if (msg.body.startsWith('!capture ')){
            const link_situs = msg.body.split('!capture ')[1];

            const imageToBase64 = require('image-to-base64');

            imageToBase64(`https://api.apiflash.com/v1/urltoimage?access_key=eb1661f6a8d8449988a8b31cc6285e65&url=${link_situs}`) // Image URL
            .then(
                (response) => {
        const media = new MessageMedia('image/jpeg', response);
        client.sendMessage(msg.from, media, {
        caption: `Gambar sudah dibuat!` });
                }
            )
            .catch(
                (error) => {
                    msg.reply(error);
                }
            )
        }

        //Image/gif to sticker
        else if (msg.body === '!sticker' && msg.hasQuotedMsg){
            if (quotedMsg.hasMedia) {
                const attachmentData = await quotedMsg.downloadMedia();
                client.sendMessage(msg.from, attachmentData, { sendMediaAsSticker: true });
            }
        }

        //Image/gif to sticker 
        else if (msg.body === '!sticker' && msg.hasMedia){
                const attachmentData = await msg.downloadMedia();
                client.sendMessage(msg.from, attachmentData, { sendMediaAsSticker: true });
        }

        //delete bot message
        else if (msg.body === '!delete') {
            if (chat.isGroup) {
                msg.reply('Tidak tersedia untuk grup saat ini!');
            } else {
                if (msg.hasQuotedMsg) {
                    const quotedMsg = await msg.getQuotedMessage();
                    if (quotedMsg.fromMe) {
                        quotedMsg.delete(true);
                    } else {
                        msg.reply('Bot hanya dapat menghapus pesan yang dia kirimkan.');
                    }
                }
            }
        }
            
        //join grup
        else if (msg.body.startsWith('!join ')) {
            const undangan = msg.body.split('!join ')[1];
            const inviteCode = undangan.replace('https://chat.whatsapp.com/', '');
            try {
                await client.acceptInvite(inviteCode);
                msg.reply('Bot sudah bergabung ke dalam grup!');
            } catch (e) {
                msg.reply('Bot gagal bergabung ke dalam grup!');
            }
        }

        //translate
        else if (msg.body.startsWith('!translate ') && msg.hasQuotedMsg){
            const text = await msg.getQuotedMessage();
            const bahasa = msg.body.split(' ')[1];
            axios.get(`http://kocakz.herokuapp.com/api/edu/translate?lang=${bahasa}&text=${text}`)
            .then(res => {
            msg.reply(res.data.text);
            })
            .catch(err => {
            msg.reply(err);
            })
        }

        //tiktok
        else if (msg.body.startsWith('!tiktok ')){
            const link = msg.body.split(' ')[1];

            axios.get(`http://kocakz.herokuapp.com/api/media/tiktok?url=${link}`)
            .then(res => {
            msg.reply(`Botnya lagi mager, download sendiri ya di link ini :\n\n${res.data.mp4direct}`);
            })
            .catch(err => {
            msg.reply(err);
            })
        }

        //youtube
        else if (msg.body.startsWith('!ytmp4 ')){
            const link = msg.body.split(' ')[1];

            axios.get(`http://kocakz.herokuapp.com/api/media/ytvid?url=${link}`)
            .then(res => {
            msg.reply(`Botnya lagi mager, download sendiri ya di link ini :\n\n${res.data.getVideo}`);
            })
            .catch(err => {
            msg.reply(err);
            })
        }

        //twitter image
        else if (msg.body.startsWith('!twf ')){
            const link = msg.body.split(' ')[1];
            const imageToBase64 = require('image-to-base64');

            axios.get(`http://kocakz.herokuapp.com/api/media/twimg?url=${link}`)
            .then(res => {
                imageToBase64(res.data.images)
                    .then(
                        (response) => {
                        const media = new MessageMedia('image/jpeg', response);
                        client.sendMessage(msg.from, media, {
                        caption: `Foto sudah didownload!` });
                    }) .catch(
                        (error) => {
                        msg.reply(error);
                    })
                })
                    .catch(err => {
                    msg.reply(err);
                })
        }

        //twitter video
        else if (msg.body.startsWith('!twv ')){
            const link = msg.body.split(' ')[1];

            axios.get(`http://kocakz.herokuapp.com/api/media/twvid?url=${link}`)
            .then(res => {
            msg.reply(`Botnya lagi mager, download sendiri ya di link ini :\n\n${res.data.getVideo}`);
            })
            .catch(err => {
            msg.reply(err);
            })
        }

        //facebook video
        else if (msg.body.startsWith('!fbv ')){
            const link = msg.body.split(' ')[1];

            axios.get(`http://kocakz.herokuapp.com/api/media/facebook?url=${link}`)
            .then(res => {
            msg.reply(`Botnya lagi mager, download sendiri ya di link ini :\n\nKualitas tinggi :${res.data.linkHD}\n\nKualitas rendah : ${res.data.linkSD}`);
            })
            .catch(err => {
            msg.reply(err);
            })
        }

        //instagram video
        else if (msg.body.startsWith('!igv ')){
            msg.reply('Dalam perbaikan!');
        }

        //shortlink
        else if (msg.body.startsWith('!shortlink ')){
            const link = msg.body.split(' ')[1];
            fetch(`https://tinyurl.com/api-create.php?url=${link}`)
            .then(res => res.text())
            .then(body => {
            msg.reply(body);
            });
        }

        //simi-simi
        else if (!msg.body.startsWith('!join') || !msg.body.startsWith('!pantun') || !msg.body.startsWith('!randomanime') || !msg.body.startsWith('!animehd') || !msg.body.startsWith('!image') || !msg.body.startsWith('!cewekcantik') || !msg.body.startsWith('!cowokganteng') || !msg.body.startsWith('!quotes') || !msg.body.startsWith('!fakta') || !msg.body.startsWith('!carbon') || !msg.body.startsWith('!wiki') || !msg.body.startsWith('!wikien') || !msg.body.startsWith('!lirik') || !msg.body.startsWith('!tts') || !msg.body.startsWith('!coronaindo') || !msg.body.startsWith('!howgay') || !msg.body.startsWith('!howbucin') || !msg.body.startsWith('!google') || !msg.body.startsWith('!youtube') || !msg.body.startsWith('!capture') || !msg.body.startsWith('!sticker') || !msg.body.startsWith('!delete') || !msg.body.startsWith('!translate') || !msg.body.startsWith('!shortlink') || !msg.body.startsWith('!ytmp3') || !msg.body.startsWith('!ytmp4') || !msg.body.startsWith('!tiktok') || !msg.body.startsWith('!fbv') || !msg.body.startsWith('!igv') || !msg.body.startsWith('!twf') || !msg.body.startsWith('!twv') || !msg.body.startsWith('!mentionall') || !msg.body.startsWith('!simisimi')){
            const chat = await msg.getChat();
            if (!chat.isGroup) {
                const pesan = msg.body;
                axios.get(`https://simsumi.herokuapp.com/api?text=${pesan}&lang=id`)
                .then(res => {
                client.sendMessage(msg.from, res.data.success);
                })
                .catch(err => {
                msg.reply(err);
                })
            } else if (chat.isGroup && inArray(chat.id, list_group)){
                const pesan = msg.body;
                axios.get(`https://simsumi.herokuapp.com/api?text=${pesan}&lang=id`)
                .then(res => {
                client.sendMessage(msg.from, res.data.success);
                })
                .catch(err => {
                msg.reply(err);
                })
            }
        }

        //simi-simi on/off
        else if (msg.body.startsWith('!simisimi ')){
            const on_off = msg.body.split(' ')[1];
            const chat = await msg.getChat();
            if (on_off === 'on'){
                list_group.push(chat.id);
            } else if (on_off === 'off'){
                removeItemOnce(list_group, chat.id);
            }
        }
        

        


        
        
        


    }
);

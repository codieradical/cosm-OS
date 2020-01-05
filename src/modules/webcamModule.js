
var Discord = require('discord.js');
var NodeWebcam = require( "node-webcam" );
var path = require('path');
var events = require('../events');
var fs = require('fs');
var dir = path.join(process.cwd(), 'tmp');
const Jimp = require("jimp")

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

events.on('command', async message => {
    switch(message.commandName) {
        case '?':
        case 'help': {
            message.author.send(`
**Webcam:**
__web__
    Returns a photo from the connected webcam.
__lexi__
    Returns a photo of Lexi.
            `);
            return;
        }

        case 'cam':
        case 'web': {
            try {
                const filename = await takePhoto();
                const attachment = new Discord.Attachment(filename);
                const embed = new Discord.RichEmbed()
                    .setColor(0xFFFFFF)
                    .setTitle("Heeeeere's Codie")
                    .attachFile(attachment)
                    .setImage('attachment://' + path.basename(filename));
            
                await message.channel.send(embed);
            } catch(err) {
                message.channel.send("Oh oh! Stinky! Webcam is probably off :(");
            } finally {
                //fs.unlink(filename, () => {});
            }
            return;
        }
        case 'lexi': {
            const filename = path.join(process.cwd(), 'img', 'lexi.jpg');
            const attachment = new Discord.Attachment(filename);
            const embed = new Discord.RichEmbed()
                .setColor(0xFFFFFF)
                .setTitle("Heeeeere's Lexi")
                .attachFile(attachment)
                .setImage('attachment://' + path.basename(filename));
        
            message.channel.send(embed);

            return;
        }
    }
})

async function takePhoto() {
    var options = {
        width: 1280,
        height: 720,
        quality: 100,
        delay: 3,
        saveShots: true,
        output: "jpeg",
        device: false,

        // [location, buffer, base64]
        callbackReturn: "location",
        verbose: false
    };

    //Creates webcam instance
    var Webcam = NodeWebcam.create( options );
    
    //Will automatically append location output type
    return await new Promise((res, rej) => {
        Webcam.capture(path.join(process.cwd(), 'tmp', new Date().getTime().toString()), function( err, data ) {
            if (err) {
                console.log(err);
                rej(err);
            }
            else {
                const bmppath = path.dirname(data) + path.basename(data).replace('.jpg', '.bmp');
                fs.renameSync(data, bmppath);
                Jimp.read(bmppath, async function (err, image) {
                    if (err) {
                      console.log(err)
                    } else {
                      await image.writeAsync(data)
                      fs.unlink(bmppath, () => {});
                      res(data);
                    }
                  })
            }
        });
    })
}
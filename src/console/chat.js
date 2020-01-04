const _ = require('underscore');
const client = require('../client');
const events = require('../events');

var selectedIndex = 0;
var serverId = undefined;
var channelId = undefined;

events.on('message', message => {
    if(channelId && message.channel.id === channelId) {
      console.log(`${message.author.username}#${message.author.discriminator}: ${message.content}`); 
    }
});

function enterSelection() {
    var stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    selectionChanged(null)
    stdin.on('data', selectionChanged);
}

function exitSelection() {
    var stdin = process.stdin;
    stdin.setRawMode(false);
    stdin.removeListener('data', selectionChanged);
    stdin.on('data', data => {
      client.channels.get(channelId).send(data)
    });
}

function selectionChanged(key) {
    console.clear();

    console.log('Welcome to cosm-os.')

    if (key == '\u001B\u005B\u0041') {
        selectedIndex -= 1;
        if (selectedIndex < 0)
            selectedIndex = 0;
    }
    if (key == '\u001B\u005B\u0042') {
        selectedIndex += 1;
        serversCount = Array.from(client.guilds.values()).length;
        if(!serverId && selectedIndex >= serversCount)
            selectedIndex = serversCount - 1;
        else if (serverId) {
            textChannelsCount = Array.from(client.guilds.get(serverId).channels.values()).filter(channel => channel.type == 'text').length;
            if(selectedIndex >= textChannelsCount)
                selectedIndex = textChannelsCount - 1;
        }
    }
    if (key == '\u0003') {
        process.exit();
    }    // ctrl-c
    if (key == '\u0013') {
        process.exit(); 
    }
    if (key == '\u000D\u000A' || key == '\u000D' || key == '\u000A' ) {
        if(!serverId) {
            serverId = Array.from(client.guilds.values())[selectedIndex].id;
        } else {
            channelId = Array.from(client.guilds.get(serverId).channels.values()).sort((a, b) => a.position - b.position).filter(channel => channel.type == 'text')[selectedIndex].id;
            exitSelection();
        }
    }

    if(!serverId)
        printServers();
    else
        printChannels();
}

function printServers() {
    console.log('Select a server:')
    Array.from(client.guilds.values()).forEach((guild, index) => {
        if(index === selectedIndex) {
            console.log(`>${guild.name}<`)
        } else {
            console.log(guild.name);
        }
    })
}

function printChannels() {
    console.log('Select a channel:')
    var server = client.guilds.get(serverId);
    var allChannels = Array.from(server.channels.values());
    allChannels = allChannels.sort((a, b) => a.position - b.position);
    var textChannels = allChannels.filter(channel => channel.type == 'text');
    var categories = _.groupBy(textChannels, channel => channel.parentID);
    
    var currentCategoryIndex = 0;
    var selectedCategoryIndex = 0;
    var selectedChannelIndex = selectedIndex;
    for (var categoryID in categories) {
      if (categories[categoryID].length <= selectedChannelIndex && selectedCategoryIndex == currentCategoryIndex) {
          selectedCategoryIndex += 1;
          selectedChannelIndex -= categories[categoryID].length;
      }
  
      if(categoryID == 'null') {
        categories[categoryID].forEach((channel, index) => {
            if(index === selectedChannelIndex && selectedCategoryIndex == currentCategoryIndex) {
                console.log(`>#${channel.name}<`)
            } else {
                console.log(`#${channel.name}`)
            }
        })
      } else {
        console.log(server.channels.get(categoryID).name)
        categories[categoryID].forEach((channel, index) => {
            if(index === selectedChannelIndex && selectedCategoryIndex == currentCategoryIndex) {
                console.log(`    >#${channel.name}<`)
            } else {
                console.log(`    #${channel.name}`)
            }
        })
      }
      currentCategoryIndex++;
    }
}

module.exports = {
    enterSelection
}
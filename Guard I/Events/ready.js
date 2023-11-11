

const { Collection } = require("discord.js");
const { MessageEmbed } = require("discord.js")
const Settings = require("../../settings")
const { joinVoiceChannel } = require("@discordjs/voice");
const client = global.bot;
module.exports = async client => {

  setInterval(async () => {
const VoiceChannel = client.channels.cache.get(Settings.Ses);
joinVoiceChannel({
   channelId: VoiceChannel.id,
   guildId: VoiceChannel.guild.id,
   adapterCreator: VoiceChannel.guild.voiceAdapterCreator,
   selfDeaf: true,// 
   selfMute: true // 
        });
       }, 10000)

  setInterval(() => {
    const oynuyor = Settings.Durum;
    const index = Math.floor(Math.random() * (oynuyor.length));
    client.user.setActivity(`${oynuyor[index]}`, {
        type: "COMPETING"});

    }, 10000);

    
  }





    
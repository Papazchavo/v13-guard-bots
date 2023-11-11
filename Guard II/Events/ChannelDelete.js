
const TextChannels = require("../../Schemas/TextBackup");
const VoiceChannels = require("../../Schemas/VoiceBackup");
const SafeMember = require("../../Schemas/Whitelist")
const settings = require("../../settings")
const { MessageEmbed } = require("discord.js");


module.exports = async (channel) => {
    let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first())
    if(!entry || !entry.executor || await askim(entry.executor.id)) return;
    cezaVer(client, entry.executor.id, "ban")
    let newChannel;
      if ((channel.type === 'GUILD_TEXT') || (channel.type === 'GUILD_NEWS')) {
        newChannel = await channel.guild.channels.create(channel.name, {
          type: channel.type,
          topic: channel.topic,
          nsfw: channel.nsfw,
          parent: channel.parent,
          position: channel.position + 1,
          rateLimitPerUser: channel.rateLimitPerUser
        });
      }
      if (channel.type === 'GUILD_VOICE') {
        newChannel = await channel.guild.channels.create(channel.name, {
          type: channel.type,
          bitrate: channel.bitrate,
          userLimit: channel.userLimit,
          parent: channel.parent,
          position: channel.position + 1
        });
      }
      if (channel.type === 'GUILD_CATEGORY') {
        newChannel = await channel.guild.channels.create(channel.name, {
          type: channel.type,
          position: channel.position + 1
        });
        const textChannels = await TextChannels.find({ parentID: channel.id });
        await TextChannels.updateMany({ parentID: channel.id }, { parentID: newChannel.id });
        textChannels.forEach(c => {
          const textChannel = channel.guild.channels.cache.get(c.channelID);
          if (textChannel) textChannel.setParent(newChannel, { lockPermissions: false });
        });
        const voiceChannels = await VoiceChannels.find({ parentID: channel.id });
        await VoiceChannels.updateMany({ parentID: channel.id }, { parentID: newChannel.id });
        voiceChannels.forEach(c => {
          const voiceChannel = channel.guild.channels.cache.get(c.channelID);
          if (voiceChannel) voiceChannel.setParent(newChannel, { lockPermissions: false });
        });
      };
      channel.permissionOverwrites.cache.forEach(perm => {
        let thisPermOverwrites = {};
        perm.allow.toArray().forEach(p => {
          thisPermOverwrites[p] = true;
        });
        perm.deny.toArray().forEach(p => {
          thisPermOverwrites[p] = false;
        });
        newChannel.permissionOverwrites.create(perm.id, thisPermOverwrites);
      });
      await client.channels.cache.find(x => x.name === "guard-log").send({embeds:[new MessageEmbed()
        .setTimestamp()
        .setFooter("Kanal Silindi")
      .setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`${channel.name}\` \`${channel.id}\` isimli kanal silindi ve geri oluşturularak, yapan kişi yasaklandı.`)
    ]})

}
async function askim(kisiID) {
    const whitelist = await SafeMember.findOne({ guildID: settings.guildID });
    let member = client.users.cache.get(kisiID); 
    let guvenli = whitelist.FullGuard || whitelist.ChannelGuard || []; 
    if(member.id === client.user.id || member.id === settings.Owner || guvenli.some(x => x.includes(member.id))) return true;
    else return false;
} 

async function cezaVer(BotClient, KullanıcıID, CezaTürü) {
  let MEMBER = BotClient.guilds.cache.get(settings.guildID).members.cache.get(KullanıcıID);
  if (!MEMBER) return;
  if (CezaTürü == "ban") return MEMBER.ban({reason: "Papaz Ananı Sikti."}).catch(console.error);
  if (CezaTürü == "kick") return MEMBER.kick().catch(console.error);;
};
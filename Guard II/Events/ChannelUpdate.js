
const TextChannels = require("../../Schemas/TextBackup");
const VoiceChannels = require("../../Schemas/VoiceBackup");
const SafeMember = require("../../Schemas/Whitelist")
const settings = require("../../settings")
const { MessageEmbed } = require("discord.js");


module.exports = async (oldChannel, newChannel) => {
    let entry = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first())
    if(!entry || !entry.executor || await askim(entry.executor.id)) return;
    cezaVer(client, entry.executor.id, "ban")
    if (newChannel.type !== "GUILD_CATEGORY" && newChannel.parentId !== oldChannel.parentId) newChannel.setParent(oldChannel.parentId);
    if (newChannel.type === "GUILD_CATEGORY") {
      await newChannel.edit({
        position: oldChannel.position,
        name: oldChannel.name,
      });
    } else if (newChannel.type === "GUILD_TEXT" || (newChannel.type === 'GUILD_NEWS')) {
      await newChannel.edit({
        name: oldChannel.name,
        position: oldChannel.position,
        topic: oldChannel.topic,
        nsfw: oldChannel.nsfw,
        rateLimitPerUser: oldChannel.rateLimitPerUser,
      });
    } else if (newChannel.type === "GUILD_VOICE") {
      await newChannel.edit({
        name: oldChannel.name,
        position: oldChannel.position,
        bitrate: oldChannel.bitrate,
        userLimit: oldChannel.userLimit,
      });
    };
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

const TextChannels = require("../../Schemas/TextBackup");
const VoiceChannels = require("../../Schemas/VoiceBackup");
const SafeMember = require("../../Schemas/Whitelist")
const settings = require("../../settings")
const { MessageEmbed } = require("discord.js");


module.exports = async (member) => {
    if (!member.user.bot) return;
    let entry = await member.guild.fetchAuditLogs({type: 'BOT_ADD'}).then(audit => audit.entries.first())
    if(!entry || !entry.executor || await askim(entry.executor.id)) return;
    cezaVer(client, entry.executor.id, "ban")
    cezaVer(client, member.id, "ban")

      await client.channels.cache.find(x => x.name === "guard-log").send({embeds:[new MessageEmbed()
        .setTimestamp()
        .setFooter("Bot Eklendi.")
      .setDescription(`${entry.executor} (\`${entry.executor.id}\`) isimli üye tarafından ${member} (\`${member.id}\`) adında bir bot ekledi ve eklenen bot ile ekleyen üye cezalandırıldı.`)
    ]})

}
async function askim(kisiID) {
    const whitelist = await SafeMember.findOne({ guildID: settings.guildID });
    let member = client.users.cache.get(kisiID); 
    let guvenli = whitelist.FullGuard  || []; 
    if(member.id === client.user.id || member.id === settings.Owner || guvenli.some(x => x.includes(member.id))) return true;
    else return false;
} 

async function cezaVer(BotClient, KullanıcıID, CezaTürü) {
  let MEMBER = BotClient.guilds.cache.get(settings.guildID).members.cache.get(KullanıcıID);
  if (!MEMBER) return;
  if (CezaTürü == "ban") return MEMBER.ban({reason: "Papaz Ananı Sikti."}).catch(console.error);
  if (CezaTürü == "kick") return MEMBER.kick().catch(console.error);;
};
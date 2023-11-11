
const SafeMember = require("../../Schemas/Whitelist")
const settings = require("../../settings")
const { MessageEmbed } = require("discord.js");


module.exports = async (oldGuild, newGuild) => {
    let entry = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.executor.bot || await askim(entry.executor.id)) return;
    cezaVer(client, entry.executor.id, "ban")
    if (newGuild.name !== oldGuild.name) await newGuild.setName(oldGuild.name);
    if (newGuild.iconURL({dynamic: true, size: 2048}) !== oldGuild.iconURL({dynamic: true, size: 2048})) await newGuild.setIcon(oldGuild.iconURL({dynamic: true, size: 2048}));
    if (oldGuild.banner !== newGuild.banner) await newGuild.setBanner(oldGuild.bannerURL({ size: 4096 }));
      return client.channels.cache.find(x => x.name == "guard-log").send({embeds: [new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından sunucudan sunucu güncellendi! Güncelleyen kişi banlandı ve sunucu eski haline getirildi. `)] })
}
async function askim(kisiID) {
    const whitelist = await SafeMember.findOne({ guildID: settings.guildID });
    let member = client.users.cache.get(kisiID); 
    let guvenli = whitelist.FullGuard || whitelist.RoleGuard || []; 
    if(member.id === client.user.id || member.id === settings.Owner || guvenli.some(x => x.includes(member.id))) return true;
    else return false;
} 

async function cezaVer(BotClient, KullanıcıID, CezaTürü) {
  let MEMBER = BotClient.guilds.cache.get(settings.guildID).members.cache.get(KullanıcıID);
  if (!MEMBER) return;
  if (CezaTürü == "ban") return MEMBER.ban({reason: "Papaz Ananı Sikti."}).catch(console.error);
  if (CezaTürü == "kick") return MEMBER.kick().catch(console.error);;
};
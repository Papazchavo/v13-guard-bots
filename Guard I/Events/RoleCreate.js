
const SafeMember = require("../../Schemas/Whitelist")
const settings = require("../../settings")
const { MessageEmbed } = require("discord.js");


module.exports = async (role) => {
    let entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first())
    if(!entry || !entry.executor || await askim(entry.executor.id)) return;
    cezaVer(client, entry.executor.id, "ban")
    await role.delete({reason: `Guard tarafından tekrardan silindi.`});
      await client.channels.cache.find(x => x.name === "guard-log").send({embeds:[new MessageEmbed()
        .setTimestamp()
        .setFooter("Kanal Silindi")
      .setDescription(`${entry.executor} (\`${entry.executor.id}\`) tarafından \`${role.name}\` \`${role.id}\` isimli rolü oluşturuldu ve geri silinerek, yapan kişi yasaklandı`)
    ]})

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
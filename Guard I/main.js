const {Client, Collection, MessageEmbed} = require("discord.js")
const { mongoose } = require("mongoose")
const RolBackup = require("../Schemas/RoleBackup")
const CategoryBackup = require("../Schemas/CategoryBackup")
const TextBackup = require("../Schemas/TextBackup")
const VoiceBackup = require("../Schemas/VoiceBackup")
const {readdirSync} = require("fs")
const client = global.client = new Client({
    fetchAllMembers: true,
    intents: [ 32767 ],
});
const Settings = require("../settings")

const commands = client.commands = new Collection();
const aliases = client.aliases = new Collection();
require('./Events/loader.js')(client);
mongoose.connect(Settings.Mongoose, { useNewUrlParser: true, useUnifiedTopology: true })
const files = readdirSync('./Commands/', {encoding: 'utf8'})
files.filter(file => file.endsWith(".js")).forEach((files) => {
    let command = require(`./Commands/${files}`);
    if(!command) return console.log("ff")
    if (!command.name) return console.log(`Hatalı Komut: [/Commands/${files}]`)
    commands.set(command.name, command);
    if (!command.aliases || command.aliases.length < 1) return
    command.aliases.forEach((otherUses) => { aliases.set(otherUses, command.name); })
});
files.filter((file) => !file.endsWith('.js')).forEach((folder) => {
    try {
        readdirSync(`./Commands/${folder}/`, {encoding: 'utf8'}).filter(file => file.endsWith(".js")).forEach((files) => {
            let command = require(`./Commands/${folder}/${files}`);
            if(!command) return console.log("ff")
            if (!command.name) return console.log(`Hatalı Komut: [/Commands/${folder}/${files}]`)
            commands.set(command.name, command);
            if (!command.aliases || command.aliases.length < 1) return
            command.aliases.forEach((otherUses) => { aliases.set(otherUses, command.name); })
        });
    } catch (error) {
        console.log(`${folder}  isimli zartzort hata var bilader`)
    }
})

client.login(Settings.ShieldI).then(function(x) {console.log(`${client.user.tag} İsmiyle Shield I Aktif Oldu`)}).catch(function(err){console.log(err)})
setInterval(async () => { 
  await RolYedekle();
  await KanalYedekle();
  console.log("Backup ++")
  }, 1000 * 60 * 45)
process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("hata: ", errorMsg);
    process.exit(1);
  });
  process.on("unhandledRejection", err => {
    console.error(err);
  });  
  async function RolYedekle() {    
    const guild = client.guilds.cache.get(Settings.guildID);
      let members = await guild.members.fetch();
      guild.roles.cache.forEach(async role => {
          let roleChannelOverwrites = [];
          await guild.channels.cache.filter(c => c.permissionOverwrites.cache.has(role.id)).forEach(c => {
              let channelPerm = c.permissionOverwrites.cache.get(role.id);
              let KanalAyarlarıKayıt = {id: c.id,allow: channelPerm.allow.toArray(),deny: channelPerm.deny.toArray()};
              roleChannelOverwrites.push(KanalAyarlarıKayıt);});
    await RolBackup.updateOne({roleID: role.id}, {$set: {guildID: Settings.guildID,roleID: role.id,name: role.name,color: role.hexColor,hoist: role.hoist,position: role.position,permissions: role.permissions.bitfield,mentionable: role.mentionable,time: Date.now(),members: role.members.map(m => m.id),channelOverwrites: roleChannelOverwrites}}, {    upsert: true});});};


    async function KanalYedekle() {
      const guild = client.guilds.cache.get(Settings.guildID);
        if (guild) {
            const channels = [...guild.channels.cache.values()];
            for (let index = 0; index < channels.length; index++) {
                const channel = channels[index];
                let KanalAyarları = []
                channel.permissionOverwrites.cache.forEach(perm => {
KanalAyarları.push({ id: perm.id, type: perm.type, allow: "" + perm.allow, deny: "" + perm.deny })
                });
              
                if ((channel.type === 'GUILD_TEXT') || (channel.type === 'GUILD_NEWS')) {
                  await TextBackup.updateOne({channelID: channel.id,}, {$set: { channelID: channel.id, name: channel.name, nsfw: channel.nsfw,parentID: channel.parentId, position: channel.position, rateLimit: channel.rateLimitPerUser,overwrites: KanalAyarları,}}, {upsert: true});
                }
                if (channel.type === 'GUILD_VOICE') {
                  await VoiceBackup.updateOne({channelID: channel.id,}, {$set: {channelID: channel.id,name: channel.name,bitrate: channel.bitrate,userLimit: channel.userLimit,parentID: channel.parentId,position: channel.position,overwrites: KanalAyarları, }}, {upsert: true});
                }
                if (channel.type === 'GUILD_CATEGORY') {
                  await CategoryBackup.updateOne({channelID: channel.id,}, {$set: {channelID: channel.id,name: channel.name,position: channel.position,overwrites: KanalAyarları,}}, { upsert: true});}}
      
        }}
  
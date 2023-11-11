const {createMessageComponentCollector, MessageActionRow, MessageSelectMenu, MessageEmbed  } = require("discord.js");
const SafeMember = require("../../Schemas/Whitelist")
const Settings = require("../../settings")
module.exports = {
    name: "Güvenli",
    about: "Güvenli",
    aliases: ["Güvenli","gmenü"],
    run: async (client, message, args) => {

    if ((Settings.Owner.includes(message.author.id))){

   let Kullanıcı = message.mentions.members.first() || message.mentions.roles.first() || message.guild.members.cache.get(args[1]) || message.guild.roles.cache.get(args[1]);
   if (!Kullanıcı) return message.reply({ embeds: [new MessageEmbed()
    .setThumbnail()
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
    .setDescription(`Kullanıcı Belirtmedin!`)
    ] }).then((e) => setTimeout(() => { e.delete(); }, 5000));  

 const MenüYazı = [] 
    if(Kullanıcı.user.username.length > 15) {
    let Uzunmuş = Kullanıcı.user.username.slice(0, 15)
    MenüYazı.push(`${Uzunmuş}..`)  
      } else {
        MenüYazı.push(`${Kullanıcı.user.tag}`)
      }

   const row = new MessageActionRow()
   .addComponents(
     new MessageSelectMenu()
       .setCustomId('select')
       .setPlaceholder(`${MenüYazı} :)`)
       .addOptions([
         {
           label: 'Full Güvenli',value: 'Full',
         },
         {
           label: 'Rol Güvenli',value: 'Rol',
         },
         {
           label: 'Kanal Güvenli',value: 'Kanal',
         }
       ])
   );
    var veri = await SafeMember.findOne({
        guildID: message.guild.id
      }) || {
        "FullGuard": [],
        "RoleGuard": [],
        "ChannelGuard": [],
   
      };
      await message.reply({content: `${Kullanıcı} Safe Durumunu Seçin!`, components: [row] })

      const filter = i => i.user.id == message.author.id
      const collector = message.channel.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', max: 1, time: 30000 });
      collector.on("collect", async (interaction) => {

          if (interaction.values[0] === "Full") {
              if (veri.FullGuard.includes(Kullanıcı.id)) {
                await SafeMember.updateOne({ guildID: interaction.guild.id }, { $pull: { FullGuard: Kullanıcı.id } }, { upsert: true });
                interaction.reply({ content: `${Kullanıcı} Kişisi Başarılı Bir Şekilde Full Güvenli Listesinden Çıkarıldı.`, ephemeral: true }).catch({})
              } else {
                await SafeMember.updateOne({ guildID: interaction.guild.id }, { $push: { FullGuard: Kullanıcı.id } }, { upsert: true });
                await interaction.reply({ content: `${Kullanıcı} Kişisi Başarılı Bir Şekilde Full Güvenli Listesine Eklendi.`, ephemeral: true }).catch({})
              }
            }
            if (interaction.values[0] === "Rol") {
              if (veri.RoleGuard.includes(Kullanıcı.id)) {
                await SafeMember.updateOne({ guildID: interaction.guild.id }, { $pull: { RoleGuard: Kullanıcı.id } }, { upsert: true });
                await interaction.reply({ content: `${Kullanıcı} Kişisi Başarılı Bir Şekilde Rol Güvenli Listesinden Çıkarıldı.`, ephemeral: true }).catch({})
              } else {
                await SafeMember.updateOne({ guildID: interaction.guild.id }, { $push: { RoleGuard: Kullanıcı.id } }, { upsert: true });
                await interaction.reply({ content: `${Kullanıcı} Kişisi Başarılı Bir Şekilde Rol Güvenli Listesine Eklendi.`, ephemeral: true }).catch({})
              }
            }
            if (interaction.values[0] === "Kanal") {
              if (veri.ChannelGuard.includes(Kullanıcı.id)) {
                await SafeMember.updateOne({ guildID: interaction.guild.id }, { $pull: { ChannelGuard: Kullanıcı.id } }, { upsert: true });
                await interaction.reply({ content: `${Kullanıcı} Kişisi Başarılı Bir Şekilde Kanal Güvenli Listesinden Çıkarıldı.`, ephemeral: true }).catch({})
              } else {
                await SafeMember.updateOne({ guildID: interaction.guild.id }, { $push: { ChannelGuard: Kullanıcı.id } }, { upsert: true });
                await interaction.reply({ content: `${Kullanıcı} Kişisi Başarılı Bir Şekilde Kanal Güvenli Listesine Çıkarıldı.`, ephemeral: true }).catch({})
              }
            }
   
 
        
        })

    }
    }}


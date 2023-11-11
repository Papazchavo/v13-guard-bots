const {Client, Collection, MessageEmbed} = require("discord.js")
const {mongoose} = require("mongoose")
const canvafy = require("canvafy")
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

client.login(Settings.Shield2).then(function(x) {console.log(`${client.user.tag} İsmiyle Shield II Aktif Oldu`)}).catch(function(err){console.log(err)})

process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("hata: ", errorMsg);
    process.exit(1);
  });
  process.on("unhandledRejection", err => {
    console.error(err);
  });  

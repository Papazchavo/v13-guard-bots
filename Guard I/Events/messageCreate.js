
const { MessageEmbed, Collection } = require('discord.js');
const moment = require('moment');
require('moment-duration-format')
const  Settings = require("../../settings")
const { model,Schema } = require("mongoose")

module.exports = async message => {
  if (!message.guild || message.author.bot) return;
  let prefix = Settings.Prefixs.find(x => message.content.toLowerCase().startsWith(x));
  if(!prefix) return;
  const args = message.content.slice(1).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  const preifx = "."
  if (!cmd) return;
  cmd.run(client, message, args, preifx);

}


    
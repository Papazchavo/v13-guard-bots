const Events = (event) => require(`./${event}`);
module.exports = (client) => {
    client.on("ready", Events("ready"));
    client.on("channelDelete", Events("ChannelDelete"));
    client.on("channelCreate", Events("ChannelCreate"));
    client.on("channelUpdate", Events("ChannelUpdate"));
    client.on("channelUpdate", Events("ChannelOverWrite"));
    client.on("channelUpdate", Events("ChannelOverWrite2"));
    client.on("guildMemberAdd", Events("botAdd"));
};
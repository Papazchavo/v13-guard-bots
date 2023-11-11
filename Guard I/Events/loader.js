const Events = (event) => require(`./${event}`);
module.exports = (client) => {
    client.on("ready", Events("ready"));
    client.on("messageCreate", Events("messageCreate"));
    client.on("roleCreate", Events("RoleCreate"));
    client.on("roleUpdate", Events("RoleUpdate"));
};
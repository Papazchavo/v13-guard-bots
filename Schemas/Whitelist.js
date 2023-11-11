const { Schema, model } = require("mongoose");

const Whitelist = Schema({
    guildID: String,
    FullGuard: {type: Array, default: []},
    RoleGuard: {type: Array, default: []},
    ChannelGuard: {type: Array, default: []},
    Permissions: {type: Array, default: []}
});

module.exports = model("Whitelist", Whitelist);

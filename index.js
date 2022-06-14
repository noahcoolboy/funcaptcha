const api = require("./lib/api").default
const session = require("./lib/session").default

module.exports = {
    getToken: api.getToken,
    Session: session
}
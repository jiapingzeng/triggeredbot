const response = require('./response.json')

module.exports = {
    respond: function(message) {
        switch (message.toLowerCase()) {
            case 'hi':
            case 'hello':
            case 'hey':
                return randomMessage(response.welcome);
            default:
                return message
        }
    }
}

function randomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
}
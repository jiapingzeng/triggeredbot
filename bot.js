const response = require('./response.json')

module.exports = {
    respond: function(message) {
        switch (message.toLowerCase()) {
            case 'hi':
            case 'hello':
            case 'hey':
            case 'whats up':
            case 'whazzup':
            case 'yo':
                return randomMessage(response.welcome);
            default:
                return 'I no understand "' + message + '". Blame Jiaping and Luke for doing such a shitty job.'
        }
    }
}

function randomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
}

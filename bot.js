const response = require('./response.json')

module.exports = {
    respond: function(message) {
        // TO-DO: improve this ghetto logic
        switch (message.toLowerCase()) {
            case "insult me":
                return randomMessage(response.insult)
            case 'hi':
            case 'hello':
            case 'hey':
            case 'yo':
            case 'sup':
                return randomMessage(response.greeting)
            case 'joke':
            case 'tell me a joke':
                return randomMessage(response.joke)
            default:
                return randomMessage(response.unknown)
        }
    }
}

function randomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)]
}

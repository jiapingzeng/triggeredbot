const knowledge = require('./knowledge.json')

module.exports = {
    respond: function (message) {        
        switch (message.toLowerCase()) {
            case "insult":
            case "insult me":
            case "idiot":
                return randomMessage(knowledge.insult.responses)
            case 'hi':
            case 'hello':
            case 'hey':
            case 'yo':
            case 'sup':
                return randomMessage(knowledge.greeting.responses)
            case 'joke':
            case 'tell me a joke':
                return randomMessage(knowledge.joke.responses)
            default:
                return randomMessage(knowledge.unknown.responses)
        }
    }
}

function randomMessage(messages) {
    if (messages) {
        return messages[Math.floor(Math.random() * messages.length)]
    }
}

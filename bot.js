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
        /*for (var type in knowledge) {
        // for (var i = 0; i < knowledge.length; i++) {
            //var type = knowledge[i]
            console.log(type)
            console.log(type.triggers)
            for (var trigger in type.triggers) {
            //for (var j = 0; j < type[0].length; j++) {
                //var trigger = type[0][j]
                console.log(trigger)
                if (trigger.contains(' ') && message.contains(trigger)) {
                    return randomMessage(type.responses)
                } else if (message.contains(trigger)) {
                    var start = message.indexOf(trigger)
                    var end = message.indexOf(trigger) + trigger.length

                    // wtf is this
                    if (start > 0) {
                        if (message.charAt(start - 1) != ' ') {
                            if (end < message.length - 1) {
                                if (message.charAt(end + 1) != ' ') {
                                    return randomMessage(type.responses)
                                }
                            }
                            else {
                                return randomMessage(type.responses)
                            }
                        }
                    } else if (end < message.length - 1) {
                        if (message.charAt(end + 1) != ' ') {
                            return randomMessage(type.responses)
                        }
                    }
                    else {
                        return randomMessage(type.responses)
                    }
                    // wtf was that
                }
            }
        }
        return randomMessage(knowledge.unknown.responses)*/
    }
}

function randomMessage(messages) {
    if (messages) {
        return messages[Math.floor(Math.random() * messages.length)]
    }
}

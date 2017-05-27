var knowledge = require('./knowledge')

var bot = {
  respond: function(message) {
    message = message.toLowerCase()
    var response = randomMessage(knowledge.unknown.responses)
    forEach(knowledge, function(type, next) {
        var triggers = type.triggers
        for (var i = 0; i < triggers.length; i++) {
            var trigger = triggers[i]
            if (message.includes(trigger)) {
                console.log(trigger)
                response = randomMessage(type.responses)
            }
        }
        next()
    })
    return response
  }
}

var randomMessage = function(messages) {
    if (messages) {
        return messages[Math.floor(Math.random() * messages.length)]
    }
}

var forEach = function(o, cb) {
    var i = 0
    var keys = Object.keys(o)
    var length = keys.length
    var next = function() {
        if(i < length) {
            cb(o[keys[i++]], next)
        }
    }
    next()
}

module.exports = bot
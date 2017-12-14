var knowledge = require('./knowledge')
var superKnowledge = {
	"oops":
	{
		"triggers": [
			"oops",
			"whoops"
		],
		"responses": [
			"Don't worry, everything I do is a mistake.",
			"Whoopsie daisies!"
		]
	},
	"copycat":
	{
		"triggers": [
			"k.",
			"look in the mirror."
		],
		"responses": [
			"Are you trying to copy me?!",
			"Try again, copycat."
		]
	}
}

var bot = {
  respond: function(message) {
    message = message.toLowerCase()
    forEach(superKnowledge, function(type, next) {
        var triggers = type.triggers
        for (var i = 0; i < triggers.length; i++) {
            var trigger = triggers[i]
            if (message == trigger) {
                console.log(trigger)
                return randomMessage(type.responses)
            }
        }
        next()
    })
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
	return null
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
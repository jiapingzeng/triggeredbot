const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')
const request = require('request')
const path = require('path')
const fs = require('fs')
const util = require('util')

const log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'})
const log_stdout = process.stdout

console.log = function(d) {
  var date = new Date(Date.now())
  log_file.write(date.toTimeString() + ": " + util.format(d) + '\n---\n')
  log_stdout.write(util.format(d) + '\n')
}

const bot = require('./bot.js')
const app = express()
const port = process.env.PORT || 3000

const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ? process.env.MESSENGER_APP_SECRET : config.get('appSecret')
const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ? (process.env.MESSENGER_VALIDATION_TOKEN) : config.get('validationToken')
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ? (process.env.MESSENGER_PAGE_ACCESS_TOKEN) : config.get('pageAccessToken')
const SERVER_URL = (process.env.SERVER_URL) ? (process.env.SERVER_URL) : config.get('serverURL')

if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL)) {
  console.error('Shit\'s on fire yo')
  process.exit(1)
}

app.listen(port)

console.log('Server started')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.redirect('https://www.facebook.com/triggeredbot/')
})

app.get('/debug', function (req, res) {
    res.sendFile(path.join(__dirname, '/debug.log'))
})

app.get('/webhook', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VALIDATION_TOKEN) {
        console.log('Validating webhook')
        res.status(200).send(req.query['hub.challenge'])
    } else {
        console.log('Who the **** are you')
        res.sendStatus(403)
    }
})

app.post('/webhook', function (req, res) {
    var data = req.body
    if (data.object === 'page') {
        data.entry.forEach(function (entry) {
            var pageId = entry.id
            var time = entry.time
            entry.messaging.forEach(function (event) {
                if (event.message) {
                    receivedMessage(event)
                } else {
                    console.log('uh-oh')
                }
            })
        })
    }
    res.sendStatus(200)
})

function receivedMessage(event) {
    var senderId = event.sender.id
    var recipientId = event.recipient.id
    var timestamp = event.timestamp
    var message = event.message

    var messageId = message.mid
    var messageText = message.text
    var messageAttachments = message.attachments

    if (messageText) {
        sendTextMessage(senderId, bot.respond(messageText))
    } else if (messageAttachments) {
        sendTextMessage(senderId, 'WTF is this?')
    }
}

function sendTextMessage(recipientId, messageText) {
    // var senderAction = {
    //     "recipient": { "id": recipientId },
    //     "sender_action": "typing_on"
    // }    
    var messageData = {
        "recipient": { "id": recipientId },
        "message": { "text": messageText }
    }
    console.log('sending "' + messageText + '" to user ' + recipientId)
    // callSendAPI(senderAction)
    // callSendAPI(messageData)
    console.log(messageData.message)
}

function callSendAPI(messageData) {
    request({
        uri: SERVER_URL,
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
    }, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            var recipientId = body.recipient_id
            var messageId = body.message_id
            console.log('it worked for once')
        } else {
            console.log(':( error: ' + err + ', http status code: ' + res.statusCode)
        }
    })
}

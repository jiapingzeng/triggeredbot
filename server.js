const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const bot = require('./bot.js')
const config = require('./config.json')

const app = express()
const port = process.env.PORT || 3000

app.listen(port)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send("Hello!")
})

app.get('/webhook', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === config.verify_token) {
        console.log('Validating webhook')
        res.status(200).send(req.query['hub.challenge'])
    } else {
        console.log('Validation failed')
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
    var message = event.message
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
    // console.log('sending "' + messageText + '"')
    // callSendAPI(senderAction)
    callSendAPI(messageData)
}

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: config.access_token },
        method: 'POST',
        json: messageData
    }, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            var recipientId = body.recipient_id
            var messageId = body.message_id
        } else {
            console.log(':(')
            console.log(res)
        }
    })
}
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send("Hello!")
})

app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'VERIFY_TOKEN') {
        console.log('Validating webhook')
        res.status(200).send(req.query['hub.challenge'])
    } else {
        console.error('Validation failed')
        throw new Error('oops')
    }
})

app.post('/webhook', (req, res) => {
    var data = req.body
    if (data.object === 'page') {
        data.entry.forEach((entry) => {
            var pageId = entry.id;
            var time = entry.time
            entry.messaging.forEach((event) => {
                if (event.message) {
                    receivedMessage(event)
                } else {
                    throw new Error('uh-oh')
                }
            })
        })
    }
    res.sendStatus(200);
})

function receivedMessage(event) {
    var senderId = event.sender.id
    var recipientId = event.recipient.id
    var timestamp = event.timestamp
    var message = event.message

    console.log('Received message for user ${senderId} and page ${recipientId} at ${timestamp}')
    console.log(JSON.stringify(message))

    var messageId = message.mid
    var messageText = message.text
    var messageAttachments = message.attachments

    if (messageText) {
        switch (messageText) {
            case 'generic':
                sendGenericMessage(senderId)
                break;
            default:
                sendTextMessage(senderId, messageText)
        }
    } else if (messageAttachments) {
        sendTextMessage(senderId, 'Attachment received')
    }
}

function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    }
    callSendAPI(messageData)
}

function callSendAPI(messageData) {
    requestAnimationFrame({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: 'EAAWnZBcQDeeoBAMKQGvwMQXFidBK3QzLdLFiS9XQjYyO4xJFqYgJanJd1Sk8x4z8zrQrnVbwNIkNwsD6NNHHcXp883YaIpFNBrBL65cN7rIrizwOpwLZAgzpCVSshmY0psYqJy1kxYNE6qFt9hVnkA8ifgbA2vvy3sOJfiZBAZDZD'},
        method: 'POST',
        json: messageData
    }, (err, res, body) => {
        if (!err && res.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            console.log("Message with id ${messageId} sent to recipient ${recipientId}")
        } else {
            throw new Error(':(')
        }
    })
}

app.use((err, req, res, next) => {
    console.log(err)
    response.status(403).send("Oh no!")
})

app.listen(port)
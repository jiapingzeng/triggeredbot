const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const port = process.env.PORT || 3000;

app.listen(port);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.send("Hello!");
});

app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'this_is_a_secure_token') {
        console.log('Validating webhook');
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.log('Validation failed');
        res.sendStatus(403);
    }
});

app.post('/webhook', function(req, res) {
    var data = req.body;
    if (data.object === 'page') {
        data.entry.forEach(function(entry) {
            var pageId = entry.id;
            var time = entry.time;
            entry.messaging.forEach(function(event) {
                if (event.message) {
                    receivedMessage(event);
                } else {
                    console.log('uh-oh');
                }
            });
        });
    }
    res.sendStatus(200);
});

function receivedMessage(event) {
    var senderId = event.sender.id;
    var recipientId = event.recipient.id;
    var timestamp = event.timestamp;
    var message = event.message;

    console.log('Received message for user ${senderId} and page ${recipientId} at ${timestamp}');
    console.log(JSON.stringify(message));

    var messageId = message.mid;
    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {
        switch (messageText.toLowerCase()) {
            case 'hi':
            case 'hello':
            case 'hey':
                sendWelcomeMessage(senderId);
                break;
            default:
                sendTextMessage(senderId, messageText);
        }
    } else if (messageAttachments) {
        sendTextMessage(senderId, 'Attachment received');
    }
}

function sendWelcomeMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: 'Hello! My name is Trigg EredBot. Please excuse me if I say anything dumb.'
        }
    }
    callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };
    callSendAPI(messageData);
}

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: 'EAAWnZBcQDeeoBAH13nrTZAGHpGQzdXFZBWgBNq6OORCLTmQhUKKB9rOiGrhjTHPzAjnjPw2ZAVew0gqbx648pZCssrJJTvm11VZAjZCiOPXpjd4vkyRVsfGKgym6Kk71joxDM3oNGeWmg1zyYNEwFNSRi42agStBHyWnwKuS2YGlQZDZD'},
        method: 'POST',
        json: messageData
    }, function(err, res, body) {
        if (!err && res.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;
            console.log("Message with id ${messageId} sent to recipient ${recipientId}");
        } else {
            console.log(':(');
            console.log(res)
        }
    });
}
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.Promise = Promise;
var dbUrl = 'mongodb://'

const Message = mongoose.model('Message', {
    name: String,
    message: String,
});

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

app.post('/messages', async (req, res) => {
    const message = new Message(req.body);

    var savedMessage = await message.save()
    var censored = await Message.findOne({message: 'badword'})
    if (censored) {
        console.log('censored words found', censored);
        await Message.remove({_id: censored.id});
    } else {
        io.emit('message', req.body);
    }
    res.sendStatus(200);
});

io.on('connection', (socket) => {
    console.log('a user connected');
})

var server = http.listen(8080, () => {
    console.log(`server is listening on port: ${server.address().port}`)
})

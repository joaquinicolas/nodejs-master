var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var dbUrl =  'mongodb://'

var Message = mongoose.model('Message', {
    name: String,
    message: String,
});

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
});

app.post('/messages', (req, res) => {
    const message = new Message(req.body);

    message.save(err => {
        if (err) {
            res.sendStatus(500);
        }
        io.emit('message', req.body);
        res.sendStatus(200);
    });
});

io.on('connection', (socket) => {
    console.log('a user connected');
})

var server = http.listen(8080, () => {
    console.log(`server is listening on port: ${server.address().port}`)
})

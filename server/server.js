let express = require('express');
let app = express();
let path = require('path');

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile('app.html', {root:__dirname + '/../public/'});
});


app.listen(3000);
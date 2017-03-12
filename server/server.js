let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let path = require('path');
let chat_sessions = require('./chat_sessions');


app.use(bodyParser.json());
app.use(express.static('public'));



app.get('/', function(req, res) {
    res.sendFile('app.html', {root:__dirname + '/../public/'});
});

app.post('/session/:name', function(req,res){

	try{
		let name = req.params.name;
	
		let session_id = chat_sessions.add_new_session(name);
		res.send({id: session_id});
	} catch(err) {
		res.status(500).end();
	}
});

app.put('/session/:id', function(req,res){

	try{
		let id = Number.parseInt(req.params.id);
		let changed_data = req.body;
	
		chat_sessions.update_session(id,changed_data);
		res.end();
	} catch(err){
		//TODO: handle different types of errors
		console.log(err);
		res.status(404).end();
	}
});

app.get('/session', function(req,res){
	// return a list of available sessions, the sessions should be filtered based on the user credentials
	let chats = chat_sessions.get_sessions();

	res.send(chats);
});


app.listen(3000);
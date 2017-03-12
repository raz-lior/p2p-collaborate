define(['jquery','FileSaver.js','chat-client','peerjs'],function   ($, saveAs, ChatClient) {

	var conn;
	var messageEntries = [];

	function ChatHost(){

	}

	ChatHost.prototype = new ChatClient();
	ChatHost.prototype.constructor = ChatHost;

	ChatHost.prototype.start_chat_session = function(name, msg_handler, done, fail){
		// var message = {
		//   recieved: '1/13/2017 12:34',
		//   content: 'Hello',
		//   sender: 'Jack'
		// }

		// messageEntries.push(message);
		// console.log(messageEntries);

		var data_handler = this.distibute_received_message.bind(this);

		$.post('/session/' + name)
		.done(function(chat_session){
			//TODO: change the p2p default key to a new one
			var peer = new Peer({key: 'lwjd5qra8257b9'});

			peer.on('open', function(peer_id) {

				$.ajax('/session/' + chat_session.id,{
					data: JSON.stringify({host: peer_id}),
					type: 'put',
					contentType:'application/json'
				})
				.done(function(){
					done();
				})
				.fail(function(){
					fail('fail to update host peer id');
				});

			});

			peer.on('connection', function(new_conn) {
				conn = new_conn;
				conn.on('open', function() {
				// Receive messages
					conn.on('data', function(data) {
						data_handler(data, msg_handler);
						
					});
				});
			});
		})
		.fail(function(){
			fail('fail to create a session');
		});
	}

	ChatHost.prototype.distibute_received_message = function(data, next_handler){
		//TODO: send the data to the rest of the clients
		next_handler(data);
	}

	ChatHost.prototype.load_session_data = function(file){
		if (!file) {
			return;
		}

		var reader = new FileReader();
		reader.onload = function(e) {
			var contents = e.target.result;
			messageEntries = JSON.parse(contents);
		};
		reader.readAsText(file);
	}

	ChatHost.prototype.export_session_data = function(){

		var blob = new Blob([JSON.stringify(messageEntries)], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "session.dat");
	}

	ChatHost.prototype.submit_message = function(message, done, fail){
		if(!conn)
			fail('conn is not initialized');
		
		conn.send(message);
		done();
	}

  return ChatHost;

});
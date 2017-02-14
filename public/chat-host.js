define(['jquery','FileSaver.js','peerjs'],function   ($, saveAs) {

	var messageEntries = [];

	function startChatSession(name, done, fail){
		// var message = {
		//   recieved: '1/13/2017 12:34',
		//   content: 'Hello',
		//   sender: 'Jack'
		// }

		// messageEntries.push(message);
		// console.log(messageEntries);

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

			peer.on('connection', function(conn) {

				conn.on('open', function() {
				// Receive messages
					conn.on('data', function(data) {
						console.log('Received', data);
					});
				});
			});
		})
		.fail(function(){
			fail('fail to create a session');
		});
	}

	function loadSession(file){
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

	function exportSession(){

		var blob = new Blob([JSON.stringify(messageEntries)], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "session.dat");
	}

  return {
  	startChatSession: startChatSession,
  	exportSession: exportSession,
  	loadSession: loadSession
  }

});
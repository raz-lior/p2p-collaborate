define(['peerjs'], function() {
	var conn;

	function joinChatSession(host_id, msg_handler){
		
		var peer = new Peer({key: 'lwjd5qra8257b9'});

		peer.on('open', function(peer_id) {
			console.log('peer open');
			conn = peer.connect(host_id);

			conn.on('open', function() {
				console.log('conn open');
				// Receive messages
				conn.on('data', function(data) {
					msg_handler(data);
				});

				conn.send('Hello!');
			});
		});
	}

	function submitMessage(message, done, fail){
		if(!conn)
			fail('conn is not initialized');
		
		conn.send(message);
		done();
	}

	return {
		joinChatSession: joinChatSession,
		submitMessage: submitMessage
	}

});
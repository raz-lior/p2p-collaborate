define(['peerjs'], function() {

	function joinChatSession(host_id){
		
		var peer = new Peer({key: 'lwjd5qra8257b9'});

		peer.on('open', function(peer_id) {
			console.log('peer open');
			var conn = peer.connect(host_id);

			conn.on('open', function() {
				console.log('conn open');
				// Receive messages
				conn.on('data', function(data) {
					console.log('Received', data);
				});

				conn.send('Hello!');
			});
		});
	}

	return {
		joinChatSession: joinChatSession
	}

});
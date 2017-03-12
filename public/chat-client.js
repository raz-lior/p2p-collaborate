define(['peerjs'], function() {
	var conn;
	var peer;
	var is_peer_open = false;

	function ChatClient(){

	}

	ChatClient.prototype.open_peer_connection = function(connection_opened){
		peer = new Peer({key: 'lwjd5qra8257b9'});
		peer.on('open', function(peer_id) {
			is_peer_open = true;
			connection_opened();
		});	
	}

	ChatClient.prototype.join_chat_session = function(host_id, msg_handler){

		if(!is_peer_open)
			throw new Error('peer connection must be open before calling this function');
		
		conn = peer.connect(host_id);
		var data_handler = this.handle_received_data.bind(this);
		conn.on('open', function() {
			// Receive messages
			conn.on('data', function(data) {
				data_handler(data, msg_handler);
			});
		});
	}

	ChatClient.prototype.handle_received_data = function(data, next_handler){
		next_handler(data);
	}

	ChatClient.prototype.submit_message = function(message, done, fail){
		if(!conn)
			fail('conn is not initialized');
		
		conn.send(message);
		done();
	}

	return ChatClient;

});
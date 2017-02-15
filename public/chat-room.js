define(['chat-host','chat-client'], function(ChatHost, ChatClient) {

	function ChatRoom(){
		this.room_name = '';
		this.chat_client;
	}

	ChatRoom.prototype.create_room = function(room_name, display_message_handler, done, fail){
		this.chat_client = new ChatHost();
		this.chat_client.start_chat_session(room_name, display_message_handler, done, fail);
	}

	ChatRoom.prototype.join_room = function(room_Id, display_message_handler){
		this.chat_client = new ChatClient();

		var handle_connection_opened = (function(){
			this.chat_client.join_chat_session(room_Id, display_message_handler);
		}).bind(this);

		this.chat_client.open_peer_connection(handle_connection_opened);
		
	}

	ChatRoom.prototype.send_message = function(message, done, fail){
		this.chat_client.submit_message(message, done, fail);
	}

	ChatRoom.prototype.load_chat_data = function(file){
		if(this.chat_client instanceof ChatHost)
			this.chat_client.load_session_data(file);
	}

	ChatRoom.prototype.export_chat_data = function() {
		if(this.chat_client instanceof ChatHost)
			this.chat_client.export_session_data();
	};

	return ChatRoom;

});
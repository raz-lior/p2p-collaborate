define(['jquery','chat-host','chat-client', 'chat-room'],function   ($, chat_host, chat_client, ChatRoom) {

	var chat_room;
	var chatClient;
	var chat_sessions = [];

	$('#sessionCreator').click(setup_chat_session);

	$('#sessionStarter').click(start_chat_session);

	$('#sessionExporter').click(export_session);

	$('#sessionLoader').change(load_session);
	$('#messageSubmitter').click(submit_message);

	

	get_list_of_sessions();

	function get_list_of_sessions(){
		$.get('/session')
			.done(function(data){
				chat_sessions = data;

				var session_list_container = $('#sessionList ul');
				for(var i=0; i < chat_sessions.length; i++){
					
					var chat_list_html = '<li><button>' + chat_sessions[i].name + '</button></li>';
					var chat_list_elm = $(chat_list_html);
					chat_list_elm.find('button').click(join_chat_session);
					chat_list_elm.find('button').data('host-id',chat_sessions[i].host);

					session_list_container.append(chat_list_elm);
				}
				
			})
			.fail(function(){});
	}

	function setup_chat_session(){
		$('#sessionSetup').show();
	}

	function start_chat_session(){
		// var message = {
		//   recieved: '1/13/2017 12:34',
		//   content: 'Hello',
		//   sender: 'Jack'
		// }

		// messageEntries.push(message);
		// console.log(messageEntries);

		var name = $('#sessionName').val();

		chat_room = new ChatRoom();
		chat_room.create_room(name, handle_incoming_message, start_session_succeed, start_session_failed);
	}

	function handle_incoming_message(data){
		var message_elm = $('#chatSession #messages');

		message_elm.append('<div class"message">' + data + '</div>');
	}

	function start_session_succeed(){
		$('#sessionSetup').hide();
		$('#sessionLoader').show();
		$('#sessionExporter').show();
		$('#inviteCreator').show();
	}

	function start_session_failed(err){
		//TODO: popup an error message for the client
		console.log(err);
	}

	function join_chat_session(){
		var host_id = $(this).data('host-id');

		chat_room = new ChatRoom();
		chat_room.join_room(host_id, handle_incoming_message);
	}

	function submit_message(){
		var message = $('#speaker').val();

		chat_room.send_message(message,message_sent, message_failed);
	}

	function message_sent(){
		$('#speaker').val('');
	}

	function message_failed(err){
		console.log(err);
	}

	function load_session(event){
		var file = event.target.files[0];
		if (!file) {
			return;
		}

		chat_room.load_chat_data(file);
	}

	function export_session(){
		chat_room.export_chat_data();
	}
});



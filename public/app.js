define(['jquery','chat-host','chat-client'],function   ($, chat_host, chat_client) {

	var chatClient;
	var chat_sessions = [];

	$('#sessionCreator').click(setupChatSession);

	$('#sessionStarter').click(startChatSession);

	$('#sessionExporter').click(exportSession);

	$('#sessionLoader').change(loadSession);
	$('#messageSubmitter').click(submitMessage);

	

	get_list_of_sessions();

	function get_list_of_sessions(){
		$.get('/session')
			.done(function(data){
				chat_sessions = data;

				var session_list_container = $('#sessionList ul');
				for(var i=0; i < chat_sessions.length; i++){
					
					var chat_list_html = '<li><button>' + chat_sessions[i].name + '</button></li>';
					var chat_list_elm = $(chat_list_html);
					chat_list_elm.find('button').click(joinChatSession);
					chat_list_elm.find('button').data('host-id',chat_sessions[i].host);

					session_list_container.append(chat_list_elm);
				}
				
			})
			.fail(function(){});
	}

	function setupChatSession(){
		$('#sessionSetup').show();
	}

	function startChatSession(){
		// var message = {
		//   recieved: '1/13/2017 12:34',
		//   content: 'Hello',
		//   sender: 'Jack'
		// }

		// messageEntries.push(message);
		// console.log(messageEntries);

		var name = $('#sessionName').val();

		chat_host.startChatSession(name, handleIncomingMessage, startSessionSucceed, startSessionFailed);

		chatClient = chat_host;
	}

	function handleIncomingMessage(data){
		var message_elm = $('#chatSession #messages');

		message_elm.append('<div class"message">' + data + '</div>');
	}

	function startSessionSucceed(){
		$('#sessionSetup').hide();
		$('#sessionLoader').show();
		$('#sessionExporter').show();
		$('#inviteCreator').show();
	}

	function startSessionFailed(err){
		//TODO: popup an error message for the client
		console.log(err);
	}

	function joinChatSession(){
		var host_id = $(this).data('host-id');
		
		chat_client.joinChatSession(host_id, handleIncomingMessage);

		chatClient = chat_client;
	}

	function submitMessage(){
		var message = $('#speaker').val();

		chatClient.submitMessage(message,messageSent, messageFailed);
	}

	function messageSent(){
		$('#speaker').val('');
	}

	function messageFailed(err){
		console.log(err);
	}

	function loadSession(event){
		var file = event.target.files[0];
		if (!file) {
			return;
		}

		chat_host.loadSession(file);
	}

	function exportSession(){
		chat_host.exportSession();
	}
});



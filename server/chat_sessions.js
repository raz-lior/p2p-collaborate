let chat_sessions = [];

function find_session(id){

	if(!Number.isInteger(id))
		throw new Error('ids should only be integers');

	for(let chat_session of chat_sessions){
		if(chat_session.id === id){
			return chat_session;
		}
	}
}

exports.add_new_session = function(name){
	let chat_session = {
		id: null,
		name: name,
		createdOn: new Date()
	}

	chat_sessions.push(chat_session);
	chat_session.id = chat_sessions.length;

	return chat_session.id;
};

exports.update_session = function(id,new_data){

	let chat_session = find_session(id);

	if(chat_session == undefined){
		throw new Error(`session with id:${id}, was not found`);
	}
	
	for(let prop in new_data){
		chat_session[prop] = new_data[prop];
	}
};

exports.get_sessions = function(){
	return chat_sessions;
}


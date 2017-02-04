console.log('Running...');



define(['jquery','FileSaver.js'],function   ($, saveAs) {

	var messageEntries = [];
	

	$('#sessionStarter').click(startChatSession);

	$('#sessionExporter').click(exportSession);

	$('#sessionLoader').change(loadSession);

    function startChatSession(){
    	var message = {
    		recieved: '1/13/2017 12:34',
    		content: 'Hello',
    		sender: 'Jack'
    	}

    	messageEntries.push(message);
    	console.log(messageEntries);
	}

	function loadSession(event){
  		var file = event.target.files[0];
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
});



define(['jquery','FileSaver.js','peerjs'],function   ($, saveAs) {

  var messageEntries = [];

  $('#sessionCreator').click(setupChatSession);

  $('#sessionStarter').click(startChatSession);

  $('#sessionExporter').click(exportSession);

  $('#sessionLoader').change(loadSession);


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

    $.post('/session/' + name)
      .done(sessionCreated)
      .fail(function(){
        //TODO: popup an error message for the client
        console.log('fail to create a session');
      });
  }

  function sessionCreated(chat_session){
    
    //TODO: change the p2p default key to a new one
    var peer = new Peer({key: 'lwjd5qra8257b9'});

    peer.on('open', function(peer_id) {

      $.ajax('/session/' + chat_session.id,{
        data: JSON.stringify({host: peer_id}),
        type: 'put',
        contentType:'application/json'
      })
        .done(function(){
          $('#sessionSetup').hide();
          $('#sessionLoader').show();
          $('#sessionExporter').show();
          $('#inviteCreator').show();
        })
        .fail(function(){
         console.log('fail to update host peer id'); 
        });

      
    });
  }

  function joinChatSession(){

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



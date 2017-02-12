define(['jquery','FileSaver.js','peerjs'],function   ($, saveAs) {

  var messageEntries = [];
  var chat_sessions = [];

  $('#sessionCreator').click(setupChatSession);

  $('#sessionStarter').click(startChatSession);

  $('#sessionExporter').click(exportSession);

  $('#sessionLoader').change(loadSession);

  get_list_of_sessions();

  function get_list_of_sessions(){
    $.get('/session')
      .done(function(data){
        chat_sessions = data;

        var session_list_container = $('#session_list ul');
        for(var i=0; i < chat_sessions.length; i++){
          
          var chat_list_html = '<li><button>' + chat_sessions[i].name + '</button></li>';
          var chat_list_elm = $(chat_list_html);
          chat_list_elm.find('button').click(joinChatSession);
          chat_list_elm.find('button').data('host-id',chat_sessions[i].host);

          session_list_container.append(chat_list_elm);
        }

        
      })
      .fail(function(){

      });
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

    peer.on('connection', function(conn) {

      conn.on('open', function() {
        // Receive messages
        conn.on('data', function(data) {
          console.log('Received', data);
        });

        
      });

    });
  }

  function joinChatSession(){
    var host_id = $(this).data('host-id');
    
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



const socket=io();
var chats=document.querySelector('.chat');
var sender=document.querySelector('#sender');
var reciver=document.querySelector('#reciver');
// var msgSend=document.querySelector('#msg-send');
var userMsg=document.querySelector('#user-msg');
var senderid=sender.innerHTML;
var reciverid=reciver.innerHTML;


/**message send */
$('#msg-send').click(()=>{
// msgSend.addEventListener('click',()=>{
    let data={
        sender:senderid,
        reciver:reciverid,
        msg:userMsg.value
    };
    if(userMsg.value!=''){
        appendMessage(data,'send');
        socket.emit('message',data)
        userMsg.value='';

    }
});

function appendMessage(data,status){
    let div=document.createElement('div');
    div.classList.add('message',status);
    let content='<p>'+data.msg+'</p>';
    div.innerHTML=content;
    var executed=false;
    if(!executed){
        chats.appendChild(div);
        executed=true
    }
    
    chats.scrollTop=chats.scrollHeight;
}
socket.on(senderid,(data)=>{
         appendMessage(data,'recived');
    
})
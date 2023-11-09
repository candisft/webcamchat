
const socket =io('/');

const videoGrid = document.getElementById('video-grid');
const myVideo =document.createElement('video');
myVideo.muted =true;

var peer =new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'443'
});

let myVideoStream

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    
    peer.on('call',call =>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream =>{
            addVideoStream(video,userVideoStream)
        })
    })
    
    socket.on('user-connected',(userId)=>{
        // connectToNewUser(userId,stream);
        setTimeout(connectToNewUser,1000,userId,stream);
    })
   
    const msg = document.querySelector('input')
    const chatMsg = document.getElementById('chat__message')
    
    chatMsg.addEventListener('keydown', e => {
        if (e.code == "Enter" && msg.value.length !== 0) {
            socket.emit('message', msg.value);
            msg.value = '';
        }
    })
    const sendMsg = document.querySelector('.btn')
    
    sendMsg.addEventListener('click', () => {
        if (msg.value.length !== 0) {
            socket.emit('message', msg.value);
            msg.value = '';
        }
    })

socket.on('createMessage', message => {
    const messages = document.querySelector('ul')
    messages.innerHTML += `<li class="message"><b>user</b><br>${message}</li><br>`
    scrollToBottom();
})

})

peer.on('open',id =>{
    socket.emit('join-room',ROOM_ID, id);
});


const connectToNewUser = (userId, stream)=>{
   const call = peer.call(userId,stream)
   const video = document.createElement('video')
   call.on('stream',userVideoStream =>{
       addVideoStream(video,userVideoStream)
   })
}


const addVideoStream = (video,stream)=>{
    video.srcObject = stream; 
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
  videoGrid.append(video);
}

function scrollToBottom (){
    let d= document.querySelector('.main__chat__window');
    d.scrollTop = d.scrollHeight;
}

//mute our video
const muteUnmute =() =>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled =false;
        setUnmuteButton();
    }
    else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
    }

 const setMuteButton = () =>{
     const html =`<i class ="fas fa-microphone"></i>
        <span>Mute</span>
     `
     
     document.querySelector('.main_mute_button').innerHTML = html;
 }
 
 const setUnmuteButton = () =>{
    const html =`<i class =" unmute fas fa-microphone-slash"></i>
       <span>UnMute</span>
    `
    
    document.querySelector('.main_mute_button').innerHTML = html;
}

const playStop = () =>{
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    }
    else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
    }

const setStopVideo = () =>{
    const html =`<i class="fas fa-video"></i>
    <span>Stop Video</span>           
    `
    
    document.querySelector('.main_video_button').innerHTML = html;
}
const setPlayVideo = () =>{
    const html =`<i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>           
    `
    
    document.querySelector('.main_video_button').innerHTML = html;
}
   
function leave() {
    var myWindow = window.open("", "_self");
    myWindow.document.write("");
    setTimeout (function() {myWindow.close();},100);
  }




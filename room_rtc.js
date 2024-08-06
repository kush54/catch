const APP_ID = "a7fb669a6f764b8cad69b691c0b799ae";
let uid = sessionStorage.getItem("uid");
if (!uid) {
  uid = String(Math.floor(Math.random() * 10000));
  sessionStorage.setItem("uid", uid);
}
console.log(uid, "uid");
let token = null;

let client;

// url type room.html?room=6363
let rtmClient;
let channel 

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let roomId = urlParams.get("room");
if (!roomId) {
  roomId = "main";
}

let displayName = sessionStorage.getItem('display_name')
if(!displayName){
    window.location = 'lobby.html'
}

let localTracks = [];
let remoteUsers = {}; //key value

let  localScreenTracks ;
let sharingScreen = false


let joinRoomInit = async () => {
  //  rtmClient  = await AgoraRTM.createInstance(APP_ID)
  //  console.log(uid,"uid")
  //  await rtmClient.login({uid,token}) 
  
  //  channel = await rtmClient.createChannel(roomId)
  //  await channel.join()
  //  channel.on("MemberJoined",handleMemberJoined)

  

  client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  await client.join(APP_ID, roomId, token, uid);
  client.on("user-published", handleUserPublished);
  client.on("user-left", handleUserLeft);

  joinStream();
};

let joinStream = async () => {
  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks({},{
    width:{min:640,ideal:1920,max:1920},
    height:{min:400,ideal:1080,max:1080}
  });
  let player = `<div class="video__container" id="user-container-${uid}">
    <div class="video-player" id="user-${uid}" ></div>
   </div>`;
  document
    .getElementById("streams__container")
    .insertAdjacentHTML("beforeend", player);
    document.getElementById(`user-container-${uid}`).addEventListener("click",expandVideoFrame)

  localTracks[1].play(`user-${uid}`);
  console.log("audio",localTracks[0])
  console.log("video",localTracks[1])
  await client.publish([localTracks[0],localTracks[1]])
};

let switchToCamera=async()=>{
   let  player = `<div class="video__container" id="user-container-${uid}">
    <div class="video-player" id="user-${uid}" ></div>
   </div>`;
   displayFrame.insertAdjacentHTML('beforeend',player)

   await localTracks[0].setMuted(true)
   await localTracks[1].setMuted(true)

   document.getElementById('mic-btn').classList.remove('active')
   document.getElementById('screen-btn').classList.remove('active')

   localTracks[1].play(`user-${uid}`)
   await client.publish([localTracks[1]])

}

let handleUserPublished = async (user, mediaType) => {
    
  remoteUsers[user.uid] = user;
  await client.subscribe(user, mediaType);
  let player = document.getElementById(`user-container-${user.uid}`);
  if (player === null) {
    player = `<div class="video__container" id="user-container-${user.uid}">
        <div class="video-player" id="user-${user.uid}" ></div>
       </div>`;
    document
      .getElementById("streams__container")
      .insertAdjacentHTML("beforeend", player);
      document.getElementById(`user-container-${user.uid}`).addEventListener("click",expandVideoFrame)
    }
    if(displayFrame.style.display){
      let videoFrame = document.getElementById(`user-container-${user.uid}`)
      videoFrame.style.height='100px'
      videoFrame.style.width='100px'

    }
   if(mediaType==="video"){
    console.log("aya")
    user.videoTrack.play(`user-${user.uid}`)
   }
   if(mediaType==="audio"){
    user.audioTrack.play()
   }
};

let handleUserLeft=(user)=>{
       delete remoteUsers[user.uid]
       document.getElementById(`user-container-${user.uid}`).remove()
       if(`user-container-${user.uid}`===uif){
        displayFrame.style.display=null
        for( i =0; i <videoFrames.length;i++){
            videoFrames[i].style.height="300px"
            videoFrames[i].style.width="300px"
                }
       }
       
}


let toggleCamera=async=async(e)=>{
    let button = e.currentTarget
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        button.classList.add('active')
    }else{
        await localTracks[1].setMuted(true)
        button.classList.remove('active')
    }
}

let toggleMic=async=async(e)=>{
    let button = e.currentTarget
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        button.classList.add('active')
    }else{
        await localTracks[0].setMuted(true)
        button.classList.remove('active')
    }
}

let toggleScreen=async(e)=>{
   let screenButton = e.currentTarget
   let cameraButton = document.getElementById("camera-btn")
   if(!sharingScreen){
    sharingScreen = true
    screenButton.classList.add('active')
    cameraButton.classList.remove('active')
    cameraButton.style.display="none"

    localScreenTracks = await AgoraRTC.createScreenVideoTrack()
    document.getElementById(`user-container-${uid}`).remove()
    displayFrame.style.display = 'block'
    let player = `<div class="video__container" id="user-container-${uid}">
              <div class="video-player" id="user-${uid}" ></div>
   </div>`
   displayFrame.insertAdjacentHTML("beforeend",player)
   document.getElementById(`user-container-${uid}`).addEventListener("click",expandVideoFrame)

   uif = `user-container-${uid}`

   localScreenTracks.play(`user-${uid}`)
   await client.unpublish([localTracks[1]])
   await client.publish([localScreenTracks])

   let videoFrames = document.getElementsByClassName("video__container")
   for(let i =0; i < videoFrames.length;i++){
    if(videoFrames[i].id!=uif){
      videoFrames[i].style.height = "100px"
      videoFrames[i].style.width = "100px"
    }
  }

   }else{
    sharingScreen=false
    // screenButton.classList.remove('active')
    // cameraButton.classList.add('active')
    cameraButton.style.display="block"
    document.getElementById(`user-container-${uid}`).remove()
    await client.unpublish([localScreenTracks])
    // await client.publish([localTracks[1]])
    switchToCamera()
   }

}
document.getElementById('camera-btn').addEventListener('click',toggleCamera)
document.getElementById('mic-btn').addEventListener('click',toggleMic)
document.getElementById('screen-btn').addEventListener("click",toggleScreen)

joinRoomInit();

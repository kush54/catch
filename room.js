 messagesContainer = document.getElementById('messages');
messagesContainer.scrollTop = messagesContainer.scrollHeight;

 memberContainer = document.getElementById('members__container');
 memberButton = document.getElementById('members__button');

 chatContainer = document.getElementById('messages__container');
 chatButton = document.getElementById('chat__button');

 activeMemberContainer = false;

memberButton.addEventListener('click', () => {
  if (activeMemberContainer) {
    memberContainer.style.display = 'none';
  } else {
    memberContainer.style.display = 'block';
  }

  activeMemberContainer = !activeMemberContainer;
});

 activeChatContainer = false;

chatButton.addEventListener('click', () => {
  if (activeChatContainer) {
    chatContainer.style.display = 'none';
  } else {
    chatContainer.style.display = 'block';
  }

  activeChatContainer = !activeChatContainer;
});

let displayFrame = document.getElementById("stream__box")
let videoFrames = document.getElementsByClassName("video__container")
let uif  = null

let expandVideoFrame = (e)=>{
   let child = displayFrame.children[0]
   if(child){
    document.getElementById('streams__container').appendChild(child)
   }
   displayFrame.style.display= 'block'
   displayFrame.appendChild(e.currentTarget)
   uif = e.currentTarget.id
   
for(let i =0; i < videoFrames.length;i++){
  if(videoFrames[i].id!=uif){
    videoFrames[i].style.height = "100px"
    videoFrames[i].style.width = "100px"
  }
}
}


for(let i =0; i < videoFrames.length;i++){
  videoFrames[i].addEventListener('click',expandVideoFrame)
}

let hideDisplayFrame=()=>{
  displayFrame.style.display=null
  uif=null
  let child  =displayFrame.children[0]
  document.getElementById("streams__container").appendChild(child)
  for(let i =0; i < videoFrames.length;i++){
      videoFrames[i].style.height = "300px"
      videoFrames[i].style.width = "300px"
  } 
}
displayFrame.addEventListener("click",hideDisplayFrame)
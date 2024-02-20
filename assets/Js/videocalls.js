
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
});
const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};

window.addEventListener('beforeunload', () => {
  socket.emit('user-disconnected', myPeer.id);
});

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream);

  myPeer.on('call', call => {
    call.answer(stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
  });

  socket.on('user-connected', userId => {
    setTimeout(() => {
      connectToNewUser(userId, stream);
    }, 1000);
  });

});

socket.on('user-disconnected', userId => {
  setTimeout(() => {
    if (peers[userId]) {
      peers[userId].video.remove();
      peers[userId].call.close();
      delete peers[userId];
    }
  }, 1000);
});

myPeer.on('open', id => {
  setTimeout(() => {
    socket.emit('join-room', ROOM_ID, id);
  }, 1000);
});

function connectToNewUser(userId, stream) {
  if (peers[userId]) {
    const video = peers[userId].video;
    const call = myPeer.call(userId, stream);
    call.on('stream', userVideoStream => {
      video.srcObject = userVideoStream;
    });
    peers[userId].call = call;
  } else {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
      video.remove();
      delete peers[userId];
    });
    peers[userId] = { call, video };
  }
}


let myFaceDescriptor;

async function addVideoStream(video, stream) {
  video.srcObject = stream;
  await new Promise((resolve) => {
    video.addEventListener('loadedmetadata', resolve);
  });
  video.play();

  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/face-api/weights/'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/face-api/weights/'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/face-api/weights/'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/face-api/weights/')
  ]);

  await captureMyFace(); 

  startVideoCall(video);
}

async function captureMyFace() {
  const detections = await faceapi.detectSingleFace(myVideo).withFaceLandmarks().withFaceDescriptor();
  if (detections) {
    myFaceDescriptor = detections.descriptor;
  }
}

function startVideoCall(video) {
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;
  video.width = videoWidth;
  video.height = videoHeight;

  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-container');
  videoContainer.appendChild(video);
  videoGrid.appendChild(videoContainer);

  const canvas = faceapi.createCanvasFromMedia(video);
  videoContainer.appendChild(canvas);
  faceapi.matchDimensions(canvas, { width: videoWidth, height: videoHeight });

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, { width: videoWidth, height: videoHeight });

    const faceMatcher = new faceapi.FaceMatcher(resizedDetections, 0.6); 

    canvas.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
    resizedDetections.forEach((detection) => {
      const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

      const box = detection.detection.box;
      const label = bestMatch.label === 'unknown' ? 'Unknown' : 'Moaz Ibrahim'; 

      const drawBox = new faceapi.draw.DrawBox(box, { label });
      drawBox.draw(canvas);
    });
  }, 100);
}


const muteAudioButton = document.getElementById('mute-audio');
const muteVideoButton = document.getElementById('mute-video');
const leaveCallButton = document.getElementById('leave-call');

muteAudioButton.addEventListener('click', toggleAudioMute);
muteVideoButton.addEventListener('click', toggleVideoMute);
leaveCallButton.addEventListener('click', leaveCall);

function toggleAudioMute() {
  const enabled = myVideo.srcObject.getAudioTracks()[0].enabled;
  myVideo.srcObject.getAudioTracks()[0].enabled = !enabled;
  muteAudioButton.innerHTML = !enabled ? '<i class="fa-solid fa-microphone fa-2xl" style="color: #0275d8"></i>' : '<i class="fa-solid fa-microphone-slash fa-2xl" style="color: #d9534f"></i>';
}

function toggleVideoMute() {
  const enabled = myVideo.srcObject.getVideoTracks()[0].enabled;
  myVideo.srcObject.getVideoTracks()[0].enabled = !enabled;
  muteVideoButton.innerHTML = !enabled ? '<i class="fa-solid fa-video fa-2xl" style="color: #0275d8"></i>' : '<i class="fa-solid fa-video-slash fa-2xl" style="color: #d9534f"></i>';
}

function leaveCall() {
  myPeer.destroy();
  myVideo.remove();
  socket.emit('user-disconnected', myPeer.id);
  window.location.href = '/home';
}


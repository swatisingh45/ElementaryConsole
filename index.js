window.addEventListener('load', function(){

    const myAccessToken = 'YzZhMTQ0OWYtODkzOS00MTNmLWEyZWMtYzMwZmFhMWI2OWFkNjQ3MjFjZDYtYTQy_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f';
    
    if (myAccessToken === 'ZjlkYmE3MWUtYmE3NS00NmQ0LTllYjktMzRlNDQ1ZjVkMjM5NDZjMzRkYmMtMzRm_PF84_1eb65fdf') {
      alert('Make sure to update your access token in the index.js file!');
    }

    const webex = window.Webex.init({
      credentials: {
        access_token: myAccessToken
      }
    });

    var video = document.querySelector("#self-view");

    //Start streaming self view from the beginning
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
        })
        .catch(function (err0r) {
          console.log("Something went wrong!");
        });
    }
    

   webex.meetings.register()
      .catch((err) => {
        console.error(err);
        alert(err);
        throw err;
      });

    
  function bindMeetingEvents(meeting) {
      meeting.on('error', (err) => {
        console.error(err);
      });


    // Handle media streams changes to ready state
    meeting.on('media:ready', (media) => {
      if (!media) {
        // document.getElementById('self-view').srcObject = media.stream;
      }
      if (media.type === 'local') {
        document.getElementById('self-view').srcObject = media.stream;
      }
      if (media.type === 'remoteVideo') {
        document.getElementById('remote-view-video').srcObject = media.stream;
      }
      if (media.type === 'remoteAudio') {
        document.getElementById('remote-view-audio').srcObject = media.stream;
      }
    });
  
    // Handle media streams stopping
    meeting.on('media:stopped', (media) => {
      // Remove media streams
      if (media.type === 'local') {
        document.getElementById('self-view').srcObject = null;
      }
      if (media.type === 'remoteVideo') {
        document.getElementById('remote-view-video').srcObject = null;
      }
      if (media.type === 'remoteAudio') {
        document.getElementById('remote-view-audio').srcObject = null;
      }
    });
  
    // Of course, we'd also like to be able to leave the meeting:
    document.getElementById('leave').addEventListener('click', () => {
      meeting.leave();
    });
  }
  
  // Join the meeting and add media
  function joinMeeting(meeting) {
  
    return meeting.join().then(() => {
      const mediaSettings = {
        receiveVideo: true,
        receiveAudio: true,
        receiveShare: false,
        sendVideo: true,
        sendAudio: true,
        sendShare: false
      };
  
      // Get our local media stream and add it to the meeting
      return meeting.getMediaStreams(mediaSettings).then((mediaStreams) => {
        const [localStream, localShare] = mediaStreams;
  
        meeting.addMedia({
          localShare,
          localStream,
          mediaSettings
        });
      });
    });
  }
  
  document.getElementById('destination').addEventListener('submit', (event) => {
    // again, we don't want to reload when we try to join
    event.preventDefault();
  
    const destination = document.getElementById('invitee').value;
  
    return webex.meetings.create(destination).then((meeting) => {
      // Call our helper function for binding events to meetings
      bindMeetingEvents(meeting);
  
      return joinMeeting(meeting);
    })
    .catch((error) => {
      // Report the error
      console.error(error);
    });
  });
    
  
});

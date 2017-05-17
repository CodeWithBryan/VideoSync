var socket = io();
var video = null;
var currentVideo = null;
var currentTitle = null;
var clients = 0;

// Client Count
socket.on('clientUpdate', function(msg) {
  clients = msg.clients; // No real need to save to a variable atm, but I'm doing it anyway... maybe add chat or something down the road
  $('.clientCount').html('Current Viewers: ' + clients);
});

// Video is changed.
socket.on('videoChange', function(msg) {
  currentVideo = msg.id;
  currentTitle = msg.title;

  $('.title').html(msg.title);
  setVideo(msg.id);
});

socket.on('videoUpdate', function(msg) {

  // If currentVideo isn't set, update it.
  if (!currentVideo) {
    currentVideo = msg.id;
    setVideo(msg.id);
  }

  // Video is paused and msg says it shouldn't be
  if (video.paused && !msg.paused) {
    video.play(); // Play the video
  }

  // Video is not paused and msg says it should be
  if (!video.paused && msg.paused) {
    video.pause(); // Pause it
  }

  // If the video is more than 0.5 seconds out of sync, resync it
  if (Math.abs(video.currentTime - msg.time) > 0.5) {
    video.currentTime = msg.time;
  }

  // Just some simple debugging info I threw in to show performance
  $('.timeDiff').html('Update Message Delay: ' + ((new Date).getTime() - msg.realTime) + 'ms <br>Video Offset: ' + (msg.time - video.currentTime).toFixed(3) + ' seconds');
});

// Re-render the video player w/ new video
function setVideo(id) {
  $('.video').html('<video width="400" controls id="video-active"> <source src="http://mrboolean.io/videos/episode_' + id + '.mp4" type="video/mp4" class="video-source"> Your browser does not support HTML5 video. </video>');
  video = $('#video-active').get(0);
}
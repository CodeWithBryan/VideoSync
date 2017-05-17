var socket = io();

var clients = 0;
// Default to our first video
var currentVideo = videos[0].id;
var currentTitle = videos[0].title;

// Client Count
socket.on('clientUpdate', function(msg) {
  clients = msg.clients; // No real need to save to a variable atm, but I'm doing it anyway... maybe add chat or something down the road
  $('.clientCount').html('Current Viewers: ' + clients);
});

// Document is loaded
$(document).ready(function(){
  // Build our list of videos
  $.each(videos, function( index, value ) {
    $('.video-list').append('<li class="video-link" onClick="handleClick(' + value.id + ')">' + value.title + ' </li>');
  });
});

// Handle a click on the video list
function handleClick(videoId) {
  currentVideo = videoId;
  currentTitle = $.grep(videos, function(e){ return e.id == videoId; })[0].title;

  socket.emit('videoChange', { id: videoId, title: currentTitle });

  $('.title').html(currentTitle);
  setVideo(videoId);

  $("#video-active").on(
    "timeupdate",
    function(event){
      socket.emit('videoUpdate', { paused: this.paused, time: this.currentTime, id: currentVideo, title: currentTitle, realTime: (new Date).getTime() });
    });
}

// Change the video player
function setVideo(id) {
  $('.video').html('<video width="400" controls id="video-active"> <source src="http://mrboolean.io/videos/episode_' + id + '.mp4" type="video/mp4" class="video-source"> Your browser does not support HTML5 video. </video>');
}

// Lookup an object in an array
function lookup(array, prop, value) {
  for (var i = 0, len = array.length; i < len; i++)
    if (array[i] && array[i][prop] === value) return array[i];
}
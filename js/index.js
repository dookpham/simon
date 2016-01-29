'use strict';

$(document).ready(function () {
  var strictMode = false;
  var sequence = [];
  var playerSequence = [];
  var playerTurn = false;

  var sound1 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
  var sound2 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
  var sound3 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
  var sound4 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
  var errorSound = new Audio('https://s3-us-west-1.amazonaws.com/dookpham/error.mp3');
  var colors = ['green', 'red', 'yellow', 'blue'];

  function addToSequence() {
    var nextColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(nextColor);
  }

  function playSequence() {
    var i = 0;
    var speed;
    sequence.length < 10 ? speed = 1000 : sequence.length < 16 ? speed = 700 : speed = 500;
    var playInterval;
    function playSound() {
      var color = sequence[i];
      playColor(color);

      setTimeout(function () {
        removeGlow(color);
      }, speed - 100);
      i++;
      console.log('playSound:' + i);
      if (i >= sequence.length) {
        playerTurn = true;
      } else {
        setTimeout(playSound, speed);
      }
    }
    setTimeout(playSound, speed);
  }

  function removeGlow(color) {
    console.log('removeGlow:' + color);
    $('#' + color + '-btn').removeClass(color + '-glow');
  }

  function playColor(color, error) {
    var sound;
    switch (color) {
      case 'green':
        sound = sound1;break;
      case 'red':
        sound = sound2;break;
      case 'yellow':
        sound = sound3;break;
      case 'blue':
        sound = sound4;break;
    }
    console.log('playColor:' + color);
    $('#' + color + '-btn').addClass(color + '-glow');
    error ? errorSound.play() : sound.play();
  }

  function setCount(num) {
    $('#count-num').text(num);
  }

  $('.colorBtn').mousedown(function (e) {
    if (playerTurn) {
      var id = e.target.id;
      var color = id.replace('-btn', '');
      console.log('colorBtn:' + color);
      var i = playerSequence.length;var error;
      sequence[i] === color ? error = false : error = true;
      playColor(color, error);
      if (error) {
        setCount('!!');
        playerSequence = [];
        if (strictMode === true) {
          sequence = [];
          addToSequence();
        }
        setTimeout(function () {
          setCount(sequence.length);playSequence();
        }, 500);
      } else {
        playerSequence.push(color);
        if (playerSequence.length === sequence.length) {
          setTimeout(function () {
            playerTurn = false;
            playerSequence = [];
            addToSequence();
            setCount(sequence.length);
            playSequence();
          }, 500);
        }
      }
    }
  });

  $('.colorBtn').mouseup(function (e) {
    if (playerTurn) {
      var id = e.target.id;
      var color = id.replace('-btn', '');
      removeGlow(color);
    }
  });

  $('#start-btn').click(function () {
    console.log('pressed start');
    setCount(1);
    sequence = [];
    playerTurn = false;
    addToSequence();
    playSequence();
  });

  $('#strict-btn').click(function () {
    console.log('pressed strict');
    if (strictMode == false) {
      strictMode = true;
      $('#strict-light').css({ 'backgroundColor': 'orange', 'box-shadow': '0 0 0.5em 0.3em #fc0' });
    } else {
      strictMode = false;
      $('#strict-light').css({ 'backgroundColor': '', 'box-shadow': '' });
    }
  });
});
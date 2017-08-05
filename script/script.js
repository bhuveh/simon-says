/*Initial variables.*/
var colors = ['Red', 'Yellow', 'Blue', 'Green'];
var audioList = ['https://s3.amazonaws.com/freecodecamp/simonSound1.mp3','https://s3.amazonaws.com/freecodecamp/simonSound2.mp3','https://s3.amazonaws.com/freecodecamp/simonSound3.mp3','https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'];
var chainSimon = [];
var state = 0;
var strict = 0;

var main = function() {
  /*Switched off in the beginning.*/
  off();
  
  /*Switching on and off.*/
  $('.switch-2').click(function() {
    if(state) {
      $(this).removeClass('left');
      $(this).addClass('right');
      off();
    } else {
      $(this).removeClass('right');
      $(this).addClass('left');
      on();
    }    
  });
};

/*Switch off.*/
var off = function() {
  chainSimon = [];
  state = 0;
  strict = 0;
  
  console.log('Simon is asleep.');
  
  $('.count-disp').html('');
  $('.strict').off('click');
  $('.start').off('click');
  $('.light').removeClass('st-on');
};

/*Switch on.*/
var on = function() {
  state = 1;
  console.log('Simon is awake.');
  
  $('.count-disp').html('--');
  $('.strict').on('click', function(){
    if(strict){
      $('.light').removeClass('st-on');
      strict = 0;
    } else {
      $('.light').addClass('st-on');
      strict = 1;
    }
  });
  $('.start').on('click', function(){
    roundS(0);
    $('.start').off('click');
    $('.strict').off('click');
  });
};

/*Simon plays.*/
var roundS = function(count) {
  $('.quarter').off('click');
  if(count < 5) {
    $('.count-disp').html(count+1);
    chainSimon.push(getPress());
    /*Start at zero, zero is important.*/
    dispChain(0);
    console.log('Simon says..');
  } else {
    $('.count-disp').html('win');
    setTimeout(function() {
      off();
      on();
    }, 500);
  }
}

/*Get a random button for Simon.*/
var getPress = function() {
  return (Math.floor(4*Math.random()));
}

/*Display Simon's complete chain.*/
var dispChain = function(k) {
  $('.quarter').off('click');
  setTimeout(function() {
    var id = chainSimon[k]+1;
    console.log(colors[id-1]);
    var url = audioList[id-1];
    var audio = new Audio(url);
    audio.play();
    id = '#q'+id;
    $(id).addClass('jqhover');

    setTimeout(function() {
      $(id).removeClass('jqhover');
      k++;
      if(k < chainSimon.length) {
        dispChain(k);
      } else {
        roundU(chainSimon.length-1);
      }
    }, 500);
  }, 500);
}

/*User plays.*/
var roundU = function(count) {
  console.log('User says..');
  var chainUser = [];
  $('.quarter').on('click', function() {
    chainUser = userClick($(this), chainUser);
    if(!match(chainUser) && !strict) {
      $('.count-disp').html('!!!');
      setTimeout(function() {
        $('.count-disp').html(count+1);
        dispChain(0);
        console.log('Simon says..');
      }, 500);
    } else if (!match(chainUser) && strict) {
      $('.count-disp').html('!!!');
      setTimeout(function() {
        chainSimon = [];
        roundS(0);
      }, 500);
    } else {
      if(chainUser.length > count) {
        $('.quarter').off('click');
        setTimeout(function() {
          roundS(count+1);
        }, 500);
      }
    }
  });
}

var userClick = function(obj, chainUser) {
  var id = obj.attr('id');
  id = '#' + id;
  $(id).addClass('jqhover');
  setTimeout(function() {
    $(id).removeClass('jqhover');
  },500)
  var num = Number(id.substr(2))-1;
  console.log(colors[num]);
  var url = audioList[num];
  var audio = new Audio(url);
  audio.play();
  chainUser.push(num);
  return chainUser;
}

var match = function(chainUser) {
  for(var i = 0; i < chainUser.length; i++) {
    if(chainUser[i] !== chainSimon[i]) {
      return false;
    }
  }
  return true;
}





$(document).ready(main);
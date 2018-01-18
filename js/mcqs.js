const unitQuestionTime = 54; //sec


var sec = calcTestTime(); // Calculate test total time
var interval = setInterval(countDown, 1000); // main countDown interval
var currentQ; // Current Question in view
var submitted=false;

// Apend Sidebar to DOM
var questions_list;
for(var i=1; i<=document.querySelectorAll(".questions li").length; i++){
  var num;
  if(i<10) num="0"+i;
  else num =i;
  questions_list += `<option>${num}</option>`
}

var tocInner = document.querySelector('.md-sidebar--secondary .md-sidebar__inner');
tocInner.innerHTML =`<div class="side-nav">
    <div class="text-right timer-div">
      <input type="checkbox" id="id-name--1" name="set-name" class="switch-input" checked onchange='handleTimerSwitch(this)'>
    	<label for="id-name--1" class="switch-label">Timer <span class="toggle--on">On</span><span class="toggle--off">Off</span></label>
    </div>
    <div class="timer"><span class="act-tim-digit" tabindex="0">00</span><span class="act-tim-sep">h</span><span class="act-tim-digit" tabindex="0">00</span><span class="act-tim-sep">m</span><span class="act-tim-digit" tabindex="0">00</span><span class="act-tim-sep" style="padding-right:0px">s</span></div>
    <div class="toolbar">
      <span class="label">Goto:</span> <select class="goto-select" onchange="scrollToQ(+this.value)">
      ${questions_list}
      </select>
      <button class="submit-btn" onclick="submitTest()">Submit</button>
    </div>
  </div>`


/**
 * Calc time of test by multiplying number of
 * questions with unit question time
 */
function calcTestTime(){
    return document.querySelectorAll(".questions li").length * unitQuestionTime;
}


/** Convert sec to H:M:S */
function secTohms(s){
    var h = Math.floor(s / 3600);
    var m = Math.floor((s - (h * 3600)) / 60);
    s -= ((h * 3600) + (m * 60));
    return [h, m, s]
}

/** Write time to DOM */
function renderTime(time){
    var timerSpans = document.querySelectorAll(".timer .act-tim-digit");
    if (time[0]>-1){ // hour
      if (time[0]>9)
        timerSpans[0].innerHTML=time[0]
      else
        timerSpans[0].innerHTML="0"+time[0];
    }
    if (time[1]>-1){ // min
      if (time[1]>9)
        timerSpans[1].innerHTML=time[1]
      else
        timerSpans[1].innerHTML="0"+time[1];
    }
    if (time[2]>-1){ // sec
      if (time[2]>9)
        timerSpans[2].innerHTML=time[2]
      else
        timerSpans[2].innerHTML="0"+time[2];
    }

}

/** Base timer loop  */
function countDown(){
    if (sec<0 || submitted) return;
    time = secTohms(sec);
    renderTime(time);
    if (sec==0)
      clearInterval(interval);
    sec --;

}

/** Timer Switch State change handler */
function handleTimerSwitch(e){
    if(e.checked == true){
      interval = setInterval(countDown, 1000);
    } else {
      clearInterval(interval);
   }
}

/** Jump to Question n */
function scrollToQ(n){
  window.location.href=`#q-${n}`
}

/** Submit test and show result */
function submitTest(){
    submitted = true;
    var radios = document.querySelectorAll(".md-radio");
    for(var i=0; i<radios.length; i++){
        var radio = radios[i];
        radio.children[0].disabled=true;
        var isChecked = radio.children[0].checked;
        var isCorrect = radio.classList.contains("correct");
        if(isChecked && isCorrect)
            radio.children[1].classList.add("correct");
        else if(isChecked && !isCorrect)
            radio.children[1].classList.add("wrong")
    }
    var anss = document.querySelectorAll(".ans");
    for(var i=0; i<anss.length; i++){
        anss[i].classList.remove('hidden');
        anss[i].classList.add('show');
    }
    clearInterval(interval);
}
// SELECTORS
const pomodoroButton = document.querySelector("#btn-pomodoro")
const shortBreakButton = document.querySelector("#btn-short-break")
const longBreakButton = document.querySelector("#btn-long-break")
const skipButton = document.querySelector("#skip-button")
const startButton = document.querySelector(".btn-start")

const timerDisplay = document.querySelector("#timer")
const msgBox = document.querySelector("#msg-paragraph")

const bodyStatus = document.querySelector(".body-status")
const startButtonText = document.querySelector(".start-text")
const pomodoroContainer = document.querySelector("#pomodoro-container")
const pomodoroSectionButtons = document.querySelectorAll(".section-button")

// STATUS
const POMODORO_STATUS = "pomodoro-status"
const SHORT_BREAK_STATUS = "short-break-status"
const LONG_BREAK_STATUS = "long-break-status"

let STOP_STATUS = null
let TIMER_STATUS = null
let SKIPPED = false

//VARIABLES
let elementsArray = [bodyStatus, startButtonText, pomodoroContainer, startButton]
let timerInterval = null

let timer = 0
let minutes = 0
let seconds = 0
let timerDuration = 0
let timerDurationNumber = 0

let TIMER_COUNT = 0


//setting pomodoro as main theme

// 1 - Pomodoro; 2 - Short Break; 3 - Long Break
const ID_POMODORO = ("POMODORO").toLowerCase()
const ID_SHORT_BREAK = ("SHORT-BREAK").toLowerCase()
const ID_LONG_BREAK = ("LONG-BREAK").toLowerCase()

let TIMER_ID = ID_POMODORO // padrão

for(let i = 0; i < elementsArray.length; i++) {
    elementsArray[i].classList.add(POMODORO_STATUS)
}
for(let i = 0; i < pomodoroSectionButtons.length; i++) {
    pomodoroSectionButtons[i].classList.add(POMODORO_STATUS)
}

//SOUNDS
let timer_over_audio = new Audio("./src/assets/sounds/timer_over.wav")
let start_button_audio = new Audio("./src/assets/sounds/button_start.wav")

// EVENTS
pomodoroButton.addEventListener('click', activePomodoro)
shortBreakButton.addEventListener('click', activeShortBreak)
longBreakButton.addEventListener('click', activeLongBreak)

startButton.addEventListener('click', startTimer)
skipButton.addEventListener('click', function(){
    let boxconfirm = confirm("Are you sure you want to finish the round early?")
    if(boxconfirm) {
        SKIPPED = true
        timer = 0
    }
})

// FUNCTIONS
function activeStartButton() {
    if(startButton.classList.contains('active')) {
        startButton.classList.remove('active')
        skipButton.classList.remove('active')
        startButtonText.textContent = "Start"
    }else {
        startButton.classList.add('active')
        skipButton.classList.add('active')
        startButtonText.textContent = "Stop"
    }
}

function startTimer() {

    // PLAY PRESSED AUDIO BUTTON
    start_button_audio.play()
    /**if timer over keep playing */
    timer_over_audio.pause()
    timer_over_audio.currentTime = 0

    //ACTIVE START BUTTON
    activeStartButton()

    //CONTROLLER
    if(TIMER_STATUS == false || TIMER_STATUS == null) {
        timerDuration = timerDisplay.textContent
        timerDurationNumber = +(timerDuration.split(":")[0])
        timer = timerDurationNumber * 60
        minutes = 0
        seconds = 0
    }

    //CHECK IF BUTTON IS ALREADY PRESSED
    if((startButton.classList.contains('active'))) {
        timerInterval = setInterval(timeCounter, 1000) // START TIMER COUNTER
        STOP_STATUS = false
    }else {
        STOP_STATUS = true
    }

    function timeCounter() {

        //CHECK IF BUTTON IS ACTIVED+
        if(STOP_STATUS) {
            clearInterval(timerInterval)
            return
        }

        //SET MINUTES AND SECONDS
        minutes = Math.floor(timer / 60)
        seconds = Math.floor(timer % 60)

        //FORMAT MINUTES AND SECONDS
        minutes = minutes < 10 ? "0" + minutes : minutes
        seconds = seconds < 10 ? "0" + seconds : seconds

        //SET TIMER DISPLAY
        timerDisplay.textContent = `${minutes}:${seconds}`

        //CHECK IF TIMER IS DONE 
        if(--timer < 0) {
            //PLAY AUDIO
            if(SKIPPED == false) {
                timer_over_audio.volume = 0.1
                timer_over_audio.play()
            }

            timer = timerDuration
            TIMER_STATUS = false
            STOP_STATUS = true

            // CHANGE TO POMODORO STATUS
            if(TIMER_ID === ID_POMODORO) {
                ++TIMER_COUNT
                activeShortBreak()
                activeStartButton()
            }else if(TIMER_ID === ID_SHORT_BREAK) {
                activePomodoro()
                activeStartButton()
            }else {
                activePomodoro()
                TIMER_COUNT = 0
                activeStartButton()
            }

            //ACTIVE LONG BREAK AFTER 4 POMODOROS
            if(TIMER_COUNT >= 4) {
                activeLongBreak()
            }

            startButton.classList.remove('active')
            return
        }
    }

    //SAVE CURRENT TIME
    if(TIMER_STATUS == false || TIMER_STATUS == null) {
        TIMER_STATUS  = true
    }

}

function activePomodoro() {

    if(pomodoroButton.classList.contains('selected')){
        return
    }

    //DO NOT CHANGE TO ANOTHER SECTION WHILE TIMER IS RUNNING 
    if(STOP_STATUS === false) {
        let c = confirm("The timer is still running, are you sure you want to switch?")
        if(c == false) return

        STOP_STATUS = true
        activeStartButton()
    }

    //SET TIMER ID TO POMODORO
    TIMER_ID = ID_POMODORO

    //CHECK IF 'SELECTED' EXITS
    if(shortBreakButton.classList.contains('selected')) {
        shortBreakButton.classList.remove('selected')
    }
    if(longBreakButton.classList.contains('selected')) {
        longBreakButton.classList.remove('selected')
    }

    // ADD SELECTED
    pomodoroButton.classList.add('selected')

    // REMOVE PREVIOUS STYLES
    for(let index = 0; index < elementsArray.length; index++) {
        if(elementsArray[index].classList.contains(SHORT_BREAK_STATUS)) {
            elementsArray[index].classList.remove(SHORT_BREAK_STATUS)
        }

        if(elementsArray[index].classList.contains(LONG_BREAK_STATUS)) {
            elementsArray[index].classList.remove(LONG_BREAK_STATUS)
        }
    }

    for(let index = 0; index < pomodoroSectionButtons.length; index++) {
        if(pomodoroSectionButtons[index].classList.contains(SHORT_BREAK_STATUS)) {
            pomodoroSectionButtons[index].classList.remove(SHORT_BREAK_STATUS)
        }

        if(pomodoroSectionButtons[index].classList.contains(LONG_BREAK_STATUS)) {
            pomodoroSectionButtons[index].classList.remove(LONG_BREAK_STATUS)
        }
    }
    

    // ADD POMODORO STYLES
    for(let index = 0; index < elementsArray.length; index++) {
        elementsArray[index].classList.add(POMODORO_STATUS)
    }

    for(let index = 0; index < pomodoroSectionButtons.length; index++) {
        pomodoroSectionButtons[index].classList.add(POMODORO_STATUS)
    }

    //CHANGE TEXT CONTENTS
    timerDisplay.textContent = "25:00"
    msgBox.textContent = "Time to work!"
    
    //RESET TIMER
    TIMER_STATUS = false
}

function activeShortBreak() {

    if(shortBreakButton.classList.contains('selected')) {
        return 
    }

    //DO NOT CHANGE TO ANOTHER SECTION WHILE TIMER IS RUNNING 
    if(STOP_STATUS === false) {
        let c = confirm("The timer is still running, are you sure you want to switch?")
        if(c == false) return

        STOP_STATUS = true
        activeStartButton()
    }

    //SET TIMER ID TO SHORT BREAK
    TIMER_ID = ID_SHORT_BREAK

    // CHECK IF 'SELECTED' EXISTS
    if(pomodoroButton.classList.contains('selected')) {
        pomodoroButton.classList.remove('selected')
    }
    if(longBreakButton.classList.contains('selected')) {
        longBreakButton.classList.remove('selected')
    }

    // ADD SELECTED!
    shortBreakButton.classList.add('selected')

    // REMOVE PREVIOUS STYLES
    for(let index = 0; index < elementsArray.length; index++) {
        if(elementsArray[index].classList.contains(POMODORO_STATUS)) {
            elementsArray[index].classList.remove(POMODORO_STATUS)
        }

        if(elementsArray[index].classList.contains(LONG_BREAK_STATUS)) {
            elementsArray[index].classList.remove(LONG_BREAK_STATUS)
        }
    }

    for(let index = 0; index < pomodoroSectionButtons.length; index++) {
        if(pomodoroSectionButtons[index].classList.contains(POMODORO_STATUS)){
            pomodoroSectionButtons[index].classList.remove(POMODORO_STATUS)
        }

        if(pomodoroSectionButtons[index].classList.contains(LONG_BREAK_STATUS)){
            pomodoroSectionButtons[index].classList.remove(LONG_BREAK_STATUS)
        }
    }

    // ADD SHORT BREAK STYLES  
    for(let index = 0; index < elementsArray.length; index++) {
        elementsArray[index].classList.add(SHORT_BREAK_STATUS)
    }
    for(let index = 0; index < pomodoroSectionButtons.length; index++) {
        pomodoroSectionButtons[index].classList.add(SHORT_BREAK_STATUS)
    }

    //CHANGE TEXT CONTENTS
    timerDisplay.textContent = "05:00"
    msgBox.textContent = "Time for a break!"

    //RESET TIMER
    TIMER_STATUS = false


}

function activeLongBreak() {

    if(longBreakButton.classList.contains('selected')){
        return
    }

    //DO NOT CHANGE TO ANOTHER SECTION WHILE TIMER IS RUNNING 
    if(STOP_STATUS === false) {
        let c = confirm("The timer is still running, are you sure you want to switch?")
        if(c == false) return

        STOP_STATUS = true
        activeStartButton()
    }

    //SET TIMER ID TO LONG BREAK
    TIMER_ID = ID_LONG_BREAK

    //CHECK IF 'SELECTED' EXITS
    if(shortBreakButton.classList.contains('selected')) {
        shortBreakButton.classList.remove('selected')
    }
    if(pomodoroButton.classList.contains('selected')) {
        pomodoroButton.classList.remove('selected')
    }

    // ADD SELECTED
    longBreakButton.classList.add('selected')

    // REMOVE PREVIOUS STYLES
    for(let index = 0; index < elementsArray.length; index++) {
        if(elementsArray[index].classList.contains(POMODORO_STATUS)) {
            elementsArray[index].classList.remove(POMODORO_STATUS)
        }

        if(elementsArray[index].classList.contains(SHORT_BREAK_STATUS)) {
            elementsArray[index].classList.remove(SHORT_BREAK_STATUS)
        }
    }

    for(let index = 0; index < pomodoroSectionButtons.length; index++) {
        if(pomodoroSectionButtons[index].classList.contains(POMODORO_STATUS)) {
            pomodoroSectionButtons[index].classList.remove(POMODORO_STATUS)
        }

        if(pomodoroSectionButtons[index].classList.contains(SHORT_BREAK_STATUS)) {
            pomodoroSectionButtons[index].classList.remove(SHORT_BREAK_STATUS)
        }
    }

    // ADD LONG BREAK STYLES
    for(let index = 0; index < elementsArray.length; index++) {
        elementsArray[index].classList.add(LONG_BREAK_STATUS)
    }
    for(let index = 0; index < pomodoroSectionButtons.length; index++) {
        pomodoroSectionButtons[index].classList.add(LONG_BREAK_STATUS)
    }

    //CHANGE TEXT CONTENTS
    timerDisplay.textContent = "15:00"
    msgBox.textContent = "Time for a break!"

    //RESET TIMER
    TIMER_STATUS = false
}

function setTitle() {
    var date = new Date();
    document.title = date.toLocaleTimeString();
}

function setColors() {
    root = document.documentElement;
    const inputs = document.querySelectorAll("controls input");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = (window.getComputedStyle(root).getPropertyValue("--" + inputs[i].id)).trim();
    }
}

function changeClockHandsRoot(isContinuous) {
    const clock_hands = document.querySelector("hands");
    for (let i = 0; i < clock_hands.children.length; i++) {
        clock_hands.children[i].classList.remove('calculated', 'animation');
    }

    const date = new Date();
    const timestamp_ms = ((+date - date.getTimezoneOffset() * 60000)) % 86400000;
    const timestamp_s = timestamp_ms / 1000;
    const timestamp_m = timestamp_ms / 60000;
    const timestamp_h = timestamp_ms / 3600000;
    setCSSRootVariable('--clock-hands-initial-rotation-seconds', (timestamp_s * 6) % 360 + 'deg');
    setCSSRootVariable('--clock-hands-initial-rotation-minutes', (timestamp_m * 6) % 360 + 'deg');
    setCSSRootVariable('--clock-hands-initial-rotation-hours', (timestamp_h * 30) % 360 + 'deg');
    if (isContinuous) {
        for (let i = 0; i < clock_hands.children.length; i++) {
            clock_hands.children[i].classList.add('animation');
        }
    } else {
        for (let i = 0; i < clock_hands.children.length; i++) {
            clock_hands.children[i].classList.add('calculated');
        }
    }

}

function setIntervals() {
    var adjust_clock = setInterval(function () {
        var date = new Date();
        var ms = date.getMilliseconds();
        if (ms < 20) {
            setInterval(function () {
                setTitle();
                if (!document.querySelector("controls input#continuous-movement").checked) {
                    changeClockHandsRoot(false);
                }
            }, 1000);
            clearInterval(adjust_clock);
        }
    }, 1);
}

function setCSSRootVariable(variable_name, value) {
    root = document.documentElement;
    root.style.setProperty(variable_name, value);
}

function changeColor(input) {
    setCSSRootVariable("--" + input.id, input.value);
}

function closeOptionsMenu() {
    const controls = document.querySelector("controls");
    if (controls.classList.contains("shown")) {
        controls.classList.remove("shown");
    }
}

function openOptionsMenu() {
    const controls = document.querySelector("controls");
    if (!controls.classList.contains("shown")) {
        controls.classList.add("shown");
    }
}

function changeMovementType(isContinuous) {
    changeClockHandsRoot(isContinuous);
}

function setEventListeners() {
    root = document.documentElement;
    const inputs = document.querySelectorAll("controls input[type='color']");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("input", function () { changeColor(inputs[i]); }, false);
        inputs[i].addEventListener("change", function () { changeColor(inputs[i]); }, false);
    }
    const options = document.querySelector("options hamburger");
    options.addEventListener("click", function (e) { openOptionsMenu(); e.stopPropagation(); });
    const close = document.querySelector("controls close");
    close.addEventListener("click", function () { closeOptionsMenu(); });
    const body = document.querySelector("body");
    body.addEventListener("click", function () { closeOptionsMenu(); });
    const controls = document.querySelector("controls");
    controls.addEventListener("click", function (e) { e.stopPropagation(); });
    const continuous = document.querySelector("controls input#continuous-movement");
    continuous.addEventListener("click", function (e) { changeMovementType(e.target.checked); });
}

function init() {
    setIntervals();
    setEventListeners();
    setColors();
    setTitle();
    changeClockHandsRoot(document.querySelector("controls input#continuous-movement").checked);
}
function toggleTheme() {
    playClickSound();
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        if(themeBtn) themeBtn.innerText = '🌙';
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        if(themeBtn) themeBtn.innerText = '☀️';
    }
}

// --- मल्टी-व्यू साइडबार लॉजिक ---
const sidebar = document.getElementById('history-sidebar');
const menuView = document.getElementById('menu-view');
const historyView = document.getElementById('history-view');
const historyLog = document.getElementById('history-log');

function toggleSidebar() {
    playClickSound();
    sidebar.classList.toggle('active');
    if (sidebar.classList.contains('active')) {
        openMenuView();
    }
}

function openMenuView() {
    historyView.classList.remove('active-view');
    menuView.classList.add('active-view');
}

function openHistoryView() {
    playClickSound();
    menuView.classList.remove('active-view');
    historyView.classList.add('active-view');
}

function clearAllHistory() {
    playClickSound();
    historyLog.innerHTML = '<p class="empty-msg">There\'s no history yet</p>';
}

// --- डिजिटल क्लिक SOUND फ़ंक्शन ---
let audioCtx = null;
function playClickSound() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const now = audioCtx.currentTime;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(650, now);

        gainNode.gain.setValueAtTime(0.04, now);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.04);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start(now);
        oscillator.stop(now + 0.04);
    } catch (e) {
        console.log("Audio Context Error");
    }
}
// --- रिपल एनीमेशन इफेक्ट फ़ंक्शन ---
function createRipple(button, clientX = null, clientY = null) {
    if (!button) return;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    const rect = button.getBoundingClientRect();

    if (clientX !== null && clientY !== null) {
        circle.style.left = `${clientX - rect.left - radius}px`;
        circle.style.top = `${clientY - rect.top - radius}px`;
    } else {
        circle.style.left = `${rect.width / 2 - radius}px`;
        circle.style.top = `${rect.height / 2 - radius}px`;
    }

    circle.classList.add("ripple");

    const oldRipple = button.querySelector(".ripple");
    if (oldRipple) {
        oldRipple.remove();
    }

    button.appendChild(circle);
}

// माउस क्लिक होने पर रिपल चालू करना
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("button");
    buttons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            createRipple(btn, e.clientX, e.clientY);
        });
    });
});

// --- कैलकुलेटर ऑपरेशन्स ---
const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');
let iscalculated = false;
let firstValue = null;
let currentOperator = null;
let shouldResetDisplay = false;
let isPercentApplied = false;
let percentExpr = "";

function addToSidebar(expr, result) {
    const emptyMsg = historyLog.querySelector('.empty-msg');
    if (emptyMsg) {
        historyLog.innerHTML = '';
    }

    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');

    historyItem.innerHTML = `
        <div class="history-expr">${expr}</div>
        <div class="history-res">${result}</div>
    `;

    historyLog.prepend(historyItem);
}

function appendValue(input) {
    playClickSound();

    if (['+', '-', '*', '/'].includes(input)) {
        let visualOp = input === '*' ? '×' : input === '/' ? '÷' : input;

        if (currentOperator !== null && shouldResetDisplay) {
            currentOperator = input;
            historyDisplay.innerText = firstValue + " " + visualOp;
            return;
        }

        if (firstValue !== null && currentOperator !== null && !shouldResetDisplay) {
            let secondValue = parseFloat(display.value);
            // स्पीड बढ़ाने के लिए सीधा कैलकुलेशन मैथ लॉजिक लगाया
            if (currentOperator === '+') firstValue = firstValue + secondValue;
            else if (currentOperator === '-') firstValue = firstValue - secondValue;
            else if (currentOperator === '*') firstValue = firstValue * secondValue;
            else if (currentOperator === '/') firstValue = firstValue / secondValue;
            display.value = firstValue;
        } else {
            firstValue = parseFloat(display.value);
        }

        currentOperator = input;
        historyDisplay.innerText = firstValue + " " + visualOp;
        shouldResetDisplay = true;
        iscalculated = false;
        isPercentApplied = false;
        return;
    }

    if (input === '%') {
        let currentVal = parseFloat(display.value);
        let percentResult;

        if (firstValue !== null && currentOperator !== null) {
            percentResult = (firstValue * currentVal) / 100;
            let visualOp = currentOperator === '*' ? '×' : currentOperator === '/' ? '÷' : currentOperator;
            percentExpr = firstValue + " " + visualOp + " " + currentVal + "%";
            historyDisplay.innerText = percentExpr;
            isPercentApplied = true;
        } else {
            percentExpr = currentVal + "%";
            historyDisplay.innerText = percentExpr;
            percentResult = currentVal / 100;
            isPercentApplied = false;
        }

        if (!Number.isInteger(percentResult)) {
            percentResult = Math.round(percentResult * 100000000) / 100000000;
        }

        display.value = percentResult;
        iscalculated = true;
        shouldResetDisplay = false;
        return;
    }

    if (iscalculated || shouldResetDisplay) {
        display.value = input === '.' ? '0.' : input;
        iscalculated = false;
        shouldResetDisplay = false;
        return;
    }

    if (display.value === '0' && input !== '.') {
        display.value = input;
    } else {
        display.value += input;
    }
}
function clearDisplay() {
    playClickSound();
    display.value = '0';
    historyDisplay.innerText = '';
    firstValue = null;
    currentOperator = null;
    shouldResetDisplay = false;
    iscalculated = false;
    isPercentApplied = false;
    percentExpr = "";
}

function clearEntry() {
    playClickSound();
    display.value = '0';
}

function backspace() {
    playClickSound();
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
}

function toggleSign() {
    playClickSound();
    if (display.value !== '0') {
        if (display.value.startsWith('-')) {
            display.value = display.value.substring(1);
        } else {
            display.value = '-' + display.value;
        }
    }
}

function fraction() {
    playClickSound();
    let oldVal = display.value;
    display.value = (1 / parseFloat(display.value)).toString();
    historyDisplay.innerText = `1/(${oldVal})`;
    iscalculated = true;
}

function square() {
    playClickSound();
    let oldVal = display.value;
    display.value = (Math.pow(parseFloat(display.value), 2)).toString();
    historyDisplay.innerText = `sqr(${oldVal})`;
    iscalculated = true;
}

function sqrt() {
    playClickSound();
    let oldVal = display.value;
    display.value = (Math.sqrt(parseFloat(display.value))).toString();
    historyDisplay.innerText = `√(${oldVal})`;
    iscalculated = true;
}

function calculate() {
    playClickSound();
    try {
        if (firstValue !== null && currentOperator !== null) {
            let secondValue = parseFloat(display.value);
            let visualOp = currentOperator === '*' ? '×' : currentOperator === '/' ? '÷' : currentOperator;

            let fullExpr = isPercentApplied ? percentExpr + " =" : firstValue + " " + visualOp + " " + secondValue + " =";

            let finalResult;
            if (currentOperator === '+') finalResult = firstValue + secondValue;
            else if (currentOperator === '-') finalResult = firstValue - secondValue;
            else if (currentOperator === '*') finalResult = firstValue * secondValue;
            else if (currentOperator === '/') finalResult = firstValue / secondValue;

            if (!Number.isInteger(finalResult)) {
                finalResult = Math.round(finalResult * 100000000) / 100000000;
            }

            historyDisplay.innerText = fullExpr;
            display.value = finalResult;

            addToSidebar(fullExpr, finalResult);

            firstValue = null;
            currentOperator = null;
            shouldResetDisplay = false;
            iscalculated = true;
            isPercentApplied = false;
        }
    } catch (error) {
        display.value = 'Error';
        historyDisplay.innerText = '';
    }
}

function getButtonByKey(key) {
    const buttons = document.querySelectorAll(".buttons button");
    for (let btn of buttons) {
        let text = btn.innerText.trim();
        if (key >= '0' && key <= '9' && text === key) return btn;
        if (key === '.' && text === '.') return btn;
        if (key === '+' && text === '+') return btn;
        if (key === '-' && text === '-') return btn;
        if (key === '*' && text === '×') return btn;
        if (key === '/' && text === '÷') return btn;
        if (key === '%' && text === '%') return btn;
        if ((key === 'Enter' || key === '=') && text === '=') return btn;
    }
}

// --- लैपटॉप कीबोर्ड कंट्रोल (Delete बटन सपोर्ट के साथ) ---
document.addEventListener('keydown', (e) => {
    let key = e.key;
    
    // अगर Delete दबाया जाए तो 'C' बटन को मैच करें, और Escape के लिए भी 'C' रखें
    let lookupKey = key;
    if (key === 'Delete' || key === 'Escape') {
        lookupKey = 'Escape'; // getButtonByKey('Escape') पहले से 'C' बटन ढूँढता है
    }
    
    let targetBtn = getButtonByKey(lookupKey);

    if (targetBtn) {
        targetBtn.classList.add('active-key');
        createRipple(targetBtn);
        setTimeout(() => targetBtn.classList.remove('active-key'), 80);
    }

    if ((key >= '0' && key <= '9') || ['+', '-', '*', '/', '.', '%'].includes(key)) {
        e.preventDefault();
        appendValue(key);
    } 
    else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } 
    else if (key === 'Backspace') {
        backspace();
    } 
    // लैपटॉप का Delete बटन या Escape बटन दबाने पर पूरा डिस्प्ले क्लियर होगा
    else if (key === 'Delete' || key === 'Escape') {
        e.preventDefault();
        clearDisplay();
    }
});

let boxes = document.querySelectorAll('.box');
let resetBtn = document.querySelector('#reset-btn');
let newGameBtn = document.querySelector('#new-btn');
let aiBtn = document.querySelector('#ai-btn');
let msgContainer = document.querySelector('.msg-container');
let msg = document.querySelector('#msg');

let currentPlayer = "O";   // O always starts
let count = 0;
let aiEnabled = false;

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

/* ================= RESET GAME ================= */
const resetGame = () => {
    currentPlayer = "O";
    count = 0;
    msgContainer.classList.add("hide");
    msg.classList.remove("win-msg", "lose-msg");

    boxes.forEach(box => {
        box.innerText = "";
        box.disabled = false;
        box.classList.remove("x-color", "o-color", "win-box");
    });

    // Remove strike line if exists
    let existingStrike = document.getElementById("strike");
    if (existingStrike) existingStrike.remove();
};

/* ================= AI TOGGLE ================= */
aiBtn.addEventListener("click", () => {
    aiEnabled = !aiEnabled;
    aiBtn.classList.toggle("active");
    aiBtn.innerText = aiEnabled ? "Play vs Player 👥" : "Play vs AI 🤖";
    resetGame();
});

/* ================= BOX CLICK ================= */
boxes.forEach((box) => {
    box.addEventListener("click", () => {

        if (box.innerText !== "") return;

        // Prevent user clicking X in AI mode
        if (aiEnabled && currentPlayer === "X") return;

        makeMove(box);

        if (checkWinner()) return;

        // AI plays only when enabled and it's X's turn
        if (aiEnabled && currentPlayer === "X") {
            setTimeout(aiMove, 500);
        }
    });
});

/* ================= MAKE MOVE ================= */
const makeMove = (box) => {
    box.innerText = currentPlayer;
    box.classList.add(currentPlayer === "O" ? "o-color" : "x-color");
    box.disabled = true;
    count++;

    currentPlayer = currentPlayer === "O" ? "X" : "O";
};

/* ================= AI MOVE ================= */
const aiMove = () => {
    let emptyBoxes = [];

    boxes.forEach((box, i) => {
        if (box.innerText === "") emptyBoxes.push(i);
    });

    if (emptyBoxes.length === 0) return;

    let move = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    makeMove(boxes[move]);

    checkWinner();
};


/* ================= SHOW WINNER ================= */
const showWinner = (winner, pattern) => {
    msg.innerText = aiEnabled
        ? (winner === "O" ? "🎉 CONGRATULATIONS YOU WINS!" : "🤖 CONGRATULATIONS AI WINS!")
        : `🎉CONGRATULATIONS, ${winner} WINS!`;

    msg.classList.add("win-msg");
    msgContainer.classList.remove("hide");

    pattern.forEach(i => boxes[i].classList.add("win-box"));
    drawStrike(pattern);

    boxes.forEach(box => box.disabled = true);
};

/* ================= DRAW ================= */
const showDraw = () => {
    msg.innerText = "😢 IT'S A DRAW!";
    msg.classList.add("lose-msg");
    msgContainer.classList.remove("hide");
};

/* ================= CHECK WIN ================= */
const checkWinner = () => {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;

        if (
            boxes[a].innerText &&
            boxes[a].innerText === boxes[b].innerText &&
            boxes[b].innerText === boxes[c].innerText
        ) {
            showWinner(boxes[a].innerText, pattern);
            return true;
        }
    }

    if (count === 9) {
        showDraw();
        return true;
    }
    return false;
};

/* ================= BUTTON EVENTS ================= */
resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);

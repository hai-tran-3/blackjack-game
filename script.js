const suits = ["♥", "♦", "♣", "♠"];
const ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
];

const values = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    Q: 10,
    K: 10,
    A: 11,
};

let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;

function createDeck() {
    deck = [];

    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ rank, suit });
        }
    }

    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function calculateScore(hand) {
    let score = hand.reduce((sum, card) => sum + values[card.rank], 0);

    let aces = hand.filter((card) => card.rank === "A").length;

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

function renderHands(showDealer = false) {
    const playerHandDiv = document.getElementById("player-hand");
    const dealerHandDiv = document.getElementById("dealer-hand");

    playerHandDiv.innerHTML = "";
    dealerHandDiv.innerHTML = "";

    playerHand.forEach((card) => {
        playerHandDiv.appendChild(createCard(card));
    });

    dealerHand.forEach((card, index) => {
        if (!showDealer && index === 1) {
            dealerHandDiv.appendChild(createHiddenCard());
        } else {
            dealerHandDiv.appendChild(createCard(card));
        }
    });

    document.getElementById("player-score").textContent =
        `Score: ${calculateScore(playerHand)}`;

    document.getElementById("dealer-score").textContent = showDealer
        ? `Score: ${calculateScore(dealerHand)}`
        : "Score: ?";
}

function createCard(card) {
    const div = document.createElement("div");
    div.classList.add("card");
    div.textContent = `${card.rank}${card.suit}`;
    return div;
}

function createHiddenCard() {
    const div = document.createElement("div");
    div.classList.add("card");
    div.style.background = "black";
    div.style.color = "white";
    div.textContent = "?";
    return div;
}

function startGame() {
    createDeck();

    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];

    gameOver = false;

    document.getElementById("message").textContent = "";

    renderHands();
}

function hit() {
    if (gameOver) return;

    playerHand.push(deck.pop());

    renderHands();

    const score = calculateScore(playerHand);

    if (score > 21) {
        endGame("Bust! Dealer wins 😔");
    } else if (score === 21) {
        stand();
    }
}

function stand() {
    if (gameOver) return;

    while (calculateScore(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }

    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);

    let message = "";

    if (dealerScore > 21) {
        message = "Dealer busted! You win 🎉";
    } else if (playerScore > dealerScore) {
        message = "You win 🎉";
    } else if (playerScore < dealerScore) {
        message = "Dealer wins 😔";
    } else {
        message = "Push! 🤝";
    }

    endGame(message);
}

function endGame(message) {
    gameOver = true;

    renderHands(true);

    document.getElementById("message").textContent = message;
}

document.getElementById("hit-btn").addEventListener("click", hit);
document.getElementById("stand-btn").addEventListener("click", stand);
document.getElementById("restart-btn").addEventListener("click", startGame);

startGame();

var pack = [];
var hand = [];
var dealerhand = [];

var suits = {
    "diamont": "&#9830;", //diamond suit Karo
    "hearts": "&#9829;", //hearts suit Herz
    "spades": "&#9824;", //spades suit Pik
    "club": "&#9827;" //club suit Kreuz
}


var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "B", "D", "K", "A"];
var scoreValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];

var score = 0;
var dealerScore = 0;
var points = 0;
var dealerPoints = 0;

class card {

    constructor(color, value) {
        this.color = color;
        this.value = value;
        this.scoreValue = scoreValues[values.findIndex(elem => {
            return elem == this.value;
        })];
        this.id = color + "" + value;
    }
}


function createCardElement(card) {

    var div_card = document.createElement("div");
    div_card.className = "card"
    div_card.id = card.id;
    div_card.style.backgroundColor = "white";
    div_card.style.position = "absolute";
    var div_color = document.createElement("div");
    div_color.className = "color_top"
    div_color.innerHTML = suits[card.color];
    div_color.style.fontcolor = card.value === suits["diamont"] ? "red" : card.value === suits["hearts"] ? "red" : "black";
    var div_value = document.createElement("div");
    div_value.className = "value_top"
    div_value.innerHTML = card.value;
    div_card.appendChild(div_value);
    div_card.appendChild(div_color);

    return div_card;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function initpack() {
    for (let suit in suits) {
        values.forEach(value => {
            pack.push(new card(suit, value));

        });

    }
}

function shufflePack() {
    renderPoints();
    pack.length = 0;
    hand.length = 0;
    dealerhand.length = 0;
    score = 0;
    dealerScore = 0;
    initpack();
    for (let index = 0; index < pack.length; index++) {
        let a = getRandomInt(0, pack.length);
        let b = getRandomInt(0, pack.length);
        if (a != b) swap(a, b);
    }
    getCard(hand);
    getCard(hand);
    getCard(dealerhand);
    renderScore();
    renderCards();
}

function getCard(hand) {
    hand.push(pack.pop());
    renderCards();
    calcScore();
}

function calcScore() {

    score = hand.reduce((acc, card) => acc + card.scoreValue, 0);
    if (score > 21) {
        let i = hand.findIndex(card => card.scoreValue === 11);
        if (i != -1) {
            hand[i].scoreValue = 1;
            calcScore();
        } else {
            renderScore();
            alert("You lose!");
            dealerPoints++;
            shufflePack();
        }

    }

    renderScore();

    if (score == 21) {
        alert('You win!');
        points++;
        shufflePack();

    }

}


function swap(a, b) {
    let tmp = pack[a];
    pack[a] = pack[b];
    pack[b] = tmp;
}

function placeDiv(div, x_pos, y_pos) {
    //var d = document.getElementById('yourDivId');
    div.style.position = "absolute";
    div.style.left = x_pos + 'px';
    div.style.top = y_pos + 'px';
}

function divClicked(id) {
    color = document.getElementById(id).getElementsByClassName("color_top")[0].innerHTML;
    value = document.getElementById(id).getElementsByClassName("value_top")[0].innerHTML;
    alert('Clicked on ' + color + value);
}

function renderScore() {
    document.getElementById("yourScore").innerText = "You: " + score;
    document.getElementById("dealerScore").innerText = "Dealer: " + dealerScore;
}

function renderPoints() {
    document.getElementById("yourPoints").innerText = "You: " + points;
    document.getElementById("dealerPoints").innerText = "Dealer: " + dealerPoints;
}

function renderCards() {

    document.getElementById("playercards").innerHTML = "";


    // TODO clear Screnn or draw just last card
    for (let i = 0; i < hand.length; i++) {
        let div = createCardElement(hand[i]);
        placeDiv(div, 300 + (i * 30), 300);
        div.addEventListener('click', (event) => {
            divClicked(div.id);
        });
        document.getElementById("playercards").appendChild(div);
    }

    // Dealer Cards
    for (let i = 0; i < dealerhand.length; i++) {
        let div = createCardElement(dealerhand[i]);
        placeDiv(div, 300 + (i * 30), 70);
        div.addEventListener('click', (event) => {
            divClicked(div.id);
        });
        document.getElementById("playercards").appendChild(div);
    }
}

function playDealer() {
    dealerScore = dealerhand.reduce((acc, card) => acc + card.scoreValue, 0);
    while (dealerScore <= score) {
        getCard(dealerhand);
        renderCards();
        dealerScore = dealerhand.reduce((acc, card) => acc + card.scoreValue, 0);

    }
    renderCards();
    renderScore();

    if (dealerScore > 21) {
        alert('You win!');
        points++;
        shufflePack();
    }

    if (dealerScore > score) {
        alert('You lose!');
        dealerPoints++;
        shufflePack();
    }


}


window.onload = () => {

    let hitbtn = document.getElementById("hitBtn");
    hitbtn.addEventListener('click', (event) => {
        getCard(hand);
    });

    let passbtn = document.getElementById("passBtn");
    passbtn.addEventListener('click', (event) => {
        if (hand.length < 2) {
            getCard(hand);
        } else {
            playDealer();
        }
    });

    shufflePack();

}
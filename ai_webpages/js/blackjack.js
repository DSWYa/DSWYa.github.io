document.addEventListener('DOMContentLoaded', () => {
    // Card data - MOVED UP before functions that use them
    const suits = ['♥', '♦', '♠', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    // Game state
    let deck = [];
    let dealerCards = [];
    let playerCards = [];
    let dealerScore = 0;
    let playerScore = 0;
    let currentBet = 0;
    let chips = 1000;
    let gameInProgress = false;
    let cardCount = 0;
    let dealerHiddenCard = null;

    // DOM elements
    const dealerCardsEl = document.getElementById('dealer-cards');
    const playerCardsEl = document.getElementById('player-cards');
    const dealerScoreEl = document.getElementById('dealer-score');
    const playerScoreEl = document.getElementById('player-score');
    const messageEl = document.getElementById('message');
    const chipsEl = document.getElementById('chips');
    const betEl = document.getElementById('bet');
    const cardCountEl = document.getElementById('card-count');
    const bettingControlsEl = document.getElementById('betting-controls');
    const gameControlsEl = document.getElementById('game-controls');
    const deckCountEl = document.getElementById('deck-count');

    // Buttons
    const hitBtn = document.getElementById('hit');
    const standBtn = document.getElementById('stand');
    const doubleBtn = document.getElementById('double');
    const dealBtn = document.getElementById('deal');
    const clearBetBtn = document.getElementById('clear-bet');
    const newGameBtn = document.getElementById('new-game');

    // Chip values
    const chipElements = document.querySelectorAll('.chip');

    // Initialize game
    initGame();

    // Event listeners
    hitBtn.addEventListener('click', hit);
    standBtn.addEventListener('click', stand);
    doubleBtn.addEventListener('click', doubleBet);
    dealBtn.addEventListener('click', startRound);
    clearBetBtn.addEventListener('click', clearBet);
    newGameBtn.addEventListener('click', newGame);
    deckCountEl.addEventListener('change', initGame);

    chipElements.forEach(chip => {
        chip.addEventListener('click', () => {
            if (!gameInProgress) {
                const value = parseInt(chip.getAttribute('data-value'));
                if (chips >= value) {
                    currentBet += value;
                    chips -= value;
                    updateUI();
                }
            }
        });
    });

    // Functions
    function initGame() {
        dealerCards = [];
        playerCards = [];
        dealerScore = 0;
        playerScore = 0;
        currentBet = 0;
        gameInProgress = false;
        cardCount = 0;
        dealerHiddenCard = null;
        createDeck();
        updateUI();
        enableBetting();
        messageEl.textContent = "Place your bet to begin";
    }

    function createDeck() {
        deck = [];
        const numberOfDecks = parseInt(deckCountEl.value);
        
        for (let d = 0; d < numberOfDecks; d++) {
            for (const suit of suits) {
                for (const value of values) {
                    deck.push({
                        suit,
                        value,
                        numericValue: getCardValue(value)
                    });
                }
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

    function drawCard(isHidden = false) {
        if (deck.length === 0) {
            // If deck runs out, create and shuffle a new one
            createDeck();
        }
        
        const card = deck.pop();
        
        // Update card count (card counting)
        if (!isHidden) {
            updateCardCount(card.value);
        }
        
        return card;
    }

    function updateCardCount(cardValue) {
        // Hi-Lo card counting system
        if (['2', '3', '4', '5', '6'].includes(cardValue)) {
            cardCount++;
        } else if (['10', 'J', 'Q', 'K', 'A'].includes(cardValue)) {
            cardCount--;
        }
        // 7, 8, 9 are counted as 0 in Hi-Lo
        
        cardCountEl.textContent = cardCount;
    }

    function getCardValue(value) {
        if (value === 'A') return 11;
        if (['K', 'Q', 'J'].includes(value)) return 10;
        return parseInt(value);
    }

    function calculateScore(cards) {
        let score = 0;
        let aces = 0;
        
        for (const card of cards) {
            score += card.numericValue;
            if (card.value === 'A') {
                aces++;
            }
        }
        
        // Adjust for aces
        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }
        
        return score;
    }

    function renderCard(card, container, isHidden = false) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        
        if (isHidden) {
            cardElement.className += ' hidden-card';
            return cardElement;
        }
        
        if (card.suit === '♥' || card.suit === '♦') {
            cardElement.className += ' red';
        }
        
        const topLeft = document.createElement('div');
        topLeft.className = 'card-value card-tl';
        topLeft.textContent = card.value;
        
        const bottomRight = document.createElement('div');
        bottomRight.className = 'card-value card-br';
        bottomRight.textContent = card.value;
        
        const suitElement = document.createElement('div');
        suitElement.className = 'card-suit';
        suitElement.textContent = card.suit;
        
        cardElement.appendChild(topLeft);
        cardElement.appendChild(suitElement);
        cardElement.appendChild(bottomRight);
        
        return cardElement;
    }

    function startRound() {
        if (currentBet <= 0) {
            messageEl.textContent = "Please place a bet";
            return;
        }
        
        gameInProgress = true;
        disableBetting();
        gameControlsEl.style.display = 'block';
        
        // Deal initial cards
        dealerCards = [drawCard()];
        dealerHiddenCard = drawCard(true);  // Hidden card
        playerCards = [drawCard(), drawCard()];
        
        dealerScore = calculateScore(dealerCards);
        playerScore = calculateScore(playerCards);
        
        renderCards();
        
        // Check for blackjack
        if (playerScore === 21) {
            if (dealerCards[0].numericValue === 10 || dealerCards[0].value === 'A') {
                // Check for dealer blackjack
                revealDealerCard();
                dealerScore = calculateScore(dealerCards);
                
                if (dealerScore === 21) {
                    endRound("Push! Both have Blackjack.");
                    chips += currentBet;
                } else {
                    endRound("Blackjack! You win 3:2!");
                    chips += currentBet * 2.5;
                }
            } else {
                endRound("Blackjack! You win 3:2!");
                chips += currentBet * 2.5;
            }
        } else if (dealerCards[0].value === 'A') {
            // Offer insurance
            messageEl.textContent = "Dealer shows Ace. Insurance?";
            // For simplicity, we're not implementing insurance in this version
        }
        
        updateUI();
        checkDoubleOption();
    }

    function hit() {
        playerCards.push(drawCard());
        playerScore = calculateScore(playerCards);
        renderCards();
        
        if (playerScore > 21) {
            endRound("Bust! You lose.");
        } else if (playerScore === 21) {
            stand();
        }
        
        doubleBtn.disabled = true;
    }

    function stand() {
        revealDealerCard();
        dealerScore = calculateScore(dealerCards);
        renderCards();
        
        // Dealer draws until reaching 17 or higher
        setTimeout(() => {
            dealerTurn();
        }, 500);
    }

    function dealerTurn() {
        if (dealerScore < 17) {
            dealerCards.push(drawCard());
            dealerScore = calculateScore(dealerCards);
            renderCards();
            
            setTimeout(() => {
                dealerTurn();
            }, 500);
        } else {
            determineWinner();
        }
    }

    function doubleBet() {
        // Check if player can afford to double
        if (chips >= currentBet) {
            chips -= currentBet;
            currentBet *= 2;
            
            // Draw one card and stand
            playerCards.push(drawCard());
            playerScore = calculateScore(playerCards);
            renderCards();
            
            if (playerScore > 21) {
                endRound("Bust! You lose.");
            } else {
                stand();
            }
            
            updateUI();
        }
    }

    function determineWinner() {
        if (dealerScore > 21) {
            endRound("Dealer busts! You win!");
            chips += currentBet * 2;
        } else if (dealerScore > playerScore) {
            endRound("Dealer wins!");
        } else if (dealerScore < playerScore) {
            endRound("You win!");
            chips += currentBet * 2;
        } else {
            endRound("Push! It's a tie.");
            chips += currentBet;
        }
    }

    function revealDealerCard() {
        dealerCards.push(dealerHiddenCard);
        updateCardCount(dealerHiddenCard.value);
        dealerHiddenCard = null;
    }

    function renderCards() {
        dealerCardsEl.innerHTML = '';
        playerCardsEl.innerHTML = '';
        
        // Render dealer cards
        for (const card of dealerCards) {
            dealerCardsEl.appendChild(renderCard(card, dealerCardsEl));
        }
        
        if (dealerHiddenCard) {
            dealerCardsEl.appendChild(renderCard(null, dealerCardsEl, true));
        }
        
        // Render player cards
        for (const card of playerCards) {
            playerCardsEl.appendChild(renderCard(card, playerCardsEl));
        }
        
        dealerScoreEl.textContent = dealerHiddenCard ? '?' : dealerScore;
        playerScoreEl.textContent = playerScore;
    }

    function endRound(message) {
        messageEl.textContent = message;
        gameInProgress = false;
        disableGameControls();
        enableBetting();
        updateUI();
        
        // Check if player is out of chips
        if (chips <= 0) {
            messageEl.textContent = "Game over! You're out of chips.";
            disableBetting();
        }
    }

    function clearBet() {
        chips += currentBet;
        currentBet = 0;
        updateUI();
    }

    function newGame() {
        initGame();
    }

    function enableBetting() {
        bettingControlsEl.style.display = 'flex';
        gameControlsEl.style.display = 'none';
    }

    function disableBetting() {
        bettingControlsEl.style.display = 'none';
    }

    function disableGameControls() {
        gameControlsEl.style.display = 'none';
    }

    function checkDoubleOption() {
        // Can only double with first two cards and if you have enough chips
        doubleBtn.disabled = !(playerCards.length === 2 && chips >= currentBet);
    }

    function updateUI() {
        chipsEl.textContent = chips;
        betEl.textContent = currentBet;
    }
    
});

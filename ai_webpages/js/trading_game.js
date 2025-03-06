// Game state
const gameState = {
    balance: 10000,
    portfolio: {},
    tradeHistory: [],
    limitOrders: [],
    shortPositions: {},
    marginDebt: 0,
    marginCallThreshold: 0.3, // 30% equity remaining
    currentDay: 1,
    currentHour: 9,
    gameOver: false,
    selectedStock: null,
    aiTrader: {
        balance: 10000,
        portfolio: {},
        strategy: 'random', // can be 'random', 'trend-follower', 'contrarian'
        nextAction: null
    }
};

// Stock data (historical-like data)
const stocks = [
    {
        symbol: "TOON",
        name: "Toon Networks Inc.",
        initialPrice: 150.42,
        volatility: 0.03,
        trend: 0.001,
        currentPrice: 150.42,
        previousPrice: 150.42,
        history: []
    },
    {
        symbol: "GOOF",
        name: "Goofy Tech",
        initialPrice: 210.75,
        volatility: 0.04,
        trend: 0.002,
        currentPrice: 210.75,
        previousPrice: 210.75,
        history: []
    },
    {
        symbol: "DUCK",
        name: "Duck Industries",
        initialPrice: 85.33,
        volatility: 0.025,
        trend: -0.001,
        currentPrice: 85.33,
        previousPrice: 85.33,
        history: []
    },
    {
        symbol: "BUNNY",
        name: "Bunny Hops Co.",
        initialPrice: 42.18,
        volatility: 0.035,
        trend: 0.0015,
        currentPrice: 42.18,
        previousPrice: 42.18,
        history: []
    },
    {
        symbol: "CHEESE",
        name: "Cheese Manufacturing",
        initialPrice: 67.89,
        volatility: 0.02,
        trend: 0.0005,
        currentPrice: 67.89,
        previousPrice: 67.89,
        history: []
    }
];

// DOM elements
const balanceElement = document.getElementById('balance');
const portfolioElement = document.getElementById('portfolio');
const tradeHistoryElement = document.getElementById('trade-history');
const stockListElement = document.getElementById('stock-list');
const chartContainer = document.getElementById('chart-container');
const gameTimeElement = document.getElementById('game-time');
const aiThoughtElement = document.getElementById('ai-thought');
const tradeModal = document.getElementById('trade-modal');
const modalTitle = document.getElementById('modal-title');
const stockSelect = document.getElementById('stock-select');
const quantityInput = document.getElementById('quantity');
const limitPriceInput = document.getElementById('limit-price');
const useMarginSelect = document.getElementById('use-margin');
const costEstimate = document.getElementById('cost-estimate');
const confirmTradeButton = document.getElementById('confirm-trade');
const priceGroup = document.getElementById('price-group');
const marginGroup = document.getElementById('margin-group');
const gameOverScreen = document.getElementById('game-over');
const gameOverTitle = document.getElementById('game-over-title');
const gameOverMessage = document.getElementById('game-over-message');
const marginInfoElement = document.getElementById('margin-info');

// Trade action buttons
const buyButton = document.getElementById('btn-buy');
const sellButton = document.getElementById('btn-sell');
const shortButton = document.getElementById('btn-short');
const limitButton = document.getElementById('btn-limit');
const advanceButton = document.getElementById('btn-advance');
const closeModalButton = document.getElementById('close-modal');
const restartButton = document.getElementById('btn-restart');

// Initialize the game
function initGame() {
    // Initialize stock history
    stocks.forEach(stock => {
        for (let i = 0; i < 24; i++) {
            updateStockPrice(stock, true);
        }
        // Reset current price to initial for game start
        stock.currentPrice = stock.initialPrice;
        stock.previousPrice = stock.initialPrice;
    });
    
    updateUI();
    renderStockList();
    setupChart();
    
    // Generate first AI thought
    generateAIThought();
    
    // Set up event listeners
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    buyButton.addEventListener('click', () => openTradeModal('buy'));
    sellButton.addEventListener('click', () => openTradeModal('sell'));
    shortButton.addEventListener('click', () => openTradeModal('short'));
    limitButton.addEventListener('click', () => openTradeModal('limit'));
    advanceButton.addEventListener('click', advanceTime);
    closeModalButton.addEventListener('click', closeTradeModal);
    restartButton.addEventListener('click', restartGame);
    confirmTradeButton.addEventListener('click', executeTrade);
    
    // Set up quantity and price input event listeners
    quantityInput.addEventListener('input', updateCostEstimate);
    stockSelect.addEventListener('change', updateCostEstimate);
    limitPriceInput.addEventListener('input', updateCostEstimate);
}

// Restart the game
function restartGame() {
    // Reset game state
    gameState.balance = 10000;
    gameState.portfolio = {};
    gameState.tradeHistory = [];
    gameState.limitOrders = [];
    gameState.shortPositions = {};
    gameState.marginDebt = 0;
    gameState.currentDay = 1;
    gameState.currentHour = 9;
    gameState.gameOver = false;
    gameState.selectedStock = null;
    gameState.aiTrader = {
        balance: 10000,
        portfolio: {},
        strategy: 'random',
        nextAction: null
    };
    
    // Reset stock prices
    stocks.forEach(stock => {
        stock.currentPrice = stock.initialPrice;
        stock.previousPrice = stock.initialPrice;
        stock.history = [];
        
        // Re-initialize history
        for (let i = 0; i < 24; i++) {
            updateStockPrice(stock, true);
        }
        
        // Reset current price to initial for game start
        stock.currentPrice = stock.initialPrice;
        stock.previousPrice = stock.initialPrice;
    });
    
    // Hide game over screen
    gameOverScreen.style.display = 'none';
    
    // Update UI
    updateUI();
    renderStockList();
    setupChart();
    updateGameTimeDisplay();
    
    // Generate AI thought
    generateAIThought();
}

// Update stock prices
function updateStockPrice(stock, historyOnly = false) {
    // Store previous price
    if (!historyOnly) {
        stock.previousPrice = stock.currentPrice;
    }
    
    // Calculate random price movement
    const randomFactor = (Math.random() - 0.5) * 2 * stock.volatility;
    const trendFactor = stock.trend;
    const aiInfluence = calculateAIInfluence(stock);
    
    const priceChange = stock.currentPrice * (randomFactor + trendFactor + aiInfluence);
    
    // Update current price
    if (!historyOnly) {
        stock.currentPrice = Math.max(0.01, stock.currentPrice + priceChange);
    }
    
    // Add to history
    const timestamp = `Day ${gameState.currentDay} - ${gameState.currentHour}:00`;
    stock.history.push({
        price: historyOnly ? stock.currentPrice + priceChange : stock.currentPrice,
        timestamp
    });
    
    // Keep history at a reasonable size
    if (stock.history.length > 50) {
        stock.history.shift();
    }
}

// Calculate AI trader's influence on stock price
function calculateAIInfluence(stock) {
    // If AI doesn't own any of this stock, no influence
    if (!gameState.aiTrader.portfolio[stock.symbol]) {
        return 0;
    }
    
    // Calculate influence based on AI's position size (very small)
    const aiShares = gameState.aiTrader.portfolio[stock.symbol].shares;
    const marketCap = stock.currentPrice * 1000000; // Assume 1M shares outstanding
    
    // AI influence is proportional to their ownership percentage, but capped
    return (aiShares * stock.currentPrice / marketCap) * 0.01;
}

// AI Trader logic
function aiTraderTurn() {
    // Decide what the AI will do
    const strategy = gameState.aiTrader.strategy;
    const actionRoll = Math.random();
    
    // 30% chance to do nothing
    if (actionRoll < 0.3) {
        gameState.aiTrader.nextAction = null;
        return;
    }
    
    // Pick a random stock
    const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
    const ownedStock = gameState.aiTrader.portfolio[randomStock.symbol];
    const hasPosition = ownedStock && ownedStock.shares > 0;
    
    // 35% chance to buy, 35% chance to sell if has position
    if (actionRoll < 0.65) {
        // Buy logic
        if (strategy === 'trend-follower') {
            // Buy if price is rising
            if (randomStock.currentPrice > randomStock.previousPrice) {
                aiTrade('buy', randomStock);
            }
        } else if (strategy === 'contrarian') {
            // Buy if price is falling
            if (randomStock.currentPrice < randomStock.previousPrice) {
                aiTrade('buy', randomStock);
            }
        } else {
            // Random strategy
            aiTrade('buy', randomStock);
        }
    } else if (hasPosition) {
        // Sell logic
        if (strategy === 'trend-follower') {
            // Sell if price is falling
            if (randomStock.currentPrice < randomStock.previousPrice) {
                aiTrade('sell', randomStock);
            }
        } else if (strategy === 'contrarian') {
            // Sell if price is rising
            if (randomStock.currentPrice > randomStock.previousPrice) {
                aiTrade('sell', randomStock);
            }
        } else {
            // Random strategy
            aiTrade('sell', randomStock);
        }
    }
    
    // Generate a new thought for the AI
    generateAIThought();
}

// Execute AI trade
function aiTrade(action, stock) {
    // Determine quantity - this is simple for the AI
    const maxShares = Math.floor(gameState.aiTrader.balance / stock.currentPrice);
    const quantity = Math.max(1, Math.floor(maxShares * Math.random() * 0.2)); // Use up to 20% of available funds
    
    if (action === 'buy' && maxShares >= quantity) {
        // Execute buy
        const cost = quantity * stock.currentPrice;
        gameState.aiTrader.balance -= cost;
        
        // Add to portfolio
        if (!gameState.aiTrader.portfolio[stock.symbol]) {
            gameState.aiTrader.portfolio[stock.symbol] = {
                shares: 0,
                avgPrice: 0
            };
        }
        
        // Update average price
        const currentPosition = gameState.aiTrader.portfolio[stock.symbol];
        const totalShares = currentPosition.shares + quantity;
        const totalCost = (currentPosition.shares * currentPosition.avgPrice) + cost;
        
        currentPosition.shares = totalShares;
        currentPosition.avgPrice = totalCost / totalShares;
    } else if (action === 'sell') {
        // Make sure AI owns the stock
        if (gameState.aiTrader.portfolio[stock.symbol] && gameState.aiTrader.portfolio[stock.symbol].shares > 0) {
            const ownedShares = gameState.aiTrader.portfolio[stock.symbol].shares;
            const sellQuantity = Math.min(ownedShares, quantity);
            
            // Execute sell
            const proceeds = sellQuantity * stock.currentPrice;
            gameState.aiTrader.balance += proceeds;
            gameState.aiTrader.portfolio[stock.symbol].shares -= sellQuantity;
        }
    }
}

// Generate AI thought bubble
function generateAIThought() {
    const thoughts = [
        "I think tech stocks will rise today!",
        "Market looks bearish, might sell some shares.",
        "Time to buy the dip!",
        "Hmm, this volatility is concerning...",
        "I'm feeling bullish about TOON Networks!",
        "DUCK Industries might be overvalued.",
        "Just bought more GOOF Tech - to the moon!",
        "Considering shorting BUNNY, looks weak.",
        "The market sentiment seems positive today.",
        "Is this a good time to take profits?",
        "Diversification is key in this market.",
        "Cheese Manufacturing has solid fundamentals."
    ];
    
    aiThoughtElement.textContent = thoughts[Math.floor(Math.random() * thoughts.length)];
}

// Advance game time
function advanceTime() {
    // Don't advance if game is over
    if (gameState.gameOver) return;
    
    // Update time
    gameState.currentHour++;
    if (gameState.currentHour > 16) {
        gameState.currentHour = 9;
        gameState.currentDay++;
    }
    
    // Update game time display
    updateGameTimeDisplay();
    
    // Update stock prices
    stocks.forEach(stock => updateStockPrice(stock));
    
    // Check limit orders
    processLimitOrders();
    
    // AI trader takes its turn
    aiTraderTurn();
    
    // Check for margin call
    checkMarginCall();
    
    // Check win/lose conditions
    checkGameEndConditions();
    
    // Update UI
    updateUI();
    updateChart();
}

// Update the game time display
function updateGameTimeDisplay() {
    gameTimeElement.textContent = `Day ${gameState.currentDay} - ${gameState.currentHour}:00`;
}

// Process any pending limit orders
function processLimitOrders() {
    const executedOrders = [];
    
    gameState.limitOrders.forEach((order, index) => {
        const stock = stocks.find(s => s.symbol === order.symbol);
        
        if (order.type === 'buy' && stock.currentPrice <= order.price) {
            // Execute buy limit order
            executeBuyOrder(stock, order.quantity, false, order.useMargin);
            executedOrders.push(index);
        } else if (order.type === 'sell' && stock.currentPrice >= order.price) {
            // Execute sell limit order
            executeSellOrder(stock, order.quantity);
            executedOrders.push(index);
        }
    });
    
    // Remove executed orders (in reverse to avoid index issues)
    executedOrders.sort((a, b) => b - a).forEach(index => {
        gameState.limitOrders.splice(index, 1);
    });
}

// Check for margin call
function checkMarginCall() {
    if (gameState.marginDebt === 0) return;
    
    // Calculate total portfolio value
    const portfolioValue = calculatePortfolioValue();
    const equity = gameState.balance + portfolioValue;
    const marginRatio = equity / gameState.marginDebt;
    
    // Margin call if equity falls below threshold
    if (marginRatio < gameState.marginCallThreshold) {
        // Liquidate positions to cover margin
        liquidatePositions();
        
        // Add margin call to history
        gameState.tradeHistory.push({
            time: `Day ${gameState.currentDay} - ${gameState.currentHour}:00`,
            action: "MARGIN CALL",
            stock: "SYSTEM",
            shares: 0,
            price: 0
        });
    }
}

// Liquidate positions in a margin call
function liquidatePositions() {
    // Sort stocks by value (highest first)
    const positions = Object.entries(gameState.portfolio).map(([symbol, data]) => {
        const stock = stocks.find(s => s.symbol === symbol);
        return {
            symbol,
            shares: data.shares,
            value: data.shares * stock.currentPrice
        };
    }).sort((a, b) => b.value - a.value);
    
    // Liquidate positions until debt is covered or everything is gone
    for (const position of positions) {
        const stock = stocks.find(s => s.symbol === position.symbol);
        executeSellOrder(stock, position.shares, true);
        
        // If we've covered the debt, stop liquidating
        if (gameState.marginDebt === 0) break;
    }
    
    // If we still have debt, game over
    if (gameState.marginDebt > 0) {
        endGame(false, "You received a margin call and couldn't cover your debt!");
    }
}
// Calculate total portfolio value
function calculatePortfolioValue() {
    let total = 0;
    
    // Add up value of all owned stocks
    for (const symbol in gameState.portfolio) {
        const position = gameState.portfolio[symbol];
        const stock = stocks.find(s => s.symbol === symbol);
        total += position.shares * stock.currentPrice;
    }
    
    // Subtract short position values
    for (const symbol in gameState.shortPositions) {
        const position = gameState.shortPositions[symbol];
        const stock = stocks.find(s => s.symbol === symbol);
        total -= position.shares * stock.currentPrice;
    }
    
    return total;
}

// Check if game ending conditions are met
function checkGameEndConditions() {
    // Calculate net worth
    const portfolioValue = calculatePortfolioValue();
    const netWorth = gameState.balance + portfolioValue - gameState.marginDebt;
    
    // Win condition: $25,000 or more in net worth
    if (netWorth >= 25000) {
        endGame(true, `Congratulations! You've reached $${netWorth.toFixed(2)} in net worth!`);
    }
    
    // Lose condition: Less than $1000 and no positions
    if (netWorth < 1000 && Object.keys(gameState.portfolio).length === 0 && Object.keys(gameState.shortPositions).length === 0) {
        endGame(false, `Game over! Your net worth has fallen to $${netWorth.toFixed(2)}.`);
    }
}

// End the game
function endGame(isWin, message) {
    gameState.gameOver = true;
    
    // Display game over screen
    gameOverTitle.textContent = isWin ? "You Win!" : "Game Over";
    gameOverMessage.textContent = message;
    gameOverScreen.style.display = 'flex';
}

// Open trade modal
function openTradeModal(action) {
    // Don't allow trading if game is over
    if (gameState.gameOver) return;
    
    // Set up modal for the selected action
    tradeModal.style.display = 'block';
    
    // Configure modal based on action type
    switch (action) {
        case 'buy':
            modalTitle.textContent = 'Buy Stocks';
            priceGroup.style.display = 'none';
            marginGroup.style.display = 'block';
            gameState.tradeAction = 'buy';
            break;
        case 'sell':
            modalTitle.textContent = 'Sell Stocks';
            priceGroup.style.display = 'none';
            marginGroup.style.display = 'none';
            gameState.tradeAction = 'sell';
            break;
        case 'short':
            modalTitle.textContent = 'Short Stocks';
            priceGroup.style.display = 'none';
            marginGroup.style.display = 'none';
            gameState.tradeAction = 'short';
            break;
        case 'limit':
            modalTitle.textContent = 'Place Limit Order';
            priceGroup.style.display = 'block';
            marginGroup.style.display = 'block';
            gameState.tradeAction = 'limit';
            break;
    }
    
    // Populate stock select
    populateStockSelect();
    
    // Update cost estimate
    updateCostEstimate();
}

// Close trade modal
function closeTradeModal() {
    tradeModal.style.display = 'none';
}

// Populate stock select dropdown
function populateStockSelect() {
    // Clear existing options
    stockSelect.innerHTML = '';
    
    // Add each stock
    stocks.forEach(stock => {
        const option = document.createElement('option');
        option.value = stock.symbol;
        option.textContent = `${stock.symbol} - ${stock.name} ($${stock.currentPrice.toFixed(2)})`;
        stockSelect.appendChild(option);
    });
    
    // Pre-select current selected stock if any
    if (gameState.selectedStock) {
        stockSelect.value = gameState.selectedStock;
    }
}

// Update cost estimate based on current inputs
function updateCostEstimate() {
    const symbol = stockSelect.value;
    const stock = stocks.find(s => s.symbol === symbol);
    const quantity = parseInt(quantityInput.value) || 0;
    
    let cost = quantity * stock.currentPrice;
    
    // For limit orders, use the limit price
    if (gameState.tradeAction === 'limit') {
        const limitPrice = parseFloat(limitPriceInput.value) || 0;
        cost = quantity * limitPrice;
    }
    
    // Display the estimated cost
    costEstimate.textContent = `Estimated Cost: $${cost.toFixed(2)}`;
}

// Execute a trade based on the modal inputs
function executeTrade() {
    const symbol = stockSelect.value;
    const stock = stocks.find(s => s.symbol === symbol);
    const quantity = parseInt(quantityInput.value) || 0;
    
    // Validate quantity
    if (quantity <= 0) {
        alert("Please enter a valid quantity");
        return;
    }
    
    // Execute different types of trades
    switch (gameState.tradeAction) {
        case 'buy':
            const useMargin = useMarginSelect.checked;
            executeBuyOrder(stock, quantity, false, useMargin);
            break;
        case 'sell':
            executeSellOrder(stock, quantity);
            break;
        case 'short':
            executeShortOrder(stock, quantity);
            break;
        case 'limit':
            const limitPrice = parseFloat(limitPriceInput.value) || 0;
            if (limitPrice <= 0) {
                alert("Please enter a valid limit price");
                return;
            }
            executeLimitOrder(stock, quantity, limitPrice);
            break;
    }
    
    // Close the modal
    closeTradeModal();
    
    // Update UI
    updateUI();
}

// Execute a buy order
function executeBuyOrder(stock, quantity, isLimitOrder = false, useMargin = false) {
    const orderCost = quantity * stock.currentPrice;
    
    // Check if we have enough balance or if using margin
    if (gameState.balance < orderCost && !useMargin) {
        if (!isLimitOrder) alert("Insufficient funds!");
        return false;
    }

    // Process margin if using it
    if (useMargin && gameState.balance < orderCost) {
        const marginAmount = orderCost - gameState.balance;
        gameState.marginDebt += marginAmount;
        gameState.balance = 0;
    } else {
        gameState.balance -= totalCost;
    }
    
    // Add to portfolio
    if (!gameState.portfolio[stock.symbol]) {
        gameState.portfolio[stock.symbol] = {
            shares: 0,
            avgPrice: 0
        };
    }
    
    // Update average price
    const currentPosition = gameState.portfolio[stock.symbol];
    const totalShares = currentPosition.shares + quantity;
    const totalCost = (currentPosition.shares * currentPosition.avgPrice) + (quantity * stock.currentPrice);
    
    currentPosition.shares = totalShares;
    currentPosition.avgPrice = totalCost / totalShares;
    
    // Add to trade history
    gameState.tradeHistory.unshift({
        time: `Day ${gameState.currentDay} - ${gameState.currentHour}:00`,
        action: "BUY" + (useMargin ? " (MARGIN)" : ""),
        stock: stock.symbol,
        shares: quantity,
        price: stock.currentPrice
    });
    
    return true;
}

// Execute a sell order
function executeSellOrder(stock, quantity, isMarginCall = false) {
    // Check if we own the stock and have enough shares
    if (!gameState.portfolio[stock.symbol] || gameState.portfolio[stock.symbol].shares < quantity) {
        if (!isMarginCall) alert("You don't own enough shares!");
        return false;
    }
    
    // Calculate proceeds
    const proceeds = quantity * stock.currentPrice;
    
    // Update portfolio
    gameState.portfolio[stock.symbol].shares -= quantity;
    
    // Remove stock from portfolio if no shares left
    if (gameState.portfolio[stock.symbol].shares === 0) {
        delete gameState.portfolio[stock.symbol];
    }
    
    // Pay down margin debt first if any
    if (gameState.marginDebt > 0) {
        const paymentAmount = Math.min(proceeds, gameState.marginDebt);
        gameState.marginDebt -= paymentAmount;
        gameState.balance += (proceeds - paymentAmount);
    } else {
        gameState.balance += proceeds;
    }
    
    // Add to trade history
    gameState.tradeHistory.unshift({
        time: `Day ${gameState.currentDay} - ${gameState.currentHour}:00`,
        action: isMarginCall ? "FORCED SELL" : "SELL",
        stock: stock.symbol,
        shares: quantity,
        price: stock.currentPrice
    });
    
    return true;
}

// Execute a short order
function executeShortOrder(stock, quantity) {
    // Need to maintain 50% of the short value as cash collateral
    const collateralRequired = stock.currentPrice * quantity * 0.5;
    
    if (gameState.balance < collateralRequired) {
        alert("Insufficient funds for collateral!");
        return false;
    }
    
    // Add to short positions
    if (!gameState.shortPositions[stock.symbol]) {
        gameState.shortPositions[stock.symbol] = {
            shares: 0,
            avgPrice: 0
        };
    }
    
    // Update average price
    const currentPosition = gameState.shortPositions[stock.symbol];
    const totalShares = currentPosition.shares + quantity;
    const totalValue = (currentPosition.shares * currentPosition.avgPrice) + (quantity * stock.currentPrice);
    
    currentPosition.shares = totalShares;
    currentPosition.avgPrice = totalValue / totalShares;
    
    // Credit account with short proceeds
    gameState.balance += (stock.currentPrice * quantity);
    
    // Add to trade history
    gameState.tradeHistory.unshift({
        time: `Day ${gameState.currentDay} - ${gameState.currentHour}:00`,
        action: "SHORT",
        stock: stock.symbol,
        shares: quantity,
        price: stock.currentPrice
    });
    
    return true;
}

// Execute a limit order
function executeLimitOrder(stock, quantity, limitPrice) {
    // Add the limit order to the queue
    gameState.limitOrders.push({
        symbol: stock.symbol,
        type: limitPrice < stock.currentPrice ? 'buy' : 'sell',
        quantity: quantity,
        price: limitPrice,
        useMargin: useMarginSelect.checked
    });
    
    // Add to trade history
    gameState.tradeHistory.unshift({
        time: `Day ${gameState.currentDay} - ${gameState.currentHour}:00`,
        action: `LIMIT ${limitPrice < stock.currentPrice ? 'BUY' : 'SELL'}`,
        stock: stock.symbol,
        shares: quantity,
        price: limitPrice
    });
    
    return true;
}

// Update the UI elements
function updateUI() {
    // Update balance display
    balanceElement.textContent = `$${gameState.balance.toFixed(2)}`;
    
    // Update portfolio display
    renderPortfolio();
    
    // Update trade history
    renderTradeHistory();
    
    // Update margin info
    renderMarginInfo();
    
    // Update selected stock in list
    highlightSelectedStock();
}

// Render portfolio
function renderPortfolio() {
    portfolioElement.innerHTML = '';
    
    // Add long positions
    for (const symbol in gameState.portfolio) {
        const position = gameState.portfolio[symbol];
        const stock = stocks.find(s => s.symbol === symbol);
        const currentValue = position.shares * stock.currentPrice;
        const pnl = currentValue - (position.shares * position.avgPrice);
        const pnlPercent = (pnl / (position.shares * position.avgPrice)) * 100;
        
        const row = document.createElement('div');
        row.className = 'portfolio-row';
        row.innerHTML = `
            <span>${symbol}</span>
            <span>${position.shares} shares</span>
            <span>Avg: $${position.avgPrice.toFixed(2)}</span>
            <span>Current: $${stock.currentPrice.toFixed(2)}</span>
            <span class="${pnl >= 0 ? 'profit' : 'loss'}">
                $${pnl.toFixed(2)} (${pnlPercent.toFixed(2)}%)
            </span>
        `;
        
        // Add click event to select this stock
        row.addEventListener('click', () => {
            gameState.selectedStock = symbol;
            updateChart(stock);
            highlightSelectedStock();
        });
        
        portfolioElement.appendChild(row);
    }
    
    // Add short positions
    for (const symbol in gameState.shortPositions) {
        const position = gameState.shortPositions[symbol];
        const stock = stocks.find(s => s.symbol === symbol);
        const currentValue = position.shares * stock.currentPrice;
        const pnl = (position.shares * position.avgPrice) - currentValue;
        const pnlPercent = (pnl / (position.shares * position.avgPrice)) * 100;
        
        const row = document.createElement('div');
        row.className = 'portfolio-row short';
        row.innerHTML = `
            <span>${symbol} (SHORT)</span>
            <span>${position.shares} shares</span>
            <span>Avg: $${position.avgPrice.toFixed(2)}</span>
            <span>Current: $${stock.currentPrice.toFixed(2)}</span>
            <span class="${pnl >= 0 ? 'profit' : 'loss'}">
                $${pnl.toFixed(2)} (${pnlPercent.toFixed(2)}%)
            </span>
        `;
        
        // Add click event to select this stock
        row.addEventListener('click', () => {
            gameState.selectedStock = symbol;
            updateChart(stock);
            highlightSelectedStock();
        });
        
        portfolioElement.appendChild(row);
    }
    
    // Show empty message if no positions
    if (Object.keys(gameState.portfolio).length === 0 && Object.keys(gameState.shortPositions).length === 0) {
        portfolioElement.innerHTML = '<div class="empty-message">No positions</div>';
    }
}

// Render trade history
function renderTradeHistory() {
    tradeHistoryElement.innerHTML = '';
    
    // Show the most recent 10 trades
    const trades = gameState.tradeHistory.slice(0, 10);
    
    trades.forEach(trade => {
        const row = document.createElement('div');
        row.className = 'history-row';
        row.innerHTML = `
            <span>${trade.time}</span>
            <span>${trade.action}</span>
            <span>${trade.stock}</span>
            <span>${trade.shares} shares</span>
            <span>$${trade.price.toFixed(2)}</span>
        `;
        tradeHistoryElement.appendChild(row);
    });
    
    // Show empty message if no trade history
    if (trades.length === 0) {
        tradeHistoryElement.innerHTML = '<div class="empty-message">No trade history</div>';
    }
}

// Render margin info
function renderMarginInfo() {
    if (gameState.marginDebt > 0) {
        const portfolioValue = calculatePortfolioValue();
        const equity = gameState.balance + portfolioValue;
        const marginRatio = equity / gameState.marginDebt;
        
        marginInfoElement.innerHTML = `
            <div>Margin Debt: $${gameState.marginDebt.toFixed(2)}</div>
            <div>Account Equity: $${equity.toFixed(2)}</div>
            <div>Margin Ratio: ${marginRatio.toFixed(2)}x</div>
            <div class="${marginRatio < gameState.marginCallThreshold * 2 ? 'warning' : ''}">
                Margin Call Threshold: ${gameState.marginCallThreshold}x
            </div>
        `;
        marginInfoElement.style.display = 'block';
    } else {
        marginInfoElement.style.display = 'none';
    }
}

// Render the stock list
function renderStockList() {
    stockListElement.innerHTML = '';
    
    stocks.forEach(stock => {
        const priceChange = stock.currentPrice - stock.previousPrice;
        const percentChange = (priceChange / stock.previousPrice) * 100;
        
        const row = document.createElement('div');
        row.className = 'stock-row';
        row.dataset.symbol = stock.symbol;
        row.innerHTML = `
            <span>${stock.symbol}</span>
            <span>${stock.name}</span>
            <span>$${stock.currentPrice.toFixed(2)}</span>
            <span class="${priceChange >= 0 ? 'profit' : 'loss'}">
                ${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} (${percentChange.toFixed(2)}%)
            </span>
        `;
        
        // Add click event to select this stock
        row.addEventListener('click', () => {
            gameState.selectedStock = stock.symbol;
            updateChart(stock);
            highlightSelectedStock();
        });
        
        stockListElement.appendChild(row);
    });
}

// Highlight the selected stock in the list
function highlightSelectedStock() {
    // Remove highlight from all rows
    const allRows = document.querySelectorAll('.stock-row');
    allRows.forEach(row => row.classList.remove('selected'));
    
    // Add highlight to selected stock
    if (gameState.selectedStock) {
        const selectedRow = document.querySelector(`.stock-row[data-symbol="${gameState.selectedStock}"]`);
        if (selectedRow) selectedRow.classList.add('selected');
    }
}

// Set up the chart
function setupChart() {
    // Use the first stock by default
    const defaultStock = stocks[0];
    gameState.selectedStock = defaultStock.symbol;
    
    // Create chart (using a placeholder - you would implement with your charting library)
    chartContainer.innerHTML = '<div class="chart-placeholder">Stock chart would render here</div>';
    
    // In a real implementation, you would create a chart with your preferred library
    // For example with Chart.js:
    // const ctx = document.createElement('canvas');
    // chartContainer.appendChild(ctx);
    // new Chart(ctx, {...});
    
    // For this example, we'll simulate a chart update
    updateChart(defaultStock);
}

// Update the chart with new data
function updateChart(stockToShow = null) {
    // If no stock specified, use the currently selected one
    if (!stockToShow && gameState.selectedStock) {
        stockToShow = stocks.find(s => s.symbol === gameState.selectedStock);
    }
    
    if (!stockToShow) return;
    
    // In a real implementation, you would update your chart with the new data
    // For this example, we'll update our placeholder
    chartContainer.innerHTML = `
        <div class="chart-placeholder">
            <h3>${stockToShow.name} (${stockToShow.symbol})</h3>
            <p>Current Price: $${stockToShow.currentPrice.toFixed(2)}</p>
            <p>Data points: ${stockToShow.history.length}</p>
            <div class="chart-line"></div>
        </div>
    `;
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);
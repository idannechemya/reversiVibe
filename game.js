class ReversiGame {
    constructor() {
        this.board = [];
        this.currentPlayer = 1; // 1 for black (human), 2 for white (computer)
        this.gameOver = false;
        this.passCount = 0;
        this.boardSize = 8;
        this.isComputerGame = true; // Enable computer opponent
        
        this.initializeBoard();
        this.setupEventListeners();
        this.updateDisplay();
        this.showValidMoves();
    }

    initializeBoard() {
        // Create empty 8x8 board
        for (let i = 0; i <this.boardSize; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i][j] = 0;
            }
        }

        // Place initial pieces
        const center = this.boardSize / 2;
        this.board[center - 1][center - 1] = 2; // White
        this.board[center - 1][center] = 1;     // Black
        this.board[center][center - 1] = 1;     // Black
        this.board[center][center] = 2;          // White
    }

    setupEventListeners() {
        const gameBoard = document.getElementById('gameBoard');
        const newGameBtn = document.getElementById('newGameBtn');
        const passBtn = document.getElementById('passBtn');

        // Board click events
        gameBoard.addEventListener('click', async (e) => {
            if (e.target.classList.contains('cell')) {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                
                // Only allow human moves when it's human's turn
                if (!this.isComputerGame || this.currentPlayer === 1) {
                    await this.makeMove(row, col);
                }
            }
        });

        // Button events
        newGameBtn.addEventListener('click', () => this.newGame());
        passBtn.addEventListener('click', () => this.passTurn());
    }

    createBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell w-12 h-12 border border-gray-600 flex items-center justify-center cursor-pointer transition-all duration-200';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                // Add hover effects
                cell.addEventListener('mouseenter', () => {
                    if (!this.gameOver && this.board[i][j] === 0) {
                        cell.classList.add('bg-green-400', 'bg-opacity-50');
                    }
                });
                
                cell.addEventListener('mouseleave', () => {
                    cell.classList.remove('bg-green-400', 'bg-opacity-50');
                });

                gameBoard.appendChild(cell);
            }
        }
    }

    updateDisplay() {
        this.createBoard();
        const cells = document.querySelectorAll('.cell');
        
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const value = this.board[row][col];
            
            cell.innerHTML = '';
            cell.className = 'cell w-12 h-12 border border-gray-600 flex items-center justify-center cursor-pointer transition-all duration-200';
            
            if (value === 1) {
                cell.innerHTML = '<div class="w-8 h-8 bg-black rounded-full shadow-lg"></div>';
            } else if (value === 2) {
                cell.innerHTML = '<div class="w-8 h-8 bg-white rounded-full shadow-lg"></div>';
            }
        });

        // Update current player indicator
        const currentPlayerIndicator = document.getElementById('currentPlayer');
        const playerLabel = document.getElementById('playerLabel');
        currentPlayerIndicator.className = `w-8 h-8 rounded-full border-2 border-white ${this.currentPlayer === 1 ? 'bg-black' : 'bg-white'}`;
        
        if (this.isComputerGame) {
            playerLabel.textContent = this.currentPlayer === 1 ? 'Your Turn (Black)' : 'Computer (White)';
        } else {
            playerLabel.textContent = this.currentPlayer === 1 ? 'Black' : 'White';
        }

        // Update scores
        const scores = this.calculateScores();
        document.getElementById('blackScore').textContent = scores.black;
        document.getElementById('whiteScore').textContent = scores.white;
    }

    showValidMoves() {
        const validMoves = this.getValidMoves();
        const cells = document.querySelectorAll('.cell');
        
        // Clear previous highlights
        cells.forEach(cell => {
            cell.classList.remove('bg-yellow-400', 'bg-opacity-70', 'animate-pulse');
        });
        
        // Only show valid moves if it's human player's turn or if not computer game
        if (!this.isComputerGame || this.currentPlayer === 1) {
            cells.forEach(cell => {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                
                if (validMoves.some(move => move.row === row && move.col === col)) {
                    cell.classList.add('bg-yellow-400', 'bg-opacity-70', 'animate-pulse');
                }
            });
        }

        // Update valid moves text
        const validMovesText = document.getElementById('validMoves');
        if (this.isComputerGame && this.currentPlayer === 2) {
            validMovesText.textContent = 'Computer is thinking...';
        } else if (validMoves.length === 0) {
            validMovesText.textContent = 'No valid moves available';
        } else {
            validMovesText.textContent = `${validMoves.length} valid move(s) available`;
        }

        // Show/hide pass button based on valid moves (ternary operator)
        const passBtn = document.getElementById('passBtn');
        passBtn.style.display = validMoves.length === 0 ? 'block' : 'none';
    }

    getValidMoves() {
        const validMoves = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === 0) {
                    for (const [dx, dy] of directions) {
                        if (this.wouldCapture(i, j, dx, dy)) {
                            validMoves.push({ row: i, col: j });
                            break;
                        }
                    }
                }
            }
        }

        return validMoves;
    }

    wouldCapture(row, col, dx, dy) {
        const opponent = this.currentPlayer === 1 ? 2 : 1;
        let x = row + dx;
        let y = col + dy;
        let hasOpponentBetween = false;

        // Check if there's an opponent piece adjacent
        if (x < 0 || x >= this.boardSize || y < 0 || y >= this.boardSize || this.board[x][y] !== opponent) {
            return false;
        }

        hasOpponentBetween = true;

        // Continue in the direction
        while (true) {
            x += dx;
            y += dy;
            
            if (x < 0 || x >= this.boardSize || y < 0 || y >= this.boardSize) {
                return false;
            }
            
            if (this.board[x][y] === 0) {
                return false;
            }
            
            if (this.board[x][y] === this.currentPlayer) {
                return hasOpponentBetween;
            }
        }
    }

    async makeMove(row, col) {
        if (this.gameOver || this.board[row][col] !== 0) {
            return false;
        }

        const validMoves = this.getValidMoves();
        const isValidMove = validMoves.some(move => move.row === row && move.col === col);
        
        if (!isValidMove) {
            return false;
        }

        // Place the piece
        this.board[row][col] = this.currentPlayer;

        // Capture opponent pieces with animation
        await this.capturePiecesWithAnimation(row, col);

        // Switch players
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.passCount = 0;

        // Update display
        this.updateDisplay();
        this.showValidMoves();

        // Check for game over
        this.checkGameOver();

        // If it's computer's turn, make computer move
        if (this.isComputerGame && this.currentPlayer === 2 && !this.gameOver) {
            setTimeout(() => {
                this.makeComputerMove();
            }, 500); // Small delay for better UX
        }

        return true;
    }

    capturePieces(row, col) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        for (const [dx, dy] of directions) {
            this.captureInDirection(row, col, dx, dy);
        }
    }

    captureInDirection(row, col, dx, dy) {
        const opponent = this.currentPlayer === 1 ? 2 : 1;
        let x = row + dx;
        let y = col + dy;
        const piecesToCapture = [];

        // Find pieces to capture
        while (x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && this.board[x][y] === opponent) {
            piecesToCapture.push({ row: x, col: y });
            x += dx;
            y += dy;
        }

        // If we found our own piece at the end, capture all pieces in between
        if (x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && this.board[x][y] === this.currentPlayer) {
            for (const piece of piecesToCapture) {
                this.board[piece.row][piece.col] = this.currentPlayer;
            }
        }
    }

    async capturePiecesWithAnimation(row, col) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        const allPiecesToFlip = [];

        // Collect all pieces to flip
        for (const [dx, dy] of directions) {
            const piecesInDirection = this.captureInDirectionWithAnimation(row, col, dx, dy);
            allPiecesToFlip.push(...piecesInDirection);
        }

        // Animate the flipping
        if (allPiecesToFlip.length > 0) {
            await this.animatePieceFlips(allPiecesToFlip);
        }
    }

    captureInDirectionWithAnimation(row, col, dx, dy) {
        const opponent = this.currentPlayer === 1 ? 2 : 1;
        let x = row + dx;
        let y = col + dy;
        const piecesToCapture = [];

        // Find pieces to capture
        while (x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && this.board[x][y] === opponent) {
            piecesToCapture.push({ row: x, col: y });
            x += dx;
            y += dy;
        }

        // If we found our own piece at the end, capture all pieces in between
        if (x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && this.board[x][y] === this.currentPlayer) {
            return piecesToCapture;
        }

        return [];
    }

    async animatePieceFlips(piecesToFlip) {
        const flipDelay = 150; // 150ms between each flip
        
        for (let i = 0; i < piecesToFlip.length; i++) {
            const piece = piecesToFlip[i];
            
            // Flip the piece in the board
            this.board[piece.row][piece.col] = this.currentPlayer;
            
            // Update the visual representation
            const cell = document.querySelector(`[data-row="${piece.row}"][data-col="${piece.col}"]`);
            if (cell) {
                // Add flip animation
                cell.style.transform = 'scale(0.8) rotateY(90deg)';
                cell.style.transition = 'transform 0.15s ease-in-out';
                
                // Wait for the flip animation
                await new Promise(resolve => setTimeout(resolve, 75));
                
                // Update the piece color
                cell.innerHTML = `<div class="w-8 h-8 ${this.currentPlayer === 1 ? 'bg-black' : 'bg-white'} rounded-full shadow-lg"></div>`;
                
                // Complete the flip
                cell.style.transform = 'scale(1) rotateY(0deg)';
                
                // Wait for the completion animation
                await new Promise(resolve => setTimeout(resolve, 75));
                
                // Reset transition
                cell.style.transition = '';
                cell.style.transform = '';
            }
            
            // Wait before next flip
            if (i < piecesToFlip.length - 1) {
                await new Promise(resolve => setTimeout(resolve, flipDelay));
            }
        }
    }

    passTurn() {
        if (this.gameOver) return;

        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.passCount++;

        this.updateDisplay();
        this.showValidMoves();
        this.checkGameOver();

        this.showMessage(`${this.currentPlayer === 1 ? 'Black' : 'White'} passed their turn`);
    }

    checkGameOver() {
        const validMoves = this.getValidMoves();
        
        if (validMoves.length === 0) {
            this.passCount++;
            if (this.passCount >= 2) {
                this.endGame();
            } else {
                this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
                this.updateDisplay();
                this.showValidMoves();
                this.showMessage(`${this.currentPlayer === 1 ? 'Black' : 'White'} has no valid moves and must pass`);
            }
        }
    }

    endGame() {
        this.gameOver = true;
        const scores = this.calculateScores();
        let message = '';

        if (scores.black > scores.white) {
            message = `Game Over! Black wins with ${scores.black} pieces!`;
        } else if (scores.white > scores.black) {
            message = `Game Over! White wins with ${scores.white} pieces!`;
        } else {
            message = `Game Over! It's a tie with ${scores.black} pieces each!`;
        }

        this.showMessage(message, 'bg-green-600');
    }

    calculateScores() {
        let black = 0;
        let white = 0;

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === 1) black++;
                else if (this.board[i][j] === 2) white++;
            }
        }

        return { black, white };
    }

    showMessage(message, bgClass = 'bg-blue-600') {
        const messageElement = document.getElementById('gameMessage');
        messageElement.textContent = message;
        messageElement.className = `mt-4 p-3 rounded-lg text-center font-semibold ${bgClass} text-white`;
        messageElement.classList.remove('hidden');

        // Hide message after 3 seconds
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 3000);
    }

    async makeComputerMove() {
        const validMoves = this.getValidMoves();
        if (validMoves.length === 0) {
            this.passTurn();
            return;
        }

        // Computer AI strategy
        const move = this.getComputerMove(validMoves);
        
        if (move) {
            await this.makeMove(move.row, move.col);
        }
    }

    getComputerMove(validMoves) {
        // Priority 1: Corners (0,0), (0,7), (7,0), (7,7)
        const corners = [
            {row: 0, col: 0}, {row: 0, col: 7}, 
            {row: 7, col: 0}, {row: 7, col: 7}
        ];
        
        for (const corner of corners) {
            if (validMoves.some(move => move.row === corner.row && move.col === corner.col)) {
                return corner;
            }
        }

        // Priority 2: Edge positions (0,2), (2,0), (2,2), (0,5), (2,7), (5,0), (5,2), (7,2), (5,7), (7,5), (2,5), (5,5)
        const edgePositions = [
            {row: 0, col: 2}, {row: 2, col: 0}, {row: 2, col: 2},
            {row: 0, col: 5}, {row: 2, col: 7}, {row: 5, col: 0},
            {row: 5, col: 2}, {row: 7, col: 2}, {row: 5, col: 7},
            {row: 7, col: 5}, {row: 2, col: 5}, {row: 5, col: 5}
        ];
        
        for (const edge of edgePositions) {
            if (validMoves.some(move => move.row === edge.row && move.col === edge.col)) {
                return edge;
            }
        }

        // Priority 3: Avoid positions next to corners
        const avoidPositions = [
            {row: 0, col: 1}, {row: 1, col: 0}, {row: 1, col: 1}, // Near (0,0)
            {row: 0, col: 6}, {row: 1, col: 6}, {row: 1, col: 7}, // Near (0,7)
            {row: 6, col: 0}, {row: 6, col: 1}, {row: 7, col: 1}, // Near (7,0)
            {row: 6, col: 6}, {row: 6, col: 7}, {row: 7, col: 6}  // Near (7,7)
        ];

        // Filter out positions next to corners
        const safeMoves = validMoves.filter(move => 
            !avoidPositions.some(avoid => 
                avoid.row === move.row && avoid.col === move.col
            )
        );

        // If we have safe moves, choose the first one
        if (safeMoves.length > 0) {
            return safeMoves[0];
        }

        // If no safe moves, just take the first valid move
        return validMoves[0];
    }

    newGame() {
        this.board = [];
        this.currentPlayer = 1;
        this.gameOver = false;
        this.passCount = 0;
        
        this.initializeBoard();
        this.updateDisplay();
        this.showValidMoves();
        
        // Hide any existing messages
        document.getElementById('gameMessage').classList.add('hidden');
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ReversiGame();
});

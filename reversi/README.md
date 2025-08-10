# ReversiVibe - Classic Othello Game

A modern, responsive Reversi (Othello) game built with JavaScript and Tailwind CSS.

## Features

- **Classic Reversi Gameplay**: Full implementation of the traditional Othello rules
- **Modern UI**: Beautiful, responsive design using Tailwind CSS
- **Visual Feedback**: Highlighted valid moves and hover effects
- **Score Tracking**: Real-time score display for both players
- **Game Controls**: New game and pass turn functionality
- **Responsive Design**: Works on desktop and mobile devices

## How to Play

1. **Objective**: Capture your opponent's pieces by surrounding them with your own pieces. The player with the most pieces at the end wins.

2. **Rules**:
   - Black always goes first
   - You can only place pieces where you can capture opponent pieces
   - Pieces are captured by surrounding them on opposite sides
   - If you can't make a move, you must pass
   - The game ends when neither player can make a move

3. **Game Interface**:
   - **Board**: 8x8 grid where you place your pieces
   - **Valid Moves**: Highlighted in yellow with a pulsing animation
   - **Current Player**: Shown as a colored circle indicator
   - **Scores**: Real-time count of pieces for each player
   - **Controls**: New Game and Pass Turn buttons

## How to Run

1. Simply open `index.html` in your web browser
2. No additional setup or dependencies required
3. The game uses CDN for Tailwind CSS, so an internet connection is needed

## Game Controls

- **Click on highlighted squares**: Make a move
- **New Game button**: Start a fresh game
- **Pass Turn button**: Skip your turn when no valid moves are available

## Technical Details

- **Frontend**: Pure HTML, CSS (Tailwind), and JavaScript
- **No Dependencies**: Self-contained game
- **Responsive**: Works on all screen sizes
- **Modern JavaScript**: Uses ES6+ features and classes

## Browser Compatibility

Works on all modern browsers that support:
- ES6 JavaScript features
- CSS Grid and Flexbox
- CSS animations

## Game Logic

The game implements the complete Reversi rule set:
- Valid move detection in all 8 directions
- Piece capturing mechanics
- Turn management
- Game end detection
- Score calculation

Enjoy playing ReversiVibe! 
// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get canvas and context
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Get restart button
    const restartButton = document.getElementById('restartButton');

    // Player properties
    const player = {
        x: canvas.width / 2 - 25, // Center the player
        y: canvas.height - 50,    // Position from bottom
        width: 50,
        height: 30,
        speed: 5,
        color: '#0095DD'
    };

    // Game state
    let objects = [];
    let isGameOver = false;
    let score = 0;
    let animationId;

    // Event listeners for keyboard
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && player.x > 0) {
            player.x -= player.speed;
        }
        if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) {
            player.x += player.speed;
        }
    });

    // Create falling object
    function createObject() {
        const object = {
            x: Math.random() * (canvas.width - 20),
            y: 0,
            width: 20,
            height: 20,
            speed: 2 + Math.random() * 2,
            color: '#FF0000'
        };
        objects.push(object);
    }

    // Update game objects
    function updateObjects() {
        for (let i = objects.length - 1; i >= 0; i--) {
            const obj = objects[i];
            obj.y += obj.speed;

            // Check collision
            if (obj.y + obj.height > player.y &&
                obj.x < player.x + player.width &&
                obj.x + obj.width > player.x &&
                obj.y < player.y + player.height) {
                isGameOver = true;
                restartButton.style.display = 'block';
                return;
            }

            // Remove objects that are off screen
            if (obj.y > canvas.height) {
                objects.splice(i, 1);
                score++;
            }
        }
    }

    // Draw game
    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw player
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Draw objects
        objects.forEach(obj => {
            ctx.fillStyle = obj.color;
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        });

        // Draw score
        ctx.fillStyle = '#000000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + score, 10, 30);

        // Draw game over
        if (isGameOver) {
            ctx.fillStyle = '#000000';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
        }
    }

    // Game loop
    function gameLoop() {
        if (!isGameOver) {
            updateObjects();
            
            // Create new objects
            if (objects.length < 5 && Math.random() < 0.02) {
                createObject();
            }
            
            draw();
            animationId = requestAnimationFrame(gameLoop);
        }
    }

    // Restart game
    function restartGame() {
        isGameOver = false;
        score = 0;
        objects = [];
        player.x = canvas.width / 2 - 25; // Center the player
        restartButton.style.display = 'none';
        
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        // Start with 3 objects
        for (let i = 0; i < 3; i++) {
            createObject();
        }
        
        gameLoop();
    }

    // Add restart button listener
    restartButton.addEventListener('click', restartGame);

    // Start game
    for (let i = 0; i < 3; i++) {
        createObject();
    }
    gameLoop();
});

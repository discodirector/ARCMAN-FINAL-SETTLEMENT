// Input Handler Module - Mouse, touch, and keyboard event handlers
const InputHandler = {
    isDragging: false,
    
    // Helper to get canvas coordinates from event
    getCanvasCoords: function(e) {
        if (!CanvasManager.canvas) return { x: 0, y: 0 };
        
        const rect = CanvasManager.canvas.getBoundingClientRect();
        
        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        // Convert to viewport coordinates (canvas fills viewport)
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    },
    
    // Setup all event listeners
    setupEventListeners: function() {
        if (!CanvasManager.canvas) {
            console.error('Canvas not found for event listeners');
            return;
        }
        
        // Mouse events
        CanvasManager.canvas.addEventListener('mousedown', (e) => {
            if (GameState.gameState !== 'aiming' || GameState.gameMode === null || GameState.gameState === 'menu') return;
            const coords = this.getCanvasCoords(e);
            GameState.aimStart = coords;
            this.isDragging = true;
        });
        
        CanvasManager.canvas.addEventListener('mousemove', (e) => {
            if (!this.isDragging || GameState.gameState !== 'aiming') return;
            const coords = this.getCanvasCoords(e);
            GameState.aimEnd = coords;
        });
        
        CanvasManager.canvas.addEventListener('mouseup', (e) => {
            if (!this.isDragging || GameState.gameState !== 'aiming') return;
            this.isDragging = false;
            if (GameState.aimStart && GameState.aimEnd) {
                if (typeof GameFlow !== 'undefined' && GameFlow.launchCoin) {
                    GameFlow.launchCoin();
                }
            }
        });
        
        // Touch events
        CanvasManager.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (GameState.gameState !== 'aiming' || GameState.gameMode === null || GameState.gameState === 'menu') return;
            const coords = this.getCanvasCoords(e);
            GameState.aimStart = coords;
            this.isDragging = true;
        });
        
        CanvasManager.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.isDragging || GameState.gameState !== 'aiming') return;
            const coords = this.getCanvasCoords(e);
            GameState.aimEnd = coords;
        });
        
        CanvasManager.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!this.isDragging || GameState.gameState !== 'aiming') return;
            this.isDragging = false;
            if (GameState.aimStart && GameState.aimEnd) {
                if (typeof GameFlow !== 'undefined' && GameFlow.launchCoin) {
                    GameFlow.launchCoin();
                }
            }
        });
        
        // Prevent context menu on long press (mobile)
        CanvasManager.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
};




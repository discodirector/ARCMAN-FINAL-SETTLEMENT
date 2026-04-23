// Renderer Module - All drawing functions
const Renderer = {
    // Draw starfield
    drawStars: function() {
        const ctx = CanvasManager.ctx;
        ctx.fillStyle = GameConfig.COLORS.white;
        GameState.stars.forEach(star => {
            const alpha = star.brightness * 0.8;
            ctx.globalAlpha = alpha;
            ctx.fillRect(star.x, star.y, star.size, star.size);
            ctx.shadowBlur = 5;
            ctx.shadowColor = GameConfig.COLORS.white;
            ctx.fillRect(star.x, star.y, star.size, star.size);
            ctx.shadowBlur = 0;
        });
        ctx.globalAlpha = 1;
    },
    
    // Draw player character
    drawPlayer: function() {
        const ctx = CanvasManager.ctx;
        const { x, y, width, height } = GameState.player;
        
        if (!width || !height || width <= 0 || height <= 0) {
            return; // Don't draw if invalid dimensions
        }
        
        // Check if player animation frames are loaded
        const animationFrames = GameState.playerAnimationFrames;
        if (animationFrames && (
            (animationFrames.idle && animationFrames.idle.length > 0) ||
            (animationFrames.throwing && animationFrames.throwing.length > 0)
        )) {
            // Use animated sprite
            this.drawPlayerAnimation(ctx, x, y, width, height);
            return;
        }
        
        // Fallback to drawn character
        // Idle floating animation
        GameState.player.floatOffset = Math.sin(Date.now() / 1000) * (height * 0.05);
        const drawY = y + GameState.player.floatOffset;
        
        // Use player dimensions for proportional drawing
        const headHeight = height * 0.28;
        const torsoHeight = height * 0.42;
        const legHeight = height * 0.3;
        const armWidth = width * 0.15;
        const armHeight = height * 0.28;
        
        // Glow effect
        const glowSize = Math.max(10, width * 0.5);
        ctx.shadowBlur = glowSize * 0.5;
        ctx.shadowColor = GameConfig.COLORS.cyan;
        
        // Narrower body - use player dimensions proportionally
        ctx.fillStyle = GameConfig.COLORS.cyan;
        const torsoWidth = width * 0.45; // Narrower torso
        const torsoX = x + width/2 - torsoWidth/2;
        const headSize = width * 0.25; // Define here for gap calculation
        const gapSize = height * 0.02; // Gap between head and body
        const torsoY = drawY + headHeight + headSize + gapSize; // Gap between head and body
        ctx.fillRect(torsoX, torsoY, torsoWidth, torsoHeight); // torso
        
        // Magenta chest accent
        const chestWidth = torsoWidth * 0.5;
        const chestHeight = torsoHeight * 0.35;
        const chestX = x + width/2 - chestWidth/2;
        const chestY = torsoY + torsoHeight * 0.2;
        ctx.fillStyle = GameConfig.COLORS.magenta;
        ctx.shadowBlur = glowSize * 0.4;
        ctx.shadowColor = GameConfig.COLORS.silver;
        ctx.fillRect(chestX, chestY, chestWidth, chestHeight);
        ctx.shadowBlur = glowSize * 0.5; // Reset shadow for other elements
        
        // Legs (narrower)
        const legWidth = width * 0.18;
        ctx.fillRect(x + width/2 - legWidth * 1.15, torsoY + torsoHeight, legWidth, legHeight); // left leg
        ctx.fillRect(x + width/2 + legWidth * 0.15, torsoY + torsoHeight, legWidth, legHeight); // right leg
        
        // Head - simple silver arc
        const arcWidth = width * 0.5;
        const arcHeight = headHeight * 0.6;
        const centerX = x + width/2;
        const arcY = drawY + headHeight * 0.4; // Raised higher above head
        
        ctx.save();
        
        // Draw silver arc
        ctx.strokeStyle = GameConfig.COLORS.silver;
        ctx.lineWidth = Math.max(3, width * 0.08);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Create gradient for the arc (brighter at top-left)
        const gradient = ctx.createLinearGradient(centerX - arcWidth/2, arcY, centerX + arcWidth/2, arcY + arcHeight);
        gradient.addColorStop(0, GameConfig.COLORS.silverLight);
        gradient.addColorStop(0.5, GameConfig.COLORS.silver);
        gradient.addColorStop(1, GameConfig.COLORS.silverDark);
        
        ctx.strokeStyle = gradient;
        
        ctx.beginPath();
        // Draw arc from left to right (curved downward)
        ctx.arc(centerX, arcY + arcHeight, arcWidth/2, Math.PI, 0, false);
        ctx.stroke();
        
        ctx.restore();
        
        // Small square head under the arc (lifted up with gap from body)
        const headX = centerX - headSize/2;
        const headY = drawY + headHeight - headSize * 0.1; // Lifted up to create gap from body
        ctx.fillStyle = GameConfig.COLORS.cyan;
        ctx.fillRect(headX, headY, headSize, headSize);
        
        // Inner rectangle at the bottom center of the head (vertically elongated)
        const innerRectWidth = headSize * 0.7;
        const innerRectHeight = headSize * 0.85; // Slightly elongated vertically
        const innerRectX = centerX - innerRectWidth/2;
        const innerRectY = headY + headSize - innerRectHeight * 0.85; // Positioned at bottom, slightly inset
        ctx.fillStyle = GameConfig.COLORS.peach;
        ctx.fillRect(innerRectX, innerRectY, innerRectWidth, innerRectHeight);
        
        // Two small black square eyes positioned slightly above center
        const eyeSize = headSize * 0.12;
        const eyeSpacing = innerRectWidth * 0.25; // Distance between eyes
        const eyeY = innerRectY + innerRectHeight * 0.45; // Slightly above center (45% from top)
        const leftEyeX = centerX - eyeSpacing - eyeSize/2;
        const rightEyeX = centerX + eyeSpacing - eyeSize/2;
        ctx.fillStyle = GameConfig.COLORS.black;
        ctx.fillRect(leftEyeX, eyeY, eyeSize, eyeSize);
        ctx.fillRect(rightEyeX, eyeY, eyeSize, eyeSize);
        
        // Arms (narrower)
        ctx.fillStyle = GameConfig.COLORS.cyan;
        ctx.shadowBlur = glowSize * 0.3;
        const armAngle = GameState.aimStart && GameState.aimEnd ? 
            Math.atan2(GameState.aimEnd.y - (torsoY + torsoHeight * 0.3), GameState.aimEnd.x - (x + width/2)) : 0;
        const armLength = width * 0.7;
        const armX = x + width/2 + Math.cos(armAngle) * armLength;
        const armY = torsoY + torsoHeight * 0.3 + Math.sin(armAngle) * armLength;
        ctx.fillRect(x + width/2 - armWidth/2, torsoY + torsoHeight * 0.1, armWidth, armHeight); // left arm
        ctx.fillRect(armX - armWidth/2, armY - armHeight/2, armWidth, armHeight); // right arm (throwing arm)
        
        // Subtle glowing accents (reduced)
        ctx.fillStyle = GameConfig.COLORS.cyan;
        ctx.shadowBlur = glowSize * 0.2;
        ctx.shadowColor = GameConfig.COLORS.cyan;
        const accentSize = Math.max(2, width * 0.1);
        ctx.fillRect(x + width/2 - accentSize/2, torsoY + torsoHeight * 0.35, accentSize, accentSize);
        ctx.shadowBlur = 0;
    },
    
    // Draw arc preview
    drawArcPreview: function() {
        const ctx = CanvasManager.ctx;
        if (!GameState.aimStart || !GameState.aimEnd) return;
        
        const dx = GameState.aimEnd.x - GameState.aimStart.x;
        const dy = GameState.aimEnd.y - GameState.aimStart.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const power = Math.min(distance / (GameConfig.CONFIG.width * 0.06), 3);
        
        const speedScale = GameConfig.CONFIG.width / GameConfig.BASE_CONFIG.width;
        const vx = (dx / distance) * GameConfig.CONFIG.coinSpeed * power * speedScale;
        const vy = (dy / distance) * GameConfig.CONFIG.coinSpeed * power * speedScale;
        
        ctx.strokeStyle = GameConfig.COLORS.cyan;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = GameConfig.COLORS.cyan;
        ctx.globalAlpha = 0.6;
        
        ctx.beginPath();
        // Arc preview starts from right side of player (where hand/arm is positioned)
        let px = GameState.player.x + GameState.player.width * 0.75;
        let py = GameState.player.y + GameState.player.height * 0.3;
        ctx.moveTo(px, py);
        
        let x = px, y = py;
        let velX = vx, velY = vy;
        const scaledGravity = GameConfig.CONFIG.gravity * (GameConfig.CONFIG.width / GameConfig.BASE_CONFIG.width);
        
        for (let i = 0; i < 100; i++) {
            velY += scaledGravity;
            x += velX;
            y += velY;
            ctx.lineTo(x, y);
            if (x < 0 || x > GameConfig.CONFIG.width || y > GameConfig.CONFIG.height) break;
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    },
    
    // Draw USDC coin
    drawCoin: function() {
        const ctx = CanvasManager.ctx;
        if (!GameState.coin) return;
        
        const { x, y, radius } = GameState.coin;
        
        // Enhanced trail with glow effect (draw first so it appears behind the coin)
        if (GameState.coinTrail.length > 1) {
            // Create gradient for trail
            const gradient = ctx.createLinearGradient(
                GameState.coinTrail[0].x, GameState.coinTrail[0].y,
                GameState.coinTrail[GameState.coinTrail.length - 1].x,
                GameState.coinTrail[GameState.coinTrail.length - 1].y
            );
            gradient.addColorStop(0, 'rgba(39, 117, 202, 0.8)'); // USDC blue, more opaque at start
            gradient.addColorStop(0.5, 'rgba(39, 117, 202, 0.4)'); // Fade in middle
            gradient.addColorStop(1, 'rgba(39, 117, 202, 0.1)'); // Very transparent at end
            
            // Draw outer glow layer (softer, wider)
            ctx.strokeStyle = GameConfig.COLORS.usdcBlue;
            ctx.lineWidth = 8;
            ctx.globalAlpha = 0.2;
            ctx.shadowBlur = 20;
            ctx.shadowColor = GameConfig.COLORS.usdcBlue;
            ctx.beginPath();
            ctx.moveTo(GameState.coinTrail[0].x, GameState.coinTrail[0].y);
            for (let i = 1; i < GameState.coinTrail.length; i++) {
                ctx.lineTo(GameState.coinTrail[i].x, GameState.coinTrail[i].y);
            }
            ctx.stroke();
            
            // Draw middle glow layer
            ctx.strokeStyle = GameConfig.COLORS.usdcBlue;
            ctx.lineWidth = 5;
            ctx.globalAlpha = 0.3;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.moveTo(GameState.coinTrail[0].x, GameState.coinTrail[0].y);
            for (let i = 1; i < GameState.coinTrail.length; i++) {
                ctx.lineTo(GameState.coinTrail[i].x, GameState.coinTrail[i].y);
            }
            ctx.stroke();
            
            // Draw main trail (brightest, thinnest)
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.6;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(GameState.coinTrail[0].x, GameState.coinTrail[0].y);
            for (let i = 1; i < GameState.coinTrail.length; i++) {
                ctx.lineTo(GameState.coinTrail[i].x, GameState.coinTrail[i].y);
            }
            ctx.stroke();
            
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }
        
        // Glow effect for coin
        ctx.shadowBlur = 20;
        ctx.shadowColor = GameConfig.COLORS.usdcBlue;
        
        // Draw coin - use sprite image if available, otherwise draw USDC logo
        if (GameState.coinSpriteImage && GameState.coinSpriteImage.complete) {
            // Draw sprite image
            const size = radius * 2;
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.drawImage(
                GameState.coinSpriteImage,
                x - radius,
                y - radius,
                size,
                size
            );
            ctx.restore();
        } else {
            // Fallback: Draw USDC logo
            // USDC logo - Blue circle background
            ctx.fillStyle = GameConfig.COLORS.usdcBlue;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Calculate sizes relative to coin radius
            const curveHeight = radius * 0.5; // Vertical span of curves
            const curveOffset = radius * 0.25; // Horizontal offset for curves
            const curveBulge = radius * 0.2; // How much the curve bulges
            
            // Draw curved lines (parentheses-like) on left and right
            ctx.strokeStyle = GameConfig.COLORS.white;
            ctx.lineWidth = Math.max(2, radius * 0.12);
            ctx.lineCap = 'round';
            
            // Left curved line (opening parenthesis "(")
            ctx.beginPath();
            ctx.moveTo(x - curveOffset, y - curveHeight / 2);
            ctx.quadraticCurveTo(x - curveOffset - curveBulge, y, x - curveOffset, y + curveHeight / 2);
            ctx.stroke();
            
            // Right curved line (closing parenthesis ")")
            ctx.beginPath();
            ctx.moveTo(x + curveOffset, y - curveHeight / 2);
            ctx.quadraticCurveTo(x + curveOffset + curveBulge, y, x + curveOffset, y + curveHeight / 2);
            ctx.stroke();
            
            // $ symbol (white, centered)
            ctx.fillStyle = GameConfig.COLORS.white;
            const fontSize = Math.max(12, radius * 1.2);
            ctx.font = `bold ${fontSize}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', x, y);
        }
        
        ctx.shadowBlur = 0;
    },
    
    // Draw player animation (PNG sequence)
    drawPlayerAnimation: function(ctx, x, y, width, height) {
        const animationFrames = GameState.playerAnimationFrames;
        if (!animationFrames) return;
        
        // Determine which animation to use based on game state
        // Use throwing animation when player is actively dragging to aim (aimStart exists)
        // Use idle animation otherwise (including when not aiming, coin flying, etc.)
        let animationType = 'idle';
        let frames = animationFrames.idle || [];
        let config = GameConfig.PLAYER_ANIMATION?.idle;
        
        // Only use throwing animation when player is actively dragging to aim (aimStart is set)
        const isActivelyAiming = GameState.gameState === 'aiming' && GameState.aimStart !== null;
        if (isActivelyAiming && animationFrames.throwing && animationFrames.throwing.length > 0) {
            animationType = 'throwing';
            frames = animationFrames.throwing;
            config = GameConfig.PLAYER_ANIMATION?.throwing;
        } else if (animationFrames.idle && animationFrames.idle.length > 0) {
            animationType = 'idle';
            frames = animationFrames.idle;
            config = GameConfig.PLAYER_ANIMATION?.idle;
        }
        
        // Update animation type if it changed (reset frame to start of new animation)
        if (GameState.playerAnimationType !== animationType) {
            GameState.playerAnimationFrame = 0;
            GameState.playerAnimationType = animationType;
            GameState.playerAnimationLastUpdate = Date.now();
        }
        
        if (!frames || frames.length === 0) return;
        
        // Idle floating animation (optional, can be removed if animation includes it)
        GameState.player.floatOffset = Math.sin(Date.now() / 1000) * (height * 0.05);
        const drawY = y + GameState.player.floatOffset;
        
        // Update animation frame (time-based for consistent playback)
        const frameRate = config?.frameRate || 10;
        const timeScale = GameConfig.CONFIG.timeScale || 1.0;
        const frameInterval = 1000 / (frameRate * timeScale); // milliseconds per frame
        
        // Use time-based animation
        const now = Date.now();
        if (!GameState.playerAnimationLastUpdate) {
            GameState.playerAnimationLastUpdate = now;
        }
        
        const elapsed = now - GameState.playerAnimationLastUpdate;
        if (elapsed >= frameInterval) {
            GameState.playerAnimationFrame = (GameState.playerAnimationFrame + Math.floor(elapsed / frameInterval)) % frames.length;
            GameState.playerAnimationLastUpdate = now;
        }
        
        // Get current frame
        const currentFrame = frames[GameState.playerAnimationFrame];
        if (!currentFrame) return;
        
        // Draw the frame
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0; // Animation frames can have their own glow/shadow
        
        // Draw image at player position
        ctx.drawImage(
            currentFrame,
            x,
            drawY,
            width,
            height
        );
        
        ctx.restore();
    },
    
    // Draw arc gate
    drawArcGate: function(gate) {
        const ctx = CanvasManager.ctx;
        if (!gate.active) return;
        
        const { x, y, width, height } = gate;
        const rotation = ((gate.rotation || 0) * Math.PI / 180);
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        // Arch gate dimensions
        const pillarWidth = Math.max(6, width * 0.15); // Pillar thickness
        const archRadius = width / 2 - pillarWidth / 2; // Radius of the arch
        const archHeight = Math.min(archRadius, height * 0.4); // Height of the arch
        const pillarTopY = -height / 2 + archHeight; // Where pillars end and arch begins
        const pillarBottomY = height / 2; // Bottom of pillars
        
        // Enhanced blur and transparency - multiple blurred glow layers with wider glow
        // Outermost glow layer (widest, softest, very blurred)
        ctx.shadowBlur = 100;
        ctx.shadowColor = GameConfig.COLORS.magenta;
        
        // Draw blurry glow outline for arch structure (widest layer)
        ctx.strokeStyle = GameConfig.COLORS.magenta;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.1;
        
        // Left pillar glow
        ctx.beginPath();
        ctx.moveTo(-width / 2, pillarTopY);
        ctx.lineTo(-width / 2, pillarBottomY);
        ctx.stroke();
        
        // Right pillar glow
        ctx.beginPath();
        ctx.moveTo(width / 2, pillarTopY);
        ctx.lineTo(width / 2, pillarBottomY);
        ctx.stroke();
        
        // Arch glow
        ctx.beginPath();
        ctx.arc(0, pillarTopY, archRadius, Math.PI, 0, false);
        ctx.stroke();
        
        // Wide glow layer (large blur)
        ctx.shadowBlur = 85;
        ctx.globalAlpha = 0.12;
        ctx.beginPath();
        ctx.moveTo(-width / 2, pillarTopY);
        ctx.lineTo(-width / 2, pillarBottomY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width / 2, pillarTopY);
        ctx.lineTo(width / 2, pillarBottomY);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, pillarTopY, archRadius, Math.PI, 0, false);
        ctx.stroke();
        
        // Additional wide blur layer
        ctx.shadowBlur = 70;
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.moveTo(-width / 2, pillarTopY);
        ctx.lineTo(-width / 2, pillarBottomY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width / 2, pillarTopY);
        ctx.lineTo(width / 2, pillarBottomY);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, pillarTopY, archRadius, Math.PI, 0, false);
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        // Enhanced foggy/misty effect - outer fog layer (extends much further beyond gate for wider glow)
        const outerFogGradient = ctx.createRadialGradient(0, pillarTopY, archRadius * 0.5, 0, pillarTopY, archRadius * 2.2);
        outerFogGradient.addColorStop(0, 'rgba(255, 0, 255, 0.12)');
        outerFogGradient.addColorStop(0.3, 'rgba(255, 0, 255, 0.08)');
        outerFogGradient.addColorStop(0.6, 'rgba(255, 0, 255, 0.04)');
        outerFogGradient.addColorStop(1, 'rgba(255, 0, 255, 0.01)');
        
        ctx.fillStyle = outerFogGradient;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(0, pillarTopY, archRadius * 2.2, Math.PI, 0, false);
        ctx.lineTo(width / 2 - pillarWidth / 2 + archRadius * 0.5, pillarTopY);
        ctx.lineTo(width / 2 - pillarWidth / 2 + archRadius * 0.5, pillarBottomY);
        ctx.lineTo(-width / 2 + pillarWidth / 2 - archRadius * 0.5, pillarBottomY);
        ctx.lineTo(-width / 2 + pillarWidth / 2 - archRadius * 0.5, pillarTopY);
        ctx.closePath();
        ctx.fill();
        
        // Additional wide outer glow layer
        const wideGlowGradient = ctx.createRadialGradient(0, pillarTopY, archRadius * 0.8, 0, pillarTopY, archRadius * 1.8);
        wideGlowGradient.addColorStop(0, 'rgba(255, 0, 255, 0.08)');
        wideGlowGradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.05)');
        wideGlowGradient.addColorStop(1, 'rgba(255, 0, 255, 0.02)');
        
        ctx.fillStyle = wideGlowGradient;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(0, pillarTopY, archRadius * 1.8, Math.PI, 0, false);
        ctx.lineTo(width / 2 - pillarWidth / 2 + archRadius * 0.3, pillarTopY);
        ctx.lineTo(width / 2 - pillarWidth / 2 + archRadius * 0.3, pillarBottomY);
        ctx.lineTo(-width / 2 + pillarWidth / 2 - archRadius * 0.3, pillarBottomY);
        ctx.lineTo(-width / 2 + pillarWidth / 2 - archRadius * 0.3, pillarTopY);
        ctx.closePath();
        ctx.fill();
        
        // Main foggy/misty effect inside the gate area (more transparent)
        const fogGradient = ctx.createRadialGradient(0, pillarTopY, archRadius * 0.3, 0, pillarTopY, archRadius * 1.2);
        fogGradient.addColorStop(0, 'rgba(255, 0, 255, 0.22)');
        fogGradient.addColorStop(0.4, 'rgba(255, 0, 255, 0.15)');
        fogGradient.addColorStop(0.7, 'rgba(255, 0, 255, 0.09)');
        fogGradient.addColorStop(1, 'rgba(255, 0, 255, 0.04)');
        
        ctx.fillStyle = fogGradient;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        // Arch fill area
        ctx.arc(0, pillarTopY, archRadius - 3, Math.PI, 0, false);
        // Fill the area below the arch
        ctx.lineTo(width / 2 - pillarWidth / 2 - 3, pillarTopY);
        ctx.lineTo(width / 2 - pillarWidth / 2 - 3, pillarBottomY - 3);
        ctx.lineTo(-width / 2 + pillarWidth / 2 + 3, pillarBottomY - 3);
        ctx.lineTo(-width / 2 + pillarWidth / 2 + 3, pillarTopY);
        ctx.closePath();
        ctx.fill();
        
        // Additional foggy layer for more depth (more transparent)
        ctx.fillStyle = GameConfig.COLORS.magenta;
        ctx.globalAlpha = 0.12;
        ctx.beginPath();
        ctx.arc(0, pillarTopY, archRadius * 0.6, Math.PI, 0, false);
        ctx.lineTo(0, pillarTopY);
        ctx.closePath();
        ctx.fill();
        
        // Dense inner fog layer (more transparent)
        const innerFogGradient = ctx.createRadialGradient(0, pillarTopY, 0, 0, pillarTopY, archRadius * 0.8);
        innerFogGradient.addColorStop(0, 'rgba(255, 0, 255, 0.18)');
        innerFogGradient.addColorStop(0.6, 'rgba(255, 0, 255, 0.12)');
        innerFogGradient.addColorStop(1, 'rgba(255, 0, 255, 0.06)');
        
        ctx.fillStyle = innerFogGradient;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(0, pillarTopY, archRadius * 0.8, Math.PI, 0, false);
        ctx.lineTo(0, pillarTopY);
        ctx.closePath();
        ctx.fill();
        
        // Inner portal effect with wider blur (arch shape, more transparent)
        ctx.fillStyle = GameConfig.COLORS.magenta;
        ctx.globalAlpha = 0.25;
        ctx.shadowBlur = 50;
        ctx.beginPath();
        ctx.arc(0, pillarTopY, archRadius - 3, Math.PI, 0, false);
        ctx.lineTo(width / 2 - pillarWidth / 2 - 3, pillarTopY);
        ctx.lineTo(width / 2 - pillarWidth / 2 - 3, pillarBottomY - 3);
        ctx.lineTo(-width / 2 + pillarWidth / 2 + 3, pillarBottomY - 3);
        ctx.lineTo(-width / 2 + pillarWidth / 2 + 3, pillarTopY);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Main gate structure with enhanced wider blur and transparency
        ctx.shadowBlur = 80;
        ctx.shadowColor = GameConfig.COLORS.magenta;
        
        // Draw left pillar (more transparent, softer)
        ctx.strokeStyle = GameConfig.COLORS.magenta;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(-width / 2, pillarTopY);
        ctx.lineTo(-width / 2, pillarBottomY);
        ctx.stroke();
        
        // Draw right pillar
        ctx.beginPath();
        ctx.moveTo(width / 2, pillarTopY);
        ctx.lineTo(width / 2, pillarBottomY);
        ctx.stroke();
        
        // Draw arch (semicircle on top)
        ctx.beginPath();
        ctx.arc(0, pillarTopY, archRadius, Math.PI, 0, false); // Arc from left to right
        ctx.stroke();
        
        // Additional wider blur pass for extra diffusion
        ctx.shadowBlur = 65;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.moveTo(-width / 2, pillarTopY);
        ctx.lineTo(-width / 2, pillarBottomY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width / 2, pillarTopY);
        ctx.lineTo(width / 2, pillarBottomY);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, pillarTopY, archRadius, Math.PI, 0, false);
        ctx.stroke();
        
        // Extra wide glow pass
        ctx.shadowBlur = 50;
        ctx.globalAlpha = 0.18;
        ctx.beginPath();
        ctx.moveTo(-width / 2, pillarTopY);
        ctx.lineTo(-width / 2, pillarBottomY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width / 2, pillarTopY);
        ctx.lineTo(width / 2, pillarBottomY);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, pillarTopY, archRadius, Math.PI, 0, false);
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        // Energy lines (animated particles flowing through the arch) with wider enhanced blur
        ctx.shadowBlur = 35;
        ctx.shadowColor = GameConfig.COLORS.cyan;
        ctx.strokeStyle = GameConfig.COLORS.cyan;
        ctx.lineWidth = 1;
        const time = Date.now() / 100;
        for (let i = 0; i < 5; i++) {
            const progress = (time + i * 15) % 100 / 100; // 0 to 1
            const angle = Math.PI - (progress * Math.PI); // From left (π) to right (0)
            const particleX = Math.cos(angle) * (archRadius - 5);
            const particleY = pillarTopY + Math.sin(angle) * (archRadius - 5);
            
            ctx.beginPath();
            ctx.arc(particleX, particleY, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = GameConfig.COLORS.cyan;
            ctx.globalAlpha = 0.6;
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        
        ctx.restore();
        ctx.shadowBlur = 0;
    },
    
    // Draw slippage cloud
    drawSlippageCloud: function(cloud) {
        const ctx = CanvasManager.ctx;
        const { x, y, radius } = cloud;
        
        ctx.save();
        
        // Create a layered glow effect with multiple passes for softness
        // Outer glow layer (very soft, barely visible)
        const outerGradient = ctx.createRadialGradient(x, y, radius * 0.3, x, y, radius * 1.3);
        outerGradient.addColorStop(0, 'rgba(255, 0, 255, 0.08)');
        outerGradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.04)');
        outerGradient.addColorStop(1, 'rgba(255, 0, 255, 0)');
        
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Middle glow layer (soft transition)
        const middleGradient = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 1.1);
        middleGradient.addColorStop(0, 'rgba(255, 0, 255, 0.15)');
        middleGradient.addColorStop(0.4, 'rgba(255, 0, 255, 0.08)');
        middleGradient.addColorStop(1, 'rgba(255, 0, 255, 0)');
        
        ctx.fillStyle = middleGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.1, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner glow layer (main body, more transparent)
        const innerGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        innerGradient.addColorStop(0, 'rgba(255, 0, 255, 0.25)');
        innerGradient.addColorStop(0.3, 'rgba(255, 0, 255, 0.18)');
        innerGradient.addColorStop(0.7, 'rgba(255, 0, 255, 0.08)');
        innerGradient.addColorStop(1, 'rgba(255, 0, 255, 0)');
        
        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Soft distortion effect (subtle, very transparent)
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        const distortionSize = Math.max(2, GameConfig.CONFIG.width * 0.004);
        for (let i = 0; i < 5; i++) {
            const angle = (Date.now() / 200 + i * Math.PI * 2 / 5) % (Math.PI * 2);
            const r = radius * 0.7;
            ctx.beginPath();
            ctx.arc(x + Math.cos(angle) * r, y + Math.sin(angle) * r, distortionSize, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    },
    
    // Draw life restoration object
    drawLifeRestore: function(lifeRestore) {
        const ctx = CanvasManager.ctx;
        const { x, y, radius, collected } = lifeRestore;
        
        // Don't draw if already collected
        if (collected) return;
        
        // Animated pulse effect
        const pulseSize = 1 + Math.sin(Date.now() / 300) * 0.15;
        const currentRadius = radius * pulseSize;
        
        // Portal dimensions (horizontal oval shape - wider than tall)
        const portalWidth = currentRadius * 1.6;
        const portalHeight = currentRadius * 1.2;
        
        ctx.save();
        ctx.translate(x, y);
        
        // Glow effect
        ctx.shadowBlur = 30;
        ctx.shadowColor = GameConfig.COLORS.magenta;
        
        // Draw oval portal using ellipse (if available) or manual path
        // Outer portal ring (glowing outline)
        ctx.strokeStyle = GameConfig.COLORS.magenta;
        ctx.lineWidth = 4;
        ctx.beginPath();
        // Draw oval using scale transformation
        ctx.save();
        ctx.scale(1, portalHeight / portalWidth);
        ctx.arc(0, 0, portalWidth, 0, Math.PI * 2);
        ctx.restore();
        ctx.stroke();
        
        // Inner portal ring (brighter glow)
        ctx.strokeStyle = '#ff0fff'; // Lighter purple/pink
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.save();
        ctx.scale(1, portalHeight / portalWidth);
        ctx.arc(0, 0, portalWidth * 0.85, 0, Math.PI * 2);
        ctx.restore();
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        // Portal interior (darker purple with transparency)
        ctx.fillStyle = 'rgba(128, 0, 128, 0.4)';
        ctx.beginPath();
        ctx.save();
        ctx.scale(1, portalHeight / portalWidth);
        ctx.arc(0, 0, portalWidth * 0.75, 0, Math.PI * 2);
        ctx.restore();
        ctx.fill();
        
        // Energy swirl effects inside portal (animated)
        ctx.strokeStyle = '#ff0fff';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.6;
        const time = Date.now() / 200;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.save();
            ctx.scale(1, portalHeight / portalWidth);
            const swirlRadius = portalWidth * 0.5 * (1 - i * 0.3);
            const startAngle = time + i * Math.PI / 3;
            const endAngle = startAngle + Math.PI * 1.5;
            ctx.arc(0, 0, swirlRadius, startAngle, endAngle);
            ctx.restore();
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        
        // Scattered purple particles orbiting around portal
        ctx.fillStyle = GameConfig.COLORS.magenta;
        ctx.globalAlpha = 0.7;
        const particleCount = 12;
        const scaleFactor = portalHeight / portalWidth;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Date.now() / 400 + i * Math.PI * 2 / particleCount) % (Math.PI * 2);
            const baseDistance = portalWidth * 0.6;
            const distanceVariation = Math.sin(Date.now() / 200 + i) * portalWidth * 0.2;
            const distance = baseDistance + distanceVariation;
            const px = Math.cos(angle) * distance;
            const py = Math.sin(angle) * distance * scaleFactor; // Apply oval scale factor
            const particleSize = 2 + Math.sin(Date.now() / 150 + i) * 1;
            
            ctx.beginPath();
            ctx.arc(px, py, particleSize, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        
        // Small white particles inside portal (like stars)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.globalAlpha = 0.8;
        const starCount = 8;
        for (let i = 0; i < starCount; i++) {
            const starAngle = (i * Math.PI * 2 / starCount + Date.now() / 500) % (Math.PI * 2);
            const starDistance = portalWidth * 0.3 * (0.5 + Math.random() * 0.5);
            const starX = Math.cos(starAngle) * starDistance;
            const starY = Math.sin(starAngle) * starDistance * scaleFactor;
            
            ctx.fillRect(starX - 1, starY - 1, 2, 2);
        }
        ctx.globalAlpha = 1;
        
        ctx.restore();
        ctx.shadowBlur = 0;
    },
    
    // Draw barrier
    drawBarrier: function(barrier) {
        const ctx = CanvasManager.ctx;
        const { x, y, width, height, size, pulse, hitFlash, energyOffset } = barrier;
        const rotation = ((barrier.rotation || 0) * Math.PI / 180);
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        
        // Size-based properties
        const sizeMultiplier = size === 'large' ? 1.0 : size === 'medium' ? 0.75 : 0.5;
        const glowIntensity = size === 'large' ? 40 : size === 'medium' ? 30 : 20;
        
        // Pulsing glow effect
        const basePulse = Math.sin(Date.now() / 800) * 0.1 + 1.0;
        const hitPulse = hitFlash > 0 ? 1.0 + (hitFlash / 10) : 1.0;
        const pulseSize = basePulse * hitPulse;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        // Outer glow
        ctx.shadowBlur = glowIntensity * pulseSize;
        ctx.shadowColor = GameConfig.COLORS.yellow;
        
        // Main barrier body (semi-transparent)
        // Gradient direction depends on rotation
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const gradient = ctx.createLinearGradient(
            -width / 2 * cos - height / 2 * sin,
            -width / 2 * sin + height / 2 * cos,
            width / 2 * cos + height / 2 * cos,
            width / 2 * sin + height / 2 * cos
        );
        gradient.addColorStop(0, `rgba(255, 255, 0, ${0.3 * sizeMultiplier})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 0, ${0.5 * sizeMultiplier})`);
        gradient.addColorStop(1, `rgba(255, 255, 0, ${0.3 * sizeMultiplier})`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-width / 2, -height / 2, width, height);
        
        // Energy flow animation (along barrier length)
        ctx.strokeStyle = GameConfig.COLORS.yellow;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        const energySpeed = 0.5;
        const energyPos = ((Date.now() / 100 + energyOffset) * energySpeed) % (height + 20) - 10;
        
        // Draw energy lines (perpendicular to barrier)
        for (let i = 0; i < 3; i++) {
            const offset = (energyPos + i * (height / 3)) % (height + 20);
            if (offset >= -height / 2 - 5 && offset <= height / 2 + 5) {
                ctx.beginPath();
                ctx.moveTo(-width / 2, offset);
                ctx.lineTo(width / 2, offset);
                ctx.stroke();
            }
        }
        
        // Hit flash effect
        if (hitFlash > 0) {
            ctx.globalAlpha = hitFlash / 10;
            ctx.fillStyle = GameConfig.COLORS.white;
            ctx.fillRect(-width / 2 - 5, -height / 2 - 5, width + 10, height + 10);
            ctx.globalAlpha = 0.6;
        }
        
        // Ripple effect on hit
        if (hitFlash > 0) {
            ctx.strokeStyle = GameConfig.COLORS.yellow;
            ctx.lineWidth = 3;
            ctx.globalAlpha = (10 - hitFlash) / 10;
            for (let i = 0; i < 3; i++) {
                const rippleSize = (10 - hitFlash) * 2 + i * 5;
                ctx.strokeRect(-width / 2 - rippleSize, -height / 2 - rippleSize, width + rippleSize * 2, height + rippleSize * 2);
            }
        }
        
        // Particle sparks (moving along surface)
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = GameConfig.COLORS.yellow;
        for (let i = 0; i < 5; i++) {
            const sparkPos = ((Date.now() / 50 + i * 20) % width) - width / 2;
            const sparkPerp = Math.sin(Date.now() / 200 + i) * (height * 0.3);
            ctx.beginPath();
            ctx.arc(sparkPos, sparkPerp, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Edge glow
        ctx.globalAlpha = 1;
        ctx.strokeStyle = GameConfig.COLORS.yellow;
        ctx.lineWidth = 2;
        ctx.strokeRect(-width / 2, -height / 2, width, height);
        
        ctx.restore();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    },
    
    // Draw settlement zone
    drawSettlementZone: function() {
        const ctx = CanvasManager.ctx;
        if (!GameState.settlementZone) return;
        
        const { x, y, width, height, pulse } = GameState.settlementZone;
        
        const pulseSize = 1 + Math.sin(Date.now() / 500) * 0.1;
        const w = width * pulseSize;
        const h = height * pulseSize;
        const offsetX = (width - w) / 2;
        const offsetY = (height - h) / 2;
        
        // Glow effect
        ctx.shadowBlur = 40;
        ctx.shadowColor = GameConfig.COLORS.cyan;
        
        // Outer frame
        ctx.strokeStyle = GameConfig.COLORS.cyan;
        ctx.lineWidth = 6;
        ctx.strokeRect(x + offsetX, y + offsetY, w, h);
        
        // Inner glow
        ctx.fillStyle = GameConfig.COLORS.cyan;
        ctx.globalAlpha = 0.2;
        ctx.fillRect(x + offsetX + 10, y + offsetY + 10, w - 20, h - 20);
        ctx.globalAlpha = 1;
        
        // Corner markers
        ctx.fillStyle = GameConfig.COLORS.yellow;
        const cornerSize = Math.max(6, GameConfig.CONFIG.width * 0.01);
        ctx.fillRect(x + offsetX, y + offsetY, cornerSize, cornerSize);
        ctx.fillRect(x + offsetX + w - cornerSize, y + offsetY, cornerSize, cornerSize);
        ctx.fillRect(x + offsetX, y + offsetY + h - cornerSize, cornerSize, cornerSize);
        ctx.fillRect(x + offsetX + w - cornerSize, y + offsetY + h - cornerSize, cornerSize, cornerSize);
        
        // Text
        ctx.fillStyle = GameConfig.COLORS.white;
        const settlementFontSize = Math.max(10, GameConfig.CONFIG.width * 0.015);
        ctx.font = `bold ${settlementFontSize}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SETTLEMENT', x + width/2, y + height/2);
        
        ctx.shadowBlur = 0;
    },
    
    // Draw lives hearts (Tournament mode)
    drawLivesHearts: function() {
        const ctx = CanvasManager.ctx;
        const heartSize = Math.max(14, GameConfig.CONFIG.width * 0.025);
        const heartSpacing = heartSize * 1.12; // Reduced by 20% (was 1.4, now 1.4 * 0.8 = 1.12)
        const totalWidth = (GameConfig.MAX_TOURNAMENT_LIVES - 1) * heartSpacing;
        const startX = GameConfig.CONFIG.width / 2 - totalWidth / 2;
        const y = Math.max(25, GameConfig.CONFIG.height * 0.035);
        
        ctx.save();
        
        for (let i = 0; i < GameConfig.MAX_TOURNAMENT_LIVES; i++) {
            const x = startX + i * heartSpacing;
            const hasLife = i < GameState.tournamentLives;
            
            // Glow effect for active hearts (red color)
            if (hasLife) {
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#ff0000'; // Red glow
            } else {
                ctx.shadowBlur = 0;
            }
            
            // Draw heart shape (cleaner, more recognizable)
            ctx.beginPath();
            const size = heartSize * 0.5;
            const topY = y;
            const bottomY = y + size;
            
            // Start from top center, slightly down
            ctx.moveTo(x, topY + size * 0.15);
            
            // Left top curve
            ctx.bezierCurveTo(x, topY, x - size * 0.35, topY, x - size * 0.35, topY + size * 0.15);
            // Left side down to bottom
            ctx.bezierCurveTo(x - size * 0.35, topY + size * 0.4, x - size * 0.15, topY + size * 0.6, x, bottomY);
            
            // Right side up
            ctx.bezierCurveTo(x + size * 0.15, topY + size * 0.6, x + size * 0.35, topY + size * 0.4, x + size * 0.35, topY + size * 0.15);
            // Right top curve
            ctx.bezierCurveTo(x + size * 0.35, topY, x, topY, x, topY + size * 0.15);
            
            ctx.closePath();
            
            // Fill or stroke based on whether life is active (red color)
            if (hasLife) {
                ctx.fillStyle = '#ff0000'; // Red
                ctx.fill();
            } else {
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.25)'; // Red outline
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
        
        ctx.restore();
        ctx.shadowBlur = 0;
    },
    
    // Draw particles
    drawParticles: function() {
        const ctx = CanvasManager.ctx;
        // Smaller particles for coin trail particles
        const particleSize = Math.max(1, GameConfig.CONFIG.width * 0.002);
        GameState.particles.forEach(p => {
            const alpha = p.life / p.maxLife;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.fillRect(p.x - particleSize, p.y - particleSize, particleSize * 2, particleSize * 2);
            ctx.shadowBlur = 0;
        });
        ctx.globalAlpha = 1;
    }
};


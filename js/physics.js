// Physics and Collision Detection Module
const Physics = {
    // Update coin physics
    updateCoin: function() {
        if (!GameState.coin) return;
        
        // Apply time scale to slow down gameplay
        const timeScale = GameConfig.CONFIG.timeScale || 1.0;
        
        // Apply gravity (scaled)
        const scaledGravity = GameConfig.CONFIG.gravity * (GameConfig.CONFIG.width / GameConfig.BASE_CONFIG.width) * timeScale;
        GameState.coin.velY += scaledGravity;
        
        // Update position (with time scale)
        GameState.coin.x += GameState.coin.velX * timeScale;
        GameState.coin.y += GameState.coin.velY * timeScale;
        
        // Add to trail (long trail for visual effect)
        GameState.coinTrail.push({ x: GameState.coin.x, y: GameState.coin.y });
        if (GameState.coinTrail.length > 200) GameState.coinTrail.shift();
        
        // Spawn trail particles behind the coin
        GameState.coinTrailParticleCounter++;
        // Spawn particles every 2 frames for more frequent spawning
        if (GameState.coinTrailParticleCounter >= 2) {
            GameState.coinTrailParticleCounter = 0;
            
            // Calculate spawn offset behind the coin (based on velocity)
            const speed = Math.sqrt(GameState.coin.velX * GameState.coin.velX + GameState.coin.velY * GameState.coin.velY);
            if (speed > 0) {
                // Spawn multiple particles in a burst
                const particleCount = 3; // Spawn 3 particles at once
                const offsetDistance = GameState.coin.radius * 0.8;
                const baseOffsetX = -(GameState.coin.velX / speed) * offsetDistance;
                const baseOffsetY = -(GameState.coin.velY / speed) * offsetDistance;
                
                const baseParticleSpeed = 2 * (GameConfig.CONFIG.width / GameConfig.BASE_CONFIG.width);
                const baseVelAngle = Math.atan2(GameState.coin.velY, GameState.coin.velX) + Math.PI; // Direction opposite to coin movement
                
                for (let i = 0; i < particleCount; i++) {
                    // Add random offset to spawn position for scatter
                    const spawnOffset = (Math.random() - 0.5) * GameState.coin.radius * 0.4;
                    const spawnAngle = Math.random() * Math.PI * 2; // Random angle around the spawn point
                    const offsetX = baseOffsetX + Math.cos(spawnAngle) * spawnOffset;
                    const offsetY = baseOffsetY + Math.sin(spawnAngle) * spawnOffset;
                    
                    // Scatter particles in different directions (wide spread)
                    const scatterAngle = (Math.random() - 0.5) * Math.PI * 1.5; // Wide scatter (270 degree spread)
                    const velAngle = baseVelAngle + scatterAngle;
                    
                    // Variable particle speed for more variation
                    const particleSpeed = baseParticleSpeed * (0.5 + Math.random() * 0.8);
                    
                    GameState.particles.push({
                        x: GameState.coin.x + offsetX,
                        y: GameState.coin.y + offsetY,
                        velX: Math.cos(velAngle) * particleSpeed + (Math.random() - 0.5) * particleSpeed * 0.4,
                        velY: Math.sin(velAngle) * particleSpeed + (Math.random() - 0.5) * particleSpeed * 0.4,
                        life: 25,
                        maxLife: 25,
                        color: GameConfig.COLORS.usdcBlue
                    });
                }
            }
        }
        
        // Check arc gate collisions
        GameState.arcGates.forEach(gate => {
            if (gate.active && 
                GameState.coin.x > gate.x && GameState.coin.x < gate.x + gate.width &&
                GameState.coin.y > gate.y && GameState.coin.y < gate.y + gate.height) {
                gate.active = false;
                GameState.gatesPassed++;
                GameState.multiplier += 0.5;
                // Slight boost
                GameState.coin.velX *= 1.1;
                GameState.coin.velY *= 0.9;

                if (typeof GameFlow !== 'undefined') GameFlow.sendSessionEvent('gatePassed');
                
                // Play gate sound
                AudioManager.playGateSound();
                
                // Gate activation particles
                const particleSpeed = 6 * (GameConfig.CONFIG.width / GameConfig.BASE_CONFIG.width);
                for (let i = 0; i < 15; i++) {
                    GameState.particles.push({
                        x: gate.x + gate.width/2,
                        y: gate.y + gate.height/2,
                        velX: (Math.random() - 0.5) * particleSpeed,
                        velY: (Math.random() - 0.5) * particleSpeed,
                        life: 40,
                        maxLife: 40,
                        color: GameConfig.COLORS.magenta
                    });
                }
            }
        });
        
        // Check slippage cloud collisions
        GameState.slippageClouds.forEach(cloud => {
            const dx = GameState.coin.x - cloud.x;
            const dy = GameState.coin.y - cloud.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < cloud.radius) {
                // Track slippage cloud passed for scoring (10 points awarded at level completion)
                if (!cloud.passed) {
                    cloud.passed = true;
                    GameState.slippageCloudsPassed++;
                    GameState.coin.velX *= 0.85;
                    GameState.coin.velY *= 0.85;
                    if (typeof GameFlow !== 'undefined') GameFlow.sendSessionEvent('cloudPassed');
                }
                GameState.slippageHits++;
            }
        });
        
        // Check life restoration object collisions
        GameState.lifeRestores.forEach(lifeRestore => {
            if (!lifeRestore.collected) {
                const dx = GameState.coin.x - lifeRestore.x;
                const dy = GameState.coin.y - lifeRestore.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < lifeRestore.radius) {
                    lifeRestore.collected = true;
                    // Restore 1 life in tournament mode (max 5)
                    if (GameState.tournamentMode && GameState.tournamentLives < GameConfig.MAX_TOURNAMENT_LIVES) {
                        GameState.tournamentLives++;
                        if (typeof UI !== 'undefined' && UI.updateLivesUI) {
                            UI.updateLivesUI();
                        }
                        
                        // Visual feedback particles (purple to match portal)
                        const particleSpeed = 6 * (GameConfig.CONFIG.width / GameConfig.BASE_CONFIG.width);
                        for (let i = 0; i < 20; i++) {
                            GameState.particles.push({
                                x: lifeRestore.x,
                                y: lifeRestore.y,
                                velX: (Math.random() - 0.5) * particleSpeed,
                                velY: (Math.random() - 0.5) * particleSpeed,
                                life: 40,
                                maxLife: 40,
                                color: GameConfig.COLORS.magenta
                            });
                        }
                    }
                }
            }
        });
        
        // Check barrier collisions (with rotation support)
        GameState.barriers.forEach(barrier => {
            const rotation = (barrier.rotation || 0) * Math.PI / 180;
            const cos = Math.cos(rotation);
            const sin = Math.sin(rotation);
            
            // Barrier center
            const centerX = barrier.x + barrier.width / 2;
            const centerY = barrier.y + barrier.height / 2;
            
            // Transform coin position to barrier's local space
            const dx = GameState.coin.x - centerX;
            const dy = GameState.coin.y - centerY;
            const localX = dx * cos + dy * sin;
            const localY = -dx * sin + dy * cos;
            
            // Check collision in local space (axis-aligned)
            const halfWidth = barrier.width / 2;
            const halfHeight = barrier.height / 2;
            
            // Only process collision if barrier hasn't been triggered yet
            if (!barrier.triggered && Math.abs(localX) <= halfWidth + GameState.coin.radius && Math.abs(localY) <= halfHeight + GameState.coin.radius) {
                barrier.triggered = true;
                GameState.barrierHits++;
                if (typeof GameFlow !== 'undefined') GameFlow.sendSessionEvent('barrierHit');
                
                // Calculate bounce strength based on barrier size
                let bounceSpeed;
                if (barrier.size === 'large') {
                    bounceSpeed = GameState.initialCoinVelocity || Math.sqrt(GameState.coin.velX * GameState.coin.velX + GameState.coin.velY * GameState.coin.velY); // 100% of initial speed
                } else if (barrier.size === 'medium') {
                    bounceSpeed = (GameState.initialCoinVelocity || Math.sqrt(GameState.coin.velX * GameState.coin.velX + GameState.coin.velY * GameState.coin.velY)) * 0.5; // 50% of initial speed
                } else { // small
                    bounceSpeed = (GameState.initialCoinVelocity || Math.sqrt(GameState.coin.velX * GameState.coin.velX + GameState.coin.velY * GameState.coin.velY)) * 0.25; // 25% of initial speed
                }
                
                // Calculate normal vector (perpendicular to barrier surface)
                // For a rotated barrier, the normal should be perpendicular to the barrier's surface
                // The barrier's surface is along the height direction, so normal is along width direction
                // Determine which side of the barrier was hit based on penetration depth
                const penetrationX = (halfWidth + GameState.coin.radius) - Math.abs(localX);
                const penetrationY = (halfHeight + GameState.coin.radius) - Math.abs(localY);
                
                let normalLocalX, normalLocalY;
                if (penetrationX < penetrationY) {
                    // Hit left or right edge (barrier surface) - this is the primary case for thin barriers
                    normalLocalX = localX > 0 ? 1 : -1;
                    normalLocalY = 0;
                } else {
                    // Hit top or bottom edge (barrier end)
                    normalLocalX = 0;
                    normalLocalY = localY > 0 ? 1 : -1;
                }
                
                // Transform normal from local space to world space
                const normalX = normalLocalX * cos - normalLocalY * sin;
                const normalY = normalLocalX * sin + normalLocalY * cos;
                
                // Store old velocity BEFORE modifying it (position was already updated with this velocity)
                const timeScale = GameConfig.CONFIG.timeScale || 1.0;
                const scaledGravity = GameConfig.CONFIG.gravity * (GameConfig.CONFIG.width / GameConfig.BASE_CONFIG.width) * timeScale;
                
                // Get incoming velocity (before gravity was applied this frame)
                const oldVelX = GameState.coin.velX;
                const oldVelY = GameState.coin.velY - scaledGravity; // Revert gravity to get velocity at collision
                
                // Calculate the incoming velocity direction relative to the barrier normal
                const incomingSpeed = Math.sqrt(oldVelX * oldVelX + oldVelY * oldVelY);
                
                if (incomingSpeed > 0) {
                    // Calculate dot product to determine if coin is moving toward or away from barrier
                    const dot = oldVelX * normalX + oldVelY * normalY;
                    
                    // Only bounce if moving toward the barrier (dot product should be negative)
                    // If dot is positive, coin is already moving away, so don't bounce
                    if (dot < 0) {
                        // Reflect velocity: v' = v - 2(v·n)n
                        const reflectedVelX = oldVelX - 2 * dot * normalX;
                        const reflectedVelY = oldVelY - 2 * dot * normalY;
                        
                        // Normalize and scale to desired bounce speed
                        const reflectedSpeed = Math.sqrt(reflectedVelX * reflectedVelX + reflectedVelY * reflectedVelY);
                        if (reflectedSpeed > 0) {
                            GameState.coin.velX = (reflectedVelX / reflectedSpeed) * bounceSpeed;
                            GameState.coin.velY = (reflectedVelY / reflectedSpeed) * bounceSpeed;
                        } else {
                            // Fallback: bounce directly away from barrier
                            GameState.coin.velX = -normalX * bounceSpeed;
                            GameState.coin.velY = -normalY * bounceSpeed;
                        }
                    } else {
                        // Coin is moving away from barrier, don't bounce (shouldn't happen, but safety check)
                        // Just ensure velocity is away from barrier
                        GameState.coin.velX = -normalX * bounceSpeed;
                        GameState.coin.velY = -normalY * bounceSpeed;
                    }
                } else {
                    // Fallback: bounce directly away from barrier
                    GameState.coin.velX = -normalX * bounceSpeed;
                    GameState.coin.velY = -normalY * bounceSpeed;
                }
                
                // Revert the position update that happened at the start of this frame
                // (it used the old velocity with gravity), then apply new velocity with gravity
                GameState.coin.x -= oldVelX * timeScale;
                GameState.coin.y -= (oldVelY + scaledGravity) * timeScale; // Revert using old velocity (with gravity that was applied)
                
                // Apply gravity to the new velocity
                GameState.coin.velY += scaledGravity;
                
                // Update position with new velocity (arc starts immediately, with time scale)
                GameState.coin.x += GameState.coin.velX * timeScale;
                GameState.coin.y += GameState.coin.velY * timeScale;
                
                // Update trail with corrected position
                if (GameState.coinTrail.length > 0) {
                    GameState.coinTrail[GameState.coinTrail.length - 1] = { x: GameState.coin.x, y: GameState.coin.y };
                }
                
                // Create impact particles
                const particleSpeed = 8 * (GameConfig.CONFIG.width / GameConfig.BASE_CONFIG.width);
                for (let i = 0; i < 15; i++) {
                    GameState.particles.push({
                        x: GameState.coin.x,
                        y: GameState.coin.y,
                        velX: (Math.random() - 0.5) * particleSpeed,
                        velY: (Math.random() - 0.5) * particleSpeed,
                        life: 30,
                        maxLife: 30,
                        color: GameConfig.COLORS.yellow
                    });
                }
            }
            
            // Update hit flash animation
            if (barrier.hitFlash > 0) {
                barrier.hitFlash--;
            }
        });
        
        // Check settlement zone collision
        if (GameState.coin && GameState.gameState !== 'finalized' && GameState.settlementZone &&
            GameState.coin.x > GameState.settlementZone.x && GameState.coin.x < GameState.settlementZone.x + GameState.settlementZone.width &&
            GameState.coin.y > GameState.settlementZone.y && GameState.coin.y < GameState.settlementZone.y + GameState.settlementZone.height) {
            GameState.coin = null; // Stop coin immediately to prevent multiple calls
            
            // Play settlement sound
            AudioManager.playSettlementSound();
            
            if (typeof GameFlow !== 'undefined' && GameFlow.finalizeRound) {
                GameFlow.finalizeRound();
            }
            return; // Exit early to prevent further updates
        }
        
        // Check boundaries (only if level hasn't been finalized)
        if (GameState.coin && (GameState.coin.x < -50 || GameState.coin.x > GameConfig.CONFIG.width + 50 || 
            GameState.coin.y < -50 || GameState.coin.y > GameConfig.CONFIG.height + 50)) {
            // Don't process boundary failure if level is already finalized
            if (GameState.gameState === 'finalized') {
                GameState.coin = null; // Just stop coin updates
                return;
            }
            
            // Play miss sound for boundary hit
            AudioManager.playMissSound();
            
            // In tournament mode, missing means level failed - lose a life
            if (GameState.tournamentMode) {
                GameState.gameState = 'failed';
                GameState.coin = null; // Stop coin updates
                
                // Lose a life
                GameState.tournamentLives--;
                if (typeof UI !== 'undefined' && UI.updateLivesUI) {
                    UI.updateLivesUI();
                }
                
                if (GameState.tournamentLives <= 0) {
                    setTimeout(() => {
                        if (typeof GameFlow !== 'undefined' && GameFlow.restartTournamentFromFirst) {
                            GameFlow.restartTournamentFromFirst();
                        }
                    }, 2000);
                } else {
                    setTimeout(() => {
                        if (typeof GameFlow !== 'undefined' && GameFlow.resetRound) {
                            GameFlow.resetRound();
                        }
                    }, 2000);
                }
            } else {
                // In immortal mode, just reset and try again
                if (typeof GameFlow !== 'undefined' && GameFlow.resetRound) {
                    GameFlow.resetRound();
                }
            }
        }
    },
    
    // Update particles
    updateParticles: function() {
        const timeScale = GameConfig.CONFIG.timeScale || 1.0;
        const particleGravity = 0.1 * (GameConfig.CONFIG.width / GameConfig.BASE_CONFIG.width) * timeScale;
        for (let i = GameState.particles.length - 1; i >= 0; i--) {
            const p = GameState.particles[i];
            p.x += p.velX * timeScale;
            p.y += p.velY * timeScale;
            p.velY += particleGravity; // gravity
            p.life--;
            
            if (p.life <= 0) {
                GameState.particles.splice(i, 1);
            }
        }
    }
};


// Agent Trajectory Solver
// Headless, deterministic re-implementation of the shot physics so an agent
// can aim without a human. Mirrors GameFlow.launchCoin + Physics.updateCoin.
//
// The agent produces the same thing a player produces: an aim vector.
// Everything downstream (physics, rendering, scoring) is untouched.
//
// Runs in the browser and in Node (for level-solvability tests).

const AgentSolver = {
    // Base constants — mirrored from GameConfig.BASE_CONFIG
    DEFAULTS: {
        width: 800,
        height: 600,
        gravity: 0.3,
        coinSpeed: 8,
        timeScale: 0.5,
        playerScale: 2.0
    },

    MAX_FRAMES: 2000,

    // Build a simulation world from a level definition (relative 0-1 coords)
    buildWorld: function (level, overrides) {
        const cfg = Object.assign({}, this.DEFAULTS, overrides || {});

        // In the browser, follow the live scaled config
        if (typeof GameConfig !== 'undefined' && GameConfig.CONFIG && GameConfig.CONFIG.width) {
            cfg.width = GameConfig.CONFIG.width;
            cfg.height = GameConfig.CONFIG.height;
            cfg.gravity = GameConfig.CONFIG.gravity;
            cfg.coinSpeed = GameConfig.CONFIG.coinSpeed;
            cfg.timeScale = GameConfig.CONFIG.timeScale;
            cfg.playerScale = GameConfig.PLAYER_SIZE_SCALE || cfg.playerScale;
        }

        const W = cfg.width;
        const H = cfg.height;
        const scale = W / this.DEFAULTS.width;
        const ps = cfg.playerScale;

        // Launch point — see GameFlow.launchCoin + GameObjects.loadLevel
        const playerW = W * 0.04 * ps;
        const playerH = H * 0.08 * ps;
        const playerX = W * ((level.player && level.player.x) || 0.12);
        const playerY = H * ((level.player && level.player.y) || 0.75);

        return {
            W: W,
            H: H,
            scale: scale,
            timeScale: cfg.timeScale,
            gravityPerFrame: cfg.gravity * scale * cfg.timeScale,
            coinSpeed: cfg.coinSpeed,
            coinRadius: W * 0.015,
            launch: {
                x: playerX + playerW * 0.75,
                y: playerY + playerH * 0.3
            },
            gates: (level.arcGates || []).map(g => ({
                x: W * g.x, y: H * g.y,
                width: W * g.width, height: H * g.height,
                active: g.active !== undefined ? g.active : true
            })),
            clouds: (level.slippageClouds || []).map(c => ({
                x: W * c.x, y: H * c.y, radius: W * c.radius
            })),
            barriers: (level.barriers || []).map(b => {
                const defaultHeight = b.size === 'large' ? 0.3 : (b.size === 'small' ? 0.12 : 0.2);
                return {
                    x: W * b.x, y: H * b.y,
                    width: W * (b.width || 0.01),
                    height: H * (b.height || defaultHeight),
                    rotation: b.rotation || 0,
                    size: b.size || 'medium'
                };
            }),
            zone: level.settlementZone ? {
                x: W * level.settlementZone.x,
                y: H * level.settlementZone.y,
                width: W * level.settlementZone.width,
                height: H * level.settlementZone.height
            } : null
        };
    },

    // Simulate one shot. angleDeg: screen coords, negative points upward.
    // power: 0..3, exactly the value GameFlow.launchCoin derives from drag distance.
    simulate: function (world, shot, opts) {
        opts = opts || {};
        const rad = shot.angleDeg * Math.PI / 180;
        const speed = world.coinSpeed * shot.power * world.scale;

        const coin = {
            x: world.launch.x,
            y: world.launch.y,
            velX: Math.cos(rad) * speed,
            velY: Math.sin(rad) * speed
        };
        // GameState.initialCoinVelocity — drives bounce strength
        const initialSpeed = Math.sqrt(coin.velX * coin.velX + coin.velY * coin.velY);

        // Local mutable copies — the simulation must not touch the level
        const gates = world.gates.map(g => ({ x: g.x, y: g.y, width: g.width, height: g.height, active: g.active }));
        const clouds = world.clouds.map(c => ({ x: c.x, y: c.y, radius: c.radius, passed: false }));
        const barriers = world.barriers.map(b => Object.assign({ triggered: false }, b));

        const path = opts.keepPath ? [{ x: coin.x, y: coin.y, vx: coin.velX, vy: coin.velY }] : null;
        let gatesPassed = 0;
        let cloudsPassed = 0;
        let barrierHits = 0;

        for (let frame = 0; frame < this.MAX_FRAMES; frame++) {
            // 1. gravity, 2. position — Physics.updateCoin order
            coin.velY += world.gravityPerFrame;
            coin.x += coin.velX * world.timeScale;
            coin.y += coin.velY * world.timeScale;
            if (path) path.push({ x: coin.x, y: coin.y, vx: coin.velX, vy: coin.velY });

            // 3. arc gates — pass gives a boost
            for (const gate of gates) {
                if (gate.active &&
                    coin.x > gate.x && coin.x < gate.x + gate.width &&
                    coin.y > gate.y && coin.y < gate.y + gate.height) {
                    gate.active = false;
                    gatesPassed++;
                    coin.velX *= 1.1;
                    coin.velY *= 0.9;
                }
            }

            // 4. slippage clouds — drag on first entry
            for (const cloud of clouds) {
                const dx = coin.x - cloud.x;
                const dy = coin.y - cloud.y;
                if (!cloud.passed && Math.sqrt(dx * dx + dy * dy) < cloud.radius) {
                    cloud.passed = true;
                    cloudsPassed++;
                    coin.velX *= 0.85;
                    coin.velY *= 0.85;
                }
            }

            // 5. barriers — reflect once per barrier, mirroring Physics.updateCoin
            for (const b of barriers) {
                const rot = b.rotation * Math.PI / 180;
                const cos = Math.cos(rot);
                const sin = Math.sin(rot);
                const dx = coin.x - (b.x + b.width / 2);
                const dy = coin.y - (b.y + b.height / 2);
                const localX = dx * cos + dy * sin;
                const localY = -dx * sin + dy * cos;
                const halfWidth = b.width / 2;
                const halfHeight = b.height / 2;

                if (b.triggered ||
                    Math.abs(localX) > halfWidth + world.coinRadius ||
                    Math.abs(localY) > halfHeight + world.coinRadius) continue;

                b.triggered = true;
                barrierHits++;

                const bounceSpeed = initialSpeed *
                    (b.size === 'large' ? 1 : (b.size === 'medium' ? 0.5 : 0.25));

                // Normal points out of the shallower penetration axis
                const penetrationX = (halfWidth + world.coinRadius) - Math.abs(localX);
                const penetrationY = (halfHeight + world.coinRadius) - Math.abs(localY);
                let normalLocalX, normalLocalY;
                if (penetrationX < penetrationY) {
                    normalLocalX = localX > 0 ? 1 : -1;
                    normalLocalY = 0;
                } else {
                    normalLocalX = 0;
                    normalLocalY = localY > 0 ? 1 : -1;
                }
                const normalX = normalLocalX * cos - normalLocalY * sin;
                const normalY = normalLocalX * sin + normalLocalY * cos;

                // Velocity at the moment of contact — before this frame's gravity
                const oldVelX = coin.velX;
                const oldVelY = coin.velY - world.gravityPerFrame;
                const incomingSpeed = Math.sqrt(oldVelX * oldVelX + oldVelY * oldVelY);
                const dot = oldVelX * normalX + oldVelY * normalY;

                if (incomingSpeed > 0 && dot < 0) {
                    const reflectedVelX = oldVelX - 2 * dot * normalX;
                    const reflectedVelY = oldVelY - 2 * dot * normalY;
                    const reflectedSpeed = Math.sqrt(reflectedVelX * reflectedVelX + reflectedVelY * reflectedVelY);
                    if (reflectedSpeed > 0) {
                        coin.velX = (reflectedVelX / reflectedSpeed) * bounceSpeed;
                        coin.velY = (reflectedVelY / reflectedSpeed) * bounceSpeed;
                    } else {
                        coin.velX = -normalX * bounceSpeed;
                        coin.velY = -normalY * bounceSpeed;
                    }
                } else {
                    coin.velX = -normalX * bounceSpeed;
                    coin.velY = -normalY * bounceSpeed;
                }

                // Undo this frame's move, then re-apply gravity to the new velocity
                coin.x -= oldVelX * world.timeScale;
                coin.y -= (oldVelY + world.gravityPerFrame) * world.timeScale;
                coin.velY += world.gravityPerFrame;

                // The engine re-applies the move with the bounced velocity in the
                // same frame — the arc starts immediately (physics.js:262).
                coin.x += coin.velX * world.timeScale;
                coin.y += coin.velY * world.timeScale;

                // ...and rewrites the last trail point with the corrected position
                if (path) path[path.length - 1] = { x: coin.x, y: coin.y, vx: coin.velX, vy: coin.velY };
            }

            // 6. settlement zone
            const z = world.zone;
            if (z && coin.x > z.x && coin.x < z.x + z.width &&
                coin.y > z.y && coin.y < z.y + z.height) {
                return { outcome: 'settled', gatesPassed, cloudsPassed, barrierHits, frames: frame, path };
            }

            // 7. out of bounds
            if (coin.x < -50 || coin.x > world.W + 50 || coin.y < -50 || coin.y > world.H + 50) {
                return { outcome: 'miss', gatesPassed, cloudsPassed, barrierHits, frames: frame, path };
            }
        }

        return { outcome: 'timeout', gatesPassed, cloudsPassed, barrierHits, frames: this.MAX_FRAMES, path };
    },

    // Score a settled shot the way the server does (server.js finalize)
    scoreOf: function (sim) {
        const basePoints = 100 + sim.cloudsPassed * 10 + sim.barrierHits * 10;
        return Math.floor(basePoints * (1.0 + sim.gatesPassed * 0.5));
    },

    // Search the (angle, power) space for a shot that settles.
    // policy.maxPower is the agent's per-shot ceiling — the hook the
    // agent-mode budget rules plug into.
    solve: function (world, policy) {
        policy = policy || {};
        const maxPower = Math.min(policy.maxPower || 3, 3);
        // Full sweep — levels are mirrored (player on either side), so both
        // hemispheres have to be searched.
        const angleFrom = policy.angleFrom !== undefined ? policy.angleFrom : -180;
        const angleTo = policy.angleTo !== undefined ? policy.angleTo : 180;

        let best = null;
        let evaluated = 0;

        const consider = (angleDeg, power) => {
            const sim = this.simulate(world, { angleDeg, power });
            evaluated++;
            if (sim.outcome !== 'settled') return;
            const score = this.scoreOf(sim);
            if (!best || score > best.score || (score === best.score && sim.frames < best.sim.frames)) {
                best = { angleDeg, power, score, sim };
            }
        };

        // Coarse sweep
        for (let a = angleFrom; a <= angleTo; a += 1) {
            for (let p = 0.15; p <= maxPower + 1e-9; p += 0.05) {
                consider(a, p);
            }
        }

        // Refine around the winner
        if (best) {
            const a0 = best.angleDeg;
            const p0 = best.power;
            for (let a = a0 - 1; a <= a0 + 1; a += 0.1) {
                for (let p = Math.max(0.1, p0 - 0.05); p <= Math.min(maxPower, p0 + 0.05); p += 0.005) {
                    consider(a, p);
                }
            }
        }

        return best ? Object.assign(best, { evaluated }) : { evaluated, failed: true };
    },

    // Convert a solved shot into the aim vector GameFlow.launchCoin expects.
    // launchCoin reads only direction and distance, so any origin works.
    aimFor: function (world, shot) {
        const rad = shot.angleDeg * Math.PI / 180;
        const distance = shot.power * world.W * 0.06;
        return {
            aimStart: { x: world.launch.x, y: world.launch.y },
            aimEnd: {
                x: world.launch.x + Math.cos(rad) * distance,
                y: world.launch.y + Math.sin(rad) * distance
            }
        };
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AgentSolver };
}
if (typeof window !== 'undefined') {
    window.AgentSolver = AgentSolver;
}

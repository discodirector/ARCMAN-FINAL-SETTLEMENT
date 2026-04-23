// Level Editor Module
const LevelEditor = {
    editorCanvas: null,
    editorCtx: null,
    editorDragging: false,
    draggedObject: null, // { type, index } of object being dragged
    dragOffset: null, // { x, y } offset from mouse to object center
    
    // Initialize editor
    init: function() {
        this.editorCanvas = document.getElementById('editorCanvas');
        if (!this.editorCanvas) {
            console.warn('Editor canvas not found');
            return;
        }
        
        this.editorCtx = this.editorCanvas.getContext('2d');
        const editorWidth = 600;
        const editorHeight = 450;
        this.editorCanvas.width = editorWidth;
        this.editorCanvas.height = editorHeight;
        
        // Editor event listeners
        this.setupEditorListeners();
        
        // Create new level for editing
        GameState.editorLevel = this.createNewEditorLevel();
        this.updateEditorUI();
        this.renderEditor();
    },
    
    // Create new editor level
    createNewEditorLevel: function() {
        return {
            id: null,
            name: 'New Level',
            player: { x: 0.12, y: 0.75 },
            arcGates: [],
            slippageClouds: [],
            lifeRestores: [],
            barriers: [],
            settlementZone: null
        };
    },
    
    // Setup editor event listeners
    setupEditorListeners: function() {
        // Tool buttons
        document.querySelectorAll('[data-tool]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-tool]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                GameState.editorTool = e.target.getAttribute('data-tool');
                GameState.selectedObject = null;
                this.renderEditor();
            });
        });
        
        // Editor buttons
        const editorClose = document.getElementById('editorClose');
        const editorNew = document.getElementById('editorNew');
        const editorSave = document.getElementById('editorSave');
        const editorDelete = document.getElementById('editorDelete');
        const editorLoad = document.getElementById('editorLoad');
        
        if (editorClose) editorClose.addEventListener('click', () => this.toggleEditor(false));
        if (editorNew) editorNew.addEventListener('click', () => {
            GameState.editorLevel = this.createNewEditorLevel();
            this.updateEditorUI();
            this.renderEditor();
        });
        if (editorSave) editorSave.addEventListener('click', () => this.saveEditorLevel());
        if (editorDelete) editorDelete.addEventListener('click', () => this.deleteEditorLevel());
        if (editorLoad) editorLoad.addEventListener('click', () => this.loadEditorLevel());
        
        // Launch button
        const editorLaunch = document.getElementById('editorLaunch');
        if (editorLaunch) editorLaunch.addEventListener('click', () => this.launchLevel());
        
        // Export button
        const editorExport = document.getElementById('editorExport');
        if (editorExport) {
            editorExport.addEventListener('click', () => this.showExportModal());
        }
        
        // Submit button
        const editorSubmit = document.getElementById('editorSubmit');
        if (editorSubmit) {
            editorSubmit.addEventListener('click', () => this.submitLevel());
        }
        
        // Export modal buttons
        const exportClose = document.getElementById('exportClose');
        const exportCopy = document.getElementById('exportCopy');
        if (exportClose) {
            exportClose.addEventListener('click', () => {
                const modal = document.getElementById('exportModal');
                if (modal) modal.style.display = 'none';
            });
        }
        if (exportCopy) {
            exportCopy.addEventListener('click', () => {
                const textarea = document.getElementById('exportCode');
                if (textarea) {
                    textarea.select();
                    textarea.setSelectionRange(0, 99999); // For mobile devices
                    try {
                        document.execCommand('copy');
                        if (typeof UI !== 'undefined' && UI.showNotification) {
                            UI.showNotification('Code copied to clipboard!', 2000);
                        } else {
                            alert('Code copied to clipboard!');
                        }
                    } catch (err) {
                        if (typeof UI !== 'undefined' && UI.showNotification) {
                            UI.showNotification('Failed to copy. Please select and copy manually.', 3000);
                        } else {
                            alert('Failed to copy. Please select and copy manually.');
                        }
                    }
                }
            });
        }
        
        // Rotate button
        const editorRotate = document.getElementById('editorRotate');
        if (editorRotate) {
            editorRotate.addEventListener('click', () => this.rotateSelectedObject());
        }
        
        // Keyboard shortcuts (only when editor is active)
        document.addEventListener('keydown', (e) => {
            if (GameState.editorMode && e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                this.rotateSelectedObject();
            }
        });
        
        // Level select
        const levelSelect = document.getElementById('levelSelect');
        if (levelSelect) {
            this.updateLevelSelect();
            levelSelect.addEventListener('change', () => {
                const selectedId = parseInt(levelSelect.value);
                if (selectedId) {
                    const level = GameState.levelManager.getLevelById(selectedId);
                    if (level) {
                        GameState.editorLevel = JSON.parse(JSON.stringify(level)); // Deep copy
                        // Ensure lifeRestores array exists
                        if (!GameState.editorLevel.lifeRestores) {
                            GameState.editorLevel.lifeRestores = [];
                        }
                        this.updateEditorUI();
                        this.renderEditor();
                    }
                }
            });
        }
        
        // Editor canvas mouse events
        if (this.editorCanvas) {
            this.editorCanvas.addEventListener('click', (e) => this.handleEditorClick(e));
            this.editorCanvas.addEventListener('mousedown', (e) => this.handleEditorMouseDown(e));
            this.editorCanvas.addEventListener('mousemove', (e) => this.handleEditorMouseMove(e));
            this.editorCanvas.addEventListener('mouseup', (e) => this.handleEditorMouseUp(e));
            this.editorCanvas.addEventListener('mouseleave', (e) => this.handleEditorMouseUp(e)); // Stop dragging if mouse leaves canvas
        }
        
        // Level name input
        const levelNameInput = document.getElementById('editorLevelName');
        if (levelNameInput) {
            levelNameInput.addEventListener('input', (e) => {
                GameState.editorLevel.name = e.target.value;
            });
        }
    },
    
    // Toggle editor
    toggleEditor: function(show = null) {
        const editor = document.getElementById('levelEditor');
        if (!editor) return;
        
        GameState.editorMode = show !== null ? show : !GameState.editorMode;
        editor.style.display = GameState.editorMode ? 'block' : 'none';
        
        if (GameState.editorMode) {
            GameState.gameMode = 'editor';
            this.updateLevelSelect();
            this.renderEditor();
            // Play editor music
            if (typeof AudioManager !== 'undefined' && AudioManager.playEditorMusic) {
                AudioManager.playEditorMusic();
            }
        } else {
            // Closing editor - return to menu
            if (GameState.gameMode === 'editor') {
                // Stop editor music
                if (typeof AudioManager !== 'undefined' && AudioManager.stopEditorMusic) {
                    AudioManager.stopEditorMusic();
                }
                if (typeof GameFlow !== 'undefined' && GameFlow.showMainMenu) {
                    GameFlow.showMainMenu();
                }
            }
        }
    },
    
    // Handle editor canvas click
    handleEditorClick: function(e) {
        if (!this.editorCanvas || !this.editorCtx) return;
        
        // Don't handle click if we just finished dragging (mouseup will handle that)
        if (this.editorDragging) {
            return;
        }
        
        const rect = this.editorCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        if (GameState.editorTool === 'select') {
            // Select object at click position
            this.selectObjectAt(x, y);
        } else if (GameState.editorTool === 'gate') {
            // Add arc gate
            GameState.editorLevel.arcGates.push({
                x: x,
                y: y,
                width: 0.05,
                height: 0.13,
                active: true,
                rotation: 0 // Rotation in degrees
            });
            this.renderEditor();
            this.updateEditorUI();
        } else if (GameState.editorTool === 'cloud') {
            // Add slippage cloud
            GameState.editorLevel.slippageClouds.push({
                x: x,
                y: y,
                radius: 0.06
            });
            this.renderEditor();
            this.updateEditorUI();
        } else if (GameState.editorTool === 'life-restore') {
            // Add life restoration object
            if (!GameState.editorLevel.lifeRestores) {
                GameState.editorLevel.lifeRestores = [];
            }
            GameState.editorLevel.lifeRestores.push({
                x: x,
                y: y,
                radius: 0.0167  // Reduced to 1/3 of original size (0.05 / 3)
            });
            this.renderEditor();
            this.updateEditorUI();
        } else if (GameState.editorTool === 'barrier-large' || GameState.editorTool === 'barrier-medium' || GameState.editorTool === 'barrier-small') {
            // Add barrier
            const size = GameState.editorTool === 'barrier-large' ? 'large' : GameState.editorTool === 'barrier-medium' ? 'medium' : 'small';
            
            // Set height based on size
            let height;
            if (size === 'large') {
                height = 0.3; // Tallest
            } else if (size === 'medium') {
                height = 0.2; // Medium
            } else { // small
                height = 0.12; // Shortest
            }
            
            if (!GameState.editorLevel.barriers) {
                GameState.editorLevel.barriers = [];
            }
            GameState.editorLevel.barriers.push({
                x: x,
                y: y,
                width: 0.01, // Barrier thickness
                height: height, // Barrier height (size-dependent)
                size: size,
                rotation: 0 // Rotation in degrees (0 = vertical, 90 = horizontal)
            });
            this.renderEditor();
            this.updateEditorUI();
        } else if (GameState.editorTool === 'settlement') {
            // Set settlement zone
            GameState.editorLevel.settlementZone = {
                x: x,
                y: y,
                width: 0.1,
                height: 0.13,
                rotation: 0 // Rotation in degrees
            };
            this.renderEditor();
            this.updateEditorUI();
        } else if (GameState.editorTool === 'player') {
            // Set player position
            GameState.editorLevel.player = { x: x, y: y };
            this.renderEditor();
            this.updateEditorUI();
        } else if (GameState.editorTool === 'delete') {
            // Delete object at click
            this.deleteObjectAt(x, y);
        }
    },
    
    // Handle editor mouse down (start dragging)
    handleEditorMouseDown: function(e) {
        if (!this.editorCanvas || !this.editorCtx) return;
        if (GameState.editorTool !== 'select') return;
        if (!GameState.selectedObject) return;
        
        const rect = this.editorCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        // Check if clicking on the selected object
        const canvasX = x * this.editorCanvas.width;
        const canvasY = y * this.editorCanvas.height;
        
        let objectX, objectY;
        const obj = GameState.selectedObject;
        
        if (obj.type === 'settlement' && GameState.editorLevel.settlementZone) {
            const sz = GameState.editorLevel.settlementZone;
            objectX = sz.x * this.editorCanvas.width;
            objectY = sz.y * this.editorCanvas.height;
            const szW = sz.width * this.editorCanvas.width;
            const szH = sz.height * this.editorCanvas.height;
            // Check if click is within settlement zone
            if (canvasX >= objectX && canvasX <= objectX + szW && canvasY >= objectY && canvasY <= objectY + szH) {
                this.editorDragging = true;
                this.draggedObject = obj;
                // Calculate offset from click to object center
                this.dragOffset = {
                    x: x - (sz.x + sz.width / 2),
                    y: y - (sz.y + sz.height / 2)
                };
            }
        } else if (obj.type === 'gate' && GameState.editorLevel.arcGates[obj.index]) {
            const gate = GameState.editorLevel.arcGates[obj.index];
            objectX = gate.x * this.editorCanvas.width;
            objectY = gate.y * this.editorCanvas.height;
            const gW = gate.width * this.editorCanvas.width;
            const gH = gate.height * this.editorCanvas.height;
            if (canvasX >= objectX && canvasX <= objectX + gW && canvasY >= objectY && canvasY <= objectY + gH) {
                this.editorDragging = true;
                this.draggedObject = obj;
                this.dragOffset = {
                    x: x - (gate.x + gate.width / 2),
                    y: y - (gate.y + gate.height / 2)
                };
            }
        } else if (obj.type === 'cloud' && GameState.editorLevel.slippageClouds[obj.index]) {
            const cloud = GameState.editorLevel.slippageClouds[obj.index];
            objectX = cloud.x * this.editorCanvas.width;
            objectY = cloud.y * this.editorCanvas.height;
            const cR = cloud.radius * this.editorCanvas.width;
            const dist = Math.sqrt((canvasX - objectX) ** 2 + (canvasY - objectY) ** 2);
            if (dist <= cR) {
                this.editorDragging = true;
                this.draggedObject = obj;
                this.dragOffset = {
                    x: x - cloud.x,
                    y: y - cloud.y
                };
            }
        } else if (obj.type === 'life-restore' && GameState.editorLevel.lifeRestores && GameState.editorLevel.lifeRestores[obj.index]) {
            const lifeRestore = GameState.editorLevel.lifeRestores[obj.index];
            objectX = lifeRestore.x * this.editorCanvas.width;
            objectY = lifeRestore.y * this.editorCanvas.height;
            const lR = lifeRestore.radius * this.editorCanvas.width;
            const dist = Math.sqrt((canvasX - objectX) ** 2 + (canvasY - objectY) ** 2);
            if (dist <= lR) {
                this.editorDragging = true;
                this.draggedObject = obj;
                this.dragOffset = {
                    x: x - lifeRestore.x,
                    y: y - lifeRestore.y
                };
            }
        } else if (obj.type === 'barrier' && GameState.editorLevel.barriers && GameState.editorLevel.barriers[obj.index]) {
            const barrier = GameState.editorLevel.barriers[obj.index];
            objectX = barrier.x * this.editorCanvas.width;
            objectY = barrier.y * this.editorCanvas.height;
            const bW = barrier.width * this.editorCanvas.width;
            const bH = barrier.height * this.editorCanvas.height;
            if (canvasX >= objectX && canvasX <= objectX + bW && canvasY >= objectY && canvasY <= objectY + bH) {
                this.editorDragging = true;
                this.draggedObject = obj;
                this.dragOffset = {
                    x: x - (barrier.x + barrier.width / 2),
                    y: y - (barrier.y + barrier.height / 2)
                };
            }
        } else if (obj.type === 'player' && GameState.editorLevel.player) {
            const pX = GameState.editorLevel.player.x * this.editorCanvas.width;
            const pY = GameState.editorLevel.player.y * this.editorCanvas.height;
            const hitboxSize = 15; // Hitbox size in pixels
            if (canvasX >= pX - hitboxSize && canvasX <= pX + hitboxSize && 
                canvasY >= pY - hitboxSize && canvasY <= pY + hitboxSize) {
                this.editorDragging = true;
                this.draggedObject = obj;
                this.dragOffset = {
                    x: x - GameState.editorLevel.player.x,
                    y: y - GameState.editorLevel.player.y
                };
            }
        }
        
        if (this.editorDragging) {
            e.preventDefault(); // Prevent text selection
        }
    },
    
    // Handle editor mouse move (for dragging)
    handleEditorMouseMove: function(e) {
        if (!this.editorCanvas || !this.editorCtx) return;
        
        if (this.editorDragging && this.draggedObject && this.dragOffset) {
            const rect = this.editorCanvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            // Calculate new position (subtract offset to maintain relative position)
            const newX = x - this.dragOffset.x;
            const newY = y - this.dragOffset.y;
            
            // Clamp to canvas bounds (0-1)
            const clampedX = Math.max(0, Math.min(1, newX));
            const clampedY = Math.max(0, Math.min(1, newY));
            
            const obj = this.draggedObject;
            
            if (obj.type === 'settlement' && GameState.editorLevel.settlementZone) {
                // For settlement zone, adjust position but keep center-based offset
                GameState.editorLevel.settlementZone.x = clampedX - GameState.editorLevel.settlementZone.width / 2;
                GameState.editorLevel.settlementZone.y = clampedY - GameState.editorLevel.settlementZone.height / 2;
                // Clamp again to ensure it stays within bounds
                GameState.editorLevel.settlementZone.x = Math.max(0, Math.min(1 - GameState.editorLevel.settlementZone.width, GameState.editorLevel.settlementZone.x));
                GameState.editorLevel.settlementZone.y = Math.max(0, Math.min(1 - GameState.editorLevel.settlementZone.height, GameState.editorLevel.settlementZone.y));
            } else if (obj.type === 'gate' && GameState.editorLevel.arcGates[obj.index]) {
                const gate = GameState.editorLevel.arcGates[obj.index];
                gate.x = clampedX - gate.width / 2;
                gate.y = clampedY - gate.height / 2;
                gate.x = Math.max(0, Math.min(1 - gate.width, gate.x));
                gate.y = Math.max(0, Math.min(1 - gate.height, gate.y));
            } else if (obj.type === 'cloud' && GameState.editorLevel.slippageClouds[obj.index]) {
                const cloud = GameState.editorLevel.slippageClouds[obj.index];
                cloud.x = clampedX;
                cloud.y = clampedY;
                cloud.x = Math.max(cloud.radius, Math.min(1 - cloud.radius, cloud.x));
                cloud.y = Math.max(cloud.radius, Math.min(1 - cloud.radius, cloud.y));
            } else if (obj.type === 'life-restore' && GameState.editorLevel.lifeRestores && GameState.editorLevel.lifeRestores[obj.index]) {
                const lifeRestore = GameState.editorLevel.lifeRestores[obj.index];
                lifeRestore.x = clampedX;
                lifeRestore.y = clampedY;
                lifeRestore.x = Math.max(lifeRestore.radius, Math.min(1 - lifeRestore.radius, lifeRestore.x));
                lifeRestore.y = Math.max(lifeRestore.radius, Math.min(1 - lifeRestore.radius, lifeRestore.y));
            } else if (obj.type === 'barrier' && GameState.editorLevel.barriers && GameState.editorLevel.barriers[obj.index]) {
                const barrier = GameState.editorLevel.barriers[obj.index];
                barrier.x = clampedX - barrier.width / 2;
                barrier.y = clampedY - barrier.height / 2;
                barrier.x = Math.max(0, Math.min(1 - barrier.width, barrier.x));
                barrier.y = Math.max(0, Math.min(1 - barrier.height, barrier.y));
            } else if (obj.type === 'player' && GameState.editorLevel.player) {
                GameState.editorLevel.player.x = clampedX;
                GameState.editorLevel.player.y = clampedY;
                // Clamp player position to reasonable bounds
                GameState.editorLevel.player.x = Math.max(0, Math.min(1, GameState.editorLevel.player.x));
                GameState.editorLevel.player.y = Math.max(0, Math.min(1, GameState.editorLevel.player.y));
            }
            
            this.renderEditor();
        }
    },
    
    // Handle editor mouse up (stop dragging)
    handleEditorMouseUp: function(e) {
        if (this.editorDragging) {
            this.editorDragging = false;
            this.draggedObject = null;
            this.dragOffset = null;
            this.updateEditorUI();
        }
    },
    
    // Rotate selected object
    rotateSelectedObject: function() {
        if (!GameState.selectedObject || !GameState.editorLevel) return;
        
        const rotationStep = 15; // Rotate by 15 degrees
        
        if (GameState.selectedObject.type === 'gate') {
            const gate = GameState.editorLevel.arcGates[GameState.selectedObject.index];
            if (!gate.rotation) gate.rotation = 0;
            gate.rotation = (gate.rotation + rotationStep) % 360;
        } else if (GameState.selectedObject.type === 'barrier') {
            const barrier = GameState.editorLevel.barriers[GameState.selectedObject.index];
            if (!barrier.rotation) barrier.rotation = 0;
            barrier.rotation = (barrier.rotation + rotationStep) % 360;
        } else if (GameState.selectedObject.type === 'settlement') {
            if (!GameState.editorLevel.settlementZone.rotation) GameState.editorLevel.settlementZone.rotation = 0;
            GameState.editorLevel.settlementZone.rotation = (GameState.editorLevel.settlementZone.rotation + rotationStep) % 360;
        }
        
        this.renderEditor();
        this.updateEditorUI();
    },
    
    // Select object at position
    selectObjectAt: function(x, y) {
        GameState.selectedObject = null;
        const canvasX = x * this.editorCanvas.width;
        const canvasY = y * this.editorCanvas.height;
        
        // Check settlement zone
        if (GameState.editorLevel.settlementZone) {
            const sz = GameState.editorLevel.settlementZone;
            const szX = sz.x * this.editorCanvas.width;
            const szY = sz.y * this.editorCanvas.height;
            const szW = sz.width * this.editorCanvas.width;
            const szH = sz.height * this.editorCanvas.height;
            if (canvasX >= szX && canvasX <= szX + szW && canvasY >= szY && canvasY <= szY + szH) {
                GameState.selectedObject = { type: 'settlement', index: -1 };
                this.renderEditor();
                return;
            }
        }
        
        // Check gates
        GameState.editorLevel.arcGates.forEach((gate, index) => {
            const gX = gate.x * this.editorCanvas.width;
            const gY = gate.y * this.editorCanvas.height;
            const gW = gate.width * this.editorCanvas.width;
            const gH = gate.height * this.editorCanvas.height;
            if (canvasX >= gX && canvasX <= gX + gW && canvasY >= gY && canvasY <= gY + gH) {
                GameState.selectedObject = { type: 'gate', index };
                this.renderEditor();
                return;
            }
        });
        
        // Check clouds
        GameState.editorLevel.slippageClouds.forEach((cloud, index) => {
            const cX = cloud.x * this.editorCanvas.width;
            const cY = cloud.y * this.editorCanvas.height;
            const cR = cloud.radius * this.editorCanvas.width;
            const dist = Math.sqrt((canvasX - cX) ** 2 + (canvasY - cY) ** 2);
            if (dist <= cR) {
                GameState.selectedObject = { type: 'cloud', index };
                this.renderEditor();
                return;
            }
        });
        
        // Check life restores
        if (GameState.editorLevel.lifeRestores) {
            GameState.editorLevel.lifeRestores.forEach((lifeRestore, index) => {
                const lX = lifeRestore.x * this.editorCanvas.width;
                const lY = lifeRestore.y * this.editorCanvas.height;
                const lR = lifeRestore.radius * this.editorCanvas.width;
                const dist = Math.sqrt((canvasX - lX) ** 2 + (canvasY - lY) ** 2);
                if (dist <= lR) {
                    GameState.selectedObject = { type: 'life-restore', index };
                    this.renderEditor();
                    return;
                }
            });
        }
        
        // Check barriers
        if (GameState.editorLevel.barriers) {
            GameState.editorLevel.barriers.forEach((barrier, index) => {
                const bX = barrier.x * this.editorCanvas.width;
                const bY = barrier.y * this.editorCanvas.height;
                const bW = barrier.width * this.editorCanvas.width;
                const bH = barrier.height * this.editorCanvas.height;
                if (canvasX >= bX && canvasX <= bX + bW && canvasY >= bY && canvasY <= bY + bH) {
                    GameState.selectedObject = { type: 'barrier', index };
                    this.renderEditor();
                    return;
                }
            });
        }
        
        // Check player (small hitbox around player position)
        if (GameState.editorLevel.player) {
            const pX = GameState.editorLevel.player.x * this.editorCanvas.width;
            const pY = GameState.editorLevel.player.y * this.editorCanvas.height;
            const hitboxSize = 15; // Hitbox size in pixels
            if (canvasX >= pX - hitboxSize && canvasX <= pX + hitboxSize && 
                canvasY >= pY - hitboxSize && canvasY <= pY + hitboxSize) {
                GameState.selectedObject = { type: 'player', index: -1 };
                this.renderEditor();
                return;
            }
        }
        
        this.renderEditor();
    },
    
    // Delete object at position
    deleteObjectAt: function(x, y) {
        const canvasX = x * this.editorCanvas.width;
        const canvasY = y * this.editorCanvas.height;
        
        // Check and delete settlement zone
        if (GameState.editorLevel.settlementZone) {
            const sz = GameState.editorLevel.settlementZone;
            const szX = sz.x * this.editorCanvas.width;
            const szY = sz.y * this.editorCanvas.height;
            const szW = sz.width * this.editorCanvas.width;
            const szH = sz.height * this.editorCanvas.height;
            if (canvasX >= szX && canvasX <= szX + szW && canvasY >= szY && canvasY <= szY + szH) {
                GameState.editorLevel.settlementZone = null;
                this.renderEditor();
                this.updateEditorUI();
                return;
            }
        }
        
        // Check and delete gates
        for (let i = GameState.editorLevel.arcGates.length - 1; i >= 0; i--) {
            const gate = GameState.editorLevel.arcGates[i];
            const gX = gate.x * this.editorCanvas.width;
            const gY = gate.y * this.editorCanvas.height;
            const gW = gate.width * this.editorCanvas.width;
            const gH = gate.height * this.editorCanvas.height;
            if (canvasX >= gX && canvasX <= gX + gW && canvasY >= gY && canvasY <= gY + gH) {
                GameState.editorLevel.arcGates.splice(i, 1);
                this.renderEditor();
                this.updateEditorUI();
                return;
            }
        }
        
        // Check and delete clouds
        for (let i = GameState.editorLevel.slippageClouds.length - 1; i >= 0; i--) {
            const cloud = GameState.editorLevel.slippageClouds[i];
            const cX = cloud.x * this.editorCanvas.width;
            const cY = cloud.y * this.editorCanvas.height;
            const cR = cloud.radius * this.editorCanvas.width;
            const dist = Math.sqrt((canvasX - cX) ** 2 + (canvasY - cY) ** 2);
            if (dist <= cR) {
                GameState.editorLevel.slippageClouds.splice(i, 1);
                this.renderEditor();
                this.updateEditorUI();
                return;
            }
        }
        
        // Check and delete life restores
        if (GameState.editorLevel.lifeRestores) {
            for (let i = GameState.editorLevel.lifeRestores.length - 1; i >= 0; i--) {
                const lifeRestore = GameState.editorLevel.lifeRestores[i];
                const lX = lifeRestore.x * this.editorCanvas.width;
                const lY = lifeRestore.y * this.editorCanvas.height;
                const lR = lifeRestore.radius * this.editorCanvas.width;
                const dist = Math.sqrt((canvasX - lX) ** 2 + (canvasY - lY) ** 2);
                if (dist <= lR) {
                    GameState.editorLevel.lifeRestores.splice(i, 1);
                    this.renderEditor();
                    this.updateEditorUI();
                    return;
                }
            }
        }
        
        // Check and delete barriers
        if (GameState.editorLevel.barriers) {
            for (let i = GameState.editorLevel.barriers.length - 1; i >= 0; i--) {
                const barrier = GameState.editorLevel.barriers[i];
                const bX = barrier.x * this.editorCanvas.width;
                const bY = barrier.y * this.editorCanvas.height;
                const bW = barrier.width * this.editorCanvas.width;
                const bH = barrier.height * this.editorCanvas.height;
                if (canvasX >= bX && canvasX <= bX + bW && canvasY >= bY && canvasY <= bY + bH) {
                    GameState.editorLevel.barriers.splice(i, 1);
                    this.renderEditor();
                    this.updateEditorUI();
                    return;
                }
            }
        }
    },
    
    // Render editor
    renderEditor: function() {
        if (!this.editorCanvas || !this.editorCtx) return;
        
        const w = this.editorCanvas.width;
        const h = this.editorCanvas.height;
        
        // Clear
        this.editorCtx.fillStyle = GameConfig.COLORS.black;
        this.editorCtx.fillRect(0, 0, w, h);
        
        // Draw stars background
        for (let i = 0; i < 50; i++) {
            this.editorCtx.fillStyle = GameConfig.COLORS.white;
            this.editorCtx.globalAlpha = 0.5;
            const sx = Math.random() * w;
            const sy = Math.random() * h;
            this.editorCtx.fillRect(sx, sy, 1, 1);
        }
        this.editorCtx.globalAlpha = 1;
        
        // Draw settlement zone
        if (GameState.editorLevel.settlementZone) {
            const sz = GameState.editorLevel.settlementZone;
            const szX = sz.x * w;
            const szY = sz.y * h;
            const szW = sz.width * w;
            const szH = sz.height * h;
            const rotation = (sz.rotation || 0) * Math.PI / 180;
            
            this.editorCtx.save();
            this.editorCtx.translate(szX + szW / 2, szY + szH / 2);
            this.editorCtx.rotate(rotation);
            
            this.editorCtx.strokeStyle = GameState.selectedObject?.type === 'settlement' ? GameConfig.COLORS.yellow : GameConfig.COLORS.cyan;
            this.editorCtx.lineWidth = GameState.selectedObject?.type === 'settlement' ? 3 : 2;
            this.editorCtx.strokeRect(-szW / 2, -szH / 2, szW, szH);
            this.editorCtx.fillStyle = GameConfig.COLORS.cyan;
            this.editorCtx.globalAlpha = 0.2;
            this.editorCtx.fillRect(-szW / 2, -szH / 2, szW, szH);
            this.editorCtx.globalAlpha = 1;
            this.editorCtx.restore();
        }
        
        // Draw gates
        GameState.editorLevel.arcGates.forEach((gate, index) => {
            const gX = gate.x * w;
            const gY = gate.y * h;
            const gW = gate.width * w;
            const gH = gate.height * h;
            const rotation = ((gate.rotation || 0) * Math.PI / 180);
            
            this.editorCtx.save();
            this.editorCtx.translate(gX + gW / 2, gY + gH / 2);
            this.editorCtx.rotate(rotation);
            
            this.editorCtx.strokeStyle = GameState.selectedObject?.type === 'gate' && GameState.selectedObject?.index === index ? GameConfig.COLORS.yellow : GameConfig.COLORS.magenta;
            this.editorCtx.lineWidth = GameState.selectedObject?.type === 'gate' && GameState.selectedObject?.index === index ? 3 : 2;
            this.editorCtx.strokeRect(-gW / 2, -gH / 2, gW, gH);
            this.editorCtx.fillStyle = GameConfig.COLORS.magenta;
            this.editorCtx.globalAlpha = 0.2;
            this.editorCtx.fillRect(-gW / 2, -gH / 2, gW, gH);
            this.editorCtx.globalAlpha = 1;
            this.editorCtx.restore();
        });
        
        // Draw barriers
        if (GameState.editorLevel.barriers) {
            GameState.editorLevel.barriers.forEach((barrier, index) => {
                const bX = barrier.x * w;
                const bY = barrier.y * h;
                const bW = barrier.width * w;
                const bH = barrier.height * h;
                const rotation = ((barrier.rotation || 0) * Math.PI / 180);
                
                this.editorCtx.save();
                this.editorCtx.translate(bX + bW / 2, bY + bH / 2);
                this.editorCtx.rotate(rotation);
                
                this.editorCtx.strokeStyle = GameState.selectedObject?.type === 'barrier' && GameState.selectedObject?.index === index ? GameConfig.COLORS.yellow : GameConfig.COLORS.yellow;
                this.editorCtx.lineWidth = GameState.selectedObject?.type === 'barrier' && GameState.selectedObject?.index === index ? 3 : 2;
                this.editorCtx.strokeRect(-bW / 2, -bH / 2, bW, bH);
                this.editorCtx.fillStyle = GameConfig.COLORS.yellow;
                this.editorCtx.globalAlpha = 0.3;
                this.editorCtx.fillRect(-bW / 2, -bH / 2, bW, bH);
                this.editorCtx.globalAlpha = 1;
                
                // Draw size label
                this.editorCtx.fillStyle = GameConfig.COLORS.yellow;
                this.editorCtx.font = '10px monospace';
                this.editorCtx.textAlign = 'center';
                this.editorCtx.textBaseline = 'middle';
                this.editorCtx.fillText(barrier.size.toUpperCase(), 0, 0);
                this.editorCtx.restore();
            });
        }
        
        // Draw clouds
        GameState.editorLevel.slippageClouds.forEach((cloud, index) => {
            const cX = cloud.x * w;
            const cY = cloud.y * h;
            const cR = cloud.radius * w;
            
            this.editorCtx.strokeStyle = GameState.selectedObject?.type === 'cloud' && GameState.selectedObject?.index === index ? GameConfig.COLORS.yellow : GameConfig.COLORS.magenta;
            this.editorCtx.lineWidth = GameState.selectedObject?.type === 'cloud' && GameState.selectedObject?.index === index ? 3 : 2;
            this.editorCtx.beginPath();
            this.editorCtx.arc(cX, cY, cR, 0, Math.PI * 2);
            this.editorCtx.stroke();
            this.editorCtx.fillStyle = GameConfig.COLORS.magenta;
            this.editorCtx.globalAlpha = 0.2;
            this.editorCtx.fill();
            this.editorCtx.globalAlpha = 1;
        });
        
        // Draw life restores
        if (GameState.editorLevel.lifeRestores) {
            GameState.editorLevel.lifeRestores.forEach((lifeRestore, index) => {
                const lX = lifeRestore.x * w;
                const lY = lifeRestore.y * h;
                const lR = lifeRestore.radius * w;
                const portalWidth = lR * 1.6;
                const portalHeight = lR * 1.2;
                const scaleY = portalHeight / portalWidth;
                
                this.editorCtx.save();
                this.editorCtx.translate(lX, lY);
                this.editorCtx.scale(1, scaleY);
                
                const isSelected = GameState.selectedObject?.type === 'life-restore' && GameState.selectedObject?.index === index;
                this.editorCtx.strokeStyle = isSelected ? GameConfig.COLORS.yellow : GameConfig.COLORS.magenta;
                this.editorCtx.lineWidth = isSelected ? 3 : 2;
                this.editorCtx.beginPath();
                this.editorCtx.arc(0, 0, portalWidth, 0, Math.PI * 2);
                this.editorCtx.stroke();
                
                // Inner ring
                this.editorCtx.strokeStyle = '#ff0fff';
                this.editorCtx.lineWidth = 1.5;
                this.editorCtx.globalAlpha = 0.8;
                this.editorCtx.beginPath();
                this.editorCtx.arc(0, 0, portalWidth * 0.85, 0, Math.PI * 2);
                this.editorCtx.stroke();
                this.editorCtx.globalAlpha = 1;
                
                // Interior
                this.editorCtx.fillStyle = 'rgba(128, 0, 128, 0.3)';
                this.editorCtx.beginPath();
                this.editorCtx.arc(0, 0, portalWidth * 0.75, 0, Math.PI * 2);
                this.editorCtx.fill();
                
                this.editorCtx.restore();
            });
        }
        
        // Draw player
        const pX = GameState.editorLevel.player.x * w;
        const pY = GameState.editorLevel.player.y * h;
        const isPlayerSelected = GameState.selectedObject?.type === 'player';
        this.editorCtx.fillStyle = GameConfig.COLORS.cyan;
        this.editorCtx.fillRect(pX - 5, pY - 5, 10, 10);
        this.editorCtx.strokeStyle = isPlayerSelected ? GameConfig.COLORS.yellow : GameConfig.COLORS.cyan;
        this.editorCtx.lineWidth = isPlayerSelected ? 3 : 2;
        this.editorCtx.strokeRect(pX - 5, pY - 5, 10, 10);
    },
    
    // Update editor UI
    updateEditorUI: function() {
        if (!GameState.editorLevel) return;
        
        const nameInput = document.getElementById('editorLevelName');
        const idInput = document.getElementById('editorLevelId');
        const gateCount = document.getElementById('gateCount');
        const cloudCount = document.getElementById('cloudCount');
        const lifeRestoreCount = document.getElementById('lifeRestoreCount');
        const barrierCount = document.getElementById('barrierCount');
        const settlementCount = document.getElementById('settlementCount');
        
        if (nameInput) nameInput.value = GameState.editorLevel.name;
        if (idInput) idInput.value = GameState.editorLevel.id || 'New';
        if (gateCount) gateCount.textContent = GameState.editorLevel.arcGates.length;
        if (cloudCount) cloudCount.textContent = GameState.editorLevel.slippageClouds.length;
        if (lifeRestoreCount) lifeRestoreCount.textContent = GameState.editorLevel.lifeRestores ? GameState.editorLevel.lifeRestores.length : 0;
        if (barrierCount) barrierCount.textContent = GameState.editorLevel.barriers ? GameState.editorLevel.barriers.length : 0;
        if (settlementCount) settlementCount.textContent = GameState.editorLevel.settlementZone ? 1 : 0;
    },
    
    // Save editor level
    saveEditorLevel: function() {
        if (!GameState.levelManager || !GameState.editorLevel) return;
        
        // Ensure settlement zone exists
        if (!GameState.editorLevel.settlementZone) {
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification('Please add a Settlement Zone before saving!', 3000);
            } else {
                alert('Please add a Settlement Zone before saving!');
            }
            return;
        }
        
        if (GameState.editorLevel.id) {
            // Update existing level
            GameState.levelManager.saveCustomLevel(GameState.editorLevel);
        } else {
            // Add new level (addLevel already adds to DEFAULT_LEVELS)
            GameState.editorLevel.id = GameState.levelManager.addLevel(GameState.editorLevel);
        }
        
        this.updateLevelSelect();
        if (typeof UI !== 'undefined' && UI.showNotification) {
            UI.showNotification('Level saved!', 2000);
        } else {
            alert('Level saved!');
        }
    },
    
    // Delete editor level
    deleteEditorLevel: function() {
        if (!GameState.levelManager || !GameState.editorLevel || !GameState.editorLevel.id) {
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification('Cannot delete: This is a new level or a default level.', 3000);
            } else {
                alert('Cannot delete: This is a new level or a default level.');
            }
            return;
        }
        
        if (confirm('Delete this level?')) {
            GameState.levelManager.deleteLevel(GameState.editorLevel.id);
            GameState.editorLevel = this.createNewEditorLevel();
            this.updateEditorUI();
            this.updateLevelSelect();
            this.renderEditor();
        }
    },
    
    // Load editor level
    loadEditorLevel: function() {
        const levelSelect = document.getElementById('levelSelect');
        if (!levelSelect || !GameState.levelManager) return;
        
        const selectedId = parseInt(levelSelect.value);
        if (selectedId) {
            const level = GameState.levelManager.getLevelById(selectedId);
            if (level) {
                GameState.editorLevel = JSON.parse(JSON.stringify(level)); // Deep copy
                // Ensure lifeRestores array exists
                if (!GameState.editorLevel.lifeRestores) {
                    GameState.editorLevel.lifeRestores = [];
                }
                this.updateEditorUI();
                this.renderEditor();
            }
        }
    },
    
    // Update level select dropdown
    updateLevelSelect: function() {
        const levelSelect = document.getElementById('levelSelect');
        if (!levelSelect || !GameState.levelManager) return;
        
        levelSelect.innerHTML = '';
        const allLevels = GameState.levelManager.getAllLevels();
        
        allLevels.forEach(level => {
            const option = document.createElement('option');
            option.value = level.id;
            option.textContent = `Level ${level.id}: ${level.name}`;
            levelSelect.appendChild(option);
        });
        
        if (GameState.editorLevel && GameState.editorLevel.id) {
            levelSelect.value = GameState.editorLevel.id;
        }
    },
    
    // Show export modal with DEFAULT_LEVELS code
    showExportModal: function() {
        if (typeof window.exportDEFAULT_LEVELS === 'function') {
            const code = window.exportDEFAULT_LEVELS();
            const modal = document.getElementById('exportModal');
            const textarea = document.getElementById('exportCode');
            
            if (modal && textarea) {
                textarea.value = code;
                modal.style.display = 'block';
            } else {
                // Fallback: show notification with code
                if (typeof UI !== 'undefined' && UI.showNotification) {
                    UI.showNotification('Export modal not found. Code logged to console.', 3000);
                    console.log('Export code:', code);
                } else {
                    alert('Export modal not found. Here is the code:\n\n' + code);
                }
            }
        } else {
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification('Export function not available. Make sure levels.js is loaded.', 3000);
            } else {
                alert('Export function not available. Make sure levels.js is loaded.');
            }
        }
    },
    
    // Submit level for approval
    submitLevel: function() {
        if (!GameState.editorLevel) {
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification('No level to submit!', 2000);
            } else {
                alert('No level to submit!');
            }
            return;
        }
        
        // Validate settlement zone exists
        if (!GameState.editorLevel.settlementZone) {
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification('Please add a Settlement Zone before submitting!', 3000);
            } else {
                alert('Please add a Settlement Zone before submitting!');
            }
            return;
        }
        
        // Validate at least one object exists
        const hasObjects = 
            (GameState.editorLevel.arcGates && GameState.editorLevel.arcGates.length > 0) ||
            (GameState.editorLevel.slippageClouds && GameState.editorLevel.slippageClouds.length > 0) ||
            (GameState.editorLevel.barriers && GameState.editorLevel.barriers.length > 0) ||
            (GameState.editorLevel.lifeRestores && GameState.editorLevel.lifeRestores.length > 0);
        
        if (!hasObjects) {
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification('Please add at least one object (gate, cloud, barrier, or life restore) before submitting!', 3000);
            } else {
                alert('Please add at least one object (gate, cloud, barrier, or life restore) before submitting!');
            }
            return;
        }
        
        // Prepare level data
        const levelData = {
            id: GameState.editorLevel.id || null,
            name: GameState.editorLevel.name || 'Unnamed Level',
            player: GameState.editorLevel.player,
            arcGates: GameState.editorLevel.arcGates || [],
            slippageClouds: GameState.editorLevel.slippageClouds || [],
            lifeRestores: GameState.editorLevel.lifeRestores || [],
            barriers: GameState.editorLevel.barriers || [],
            settlementZone: GameState.editorLevel.settlementZone
        };
        
        // Show loading notification
        if (typeof UI !== 'undefined' && UI.showNotification) {
            UI.showNotification('Submitting level...', 2000);
        }
        
        // Send to server
        fetch('/api/submit-level', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ level: levelData })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (typeof UI !== 'undefined' && UI.showNotification) {
                    UI.showNotification('Level submitted successfully! The developer will review it.', 4000);
                } else {
                    alert('Level submitted successfully! The developer will review it.');
                }
            } else {
                throw new Error(data.error || 'Failed to submit level');
            }
        })
        .catch(error => {
            console.error('Error submitting level:', error);
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification('Failed to submit level. Please try again later.', 3000);
            } else {
                alert('Failed to submit level. Please try again later.');
            }
        });
    },
    
    // Launch level for testing
    launchLevel: function() {
        if (!GameState.editorLevel) {
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification('No level to launch!', 2000);
            } else {
                alert('No level to launch!');
            }
            return;
        }
        
        // Ensure settlement zone exists
        if (!GameState.editorLevel.settlementZone) {
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification('Please add a Settlement Zone before launching!', 3000);
            } else {
                alert('Please add a Settlement Zone before launching!');
            }
            return;
        }
        
        // Save the level if it hasn't been saved yet
        if (!GameState.editorLevel.id) {
            if (!GameState.levelManager) {
                if (typeof UI !== 'undefined' && UI.showNotification) {
                    UI.showNotification('Level manager not initialized!', 3000);
                } else {
                    alert('Level manager not initialized!');
                }
                return;
            }
            // Save the level first
            GameState.editorLevel.id = GameState.levelManager.addLevel(GameState.editorLevel);
            this.updateLevelSelect();
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification('Level saved and launching...', 2000);
            }
        }
        
        // Store the editor state so we can return to it
        GameState.editorLevelBeforeLaunch = JSON.parse(JSON.stringify(GameState.editorLevel));
        
        // Get the level from the level manager (to ensure we have the latest saved version)
        const levelToLaunch = GameState.levelManager.getLevelById(GameState.editorLevel.id);
        if (!levelToLaunch) {
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification('Failed to load level for launch!', 3000);
            } else {
                alert('Failed to load level for launch!');
            }
            return;
        }
        
        // Set up test mode BEFORE hiding editor (so toggleEditor doesn't show menu)
        GameState.gameMode = 'test';
        GameState.immortalMode = true; // Use immortal mode mechanics (no lives)
        GameState.tournamentMode = false;
        GameState.gameState = 'aiming';
        
        // Hide editor (now that gameMode is 'test', it won't show menu)
        const editor = document.getElementById('levelEditor');
        if (editor) {
            editor.style.display = 'none';
        }
        GameState.editorMode = false;
        
        // Stop editor music
        if (typeof AudioManager !== 'undefined' && AudioManager.stopEditorMusic) {
            AudioManager.stopEditorMusic();
        }
        
        // Hide main menu if visible
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.classList.add('hidden');
        }
        
        // Reset game state
        GameState.resetGame();
        GameState.gameStartTime = Date.now();
        GameState.gameCompleted = false;
        GameState.levelScores = [];
        GameState.totalGatesPassed = 0;
        GameState.totalCloudsPassed = 0;
        GameState.totalBarriersHit = 0;
        
        // Play gameplay music
        if (typeof AudioManager !== 'undefined' && AudioManager.playGameplayMusic) {
            AudioManager.playGameplayMusic();
        }
        
        // Setup canvas
        if (typeof CanvasManager !== 'undefined' && CanvasManager.setupCanvas) {
            CanvasManager.setupCanvas(true);
        }
        
        // Load the level
        if (typeof GameObjects !== 'undefined' && GameObjects.loadLevel) {
            GameObjects.loadLevel(levelToLaunch);
        }
        
        // Initialize stars for the level
        if (typeof GameObjects !== 'undefined' && GameObjects.initStars) {
            GameObjects.initStars();
        }
        
        // Reset round
        if (typeof GameFlow !== 'undefined' && GameFlow.resetRound) {
            GameFlow.resetRound();
        }
        
        // Update UI
        if (typeof UI !== 'undefined' && UI.updateLevelUI) {
            UI.updateLevelUI();
        }
        
        // Show back to editor button
        const backToEditorBtn = document.getElementById('backToEditor');
        if (backToEditorBtn) {
            backToEditorBtn.style.display = 'block';
        }
        
        // Hide back to menu button
        const backToMenuBtn = document.getElementById('backToMenu');
        if (backToMenuBtn) {
            backToMenuBtn.style.display = 'none';
        }
        
        console.log('Level launched for testing:', levelToLaunch);
    },
    
    // Return to editor from test mode
    returnToEditor: function() {
        // Hide level summary if visible
        const summaryEl = document.getElementById('levelSummary');
        if (summaryEl) {
            summaryEl.style.display = 'none';
        }
        
        // Restore editor state
        if (GameState.editorLevelBeforeLaunch) {
            GameState.editorLevel = JSON.parse(JSON.stringify(GameState.editorLevelBeforeLaunch));
            GameState.editorLevelBeforeLaunch = null;
        }
        
        // Hide back to editor button
        const backToEditorBtn = document.getElementById('backToEditor');
        if (backToEditorBtn) {
            backToEditorBtn.style.display = 'none';
        }
        
        // Stop gameplay music
        if (typeof AudioManager !== 'undefined' && AudioManager.stopGameplayMusic) {
            AudioManager.stopGameplayMusic();
        }
        
        // Return to editor
        GameState.gameMode = 'editor';
        GameState.editorMode = true;
        GameState.immortalMode = false;
        GameState.tournamentMode = false;
        this.toggleEditor(true);
        
        // Update UI
        this.updateEditorUI();
        this.renderEditor();
        
        // Update level select to show the level we were testing
        this.updateLevelSelect();
    }
};




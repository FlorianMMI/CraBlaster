// Composant A-Frame : `pistolet-shooter`

// Variable globale pour savoir si la partie est en cours
let isGameRunning = false;

// Écouter les événements de jeu
if (typeof document !== 'undefined') {
	document.addEventListener('DOMContentLoaded', () => {
		const scene = document.querySelector('a-scene');
		if (scene) {
			scene.addEventListener('game-start', () => {
				isGameRunning = true;
				console.log('🔫 Blaster activé pour le jeu');
			});
			scene.addEventListener('game-end', () => {
				isGameRunning = false;
				console.log('🔫 Blaster désactivé (menu)');
			});
		}
	});
}

AFRAME.registerComponent('pistolet-shooter', {
	schema: {
		handSelector: { type: 'string', default: '#rightController' },
		modelId: { type: 'string', default: '#pistoletModel' },
		ammoSpeed: { type: 'number', default: 50 }, // units per second
		magazine: { type: 'int', default: 12 },
		damage: { type: 'number', default: 50 }, // 2 tirs pour tuer un ennemi (100 HP)
		explosionRadius: { type: 'number', default: 0.6 },
		reloadTime: { type: 'number', default: 1500 } // ms
	},

	init: function () {
		this.projectiles = [];
		this.canShoot = true;
		this.ammo = this.data.magazine;
		this.reloading = false;

		// Create model entity (will be attached once hand is available)
		this.modelEl = document.createElement('a-entity');
		this.modelEl.setAttribute('gltf-model', this.data.modelId);
		this.modelEl.setAttribute('scale', '1 1 1');
		// Default offset so the gun sits on the right side of the controller
		this.modelEl.setAttribute('position', '0.05 -0.05 -0.05');
		this.modelEl.setAttribute('rotation', '0 0 90');

		// Detect VR vs PC. On PC attach the gun to the camera so it appears in front/right of the player.
		this._isVR = AFRAME && AFRAME.utils && AFRAME.utils.device && AFRAME.utils.device.isMobileVR && AFRAME.utils.device.isMobileVR();

		if (!this._isVR) {
			// Attach to camera for desktop so it stays near the view (right-hand offset)
			const cam = document.querySelector('[camera]') || document.querySelector('#rig a-entity[camera]');
			if (cam) {
				this.hand = cam;
				// set a more visible offset for desktop (right and down)
				this.modelEl.setAttribute('position', '0.35 -0.4 -0.6');
				this.modelEl.setAttribute('rotation', '0 90 -10');
				this.modelEl.setAttribute('scale', '0.8 0.8 0.8');
				this.hand.appendChild(this.modelEl);
			} else {
				// fallback: attach to default selector
				this.hand = document.querySelector(this.data.handSelector) || this.el;
				this.hand.appendChild(this.modelEl);
			}

			// For PC (non-VR), support left-click and right-click to shoot
			this.shootHandler = this.shoot.bind(this);
			// Right-click (contextmenu) preserved
			window.addEventListener('contextmenu', this._onContext = (e) => {
				e.preventDefault();
				this.shootHandler();
			});
			// Left-click (primary button) — ignore clicks on UI elements with class 'clickable'
			window.addEventListener('mousedown', this._onLeft = (e) => {
				if (e.button !== 0) return;
				const target = e.target;
				if (target && target.classList && target.classList.contains('clickable')) return;
				this.shootHandler();
			});
			// reload with middle click as convenience
			window.addEventListener('auxclick', this._onAux = (e) => {
				if (e.button === 1) this.reload();
			});
		} else {
			// VR: attach to controller (may not exist yet)
			this.hand = document.querySelector(this.data.handSelector);
			if (this.hand) {
				this.hand.appendChild(this.modelEl);
			} else {
				this._onSceneLoaded = () => {
					this.hand = document.querySelector(this.data.handSelector) || this.el;
					if (this.hand) this.hand.appendChild(this.modelEl);
				};
				document.addEventListener('DOMContentLoaded', this._onSceneLoaded);
				this._attachInterval = setInterval(() => {
					if (!this.hand) {
						this.hand = document.querySelector(this.data.handSelector);
						if (this.hand) {
							this.hand.appendChild(this.modelEl);
							clearInterval(this._attachInterval);
						}
					}
				}, 200);
			}

			// VR controller events
			this.shootHandler = this.shoot.bind(this);
			this.reloadHandler = this.reload.bind(this);
			if (this.hand && this.hand.addEventListener) {
				this.hand.addEventListener('triggerdown', this.shootHandler);
				this.hand.addEventListener('gripdown', this.reloadHandler);
			}
		}

		// Expose API on element
		this.el.setPistolet = (v) => { this.data.ammoSpeed = v; };
		this.el.reloadPistolet = () => this.reload();

		// prepare shooting sound (asset in index2.html)
		this.shootSound = document.querySelector('#pioupiou') || null;

		this.dir = new THREE.Vector3();
	},

	shoot: function () {
		// Ne pas tirer si la partie n'est pas en cours (menu start/end)
		if (!isGameRunning) return;
		
		if (!this.canShoot || this.reloading) return;
		if (this.ammo <= 0) {
			this.reload();
			return;
		}
		this.ammo -= 1;

		// create projectile (neon blue)
		const proj = document.createElement('a-entity');
        proj.setAttribute('geometry', 'primitive: cylinder; radius: 0.03; height: 0.25');
		proj.setAttribute('material', 'color: #00e6ff; emissive: #00e6ff; metalness: 0.1; roughness: 0.1; shader: standard');
		proj.object3D.userData = { velocity: new THREE.Vector3() };

		// Determine forward direction from the controller or model
		const refObj = (this.hand && this.hand.object3D) ? this.hand.object3D : (this.modelEl && this.modelEl.object3D);
		const spawnPos = new THREE.Vector3();
		if (refObj) {
						// Prefer aiming with the player's camera direction so bullets follow where the player looks (PC)
						const camEl = document.querySelector('[camera]');
						let aimDir = new THREE.Vector3();
						if (camEl && camEl.object3D) {
							// Use the camera's forward direction directly for aiming
							const camDir = new THREE.Vector3();
							camEl.object3D.getWorldDirection(camDir);
							camDir.normalize();
							// getWorldDirection returns the camera's look vector; invert if bullets spawn behind
							camDir.negate();
							// get muzzle/world spawn position
							if (this.modelEl && this.modelEl.object3D) {
								this.modelEl.object3D.getWorldPosition(spawnPos);
							} else {
								refObj.getWorldPosition(spawnPos);
							}
							// spawn slightly in front of muzzle along camera direction
							spawnPos.addScaledVector(camDir, 0.25);
							proj.setAttribute('position', `${spawnPos.x} ${spawnPos.y} ${spawnPos.z}`);
							proj.object3D.userData.velocity.copy(camDir).multiplyScalar(this.data.ammoSpeed);
							// orient projectile so it visually points along velocity
							const up = new THREE.Vector3(0, 1, 0);
							const quat = new THREE.Quaternion().setFromUnitVectors(up, camDir.clone().normalize());
							proj.object3D.quaternion.copy(quat);
						} else {
							// Fallback: use object's forward (controller) orientation
							const worldQuat = new THREE.Quaternion();
							refObj.getWorldQuaternion(worldQuat);
							const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(worldQuat).normalize();
							this.dir.copy(forward);
							if (this.modelEl && this.modelEl.object3D) {
								this.modelEl.object3D.getWorldPosition(spawnPos);
							} else {
								refObj.getWorldPosition(spawnPos);
							}
							spawnPos.addScaledVector(this.dir, 0.25);
							proj.setAttribute('position', `${spawnPos.x} ${spawnPos.y} ${spawnPos.z}`);
							proj.object3D.userData.velocity.copy(this.dir).multiplyScalar(this.data.ammoSpeed);
							const up = new THREE.Vector3(0, 1, 0);
							const quat = new THREE.Quaternion().setFromUnitVectors(up, this.dir.clone().normalize());
							proj.object3D.quaternion.copy(quat);
						}
		} else {
			// fallback to previous method
			proj.setAttribute('position', this._getWorldPosition());
		}

		this.el.sceneEl.appendChild(proj);
		// store previous position for raycast collision checks
		const prev = new THREE.Vector3();
		proj.object3D.getWorldPosition(prev);
		proj.object3D.userData.damage = this.data.damage;
		this.projectiles.push({ el: proj, life: 3000, prevPos: prev }); // life in ms

		// Play shooting sound for ~1s (clone node to allow overlap)
		if (this.shootSound && this.el.sceneEl) {
			try {
				const s = this.shootSound.cloneNode();
				this.el.sceneEl.appendChild(s);
				const playPromise = s.play();
				if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
				setTimeout(() => {
					try { s.pause(); s.currentTime = 0; } catch (e) {}
					if (s.parentNode) s.parentNode.removeChild(s);
				}, 600);
			} catch (e) { /* ignore sound errors */ }
		}

		// small cooldown to avoid flooding
		this.canShoot = false;
		setTimeout(() => { this.canShoot = true; }, 100);
	},

	_getWorldPosition: function () {
		const worldPos = new THREE.Vector3();
		const ref = (this.modelEl && this.modelEl.object3D && this.modelEl.object3D.children.length) ? this.modelEl.object3D : (this.hand && this.hand.object3D);
		if (ref) ref.getWorldPosition(worldPos);
		return `${worldPos.x} ${worldPos.y} ${worldPos.z}`;
	},

	reload: function () {
		if (this.reloading) return;
		this.reloading = true;
		
		// Jouer le son de rechargement (air)
		const airSound = document.querySelector('#air');
		if (airSound) {
			const soundClone = airSound.cloneNode();
			soundClone.play().catch(() => {});
		}
		
		// Créer un effet de fumée lors du rechargement avec des sphères
		const refObj = (this.hand && this.hand.object3D) ? this.hand.object3D : (this.modelEl && this.modelEl.object3D);
		const spawnPos = new THREE.Vector3();
		
		if (refObj) {
			if (this.modelEl && this.modelEl.object3D) {
				this.modelEl.object3D.getWorldPosition(spawnPos);
			} else {
				refObj.getWorldPosition(spawnPos);
			}
			
			// Créer plusieurs sphères de fumée
			for (let i = 0; i < 15; i++) {
				setTimeout(() => {
					const smoke = document.createElement('a-sphere');
					const offsetX = (Math.random() - 0.5) * 0.3;
					const offsetZ = (Math.random() - 0.5) * 0.3;
					
					smoke.setAttribute('position', `${spawnPos.x + offsetX} ${spawnPos.y} ${spawnPos.z + offsetZ}`);
					smoke.setAttribute('radius', '0.1');
					smoke.setAttribute('color', '#CCCCCC');
					smoke.setAttribute('material', 'shader: flat; opacity: 0.6; transparent: true');
					
					// Animation montante et expansion
					smoke.setAttribute('animation__move', {
						property: 'position',
						to: `${spawnPos.x + offsetX} ${spawnPos.y + 1.5} ${spawnPos.z + offsetZ}`,
						dur: 1000,
						easing: 'easeOutQuad'
					});
					
					smoke.setAttribute('animation__scale', {
						property: 'scale',
						from: '0.5 0.5 0.5',
						to: '2 2 2',
						dur: 1000,
						easing: 'easeOutQuad'
					});
					
					smoke.setAttribute('animation__fade', {
						property: 'material.opacity',
						from: 0.6,
						to: 0,
						dur: 1000,
						easing: 'easeInQuad'
					});
					
					this.el.sceneEl.appendChild(smoke);
					
					// Supprimer la fumée après l'animation
					setTimeout(() => {
						if (smoke.parentNode) {
							smoke.parentNode.removeChild(smoke);
						}
					}, 1100);
				}, i * 50); // Décalage pour effet progressif
			}
			
			console.log('💨 Rechargement en cours avec effet de fumée...');
		}
		
		setTimeout(() => {
			this.ammo = this.data.magazine;
			this.reloading = false;
			console.log('🔄 Rechargement terminé!');
		}, this.data.reloadTime);
	},

	tick: function (time, delta) {
		const dt = delta / 1000; // seconds
		// Update projectiles
		for (let i = this.projectiles.length - 1; i >= 0; i--) {
			const p = this.projectiles[i];
			const obj = p.el.object3D;
			const vel = obj.userData.velocity;
			if (!vel) continue;
			
			// Sauvegarder la position actuelle pour le raycast
			const currentPos = obj.position.clone();
			
			// Mettre à jour la position
			obj.position.addScaledVector(vel, dt);
			
			// Détecter les collisions avec les ennemis
			const raycaster = new THREE.Raycaster();
			const direction = obj.position.clone().sub(currentPos).normalize();
			const distance = obj.position.distanceTo(currentPos);
			
			raycaster.set(currentPos, direction);
			
			// Chercher tous les ennemis dans la scène
			const enemies = document.querySelectorAll('[data-tag="enemy"]');
			let hit = false;
			
			for (let enemy of enemies) {
				if (!enemy.object3D) continue;
				
				const intersects = raycaster.intersectObject(enemy.object3D, true);
				
				if (intersects.length > 0 && intersects[0].distance <= distance) {
					// Collision détectée!
					hit = true;
					const enemyId = enemy.id;
					const damage = obj.userData.damage || this.data.damage;
					
					// Importer et appeler damageEnemy
					import('../enemyBehavior.js').then(module => {
						const remainingHealth = module.damageEnemy(enemyId, damage);
						console.log(`🎯 Balle a touché ${enemyId} pour ${damage} dégâts!`);
						
						// Ajouter du score
						import('../game.js').then(gameModule => {
							if (remainingHealth === 0) {
								gameModule.addScore(100); // Ennemi tué
							} else {
								gameModule.addScore(10); // Ennemi touché
							}
						});
					});
					
					break;
				}
			}
			
			// Supprimer le projectile s'il a touché ou si sa durée de vie est écoulée
			p.life -= delta;
			if (hit || p.life <= 0) {
				p.el.parentNode && p.el.parentNode.removeChild(p.el);
				this.projectiles.splice(i, 1);
			}
		}
	},

	remove: function () {
		// cleanup
		this.projectiles.forEach(p => { p.el.parentNode && p.el.parentNode.removeChild(p.el); });
		this.projectiles = [];
		if (this.modelEl && this.modelEl.parentNode) this.modelEl.parentNode.removeChild(this.modelEl);
		if (this.hand && this.hand.removeEventListener) {
			this.hand.removeEventListener('triggerdown', this.shootHandler);
			this.hand.removeEventListener('gripdown', this.reloadHandler);
		}
		if (this._onSceneLoaded) document.removeEventListener('DOMContentLoaded', this._onSceneLoaded);
		if (this._attachInterval) clearInterval(this._attachInterval);
		if (this._onContext) window.removeEventListener('contextmenu', this._onContext);
	}
});

// Helper: attach pistol to rightController automatically by adding the component to the scene
// DÉSACTIVÉ - Le pistolet est maintenant géré par la roue d'armes (weapons.js)
// document.addEventListener('DOMContentLoaded', () => {
// 	const scene = document.querySelector('a-scene');
// 	if (!scene) return;
// 	if (!document.querySelector('[pistolet-shooter]')) {
// 		const gunHolder = document.createElement('a-entity');
// 		gunHolder.setAttribute('pistolet-shooter', '');
// 		scene.appendChild(gunHolder);
// 	}
// });

// Système de roue d'armes pour CraBlaster
// Modulable et extensible pour ajouter facilement de nouvelles armes

// Registre des armes disponibles
const weaponRegistry = {
    sabre: {
        name: 'Sabre Laser',
        icon: '⚔️', // Emoji ou pourrait être remplacé par une image
        color: '#00e6ff',
        initFunction: null, // Sera défini lors de l'import
        activeEntity: null
    },
    pistolet: {
        name: 'Pistolet',
        icon: '🔫',
        color: '#ff6600',
        initFunction: null,
        activeEntity: null
    }
    // Facile d'ajouter d'autres armes ici:
    // fusil: { name: 'Fusil', icon: '🎯', color: '#ff0000', initFunction: null, activeEntity: null }
};

let currentWeapon = null;
let weaponWheelVisible = false;

// Composant A-Frame pour la roue d'armes
AFRAME.registerComponent('weapon-wheel', {
    schema: {
        radius: { type: 'number', default: 0.8 },
        position: { type: 'vec3', default: { x: 0, y: 0, z: -1.5 } }
    },

    init: function () {
        this.isVR = AFRAME.utils.device.isMobileVR();
        this.wheelContainer = null;
        this.weaponSlots = [];
        this.selectedSlot = null;
        this.lastHoveredSlot = null;
        
        // Pour la détection à la souris (position 2D)
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Créer la roue (initialement cachée)
        this.createWheel();
        
        // Événements pour ouvrir/fermer la roue
        this.toggleWheel = this.toggleWheel.bind(this);
        this.selectWeapon = this.selectWeapon.bind(this);
        
        if (!this.isVR) {
            // PC: Tab pour ouvrir/fermer
            document.addEventListener('keydown', (evt) => {
                if (evt.key === 'Tab') {
                    evt.preventDefault();
                    this.toggleWheel();
                }
            });
            
            // PC: Suivre la position de la souris
            this._mouseMoveHandler = (evt) => {
                if (weaponWheelVisible) {
                    this.mouseX = (evt.clientX / window.innerWidth) * 2 - 1;
                    this.mouseY = -(evt.clientY / window.innerHeight) * 2 + 1;
                }
            };
            window.addEventListener('mousemove', this._mouseMoveHandler);
            
            // PC: Clic pour sélectionner l'arme visée
            this._clickHandler = (evt) => {
                if (weaponWheelVisible && this.hoveredSlot) {
                    const weaponKey = this.hoveredSlot.getAttribute('data-weapon');
                    console.log('Click - selecting weapon:', weaponKey);
                    this.selectWeapon(weaponKey);
                }
            };
            window.addEventListener('click', this._clickHandler);
        } else {
            // VR: Gâchette gauche pour ouvrir (grip déjà utilisé pour reload)
            const leftController = document.querySelector('#leftController');
            if (leftController) {
                leftController.addEventListener('gripdown', this.toggleWheel);
            }
        }
    },

    createWheel: function () {
        const camera = document.querySelector('[camera]');
        if (!camera) return;

        // Conteneur principal de la roue
        this.wheelContainer = document.createElement('a-entity');
        this.wheelContainer.setAttribute('id', 'weapon-wheel-container');
        this.wheelContainer.setAttribute('visible', 'false');
        
        // Positionner devant la caméra
        this.wheelContainer.setAttribute('position', this.data.position);
        
        // Fond circulaire principal (noir avec gradient)
        const backgroundOuter = document.createElement('a-circle');
        backgroundOuter.setAttribute('radius', this.data.radius);
        backgroundOuter.setAttribute('color', '#0a0a0a');
        backgroundOuter.setAttribute('opacity', '0.85');
        backgroundOuter.setAttribute('position', '0 0 -0.02');
        this.wheelContainer.appendChild(backgroundOuter);
        
        // Cercle intérieur (plus clair)
        const backgroundInner = document.createElement('a-circle');
        backgroundInner.setAttribute('radius', this.data.radius * 0.85);
        backgroundInner.setAttribute('color', '#1a1a1a');
        backgroundInner.setAttribute('opacity', '0.9');
        backgroundInner.setAttribute('position', '0 0 -0.01');
        this.wheelContainer.appendChild(backgroundInner);
        
        // Centre de la roue (indicateur)
        const centerCircle = document.createElement('a-circle');
        centerCircle.setAttribute('radius', '0.12');
        centerCircle.setAttribute('color', '#FFFFFF');
        centerCircle.setAttribute('opacity', '0.3');
        centerCircle.setAttribute('position', '0 0 0.01');
        this.wheelContainer.appendChild(centerCircle);
        
        // Texte central
        const centerText = document.createElement('a-text');
        centerText.setAttribute('value', 'ARMES');
        centerText.setAttribute('align', 'center');
        centerText.setAttribute('width', '0.5');
        centerText.setAttribute('position', '0 0 0.02');
        centerText.setAttribute('color', '#FFFFFF');
        centerText.setAttribute('opacity', '0.6');
        this.wheelContainer.appendChild(centerText);

        // Créer les slots pour chaque arme
        const weapons = Object.keys(weaponRegistry);
        const angleStep = (2 * Math.PI) / weapons.length;
        
        weapons.forEach((weaponKey, index) => {
            const weapon = weaponRegistry[weaponKey];
            const angle = index * angleStep - Math.PI / 2; // Commencer en haut
            const slotRadius = this.data.radius * 0.5;
            
            const x = Math.cos(angle) * slotRadius;
            const y = Math.sin(angle) * slotRadius;
            
            // Conteneur pour le slot (pour grouper tous les éléments)
            const slotContainer = document.createElement('a-entity');
            slotContainer.setAttribute('position', `${x} ${y} 0`);
            
            // Fond du slot (cercle de fond)
            const slotBg = document.createElement('a-circle');
            slotBg.setAttribute('radius', '0.22');
            slotBg.setAttribute('color', '#2a2a2a');
            slotBg.setAttribute('opacity', '0.6');
            slotBg.setAttribute('position', '0 0 0');
            slotContainer.appendChild(slotBg);
            
            // Cercle de couleur de l'arme (derrière l'icône)
            const colorCircle = document.createElement('a-circle');
            colorCircle.setAttribute('radius', '0.18');
            colorCircle.setAttribute('color', weapon.color);
            colorCircle.setAttribute('opacity', '0.4');
            colorCircle.setAttribute('position', '0 0 0.001');
            slotContainer.appendChild(colorCircle);
            
            // Slot d'arme principal (cercle cliquable)
            const slot = document.createElement('a-circle');
            slot.setAttribute('radius', '0.15');
            slot.setAttribute('color', weapon.color);
            slot.setAttribute('opacity', '0.7');
            slot.setAttribute('position', '0 0 0.002');
            slot.setAttribute('class', 'weapon-slot clickable');
            slot.setAttribute('data-weapon', weaponKey);
            slotContainer.appendChild(slot);
            
            // Contour blanc (highlight) - initialement invisible
            const whiteOutline = document.createElement('a-ring');
            whiteOutline.setAttribute('radius-inner', '0.16');
            whiteOutline.setAttribute('radius-outer', '0.20');
            whiteOutline.setAttribute('color', '#FFFFFF');
            whiteOutline.setAttribute('opacity', '0');
            whiteOutline.setAttribute('position', '0 0 0.003');
            whiteOutline.setAttribute('class', 'weapon-outline');
            slotContainer.appendChild(whiteOutline);
            
            // Icône de l'arme
            const icon = document.createElement('a-text');
            icon.setAttribute('value', weapon.icon);
            icon.setAttribute('align', 'center');
            icon.setAttribute('width', '1');
            icon.setAttribute('position', '0 0.02 0.004');
            icon.setAttribute('color', '#FFFFFF');
            slotContainer.appendChild(icon);
            
            // Nom de l'arme
            const nameLabel = document.createElement('a-text');
            nameLabel.setAttribute('value', weapon.name);
            nameLabel.setAttribute('align', 'center');
            nameLabel.setAttribute('width', '0.35');
            nameLabel.setAttribute('position', '0 -0.18 0.004');
            nameLabel.setAttribute('color', '#CCCCCC');
            nameLabel.setAttribute('opacity', '0.8');
            slotContainer.appendChild(nameLabel);
            
            // Événement de clic A-Frame
            slot.addEventListener('click', () => {
                console.log('Slot clicked:', weaponKey);
                this.selectWeapon(weaponKey);
            });
            
            // Événement mousedown (plus fiable que click)
            slot.addEventListener('mousedown', () => {
                console.log('Slot mousedown:', weaponKey);
                this.selectWeapon(weaponKey);
            });
            
            // Événement de raycaster (pour VR uniquement)
            if (this.isVR) {
                slot.addEventListener('raycaster-intersected', (evt) => {
                    console.log('VR Raycaster intersected:', weaponKey);
                    this.hoveredSlot = slot;
                    
                    // Animation du contour blanc (GTA style)
                    whiteOutline.setAttribute('animation__fadein', {
                        property: 'opacity',
                        to: '1',
                        dur: 150,
                        easing: 'easeOutQuad'
                    });
                    
                    // Agrandir légèrement le slot
                    slotContainer.setAttribute('animation__scale', {
                        property: 'scale',
                        to: '1.15 1.15 1.15',
                        dur: 150,
                        easing: 'easeOutQuad'
                    });
                    
                    // Effet glow sur la couleur
                    colorCircle.setAttribute('animation__glow', {
                        property: 'opacity',
                        to: '0.8',
                        dur: 150,
                        easing: 'easeOutQuad'
                    });
                    
                    // Rotation subtile du contour
                    whiteOutline.setAttribute('animation__rotate', {
                        property: 'rotation',
                        to: '0 0 360',
                        dur: 2000,
                        loop: true,
                        easing: 'linear'
                    });
                });
                
                slot.addEventListener('raycaster-intersected-cleared', () => {
                    if (this.hoveredSlot === slot) {
                        this.hoveredSlot = null;
                    }
                    
                    // Ne pas cacher le contour si c'est l'arme actuelle
                    if (currentWeapon !== weaponKey) {
                        whiteOutline.setAttribute('animation__fadeout', {
                            property: 'opacity',
                            to: '0',
                            dur: 200,
                            easing: 'easeInQuad'
                        });
                    }
                    
                    // Retour à la taille normale
                    slotContainer.setAttribute('animation__scaledown', {
                        property: 'scale',
                        to: '1 1 1',
                        dur: 200,
                        easing: 'easeInQuad'
                    });
                    
                    // Retour opacité normale
                    colorCircle.setAttribute('animation__unglow', {
                        property: 'opacity',
                        to: '0.4',
                        dur: 200,
                        easing: 'easeInQuad'
                    });
                    
                    // Arrêter la rotation
                    whiteOutline.removeAttribute('animation__rotate');
                });
            }
            
            // Survol PC - désactivé car on utilise le raycasting de la tête
            // Le tick() s'occupera de la détection
            
            this.wheelContainer.appendChild(slotContainer);
            
            this.weaponSlots.push({ 
                element: slot, 
                weaponKey: weaponKey,
                container: slotContainer,
                outline: whiteOutline,
                colorCircle: colorCircle
            });
        });
        
        camera.appendChild(this.wheelContainer);
        
        // En VR, configurer le raycaster des contrôleurs
        if (this.isVR) {
            const rightController = document.querySelector('#rightController');
            if (rightController) {
                // Le raycaster est déjà configuré sur le contrôleur dans index2.html
            }
        }
    },

    tick: function (time, delta) {
        // Sur PC : Détecter l'arme visée par la position de la souris à l'écran
        if (!this.isVR && weaponWheelVisible && this.wheelContainer) {
            const camera = document.querySelector('[camera]');
            if (!camera || !camera.components.camera) return;
            
            // Obtenir la caméra THREE.js
            const threeCamera = camera.components.camera.camera;
            
            // Convertir la position de la souris en coordonnées 3D
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(this.mouseX, this.mouseY);
            raycaster.setFromCamera(mouse, threeCamera);
            
            // Tester les intersections avec tous les slots
            let closestSlot = null;
            let closestDistance = Infinity;
            
            this.weaponSlots.forEach(slotData => {
                // Créer une zone de clic invisible pour le slot
                const slotObj = slotData.element.object3D;
                
                // Intersections avec le mesh du slot
                const intersects = raycaster.intersectObject(slotObj, true);
                
                if (intersects.length > 0 && intersects[0].distance < closestDistance) {
                    closestDistance = intersects[0].distance;
                    closestSlot = slotData;
                }
            });
            
            // Mettre à jour le slot survolé
            if (closestSlot && closestSlot !== this.lastHoveredSlot) {
                // Désactiver l'ancien slot survolé
                if (this.lastHoveredSlot) {
                    const oldWeaponKey = this.lastHoveredSlot.weaponKey;
                    if (currentWeapon !== oldWeaponKey) {
                        this.lastHoveredSlot.outline.setAttribute('opacity', '0');
                    }
                    this.lastHoveredSlot.container.setAttribute('scale', '1 1 1');
                    this.lastHoveredSlot.colorCircle.setAttribute('opacity', '0.4');
                    this.lastHoveredSlot.outline.removeAttribute('animation__rotate');
                }
                
                // Activer le nouveau slot
                this.hoveredSlot = closestSlot.element;
                this.lastHoveredSlot = closestSlot;
                
                console.log('Mouse hovering:', closestSlot.weaponKey);
                
                // Animations GTA style
                closestSlot.outline.setAttribute('opacity', '1');
                closestSlot.container.setAttribute('scale', '1.15 1.15 1.15');
                closestSlot.colorCircle.setAttribute('opacity', '0.8');
                
                // Rotation du contour
                closestSlot.outline.setAttribute('animation__rotate', {
                    property: 'rotation',
                    to: '0 0 360',
                    dur: 2000,
                    loop: true,
                    easing: 'linear'
                });
            } else if (!closestSlot && this.lastHoveredSlot) {
                // Aucun slot visé : désactiver le dernier
                const oldWeaponKey = this.lastHoveredSlot.weaponKey;
                if (currentWeapon !== oldWeaponKey) {
                    this.lastHoveredSlot.outline.setAttribute('opacity', '0');
                }
                this.lastHoveredSlot.container.setAttribute('scale', '1 1 1');
                this.lastHoveredSlot.colorCircle.setAttribute('opacity', '0.4');
                this.lastHoveredSlot.outline.removeAttribute('animation__rotate');
                
                this.lastHoveredSlot = null;
                this.hoveredSlot = null;
            }
        }
    },

    toggleWheel: function () {
        weaponWheelVisible = !weaponWheelVisible;
        
        if (this.wheelContainer) {
            this.wheelContainer.setAttribute('visible', weaponWheelVisible);
            
            // Animation d'apparition/disparition
            if (weaponWheelVisible) {
                // Apparition avec zoom et rotation
                this.wheelContainer.setAttribute('animation__scale', {
                    property: 'scale',
                    from: '0.3 0.3 0.3',
                    to: '1 1 1',
                    dur: 250,
                    easing: 'easeOutBack'
                });
                this.wheelContainer.setAttribute('animation__rotate', {
                    property: 'rotation',
                    from: '0 0 -90',
                    to: '0 0 0',
                    dur: 250,
                    easing: 'easeOutQuad'
                });
                
                // PC : Désactiver le pointer lock pour pouvoir utiliser la souris
                if (!this.isVR && document.pointerLockElement) {
                    document.exitPointerLock();
                }
            } else {
                // Disparition avec zoom inverse
                this.wheelContainer.setAttribute('animation__scaleout', {
                    property: 'scale',
                    to: '0.3 0.3 0.3',
                    dur: 200,
                    easing: 'easeInBack'
                });
                // Remettre à l'échelle normale après l'animation pour la prochaine ouverture
                setTimeout(() => {
                    if (!weaponWheelVisible) {
                        this.wheelContainer.object3D.scale.set(1, 1, 1);
                    }
                }, 200);
            }
        }
        
        // Pause le jeu quand la roue est ouverte (optionnel)
        // Désactiver les contrôles de mouvement
        const rig = document.querySelector('#rig');
        if (rig) {
            const movementControls = rig.components['movement-controls'];
            if (movementControls) {
                movementControls.data.enabled = !weaponWheelVisible;
            }
        }
    },

    selectWeapon: function (weaponKey) {
        console.log('Arme sélectionnée:', weaponKey);
        
        // Désactiver l'arme actuelle
        if (currentWeapon) {
            this.deactivateWeapon(currentWeapon);
        }
        
        // Activer la nouvelle arme
        this.activateWeapon(weaponKey);
        currentWeapon = weaponKey;
        
        // Fermer la roue après sélection
        this.toggleWheel();
        
        // Feedback visuel - Marquer l'arme active avec le contour blanc
        this.weaponSlots.forEach(slot => {
            if (slot.weaponKey === weaponKey) {
                // Arme sélectionnée : contour blanc permanent
                slot.outline.setAttribute('opacity', '1');
                slot.outline.setAttribute('animation__pulse', {
                    property: 'opacity',
                    from: '0.7',
                    to: '1',
                    dur: 1000,
                    dir: 'alternate',
                    loop: true,
                    easing: 'easeInOutQuad'
                });
                slot.colorCircle.setAttribute('opacity', '0.8');
                
                // Effet émissif
                slot.element.setAttribute('material', {
                    emissive: weaponRegistry[weaponKey].color,
                    emissiveIntensity: 0.6
                });
            } else {
                // Autres armes : retirer le highlight
                slot.outline.setAttribute('opacity', '0');
                slot.outline.removeAttribute('animation__pulse');
                slot.colorCircle.setAttribute('opacity', '0.4');
                
                slot.element.setAttribute('material', {
                    emissive: '#000000',
                    emissiveIntensity: 0
                });
            }
        });
    },

    activateWeapon: function (weaponKey) {
        const weapon = weaponRegistry[weaponKey];
        if (!weapon) return;
        
        console.log('Activation de', weapon.name);
        
        // Vérifier si l'arme existe déjà dans la scène
        if (weaponKey === 'sabre') {
            let sabre = document.querySelector('#sabre');
            if (sabre) {
                // L'arme existe déjà, juste s'assurer qu'elle est visible
                console.log('Sabre déjà présent, réutilisation');
                weapon.activeEntity = sabre;
                return;
            }
            
            // Créer le sabre
            import('./sabre.js').then(module => {
                module.initSabre();
                // Attendre un peu pour que le DOM soit mis à jour
                setTimeout(() => {
                    weapon.activeEntity = document.querySelector('#sabre');
                    console.log('Sabre créé et stocké');
                }, 100);
            });
        } else if (weaponKey === 'pistolet') {
            let gunComponent = document.querySelector('[pistolet-shooter]');
            if (gunComponent) {
                // Le composant existe déjà
                console.log('Pistolet déjà présent, réutilisation');
                weapon.activeEntity = gunComponent;
                return;
            }
            
            // Créer le pistolet
            const scene = document.querySelector('a-scene');
            gunComponent = document.createElement('a-entity');
            gunComponent.setAttribute('id', 'active-pistol');
            gunComponent.setAttribute('pistolet-shooter', '');
            scene.appendChild(gunComponent);
            
            // Attendre que le composant soit initialisé
            setTimeout(() => {
                weapon.activeEntity = gunComponent;
                console.log('Pistolet créé et attaché');
                
                // Vérifier que le modèle est bien visible
                const pistolModel = gunComponent.querySelector('[gltf-model]');
                if (pistolModel) {
                    console.log('Modèle du pistolet trouvé et visible');
                } else {
                    console.warn('Modèle du pistolet non trouvé!');
                }
            }, 100);
        }
        // Ajouter d'autres armes ici facilement:
        // else if (weaponKey === 'fusil') { ... }
    },

    deactivateWeapon: function (weaponKey) {
        const weapon = weaponRegistry[weaponKey];
        if (!weapon) return;
        
        console.log('Désactivation de', weapon.name);
        
        // Cacher l'arme au lieu de la détruire (pour pouvoir la réactiver rapidement)
        if (weaponKey === 'sabre') {
            const sabre = document.querySelector('#sabre');
            if (sabre && sabre.parentNode) {
                sabre.parentNode.removeChild(sabre);
                weapon.activeEntity = null;
            }
        } else if (weaponKey === 'pistolet') {
            const gunComponent = document.querySelector('[pistolet-shooter]');
            if (gunComponent && gunComponent.parentNode) {
                gunComponent.parentNode.removeChild(gunComponent);
                weapon.activeEntity = null;
            }
        }
    }
});

// Initialiser la roue d'armes au chargement de la scène
export function initWeaponWheel() {
    const scene = document.querySelector('a-scene');
    if (!scene) {
        console.error('Scene not found');
        return;
    }
    
    // Créer l'entité qui gère la roue d'armes
    const wheelManager = document.createElement('a-entity');
    wheelManager.setAttribute('weapon-wheel', '');
    scene.appendChild(wheelManager);
    
    console.log('Weapon wheel initialized');
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que la scène soit chargée
    const scene = document.querySelector('a-scene');
    if (scene.hasLoaded) {
        initWeaponWheel();
    } else {
        scene.addEventListener('loaded', initWeaponWheel);
    }
});

// API publique pour ajouter facilement de nouvelles armes
export function registerWeapon(key, weaponData) {
    weaponRegistry[key] = {
        name: weaponData.name || key,
        icon: weaponData.icon || '❓',
        color: weaponData.color || '#FFFFFF',
        initFunction: weaponData.initFunction || null,
        activeEntity: null
    };
    console.log(`Arme "${weaponData.name}" enregistrée`);
}

export { weaponRegistry, currentWeapon };

// Système de sabre laser pour CraBlaster
export function initSabre() {
    let scene = document.querySelector('a-scene');
    let isVR = AFRAME.utils.device.isMobileVR();
    let sabre = document.createElement('a-entity');
    sabre.setAttribute('id', 'sabre');
    
    if (isVR) {
        // Mode VR : attacher le sabre à la main droite
        let rightController = document.querySelector('#rightController');
        sabre.setAttribute('gltf-model', '#sabre');
        sabre.setAttribute('position', '0 0 -0.15');
        sabre.setAttribute('rotation', '-90 0 0');
        sabre.setAttribute('scale', '4 4 4');
        
        rightController.appendChild(sabre);
        
        // Son de sabre (à activer quand l'asset audio sera ajouté)
        rightController.addEventListener('triggerdown', () => {
            let sabreSound = document.querySelector('#sabre-sound');
            if (sabreSound) sabreSound.play();
        });
        
    } else {
        // Mode PC : positionner le sabre sur la droite de l'écran
        let camera = document.querySelector('[camera]');
        
        console.log('Initializing sabre for PC mode');
        console.log('Camera found:', camera);
        
        // Charger directement avec le chemin du fichier
        sabre.setAttribute('gltf-model', 'asset/Sabre.glb');
        sabre.setAttribute('scale', '3.5 3.5 3.5');
                // Logger quand le modèle est chargé et ajuster si nécessaire
        sabre.addEventListener('model-loaded', () => {            
            // S'assurer que le modèle est visible
            let model = sabre.getObject3D('mesh');
            if (model) {
                model.traverse((node) => {
                    if (node.isMesh) {
                        node.visible = true;
                        // Ajouter un matériau émissif pour être sûr qu'il soit visible
                        if (node.material) {
                            // node.material.emissive = new THREE.Color(0x0088ff);
                            node.material.emissiveIntensity = 0.5;
                        }
                    }
                });
                console.log('Sabre model visible and emissive material applied');
            }
        });
        
        sabre.addEventListener('model-error', (evt) => {
            console.error('Error loading sabre model:', evt);
        });
        
        camera.appendChild(sabre);
        console.log('Sabre added to camera');
        
        // Animation idle subtile - enregistrer le composant avant de l'utiliser
        // Le composant prend maintenant des valeurs `basePos` et `baseRot`
        if (!AFRAME.components['sabre-idle']) {
            AFRAME.registerComponent('sabre-idle', {
                schema: {
                    basePos: { type: 'vec3', default: { x: 0.4, y: -0.3, z: -0.8 } },
                    baseRot: { type: 'vec3', default: { x: -45, y: 10, z: -10 } }
                },
                tick: function (time) {
                    let idleRotation = Math.sin(time / 1000) * 2; // degrees
                    let idlePosition = Math.sin(time / 800) * 0.02; // meters
                    let bp = this.data.basePos;
                    let br = this.data.baseRot;

                    // position relative to base
                    this.el.object3D.position.set(bp.x, bp.y + idlePosition, bp.z);

                    // rotation relative to base (convert degrees -> radians)
                    this.el.object3D.rotation.set(
                        THREE.MathUtils.degToRad(br.x + idleRotation),
                        THREE.MathUtils.degToRad(br.y),
                        THREE.MathUtils.degToRad(br.z + idleRotation)
                    );
                }
            });
        }

        // Appliquer l'idle en passant les valeurs de base actuellement définies
        sabre.setAttribute('sabre-idle', 'basePos: 1.5 -1 -1.5; baseRot: 90 0 0');
        
        // Animation de coup au clic
        let isAttacking = false;
        document.addEventListener('click', (evt) => {
            // Ignorer les clics sur les éléments cliquables
            if (evt.target.classList && evt.target.classList.contains('clickable')) return;
            if (isAttacking) return;
            
            isAttacking = true;
            

            
            // Animation de slash : rotation rapide + déplacement vertical
            // Récupérer les valeurs de base depuis le composant `sabre-idle` si présent
            let idleData = sabre.getAttribute('sabre-idle') || {};
            let originalPos = (idleData.basePos) ? { x: idleData.basePos.x, y: idleData.basePos.y, z: idleData.basePos.z } : { x: 0.4, y: -0.3, z: -0.8 };
            let originalRot = (idleData.baseRot) ? { x: idleData.baseRot.x, y: idleData.baseRot.y, z: idleData.baseRot.z } : { x: -45, y: 10, z: -10 };

            // Désactiver l'idle pendant l'attaque (on conservera les valeurs de base pour la restauration)
            sabre.removeAttribute('sabre-idle');
            
            // Retirer les anciennes animations
            sabre.removeAttribute('animation__pos1');
            sabre.removeAttribute('animation__rot1');
            sabre.removeAttribute('animation__pos2');
            sabre.removeAttribute('animation__rot2');
            sabre.removeAttribute('animation__pos3');
            sabre.removeAttribute('animation__rot3');
            // Son de sabre (à activer quand l'asset audio sera ajouté)
            let sabreSound = document.querySelector('#sabre-sound');
            if (sabreSound) sabreSound.play();
            setTimeout(() => {
                // Phase 1.5: Avance rapide (le bout tranche vers l'avant)
                // Avance le sabre le long de l'axe Z local (approximé en modifiant z world)
                sabre.removeAttribute('animation__pos1');
                sabre.removeAttribute('animation__rot1');
                sabre.setAttribute('animation__thrust', {
                    property: 'position',
                    to: `${originalPos.x - 0.1} ${originalPos.y - 0.03} ${originalPos.z + 0.2}`,
                    dur: 120,
                    easing: 'easeOutQuad'
                });
                sabre.setAttribute('animation__thrustRot', {
                    property: 'rotation',
                    to: `${originalRot.x + 10} ${originalRot.y + 10} ${originalRot.z - 10}`,
                    dur: 120,
                    easing: 'easeOutQuad'
                });
            }, 150);

            setTimeout(() => {
                // Phase 2: Coup descendant rapide (slashing)
                sabre.removeAttribute('animation__thrust');
                sabre.removeAttribute('animation__thrustRot');
                sabre.setAttribute('animation__pos2', {
                    property: 'position',
                    to: `${originalPos.x + 0.5} ${originalPos.y - 1} ${originalPos.z + 1}`,
                    dur: 200,
                    easing: 'easeInQuad'
                });
                sabre.setAttribute('animation__rot2', {
                    property: 'rotation',
                    to: `${originalRot.x - 120} ${originalRot.y + 90} ${originalRot.z - 90}`,
                    dur: 200,
                    easing: 'easeInQuad'
                });
            }, 300);

            setTimeout(() => {
                // Phase 3: Retour à la position initiale
                sabre.removeAttribute('animation__pos2');
                sabre.removeAttribute('animation__rot2');
                sabre.setAttribute('animation__pos3', {
                    property: 'position',
                    to: `${originalPos.x} ${originalPos.y} ${originalPos.z}`,
                    dur: 260,
                    easing: 'easeOutQuad'
                });
                sabre.setAttribute('animation__rot3', {
                    property: 'rotation',
                    to: `${originalRot.x} ${originalRot.y} ${originalRot.z}`,
                    dur: 260,
                    easing: 'easeOutQuad'
                });

                setTimeout(() => {
                    // Nettoyer et réactiver l'idle en restaurant les valeurs de base
                    sabre.removeAttribute('animation__pos3');
                    sabre.removeAttribute('animation__rot3');
                    sabre.setAttribute('sabre-idle', `basePos: ${originalPos.x} ${originalPos.y} ${originalPos.z}; baseRot: ${originalRot.x} ${originalRot.y} ${originalRot.z}`);
                    isAttacking = false;
                }, 280);
            }, 560);
        });
    }
}

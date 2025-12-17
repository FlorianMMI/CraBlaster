let scene = document.querySelector('a-scene');

let spawnRandomRocks = function(amount, size){
    let randomRockGroup = document.createElement('a-entity');
    for (let i = 0 ; i < amount ; i++){
        let randomX = Math.random() * (2 * size) - size;
        let randomZ = Math.random() * (2 * size) - size;
        let scale = Math.random() * 0.5 + 0.5;
        let rotation = Math.random() * 360;
        let rock = document.createElement('a-entity');
        rock.setAttribute('gltf-model', '#rocks');
        rock.setAttribute('scale', {x: scale, y:0.5 , z: scale});
        rock.setAttribute('position', {x: randomX, y: -1, z: randomZ});
        rock.setAttribute('rotation', {x: 0, y: rotation, z: 0});
        randomRockGroup.appendChild(rock);
    }
    scene.appendChild(randomRockGroup);
}

AFRAME.registerComponent('filter-part', {
    schema: {
        targetPart: { type: 'string', default: '' },
        autoCenter: { type: 'boolean', default: false }
    },
  
    init: function () {
        this.el.addEventListener('model-loaded', () => this.filterModel());
    },
  
    filterModel: function () {
        let model = this.el.getObject3D('mesh');
        if (!model) return;
    
        let bbox = new THREE.Box3();
        let targetMesh = null;
    
        model.traverse((node) => {
        if (node.isMesh) {
            if (node.name === this.data.targetPart) {
            targetMesh = node;
            } else {
            node.visible = false;
            }
        }
        });
    
        if (targetMesh && this.data.autoCenter) {
        bbox.setFromObject(targetMesh);
        let center = new THREE.Vector3();
        bbox.getCenter(center);
        targetMesh.position.sub(center); // Recentrer l'objet
        }
    }
    });
  
    document.querySelectorAll("[gltf-model='#decor']").forEach(el => {
    let part = el.getAttribute("target-part") || '';
    let autoCenter = el.hasAttribute("auto-center");
    el.setAttribute("filter-part", `targetPart: ${part}; autoCenter: ${autoCenter}`);
    });
    
    document.querySelectorAll("[gltf-model='#spacebase']").forEach(el => {
    let part = el.getAttribute("target-part") || '';
    let autoCenter = el.hasAttribute("auto-center");
    el.setAttribute("filter-part", `targetPart: ${part}; autoCenter: ${autoCenter}`);
    });
    
    document.querySelectorAll("[gltf-model='#tunnel']").forEach(el => {
    let part = el.getAttribute("target-part") || '';
    let autoCenter = el.hasAttribute("auto-center");
    el.setAttribute("filter-part", `targetPart: ${part}; autoCenter: ${autoCenter}`);
    });
    
    document.querySelectorAll("[gltf-model='#cargotoit']").forEach(el => {
    let part = el.getAttribute("target-part") || '';
    let autoCenter = el.hasAttribute("auto-center");
    el.setAttribute("filter-part", `targetPart: ${part}; autoCenter: ${autoCenter}`);
});

/* Spawn aléatoire de cailloux sur la map */
/* Commenté car ça met quand même un petit coup de lag */
// scene.addEventListener('loaded', () => {
//     spawnRandomRocks(500, 250);
// });
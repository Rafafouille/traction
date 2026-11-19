import * as ThreeModule from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

export function init(container) {
    // Rend Three.js accessible aux scripts classiques.
    globalThis.THREE = ThreeModule;

    // Scène
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    // Charge le panorama PNG et l'utilise comme environnement pour les reflets.
    new THREE.TextureLoader().load(
        './sources/images/environnement.png',
        (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.colorSpace = THREE.SRGBColorSpace;
            scene.environment = texture;
        },
        undefined,
        (erreur) => console.error("Chargement de la carte d'environnement impossible :", erreur)
    );

    // Groupes de la scène (références globales déclarées dans index.php)
    SCENE_COMPLETE = new THREE.Group();
    SCENE_COMPLETE.name = 'SCENE_COMPLETE';
    BATI = new THREE.Group();
    BATI.name = 'BATI';
    TRAVERSE_MOBILE = new THREE.Group();
    TRAVERSE_MOBILE.name = 'TRAVERSE_MOBILE';
    GROUPE_EPROUVETTE = new THREE.Group();
    GROUPE_EPROUVETTE.name = 'EPROUVETTE';
    SCENE_COMPLETE.add(BATI, TRAVERSE_MOBILE, GROUPE_EPROUVETTE);
    scene.add(SCENE_COMPLETE);

    // Caméra
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.0001, 1);
    camera.position.set(0.015, 0.015, 0.02);

    // Rendu WebGL ajouté à la page
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // CHARGE MACHINE
    chargeMachine(OBJLoader, MTLLoader);

    // Éprouvette
    EPROUVETTE.redessine();

    // Éclairage
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(5, 8, 4);
    scene.add(light);

    // Contrôles à la souris (OrbitControls)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0.003, 0.003, 0.003);

    // Adaptation au redimensionnement du conteneur
    new ResizeObserver(() => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }).observe(container);

    // Boucle d'animation
    renderer.setAnimationLoop(() => {
        
        update();

        controls.update();
        renderer.render(scene, camera);
    });
}

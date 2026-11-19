
// =================================================================================
// Charge les modèles 3D de la machine (bâti et traverse mobile)
function chargeMachine(OBJLoader, MTLLoader) {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    // Charge le bâti
    mtlLoader.load('./sources/modeles/bati.mtl', (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load('./sources/modeles/bati.obj', (object) => {
            object.scale.set(0.1, 0.1, 0.1);
            object.position.set(0, 0, 0);
            BATI.add(object);
        });
    });

    // Charge la traverse mobile
    mtlLoader.load('./sources/modeles/traverse_mobile.mtl', (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load('./sources/modeles/traverse_mobile.obj', (object) => {
            object.scale.set(0.1, 0.1, 0.1);
            object.position.set(0, 0, 0);
            TRAVERSE_MOBILE.add(object);
        });
    });
}

// Fonction qui crée des faces dans faces, en connectant deux étages
function connecte2Couches(section,noeuds,faces)
{   
    const n = section.length;
    const offset = noeuds.length - n;
    for (let i = 0; i < n; i++)
    {   
        const a = offset + i; // sommet actuel de la couche supérieure
        const b = offset + (i + 1) % n; // sommet suivant de la couche supérieure
        const c = a - n; // sommet correspondant de la couche inférieure
        const d = b - n; // sommet suivant de la couche inférieure
        faces.push([a, b, c]);
        faces.push([b, d, c]);
    }
}




// Fonction qui mets à jour le dessin
function update()
{
    // Eprouvette
    EPROUVETTE.redessine();

    // Position de la traverse mobile sur le haut du dernier élément
    TRAVERSE_MOBILE.position.set(0, ELEMENTS[EPROUVETTE.N-1].y_top, 0); // Met à jour la position de la traverse mobile (exemple)
}
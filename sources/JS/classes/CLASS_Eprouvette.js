var Eprouvette = class Eprouvette {


    constructor({ E = 210e9, nu = 0.3, D0 = 10e-3, L0 = 50e-3, N = 20 } = {}) {
        this.E = E;   // Module de Young
        this.nu = nu; // Coefficient de Poisson
        this.D0 = D0; // Diamètre initial
        this.L0 = L0; // Longueur utile initiale
        this.N = N;


        // création des éléments discrets 
        this.elements = [];
        for (var i = 0; i < this.#N; i++) {
            this.elements.push(new ElementDiscret({ dL0: this.L0 / this.#N, D0: this.D0, i: i }));
        }
    }

   

    // ==========================================
    // DIMENSIONS
    // Diamètre initial
    #D0 = undefined;
    get D0() {
        return this.#D0;
    }
    set D0(valeur) {
        this.#D0 = valeur;
    }
    // Longueur utile initiale
    #L0 = undefined;
    get L0() {
        return this.#L0;
    }
    set L0(valeur) {
        this.#L0 = valeur;
    }

    // =========================================
    // PARAMETRES MATERIAUX
    #E = undefined;
    get E() {
        return this.#E;
    }

    set E(valeur) {
        this.#E = valeur;
    }

    #nu = undefined;
    get nu() {
        return this.#nu;
    }

    set nu(valeur) {
        this.#nu = valeur;
    }


    // ==========================================
    // ELEMENTS
    // Nombre d'éléments
    #N = undefined;
    get N() {
        return this.#N;
    }
    set N(valeur) {
        this.#N = valeur;
    }

    // Éléments discrets de l'éprouvette
    elements = [];
    


    // ==========================================
    // GRAPHISMES

    #maillage = undefined;

    redessine() {
        if (!THREE || !GROUPE_EPROUVETTE) {
            throw new Error("Impossible de redessiner l'éprouvette avant l'initialisation de la scène.");
        }

        // Construit les sections aux extrémités et au centre de chaque élément.
        const noeuds = [];
        const faces = [];
        const premier = this.elements[0];
        const dernier = this.elements[this.elements.length - 1];
        const sectionBase = premier.sectionGeometry0;
        for (const point of sectionBase) {
            noeuds.push([point.x, premier.y_bottom, point.z]);
        }
        for (const element of this.elements) {
            const section = element.sectionGeometry;
            for (const point of section) {
                noeuds.push([point.x, point.y, point.z]);
            }
            connecte2Couches(section, noeuds, faces);
        }
        const sectionSommet = dernier.sectionGeometry0;
        for (const point of sectionSommet) {
            noeuds.push([point.x, dernier.y_top, point.z]);
        }
        connecte2Couches(sectionSommet, noeuds, faces);

        // Calcule les normales des faces partageant chaque noeud.
        const normalesFaces = [];
        const facesParNoeud = Array.from({ length: noeuds.length }, () => []);
        for (const [index, face] of faces.entries()) {
            const [a, b, c] = face.map(i => new THREE.Vector3(...noeuds[i]));
            const normale = b.sub(a).cross(c.sub(a)).normalize();
            normalesFaces.push(normale);
            for (const i of face) facesParNoeud[i].push(index);
        }

        // Lisse les faces voisines à moins de 30 degrés en conservant les arêtes vives.
        const positions = [];
        const normales = [];
        const seuil = Math.cos(THREE.MathUtils.degToRad(30));
        for (const [index, face] of faces.entries()) {
            for (const i of face) {
                positions.push(...noeuds[i]);
                const normale = new THREE.Vector3();
                for (const voisin of facesParNoeud[i]) {
                    if (normalesFaces[index].dot(normalesFaces[voisin]) >= seuil) {
                        normale.add(normalesFaces[voisin]);
                    }
                }
                normales.push(...normale.normalize().toArray());
            }
        }

        const geometrie = new THREE.BufferGeometry();
        geometrie.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometrie.setAttribute('normal', new THREE.Float32BufferAttribute(normales, 3));
        const maillage = new THREE.Mesh(
            geometrie,
            new THREE.MeshBasicMaterial({ color: 0x44aaff, wireframe: true })
            //new THREE.MeshStandardMaterial({ color: 0x44aaff })
            /*new THREE.MeshStandardMaterial({
                    color: 0x888888,
                    metalness: 0.9,
                    roughness: 0.2
                })*/
        );

        // Libère les ressources du maillage remplacé à chaque redessin.
        if (this.#maillage) {
            this.#maillage.removeFromParent();
            this.#maillage.geometry.dispose();
            this.#maillage.material.dispose();
        }
        this.#maillage = maillage;
        GROUPE_EPROUVETTE.add(maillage);
    }

};
<?php // Page principale ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <!-- Encodage des caractères -->
    <meta charset="UTF-8">
    <!-- Affichage adapté aux écrans mobiles -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Titre de l'onglet -->
    <title>Traction</title>
    <!-- Feuille de style de la page -->
    <link rel="stylesheet" href="./sources/style/style.css">
    <!-- Déclaration des modules Three.js (CDN) -->
    <script type="importmap">
    {
        "imports": {
            "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
            "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
        }
    }
    </script>





    <!-- Fonctions utilitaires (exécutées après l'analyse du HTML) -->
    <script src="./sources/JS/fonctions.js"></script>
    <!-- Classe des éléments discrets, chargée avant leur création -->
    <script src="./sources/JS/classes/CLASS_ElementDiscret.js"></script>
    <!-- Classe de l'éprouvette, chargée avant sa création -->
    <script src="./sources/JS/classes/CLASS_Eprouvette.js"></script>
</head>
<body>



    <!-- Variables globales JS -->
    <script>
        var F=1000; // Force appliquée (en N)

        // Eprouvette
        var EPROUVETTE = new Eprouvette();
        var ELEMENTS = EPROUVETTE.elements;
        // Référence Three.js, affectée au démarrage de main.js
        var THREE;

        // Groupes 3D (assignés dans main.js)
        var SCENE_COMPLETE, BATI, TRAVERSE_MOBILE, GROUPE_EPROUVETTE;
    </script>



    <!-- SCENE 3D -->
    <div id="scene3d"></div>

    <!-- MENU -->
    <div id="menu">
        <label for="forceSlider">Force (N): <span id="forceValue">0</span></label>
        <input type="range" id="forceSlider" min="-500000" max="500000" value="0">
        <label for="deplacementSlider">Déplacement (mm): <span id="deplacementValue">0</span></label>
        <input type="range" id="deplacementSlider" min="-100" max="100" value="0">
    </div>

    <!-- Script principal Three.js : appelle la fonction d'initialisation du modèle 3D après le chargement du HTML -->
    <script type="module">
        // Lancement du modèle 3D une fois le HTML chargé
        window.addEventListener('DOMContentLoaded', async () => {
            const { init } = await import('./sources/JS/main.js');
            init(document.getElementById('scene3d'));


            // CODE POUR CHARGER LE FICHIER D'EVENEMENTS (après que tout soit bien mis en place)
            // Charge les événements une fois la scène prête, puis active le curseur.
            const evenements = document.createElement('script');
            evenements.src = './sources/JS/evenements.js';
            document.body.appendChild(evenements);
        });

    </script>
</body>
</html>

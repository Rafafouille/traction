var ElementDiscret = class ElementDiscret {


    // ===============================================================
    // Les dimensions omises restent initialisées à zéro
    constructor({ dL0 = 0, D0 = 0, i = 0 } = {}) {
        this.dL0 = dL0;
        this.D0 = D0;
        this.i = i;
    }


    // ==================================================================
    // VARIABLES


    // LOGISITIQUE ELEMENTS ---------------------------------------------
    // Numéro de l'élément
        #i=0;
        get i()
        {
            return this.#i;
        }
        set i(valeur)
        {
            this.#i = valeur;
        }
    // Element précédent
        get elementPrecedent()
        {
            if(this.i==0)
                return null;
            return ELEMENTS[this.i - 1];
        }
    // Élement suivant
        get elementSuivant()
        {
            if(this.i==ELEMENTS.length-1)
                return null;
            return ELEMENTS[this.i + 1];
        }
    // ACTIONS MECANIQUES ------------------------------------------------
        // Force appliquée sur l'élément (variable )
        get F()
        {
            return F;
        }
    // DIMENSIONS INITIALES ---------------------------------------------------------------
    // Longueur initiale de l'élément discret
        #dL0 = 0;
        get dL0()
        {
            return this.#dL0;
        }
        set dL0(valeur)
        {
            this.#dL0 = valeur;
        }
    // Diamètre initial de l'élément discret
        #D0 = 0;
        get D0()
        {
            return this.#D0;
        }
        set D0(valeur)
        {
            this.#D0 = valeur;
        }
    // Surface initiale de l'élément (section transversale)
        get S0()
        {
            return Math.PI * (this.D0/2)**2;
        }
    // Surface courante de l'élément (section transversale)
        get S()
        {
            return this.S0 (1 + this.epsilon_transversal)**2;
        }

    // DIMENSIONS DEFORMEES ---------------------------------------------------------------
    // Longueur actuelle de l'élément
        get dL()
        {
            return this.dL0 * (1 + this.epsilon);
        }
    // Diamètre actuel de l'élément
        get D()
        {
            return this.D0 * (1 + this.epsilon_transversal);
        }

    // POSITIONS INITIALES --------------------------------------------------------------
    // Position (sur Y) du centre de l'élément à l'état initial
        get y0()
        {
            if(this.i==0)
                return this.dL0 / 2;
            return this.elementPrecedent.y0_top + this.dL0 / 2;
        }
    // Position (sur Y) du bord inférieur de l'élément à l'état initial
        get y0_bottom()
        {
            return this.y0 - this.dL0 / 2;
        }
    // Position (sur Y) du bord supérieur de l'élément à l'état initial
        get y0_top()
        {
            return this.y0 + this.dL0 / 2;
        }
        
    //POSITIONS DEFORMEES------------------------------------------------------------
    // Position (sur Y) à l'état courant
        get y()
        {
            if(this.i==0)
                return this.dL/2;
            return this.elementPrecedent.y_top + this.dL / 2;
        }
        get y_bottom()
        {
            return this.y - this.dL / 2;
        }
        get y_top()
        {
            return this.y + this.dL / 2;
        }

    // GEOMETRIE ------------------------------------------------------------
    // Résolution du cercle pour la géométrie de la section (nombre de points)
        #Ncyl = 32; // Nombre de découpages du cylindre
        get Ncyl()
        {
            return this.#Ncyl;
        }
        set Ncyl(valeur)
        {
            this.#Ncyl = valeur;
        }
        // Renvoie la géométrie d'une section initiale (liste de points formant un cercle, avec une résolution)
        get sectionGeometry0()
        {
            const points = [];
            for (let i = 0; i < this.Ncyl; i++) {
                const theta = (i / this.Ncyl) * 2 * Math.PI;
                points.push({ x: (this.D0/2) * Math.cos(theta), y:this.y0,  z: (this.D0/2) * Math.sin(theta) });
            }
            return points;
        }

        // Renvoie la géométrie d'une section actuelle (liste de points formant un cercle, avec une résolution)
        get sectionGeometry()
        {
            const points = [];
            for (let i = 0; i < this.Ncyl; i++) {
                const theta = (i / this.Ncyl) * 2 * Math.PI;
                points.push({ x: (this.D/2) * Math.cos(theta), y: this.y, z: (this.D/2) * Math.sin(theta) });
            }
            return points;
        }
    // MATERIAU ------------------------------------------------------------------
    // Limite élastique (en Pa)
        #Re = 70e6; // Limite élastique (en Pa)
        get Re()
        {
            return this.#Re;
        }
        set Re(valeur)
        {
            this.#Re = valeur;
        }
    // Module d'élasticité (en Pa)
        #E = 69e9; // Module d'élasticité (en Pa)
        get E()
        {
            return this.#E;
        }
        set E(valeur)
        {
            this.#E = valeur;
        }
    // Coefficient de Poisson
        #nu = 0.33; // Coefficient de Poisson
        get nu()
        {
            return this.#nu;
        }
        set nu(valeur)
        {
            this.#nu = valeur;
        }

    // RDC ----------------------------------------------------------------
        // Contrainte conventionnelle
        get R()
        {
            return this.F / this.S0;
        }
    //Contrainte vraie
        get sigma()
        {
            return this.F/this.S0;
        }
    // Déformation
        get epsilon()
        {
            return this.sigma / this.E;
        }

    // Déformation transversale 
        get epsilon_transversal()
        {
            return -this.nu * this.epsilon;
        }



   


   
};

// Ce fichier recense les événements liés à l'interface utilisateur, comme le curseur de force



        // Gestion du curseur de force
        document.getElementById('forceSlider').addEventListener('input', (event) => {
            F = parseInt(event.target.value);
            document.getElementById('forceValue').textContent = F;
            update();
        });
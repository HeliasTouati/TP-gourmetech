//******************************THEME SOMBRE/CLAIR********************************** */
const boutonModeSombre = document.querySelector(".sombre");
const boutonModeClair = document.querySelector(".clair");
const body = document.body;

// Activer mode sombre
boutonModeSombre.addEventListener('click', () => {
    body.classList.add('sombre');
    boutonModeSombre.style.display = 'none';
    boutonModeClair.style.display = 'block';
    localStorage.setItem('theme', 'sombre');
});

// Activer mode clair
boutonModeClair.addEventListener('click', () => {
    body.classList.remove('sombre');
    boutonModeSombre.style.display = 'block';
    boutonModeClair.style.display = 'none';
    localStorage.setItem('theme', 'clair');
});

// Cacher bouton selon theme
if (localStorage.getItem('theme') === 'sombre') {
    body.classList.add('sombre');
    boutonModeSombre.style.display = 'none';
    boutonModeClair.style.display = 'block';
} else {
    body.classList.remove('sombre');
    boutonModeSombre.style.display = 'block';
    boutonModeClair.style.display = 'none';
}

//***************************************FILTRAGE DYNAMIQUE*************************************************** */
const searchInput = document.querySelector("#search");
const recetteGrid = document.querySelector("#recette-grid");
const cards = Array.from(recetteGrid.querySelectorAll('.card'));

// Sélection des filtres
const categorieCheckboxes = document.querySelectorAll('input[name="entree"], input[name="plat"], input[name="dessert"]');
const tempsCheckboxes = document.querySelectorAll('input[name="rapide"], input[name="moyen"], input[name="long"]');
const difficultéCheckboxes = document.querySelectorAll('input[name="facile"], input[name="medium"], input[name="difficile"]');

// Ajout des écouteurs d'événements
searchInput.addEventListener('input', () => {
    cards.forEach(card => {
        const searchTerm = searchInput.value.toLowerCase();
        const nomRecette = card.querySelector('h2').textContent.toLowerCase();
        const matchRecherche = nomRecette.includes(searchTerm);

        const categorie = card.querySelectoryl('div p')[0].textContent.toLowerCase();
        const tempsPreparation = parseInt(card.querySelectorAll('div p')[1].textContent);
        const difficultéRecette = card.querySelectorAll('div p')[2].textContent.toLowerCase();

        const categorieSelectionnees = Array.from(categorieCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.name.toLowerCase());
        const matchCategorie = categorieSelectionnees.length === 0 ||
            categorieSelectionnees.includes(categorie);

        const tempsSelectionnes = Array.from(tempsCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.name);
        const matchTemps = tempsSelectionnes.length === 0 ||
            (tempsSelectionnes.includes('rapide') && tempsPreparation < 30) ||
            (tempsSelectionnes.includes('moyen') && tempsPreparation >= 30 && tempsPreparation <= 60) ||
            (tempsSelectionnes.includes('long') && tempsPreparation > 60);

        const difficultésSelectionnees = Array.from(difficultéCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.name);
        const matchDifficulté = difficultésSelectionnees.length === 0 ||
            difficultésSelectionnees.some(diff =>
                diff.toLowerCase() === difficultéRecette ||
                (diff === 'medium' && difficultéRecette === 'moyen')
            );

        card.style.display = (matchRecherche && matchCategorie && matchTemps && matchDifficulté) ? 'flex' : 'none';
    });
});

// Ajout des écouteurs pour les checkboxes
[...categorieCheckboxes, ...tempsCheckboxes, ...difficultéCheckboxes].forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        cards.forEach(card => {
            const categorie = card.querySelectorAll('div p')[0].textContent.toLowerCase();
            const tempsPreparation = parseInt(card.querySelectorAll('div p')[1].textContent);
            const difficultéRecette = card.querySelectorAll('div p')[2].textContent.toLowerCase();

            const categorieSelectionnees = Array.from(categorieCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.name.toLowerCase());
            const matchCategorie = categorieSelectionnees.length === 0 ||
                categorieSelectionnees.includes(categorie);

            const tempsSelectionnes = Array.from(tempsCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.name);
            const matchTemps = tempsSelectionnes.length === 0 ||
                (tempsSelectionnes.includes('rapide') && tempsPreparation < 30) ||
                (tempsSelectionnes.includes('moyen') && tempsPreparation >= 30 && tempsPreparation <= 60) ||
                (tempsSelectionnes.includes('long') && tempsPreparation > 60);

            const difficultésSelectionnees = Array.from(difficultéCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.name);
            const matchDifficulté = difficultésSelectionnees.length === 0 ||
                difficultésSelectionnees.some(diff =>
                    diff.toLowerCase() === difficultéRecette ||
                    (diff === 'medium' && difficultéRecette === 'moyen')
                );

            const searchTerm = searchInput.value.toLowerCase();
            const nomRecette = card.querySelector('h2').textContent.toLowerCase();
            const matchRecherche = nomRecette.includes(searchTerm);

            card.style.display = (matchRecherche && matchCategorie && matchTemps && matchDifficulté) ? 'flex' : 'none';
        });
    });
});

//*******************************************************AJOUT FAVORIS***************** */

const likeButtons = document.querySelectorAll('.like');
const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

for (const button of likeButtons) {
    const card = button.closest('.card');
    const recipeTitle = card.querySelector('h2').textContent;

    // Initialiser l'état des boutons like
    if (favorites.includes(recipeTitle)) {
        button.classList.add('active');
    }

    // Ajouter l'écouteur d'événement pour le like
    button.addEventListener('click', () => {
        // Récupérer à nouveau les favoris (pour s'assurer d'avoir la dernière version)
        const currentFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');

        // Vérifier si la recette est déjà en favoris
        const index = currentFavorites.indexOf(recipeTitle);

        if (index > -1) {
            // Supprimer des favoris
            currentFavorites.splice(index, 1);
            button.classList.remove('active');
        } else {
            // Ajouter aux favoris
            currentFavorites.push(recipeTitle);
            button.classList.add('active');
        }

        // Sauvegarder les favoris mis à jour
        localStorage.setItem('favorites', JSON.stringify(currentFavorites));

        // Mettre à jour la page des favoris si elle existe
        updateFavoritesPage();
    });
};


// Fonction pour mettre à jour la page des favoris
function updateFavoritesPage() {
    const favoritesContainer = document.querySelector('.favoris');
    if (!favoritesContainer) return;

    // Charger les favoris
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const cards = document.querySelectorAll('.card');
    const noFavoritesMessage = favoritesContainer.querySelector('.no-favoris');

    // Réinitialiser la grille des favoris
    const existingFavoriteCards = favoritesContainer.querySelectorAll('.card');
    for (const card of existingFavoriteCards) {
        card.remove();
    }

    // Filtrer et ajouter les cartes des recettes favorites
    const favoriteCards = Array.from(cards).filter(card => {
        const recipeTitle = card.querySelector('h2').textContent;
        return favorites.includes(recipeTitle);
    });

    if (favoriteCards.length > 0) {
        noFavoritesMessage.style.display = 'none';
        for (const card of favoriteCards) {
            const clonedCard = card.cloneNode(true);

            // Réactiver le bouton like
            const likeButton = clonedCard.querySelector('.like');
            likeButton.classList.add('active');

            // Ajouter l'écouteur d'événement pour le like sur la carte clonée
            likeButton.addEventListener('click', () => {
                // Récupérer à nouveau les favoris
                const currentFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                const recipeTitle = clonedCard.querySelector('h2').textContent;

                // Vérifier si la recette est déjà en favoris
                const index = currentFavorites.indexOf(recipeTitle);

                if (index > -1) {
                    // Supprimer des favoris
                    currentFavorites.splice(index, 1);
                    likeButton.classList.remove('active');
                } else {
                    // Ajouter aux favoris
                    currentFavorites.push(recipeTitle);
                    likeButton.classList.add('active');
                }

                // Sauvegarder les favoris mis à jour
                localStorage.setItem('favorites', JSON.stringify(currentFavorites));

                // Mettre à jour la page des favoris
                updateFavoritesPage();
            });

            favoritesContainer.appendChild(clonedCard);
        }
    } else {
        noFavoritesMessage.style.display = 'block';
    }
}

// Mettre à jour la page des favoris si elle existe
if (document.querySelector('.favoris')) {
    updateFavoritesPage();
}
//******************************THEME SOMBRE/CLAIR********************************** */
const boutonModeSombre = document.querySelector(".sombre");
const boutonModeClair = document.querySelector(".clair");
const body = document.body;

// Activer mode sombre
if (boutonModeSombre) {
    boutonModeSombre.addEventListener('click', () => {
        body.classList.add('sombre');
        boutonModeSombre.style.display = 'none';
        boutonModeClair.style.display = 'block';
        localStorage.setItem('theme', 'sombre');
    });
}

// Activer mode clair
if (boutonModeClair) {
    boutonModeClair.addEventListener('click', () => {
        body.classList.remove('sombre');
        boutonModeSombre.style.display = 'block';
        boutonModeClair.style.display = 'none';
        localStorage.setItem('theme', 'clair');
    });
}

// Cacher bouton selon theme
if (localStorage.getItem('theme') === 'sombre') {
    body.classList.add('sombre');
    if (boutonModeSombre) boutonModeSombre.style.display = 'none';
    if (boutonModeClair) boutonModeClair.style.display = 'block';
} else {
    body.classList.remove('sombre');
    if (boutonModeSombre) boutonModeSombre.style.display = 'block';
    if (boutonModeClair) boutonModeClair.style.display = 'none';
}

//***************************************FILTRAGE DYNAMIQUE*************************************************** */
const searchInput = document.querySelector("#search");
const recetteGrid = document.querySelector("#recette-grid");

// Vérifier si tous les éléments nécessaires existent avant de continuer
if (searchInput && recetteGrid) {
    const cards = Array.from(recetteGrid.querySelectorAll('.card'));

    // Sélection des filtres
    const categorieCheckboxes = document.querySelectorAll('input[name="entree"], input[name="plat"], input[name="dessert"]');
    const tempsCheckboxes = document.querySelectorAll('input[name="rapide"], input[name="moyen"], input[name="long"]');
    const difficultéCheckboxes = document.querySelectorAll('input[name="facile"], input[name="medium"], input[name="difficile"]');

    // Fonction de filtrage
    function filtrerRecettes() {
        cards.forEach(card => {
            const searchTerm = searchInput.value.toLowerCase();
            const nomRecette = card.querySelector('h2').textContent.toLowerCase();
            const matchRecherche = nomRecette.includes(searchTerm);

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

            card.style.display = (matchRecherche && matchCategorie && matchTemps && matchDifficulté) ? 'flex' : 'none';
        });
    }

    // Ajouter les écouteurs d'événements
    searchInput.addEventListener('input', filtrerRecettes);

    // Ajouter des écouteurs pour les checkboxes
    [...categorieCheckboxes, ...tempsCheckboxes, ...difficultéCheckboxes].forEach(checkbox => {
        checkbox.addEventListener('change', filtrerRecettes);
    });
}

//*******************************************************AJOUT FAVORIS***************** */
const likeButtons = document.querySelectorAll('.like');
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]'); // Utilisation d'une variable mutable

likeButtons.forEach(button => {
    const card = button.closest('.card');
    if (!card) return;

    const recipeTitle = card.querySelector('h2');
    if (!recipeTitle) return;

    const recipeText = recipeTitle.textContent;

    if (favorites.includes(recipeText)) {
        button.classList.add('active');
    }

    button.addEventListener('click', () => {
        const index = favorites.indexOf(recipeText);

        if (index > -1) {
            favorites.splice(index, 1);
            button.classList.remove('active');
        } else {
            favorites.push(recipeText);
            button.classList.add('active');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites)); // Écriture unique après modification
    });
});
const favorisGrid = document.querySelector("#favoris-grid");
const noFavorisMessage = document.querySelector(".no-favoris");

if (favorisGrid && noFavorisMessage) {
    // Récupérer les favoris depuis localStorage
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (favorites.length === 0) {
        favorisGrid.style.display = "none"; // Masquer la grille des favoris
        noFavorisMessage.style.display = "block"; // Afficher le message "Aucun favori"
    } else {
        favorisGrid.style.display = "flex"; // Afficher la grille des favoris
        noFavorisMessage.style.display = "none"; // Masquer le message "Aucun favori"

        favorites.forEach(recipeName => {
            const card = document.createElement("div");
            card.classList.add("card");

            // Structure de la card (en utilisant la même structure que dans index)
            card.innerHTML = `
                           <h2>${recipeName}</h2>
            <button class="remove-fav">Retirer des favoris</button>
            `;

            // Ajouter un écouteur sur le bouton de suppression
            card.querySelector(".remove-fav").addEventListener("click", () => {
                favorites = favorites.filter(fav => fav !== recipeName);
                localStorage.setItem("favorites", JSON.stringify(favorites));
                card.remove();

                // Vérifier si la liste des favoris est vide après suppression
                if (favorites.length === 0) {
                    favorisGrid.style.display = "none";
                    noFavorisMessage.style.display = "block";
                }
            });

            favorisGrid.appendChild(card);
        });
    }
} 

//**************************************************** A propos******************************************************* */
const email = document.querySelector("#email");

email.addEventListener("change", function ()) {
    const mail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
}

//******************************THEME SOMBRE/CLAIR********************************** */

// Sélection des boutons pour changer le mode de thème
const boutonModeSombre = document.querySelector(".sombre");
const boutonModeClair = document.querySelector(".clair");
const body = document.body;

// Activer le mode sombre
if (boutonModeSombre) {
    boutonModeSombre.addEventListener('click', () => {
        body.classList.add('sombre'); // Ajoute la classe 'sombre' au body pour activer le mode sombre
        boutonModeSombre.style.display = 'none'; // Masque le bouton sombre
        boutonModeClair.style.display = 'block'; // Affiche le bouton clair
        localStorage.setItem('theme', 'sombre'); // Sauvegarde le thème sombre dans le localStorage
    });
}

// Activer le mode clair
if (boutonModeClair) {
    boutonModeClair.addEventListener('click', () => {
        body.classList.remove('sombre'); // Retire la classe 'sombre' du body pour activer le mode clair
        boutonModeSombre.style.display = 'block'; // Affiche le bouton sombre
        boutonModeClair.style.display = 'none'; // Masque le bouton clair
        localStorage.setItem('theme', 'clair'); // Sauvegarde le thème clair dans le localStorage
    });
}

// Cacher les boutons en fonction du thème enregistré dans le localStorage
if (localStorage.getItem('theme') === 'sombre') {
    body.classList.add('sombre'); // Applique le thème sombre si enregistré
    if (boutonModeSombre) boutonModeSombre.style.display = 'none'; // Masque le bouton sombre
    if (boutonModeClair) boutonModeClair.style.display = 'block'; // Affiche le bouton clair
} else {
    body.classList.remove('sombre'); // Applique le mode clair par défaut
    if (boutonModeSombre) boutonModeSombre.style.display = 'block'; // Affiche le bouton sombre
    if (boutonModeClair) boutonModeClair.style.display = 'none'; // Masque le bouton clair
}

//***************************************FILTRAGE DYNAMIQUE*************************************************** */

// Sélection des éléments nécessaires pour le filtrage
const searchInput = document.querySelector("#search");
const recetteGrid = document.querySelector("#recette-grid");

// Vérification que les éléments existent avant de continuer
if (searchInput && recetteGrid) {
    const cards = Array.from(recetteGrid.querySelectorAll('.card')); // Récupère toutes les cartes de recettes

    // Sélection des checkboxes de filtres (catégorie, temps, difficulté)
    const categorieCheckboxes = document.querySelectorAll('input[name="entree"], input[name="plat"], input[name="dessert"]');
    const tempsCheckboxes = document.querySelectorAll('input[name="rapide"], input[name="moyen"], input[name="long"]');
    const difficultéCheckboxes = document.querySelectorAll('input[name="facile"], input[name="medium"], input[name="difficile"]');

    // Fonction de filtrage des recettes
    function filtrerRecettes() {
        cards.forEach(card => {
            const searchTerm = searchInput.value.toLowerCase(); // Récupère la valeur de la recherche
            const nomRecette = card.querySelector('h2').textContent.toLowerCase(); // Récupère le nom de la recette
            const matchRecherche = nomRecette.includes(searchTerm); // Vérifie si la recette correspond à la recherche

            const categorie = card.querySelectorAll('div p')[0].textContent.toLowerCase(); // Récupère la catégorie
            const tempsPreparation = parseInt(card.querySelectorAll('div p')[1].textContent); // Récupère le temps de préparation
            const difficultéRecette = card.querySelectorAll('div p')[2].textContent.toLowerCase(); // Récupère la difficulté

            // Récupère les catégories sélectionnées dans les checkboxes
            const categorieSelectionnees = Array.from(categorieCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.name.toLowerCase());
            const matchCategorie = categorieSelectionnees.length === 0 ||
                categorieSelectionnees.includes(categorie);

            // Récupère les temps sélectionnés dans les checkboxes
            const tempsSelectionnes = Array.from(tempsCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.name);
            const matchTemps = tempsSelectionnes.length === 0 ||
                (tempsSelectionnes.includes('rapide') && tempsPreparation < 30) ||
                (tempsSelectionnes.includes('moyen') && tempsPreparation >= 30 && tempsPreparation <= 60) ||
                (tempsSelectionnes.includes('long') && tempsPreparation > 60);

            // Récupère les difficultés sélectionnées dans les checkboxes
            const difficultésSelectionnees = Array.from(difficultéCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.name);
            const matchDifficulté = difficultésSelectionnees.length === 0 ||
                difficultésSelectionnees.some(diff =>
                    diff.toLowerCase() === difficultéRecette ||
                    (diff === 'medium' && difficultéRecette === 'moyen')
                );

            // Affiche ou masque la carte selon les filtres sélectionnés
            card.style.display = (matchRecherche && matchCategorie && matchTemps && matchDifficulté) ? 'flex' : 'none';
        });
    }

    // Ajout des écouteurs d'événements pour la recherche et les checkboxes
    searchInput.addEventListener('input', filtrerRecettes);
    [...categorieCheckboxes, ...tempsCheckboxes, ...difficultéCheckboxes].forEach(checkbox => {
        checkbox.addEventListener('change', filtrerRecettes);
    });
}

//*******************************************************AJOUT FAVORIS***************** */

// Sélectionne tous les boutons "like" pour ajouter aux favoris
const likeButtons = document.querySelectorAll('.like');
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]'); // Récupère les favoris du localStorage

// Pour chaque bouton de like
likeButtons.forEach(button => {
    const card = button.closest('.card'); // Trouve la carte associée
    if (!card) return;

    const recipeTitle = card.querySelector('h2'); // Récupère le titre de la recette
    if (!recipeTitle) return;

    const recipeText = recipeTitle.textContent; // Texte du titre de la recette

    // Si la recette est dans les favoris, ajouter la classe 'active' au bouton
    if (favorites.includes(recipeText)) {
        button.classList.add('active');
    }

    // Ajouter un écouteur pour gérer le clic sur le bouton de like
    button.addEventListener('click', () => {
        const index = favorites.indexOf(recipeText); // Vérifie si la recette est déjà dans les favoris

        if (index > -1) { // Si elle est déjà dans les favoris, la retirer
            favorites.splice(index, 1);
            button.classList.remove('active');
        } else { // Sinon, l'ajouter aux favoris
            favorites.push(recipeText);
            button.classList.add('active');
        }

        // Sauvegarde les favoris mis à jour dans le localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
    });
});

// Gestion de l'affichage des favoris
const favorisGrid = document.querySelector("#favoris-grid");
const noFavorisMessage = document.querySelector(".no-favoris");

if (favorisGrid && noFavorisMessage) {
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (favorites.length === 0) { // Si aucun favori, afficher un message
        favorisGrid.style.display = "none";
        noFavorisMessage.style.display = "block";
    } else { // Sinon, afficher la grille des favoris
        favorisGrid.style.display = "flex";
        noFavorisMessage.style.display = "none";

        favorites.forEach(recipeName => {
            const card = document.createElement("div");
            card.classList.add("card");

            // Structure de la carte
            card.innerHTML = `
                           <h2>${recipeName}</h2>
            <button class="remove-fav">Retirer des favoris</button>
            `;

            // Ajouter un écouteur sur le bouton "retirer des favoris"
            card.querySelector(".remove-fav").addEventListener("click", () => {
                favorites = favorites.filter(fav => fav !== recipeName); // Retirer du tableau
                localStorage.setItem("favorites", JSON.stringify(favorites)); // Mettre à jour le localStorage
                card.remove(); // Supprimer la carte de l'affichage

                // Vérifie si la liste des favoris est vide après suppression
                if (favorites.length === 0) {
                    favorisGrid.style.display = "none";
                    noFavorisMessage.style.display = "block";
                }
            });

            favorisGrid.appendChild(card); // Ajouter la carte à la grille des favoris
        });
    }
}

//**************************************************** A propos******************************************************* */
const email = document.querySelector("#email");

// Ajouter un écouteur d'événement pour la validation de l'email
email.addEventListener("change", function () {
    const mail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expression régulière pour valider l'email
});

// Récupération des projets
fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
        const gallery = document.querySelector(".gallery");
        for (let i = 0; i < data.length; i++) {
            const project = data[i];
            // Création des éléments + les contenus HTML
            const figureElement = document.createElement("figure");
            figureElement.dataset.category = project.categoryId; // Ajout de l'attribut de catégorie

            const imgElement = document.createElement("img");
            imgElement.src = project.imageUrl;
            imgElement.alt = project.title;

            const figcaptionElement = document.createElement("figcaption");
            figcaptionElement.textContent = project.title;
            // Apporter les éléments dynamiquement
            figureElement.appendChild(imgElement);
            figureElement.appendChild(figcaptionElement);

            gallery.appendChild(figureElement);
        }
    })
    .catch((error) => console.error(error));

// Récupération des catégories depuis l'API
fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
        const categorySection = document.querySelector("#category");

        // Création des éléments + les contenus HTML
        if (categorySection !== null) {
            const categoryList = document.createElement("ul");
            categoryList.classList.add("flex_row");

            // Le bouton "Tous"
            const allCategoryItem = document.createElement("li");
            const allCategoryButton = document.createElement("button");
            allCategoryButton.textContent = "Tous";
            allCategoryItem.appendChild(allCategoryButton);
            categoryList.appendChild(allCategoryItem);

            allCategoryButton.addEventListener("click", () => {
                filterWorks(0); // Afficher tout les projects
            });

            categories.forEach((category) => {
                const categoryItem = document.createElement("li");
                const categoryButton = document.createElement("button");
                categoryButton.textContent = category.name;
                // Apporter les éléments dynamiquement
                categoryItem.appendChild(categoryButton);
                categoryList.appendChild(categoryItem);

                categoryButton.addEventListener("click", () => {
                    filterWorks(category.id);
                });
            });

            categorySection.appendChild(categoryList);
        }
    })
    .catch((error) => console.error(error));

// Filtrer les projets en fonction de la catégorie sélectionnée

function filterWorks(categoryId) {
    const gallery = document.querySelector(".gallery");
    const figures = gallery.querySelectorAll("figure");

    figures.forEach((figure) => {
        const category = parseInt(figure.dataset.category);
        if (categoryId === 0 || category === categoryId) {
            figure.style.display = "block"; // Les afficher
        } else {
            figure.style.display = "none"; // Les masquer
        }
    });
}

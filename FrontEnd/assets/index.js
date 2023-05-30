// Récupération des projets pour la modale
fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
        const modalGallery = document.querySelector(".modal_gallery");
        const gallery = document.querySelector(".gallery");

        for (let i = 0; i < data.length; i++) {
            const project = data[i];

            //Création des éléments + les contenus HTML

            const imgElementModal = document.createElement("img");
            imgElementModal.src = project.imageUrl;
            imgElementModal.alt = project.title;

            const imgElementGallery = document.createElement("img");
            imgElementGallery.src = project.imageUrl;
            imgElementGallery.alt = project.title;

            const iconElement = document.createElement("i");
            iconElement.className = "fa-solid fa-trash-can";

            const figcaptionElementModal = document.createElement("figcaption");
            figcaptionElementModal.textContent = "Éditer";

            //Apporter les éléments dynamiquement sur la galerie
            const figureElementGallery = document.createElement("figure");
            figureElementGallery.appendChild(imgElementGallery);

            //Apporter les éléments dynamiquement sur la modale
            const figureElementModal = document.createElement("figure");
            figureElementModal.appendChild(imgElementModal);
            figureElementModal.appendChild(iconElement);
            figureElementModal.appendChild(figcaptionElementModal);
            figureElementModal.dataset.workId = project.id;

            // L'événement de suppression au clic sur l'icône
            iconElement.addEventListener("click", () => {
                figureElementModal.remove();
                figureElementGallery.remove();
                fetch(
                    "http://localhost:5678/api/works/" +
                        figureElementModal.dataset.workId,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization:
                                "Bearer " + localStorage.getItem("token"),
                        },
                    }
                )
                    .then((response) => {
                        console.log("DELETE OK");
                    })
                    .catch((error) => {
                        console.log("erreur :" + error);
                    });
            });

            // Mettre ou non la figcaption dans la galerie
            if (modalGallery === gallery) {
                figureElementGallery.appendChild(
                    figcaptionElementModal.cloneNode(true)
                );
            } else {
                const figcaptionElementGallery =
                    document.createElement("figcaption");
                figcaptionElementGallery.textContent = project.title;
                figureElementGallery.appendChild(figcaptionElementGallery);
            }

            if (modalGallery === gallery) {
                figureElementGallery.addEventListener("click", () => {
                    figureElementModal.classList.add("appear");
                });
            }

            modalGallery.appendChild(figureElementModal);
            gallery.appendChild(figureElementGallery);
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

function isTokenExpired(token) {
    if (token == null) {
        // si il n'y pas de token
        return true; // on renvoi qu'il est "expiré"
    }
    // récupéré pour tester la validité du token JWT
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        // on décode le token
        atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    const { exp } = JSON.parse(jsonPayload); // on récupere la date d'expiration du token
    const expired = Date.now() >= exp * 1000; // on la compare a la date actuelle,
    return expired; // si la date de maintenant est plus haute que l'exp alors on renvoi true
}

window.addEventListener("load", function () {
    const token = window.localStorage.getItem("token");
    const connexionBarSection = document.getElementById("connexion-bar");
    const categorySection = document.getElementById("category");
    const logoutLink = document.getElementById("logout");
    const loginLink = document.getElementById("login");

    if (isTokenExpired(token)) {
        connexionBarSection.style.display = "none";
        categorySection.style.display = "block";
        logoutLink.style.display = "none";
        loginLink.style.display = "block";
    } else {
        connexionBarSection.style.display = "block";
        categorySection.style.display = "none";
        logoutLink.style.display = "block";
        loginLink.style.display = "none";
    }
    console.log(localStorage.getItem("token"));

    logoutLink.addEventListener("click", () => {
        localStorage.clear();
        location.reload();
    });
});

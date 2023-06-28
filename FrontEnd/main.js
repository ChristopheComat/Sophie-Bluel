const modalGallery = document.querySelector(".modal_gallery");
const gallery = document.querySelector(".gallery");

function clearGallery() {
    modalGallery.innerHTML = ""; // éffacer le HTML de l'élément avec la classe "modal_gallery"
    gallery.innerHTML = ""; // éffacer HTML de l'élément avec la classe "gallery"
}

// récupération des projets depuis l'API et affichage dans la galerie
function displayGallery() {
    // récupération des projets pour la modale
    fetch("http://localhost:5678/api/works")
        .then((response) => response.json()) //convertion de la réponse en JSON
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                const project = data[i];

                // création des éléments HTML pour les projets dans la galerie modale

                //création des éléments <img> pour afficher l'image du projet
                const imgElementModal = document.createElement("img");
                imgElementModal.src = project.imageUrl;
                imgElementModal.alt = project.title;

                // création des éléments <figure>
                const figureElementModal = document.createElement("figure");
                figureElementModal.appendChild(imgElementModal);
                figureElementModal.dataset.workId = project.id;

                // création des éléments <figcaption> pour afficher le texte "éditer" sous l'image modale
                const figureCaptionModal = document.createElement("figcaption");
                figureCaptionModal.innerText = "éditer";
                figureElementModal.appendChild(figureCaptionModal);

                // l'ajout l'icône "fa-arrows-up-down-left-right" à la première image de la modale
                if (i === 0) {
                    const iconArrowsElement = document.createElement("i");
                    iconArrowsElement.className =
                        "fa-solid fa-arrows-up-down-left-right arrows-icon";
                    figureElementModal.appendChild(iconArrowsElement);
                }

                // créer un élément <i> pour l'icône "fa-trash-can" de suppression d'un projet
                const iconTrashElement = document.createElement("i");
                iconTrashElement.className = "fa-solid fa-trash-can trash-icon";
                figureElementModal.appendChild(iconTrashElement);

                // l'événement de suppression au clic sur l'icône "fa-trash-can"
                iconTrashElement.addEventListener("click", () => {
                    figureElementModal.remove();
                    // supprimer l'image correspondante dans la galerie
                    const figureElementGallery = document.querySelector(
                        `[data-work-id="${project.id}"]`
                    );

                    if (figureElementGallery) {
                        figureElementGallery.remove();
                    }
                    // l'appel API pour supprimer le projet
                    fetch(
                        `http://localhost:5678/api/works/${figureElementModal.dataset.workId}`,
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
                // création des éléments <figure> pour afficher l'image dans la galerie
                const figureElementGallery = document.createElement("figure");
                figureElementGallery.appendChild(imgElementModal.cloneNode());
                figureElementGallery.dataset.category = project.category.id;
                figureElementGallery.dataset.workId = project.id;

                // création des éléments <figcaption> pour afficher le titre du projet sous l'image dans la galerie
                const figureCaption = document.createElement("figcaption");
                figureCaption.innerText = project.title;
                figureElementGallery.appendChild(figureCaption);

                // l'ajout des éléments <figure> dans la galerie
                modalGallery.appendChild(figureElementModal);
                gallery.appendChild(figureElementGallery);
            }
        })
        .catch((error) => console.error(error));
}

// récupération des catégories depuis l'API
fetch("http://localhost:5678/api/categories")
    .then((response) => response.json()) // convertion de la réponse en JSON
    .then((categories) => {
        const categorySection = document.querySelector("#category");

        if (categorySection !== null) {
            const categoryList = document.createElement("ul");
            categoryList.classList.add("flex_row");

            // l'ajout d'un bouton pour la catégorie "Tous"
            const allCategoryItem = document.createElement("li");
            const allCategoryButton = document.createElement("button");
            allCategoryButton.textContent = "Tous";
            allCategoryItem.appendChild(allCategoryButton);
            categoryList.appendChild(allCategoryItem);

            // l'ajout d'un écouteur d'événement pour filtrer tous les projets lors du clic sur "Tous"
            allCategoryButton.addEventListener("click", () => {
                filterWorks(0);
                setActiveButton(allCategoryButton);
            });

            // les catégories récupérées depuis l'API
            categories.forEach((category) => {
                // créer un élément <li> pour chaque catégorie
                const categoryItem = document.createElement("li");
                const categoryButton = document.createElement("button");
                categoryButton.textContent = category.name;
                categoryItem.appendChild(categoryButton);
                categoryList.appendChild(categoryItem);

                categoryButton.addEventListener("click", () => {
                    filterWorks(category.id);
                    setActiveButton(categoryButton);
                });

                // l'ajout des options de catégorie
                const selectElementModal = document.getElementById("categorie");

                if (selectElementModal.children.length === 0) {
                    // l'ajout d'une option vide au début
                    const optionElementEmpty = document.createElement("option");
                    selectElementModal.appendChild(optionElementEmpty);

                    // parcourir les catégories pour ajouter chaque option de la liste
                    categories.forEach((category) => {
                        const optionElement = document.createElement("option");
                        optionElement.value = category.id;
                        optionElement.textContent = category.name;
                        selectElementModal.appendChild(optionElement);
                    });
                }
            });

            // l'ajout de la liste des catégories du HTML
            categorySection.appendChild(categoryList);
        }
    })
    .catch((error) => console.error(error));

function setActiveButton(button) {
    // supprime la classe active de tous les boutons
    const buttons = document.querySelectorAll("#category button");
    buttons.forEach((btn) => {
        btn.classList.remove("active");
    });

    // la classe active au bouton cliqué
    button.classList.add("active");
}

// filtrer les projets en fonction de la catégorie sélectionnée

function filterWorks(categoryId) {
    const figures = gallery.querySelectorAll("figure");

    figures.forEach((figure) => {
        const category = parseInt(figure.dataset.category); // obtenir la catégorie associée à chaque élément <figure>
        if (categoryId === 0 || category === categoryId) {
            figure.style.display = "block"; // les afficher
        } else {
            figure.style.display = "none"; // les masquer
        }
    });
}

function isTokenExpired(token) {
    if (token == null || token == undefined) {
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

//le changement de la page principale quand c'est connecté et déconnecté
window.addEventListener("load", function () {
    const token = window.localStorage.getItem("token"); //le token stoké dans le local storage
    const connexionBarSection = document.getElementById("connexion-bar");
    const categorySection = document.getElementById("category");
    const logoutLink = document.getElementById("logout");
    const loginLink = document.getElementById("login");
    const editTextLink = document.getElementById("edit-text");

    if (isTokenExpired(token)) {
        connexionBarSection.style.display = "none";
        categorySection.style.display = "block";
        logoutLink.style.display = "none";
        loginLink.style.display = "block";
        editTextLink.style.display = "none";
    } else {
        connexionBarSection.style.display = "block";
        categorySection.style.display = "none";
        logoutLink.style.display = "block";
        loginLink.style.display = "none";
        editTextLink.style.display = "block";
    }
    console.log(localStorage.getItem("token"));

    logoutLink.addEventListener("click", () => {
        localStorage.clear();
        location.reload();
    });
    displayGallery();
});

document.addEventListener("DOMContentLoaded", function () {
    // récupérer les éléments des modales
    const galleryPicModal = document.getElementById("gallery_pic");
    const addPicModal = document.getElementById("add_pic");
    const arrowLeft = document.getElementById("arrow_left");
    const addPicButton = document.getElementById("add_pic_button");

    // l'événement au click sur le bouton "Ajouter une photo"
    addPicButton.addEventListener("click", function () {
        // masquer la modale gallery_pic
        galleryPicModal.style.display = "none";
        // afficher la modale add_pic
        addPicModal.style.display = "flex";
        addPicModal.style.justifyContent = "center";
    });

    // l'événement au clic sur l'icône "fa-arrow-left"
    arrowLeft.addEventListener("click", function () {
        // afficher la modale gallery_pic
        galleryPicModal.style.display = "flex";
        // masquer la modale add_pic
        addPicModal.style.display = "none";
    });
});

//remplir le fomulaire pour ajouter un projet

document.addEventListener("DOMContentLoaded", function () {
    // récupération des éléments du formulaire
    const validBtn = document.getElementById("valid_btn");
    const imageInput = document.getElementById("image");
    const blueFrame = document.querySelector(".blue_frame");

    // l'événement au bouton de validation du formulaire
    validBtn.addEventListener("click", (event) => {
        if (!testFormValidation()) {
            document.getElementById("error").style.display = "block";
            return; // si le formulaire n'est pas valide on ne fait rien
        } else {
            document.getElementById("error").style.display = "none";
        }

        // récupération des valeurs saisies de l'utilisateur
        const inputTitle = document.getElementById("titre").value;
        const inputCategorie = document.getElementById("categorie").value;
        const inputImage = document.getElementById("image").files[0];

        event.preventDefault();

        // création d'un objet FormData pour envoyer les données du formulaire
        const formData = new FormData();
        formData.append("title", inputTitle);
        formData.append("category", inputCategorie);
        formData.append("image", inputImage);

        // la requête POST vers l'API pour ajouter le travail à la galerie
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    clearGallery(); // effacer la galerie existante
                    displayGallery(); // Afficher la nouvelle galerie
                }
            })
            .catch((error) => console.log(error));
    });
});

// fonction pour vérifier la validation du formulaire
function testFormValidation() {
    const inputTitle = document.getElementById("titre").value;
    const inputCategorie = document.getElementById("categorie").value;
    const inputImage = document.getElementById("image").files[0];
    const validBtn = document.getElementById("valid_btn");

    if (inputTitle !== "" && inputCategorie !== "" && inputImage !== "") {
        validBtn.style.backgroundColor = "#1d6154"; // changement de couleur du bouton si le formulaire est valide
        return true;
    } else {
        return false;
    }
}

// l'événement pour la sélection d'une image
const imageInput = document.getElementById("image");
imageInput.addEventListener("change", function (event) {
    const imagePreview = document.querySelector("#preview_image");
    const selectedImage = event.target.files[0];
    imagePreview.src = URL.createObjectURL(selectedImage); // afficher l'image qu'on veut ajouter

    const spanAddImage = document.querySelector(
        "#add_pic > div.blue_frame > div > span"
    );
    const inputAddImage = event.target;
    spanAddImage.style.display = "none"; // cacher le message Ajouter une image
    inputAddImage.style.display = "none"; // cacher le bouton de sélection d'image
});

// l'événement pour vérifier les champs rempli
const inputTitle = document.getElementById("titre");
const inputCategorie = document.getElementById("categorie");
const inputImage = document.getElementById("image");

inputTitle.addEventListener("change", function (event) {
    testFormValidation(); // voir la validation du formulaire quand le champ du titre est rempli
});
inputCategorie.addEventListener("change", function (event) {
    testFormValidation(); // voir la validation du formulaire quand le champ de la catégorie est rempli
});
inputImage.addEventListener("change", function (event) {
    testFormValidation(); // voir la validation du formulaire quand le champ de l'image est rempli
});

//la modale se ferme si il y a un click en dehors de la modale
document.addEventListener("DOMContentLoaded", function () {
    // récupérer les éléments de la modale
    const modalAdd = document.getElementById("modal_add");
    const editText = document.getElementById("edit-text");

    // fonction pour ouvrir la modale
    function openAddModal() {
        modalAdd.style.display = "flex";
    }

    //fonction pour fermer la modale
    function closeAddModal() {
        modalAdd.style.display = "none";
    }

    // l'ajout d'un écouteur d'événement au clic sur l'élément "edit-text" pour ouvrir la modale
    editText.addEventListener("click", openAddModal);

    // l'ajout d'un écouteur d'événement au clic en dehors de la modale pour la fermer
    window.addEventListener("click", function (event) {
        // vérifier si l'élément cliqué est en dehors de la modale
        if (event.target === modalAdd) {
            closeAddModal();
        }
    });
});

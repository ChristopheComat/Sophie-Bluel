const modalGallery = document.querySelector(".modal_gallery");
const gallery = document.querySelector(".gallery");

function clearGallery() {
    modalGallery.innerHTML = "";
    gallery.innerHTML = "";
}

function displayGallery() {
    // Récupération des projets pour la modale
    fetch("http://localhost:5678/api/works")
        .then((response) => response.json())
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                const project = data[i];

                // Création des éléments + les contenus HTML
                const imgElementModal = document.createElement("img");
                imgElementModal.src = project.imageUrl;
                imgElementModal.alt = project.title;

                const figureElementModal = document.createElement("figure");
                figureElementModal.appendChild(imgElementModal);
                figureElementModal.dataset.workId = project.id;

                // Ajouter l'icône "fa-arrows-up-down-left-right" à la première image de la modale
                if (i === 0) {
                    const iconArrowsElement = document.createElement("i");
                    iconArrowsElement.className =
                        "fa-solid fa-arrows-up-down-left-right arrows-icon";
                    figureElementModal.appendChild(iconArrowsElement);
                }

                const iconTrashElement = document.createElement("i");
                iconTrashElement.className = "fa-solid fa-trash-can trash-icon";
                figureElementModal.appendChild(iconTrashElement);

                // L'événement de suppression au clic sur l'icône "fa-trash-can"
                iconTrashElement.addEventListener("click", () => {
                    figureElementModal.remove();
                    // Supprimer l'image correspondante dans la galerie
                    const figureElementGallery = document.querySelector(
                        `[data-category="${project.category.id}"]`
                    );
                    if (figureElementGallery) {
                        figureElementGallery.remove();
                    }
                    // Effectuer l'appel API pour supprimer le projet
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

                const figureElementGallery = document.createElement("figure");
                figureElementGallery.appendChild(imgElementModal.cloneNode());
                figureElementGallery.dataset.category = project.category.id;

                modalGallery.appendChild(figureElementModal);
                gallery.appendChild(figureElementGallery);
            }
        })
        .catch((error) => console.error(error));
}

// récupération des catégories depuis l'API
fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
        const categorySection = document.querySelector("#category");

        if (categorySection !== null) {
            const categoryList = document.createElement("ul");
            categoryList.classList.add("flex_row");

            const allCategoryItem = document.createElement("li");
            const allCategoryButton = document.createElement("button");
            allCategoryButton.textContent = "Tous";
            allCategoryItem.appendChild(allCategoryButton);
            categoryList.appendChild(allCategoryItem);

            allCategoryButton.addEventListener("click", () => {
                filterWorks(0);
                setActiveButton(allCategoryButton);
            });

            categories.forEach((category) => {
                const categoryItem = document.createElement("li");
                const categoryButton = document.createElement("button");
                categoryButton.textContent = category.name;
                categoryItem.appendChild(categoryButton);
                categoryList.appendChild(categoryItem);

                categoryButton.addEventListener("click", () => {
                    filterWorks(category.id);
                    setActiveButton(categoryButton);
                });

                const selectElementModal = document.getElementById("categorie");

                if (selectElementModal.children.length === 0) {
                    const optionElementEmpty = document.createElement("option");
                    selectElementModal.appendChild(optionElementEmpty);

                    categories.forEach((category) => {
                        const optionElement = document.createElement("option");
                        optionElement.value = category.id;
                        optionElement.textContent = category.name;
                        selectElementModal.appendChild(optionElement);
                    });
                }
            });

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

    // l'écouteur d'événement au click sur le bouton "Ajouter une photo"
    addPicButton.addEventListener("click", function () {
        // masquer la modale gallery_pic
        galleryPicModal.style.display = "none";
        // afficher la modale add_pic
        addPicModal.style.display = "block";
    });

    // l'écouteur d'événement au clic sur l'icône "fa-arrow-left"
    arrowLeft.addEventListener("click", function () {
        // afficher la modale gallery_pic
        galleryPicModal.style.display = "block";
        // masquer la modale add_pic
        addPicModal.style.display = "none";
    });
});

//remplir le fomulaire
document.addEventListener("DOMContentLoaded", function () {
    const validBtn = document.getElementById("valid_btn");
    const imageInput = document.getElementById("image");
    const blueFrame = document.querySelector(".blue_frame");

    validBtn.addEventListener("click", (event) => {
        if (!testFormValidation()) {
            document.getElementById("error").style.display = "block";
            return; // si le formulaire n'est pas valide on ne fait rien
        } else {
            document.getElementById("error").style.display = "none";
        }
        const inputTitle = document.getElementById("titre").value;
        const inputCategorie = document.getElementById("categorie").value;
        const inputImage = document.getElementById("image").files[0];

        event.preventDefault();

        imageInput.addEventListener("change", (event) => {
            const selectedImage = event.target.files[0];
            const imagePreview = document.createElement("img");
            imagePreview.src = URL.createObjectURL(selectedImage);
            imagePreview.alt = "Preview Image";
            imagePreview.classList.add("preview_image");

            blueFrame.innerHTML = ""; // supprime le contenu précédent du cadre

            blueFrame.appendChild(imagePreview); // ajoute l'image de prévisualisation dans le cadre
        });

        const formData = new FormData();
        formData.append("title", inputTitle);
        formData.append("category", inputCategorie);
        formData.append("image", inputImage);

        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    clearGallery();
                    displayGallery();
                }
            })
            .catch((error) => console.log(error));
    });
});

//preview de l'ajout d'image
document.addEventListener("DOMContentLoaded", function () {
    const imageInput = document.getElementById("image");
    const blueFrame = document.querySelector(".blue_frame");
    const imagePreview = document.createElement("img");
    imagePreview.classList.add("preview_image");
    blueFrame.appendChild(imagePreview);

    imageInput.addEventListener("change", function (event) {
        const selectedImage = event.target.files[0];
        imagePreview.src = URL.createObjectURL(selectedImage);
    });
});

function testFormValidation() {
    const inputTitle = document.getElementById("titre").value;
    const inputCategorie = document.getElementById("categorie").value;
    const inputImage = document.getElementById("image").files[0];
    const validBtn = document.getElementById("valid_btn");

    if (inputTitle !== "" && inputCategorie !== "" && inputImage !== "") {
        validBtn.style.backgroundColor = "#1d6154";
        return true;
    } else {
        return false;
    }
}

const inputTitle = document.getElementById("titre");
const inputCategorie = document.getElementById("categorie");
const inputImage = document.getElementById("image");

inputTitle.addEventListener("change", function (event) {
    testFormValidation();
});
inputCategorie.addEventListener("change", function (event) {
    testFormValidation();
});
inputImage.addEventListener("change", function (event) {
    testFormValidation();
});

document.addEventListener("DOMContentLoaded", function () {
    // Récupérer les éléments de la modale
    const modalAdd = document.getElementById("modal_add");
    const editText = document.getElementById("edit-text");

    // Fonction pour ouvrir la modale
    function openAddModal() {
        modalAdd.style.display = "block";
    }

    // Fonction pour fermer la modale
    function closeAddModal() {
        modalAdd.style.display = "none";
    }

    // Ajouter un écouteur d'événement au clic sur l'élément "edit-text" pour ouvrir la modale
    editText.addEventListener("click", openAddModal);

    // Ajouter un écouteur d'événement au clic en dehors de la modale pour la fermer
    window.addEventListener("click", function (event) {
        // Vérifier si l'élément cliqué est en dehors de la modale
        if (event.target === modalAdd) {
            closeAddModal();
        }
    });
});

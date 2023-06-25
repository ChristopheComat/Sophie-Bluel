//// attendre que la page soit chargé
document.addEventListener("DOMContentLoaded", () => {
    // récupérer les éléments du formulaire de connexion
    const loginForm = document.getElementById("form_login");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorElement = document.getElementById("error_message");

    if (loginForm) {
        // l'ajout de l'événement pour le formulaire de connexion
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault(); // empêcher le chargement par défaut du formulaire

            // récupérer les valeurs de l'email et du mot de passe saisis par l'utilisateur
            const email = emailInput.value;
            const password = passwordInput.value;

            // vérification des informations d'identification correctes
            if (email === "sophie.bluel@test.tld" && password === "S0phie") {
                console.log("Connexion réussie");

                // effectuer une requête POST vers l'API pour l'authentification
                fetch("http://localhost:5678/api/users/login", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        const token = data.token; // récuperation du token dans l'API
                        window.localStorage.setItem("token", token); // stocker le token dans le local storage
                        console.log(token);

                        // basculement vers la page "index.html"
                        window.location.href = "index.html";
                    })
                    .catch((error) => {
                        console.log(
                            "Erreur lors de la requête d'authentification : ",
                            error
                        );
                    });
            } else {
                console.log("Échec de connexion");
                if (errorElement) {
                    errorElement.textContent =
                        "Les informations d'identification sont incorrectes.";
                }
            }
            // if (email === "sophie.bluel@test.tld" && password === "S0phie") {
            //     // Connexion réussie
            //     console.log("Connexion réussie");
            // } else {
            //     // échec de connexion
            //     console.log("échec de connexion");
            //     // Message d'erreur affiché
            //     if (errorElement) {
            //         errorElement.textContent =
            //             "Les informations d'identification sont incorrectes.";
            //     }
            // }
        });
    }
});

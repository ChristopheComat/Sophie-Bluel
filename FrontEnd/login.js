document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("form_login");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorElement = document.getElementById("error_message");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = emailInput.value;
            const password = passwordInput.value;
            console.log(email);
            fetch("http://localhost:5678/api/users/login", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    email: email,
                    password: password,
                },
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log("connexion réussie");
                });

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

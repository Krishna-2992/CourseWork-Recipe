const API_URL = 'http://localhost:8080/M0012345';

// Load recipes on page load
$(document).ready(function () {
    loadRecipes();

    // Handle recipe addition
    $('#add-recipe-form').submit(function (e) {
        e.preventDefault();
        const title = $('#recipe-title').val();
        const description = $('#recipe-description').val();
        const ingredients = $('#recipe-ingredients').val().split(',').map(item => item.trim());

        $.ajax({
            url: `${API_URL}/recipes`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ title, description, ingredients }),
            success: () => {
                alert('Recipe added successfully!');
                $('#recipe-title').val('');
                $('#recipe-description').val('');
                $('#recipe-ingredients').val('');
                loadRecipes();
            },
            error: () => alert('Failed to add recipe.'),
        });
    });

    // Handle login
    $('#login-form').submit(function (e) {
        e.preventDefault();
        const username = $('#login-username').val();
        const password = $('#login-password').val();

        $.ajax({
            url: `${API_URL}/login`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: () => {
                alert('Logged in successfully!');
                $('#loginModal').modal('hide');
            },
            error: () => alert('Invalid login credentials.'),
        });
    });

    // Handle registration
    $('#register-form').submit(function (e) {
        e.preventDefault();
        const username = $('#register-username').val();
        const password = $('#register-password').val();

        $.ajax({
            url: `${API_URL}/register`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: () => {
                alert('Registered successfully!');
                $('#registerModal').modal('hide');
            },
            error: () => alert('Failed to register.'),
        });
    });
});

// Load recipes
function loadRecipes() {
    $.ajax({
        url: `${API_URL}/recipes`,
        method: 'GET',
        success: (recipes) => {
            console.log("recipes", recipes)
            const recipesContainer = $('#recipes-container');
            recipesContainer.empty();
            recipes.forEach(recipe => {
                console.log("recipe", recipe)
                recipesContainer.append(`
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${recipe.title}</h5>
                            <p class="card-text">${recipe.description}</p>
                            <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                            <button class="btn btn-primary like-btn" data-id="${recipe._id}">Like (${recipe.likes})</button>
                        </div>
                    </div>
                `);
            });

            // Handle likes
            $('.like-btn').click(function () {
                const recipeId = $(this).data('id');
                $.ajax({
                    url: `${API_URL}/recipes/${recipeId}/like`,
                    method: 'PUT',
                    success: () => {
                        alert('Liked successfully!');
                        loadRecipes();
                    },
                    error: (err) => alert(err.responseJSON.error || 'Failed to like recipe.'),
                });
            });
        },
        error: () => alert('Failed to load recipes.'),
    });
}

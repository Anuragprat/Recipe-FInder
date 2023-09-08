const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const recipeList = document.getElementById("recipe-list");

searchForm.addEventListener("submit", handleFormSubmit);
function handleFormSubmit(e) {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== "") {
    searchRecipes(searchTerm);
  }
}

function searchRecipes(searchTerm) {
  fetch("/recipes")
    .then((response) => response.json())
    .then((data) => {
      const results = data.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      displayRecipes(results);
    })
    .catch((error) => console.error("Error searching recipes", error));
}

function displayRecipes(results) {
  recipeList.innerHTML = "";
  if (results.length === 0) {
    const noResultsItem = document.createElement("li");
    noResultsItem.textContent = "No recipes found.";
    recipeList.appendChild(noResultsItem);
  } else {
    results.forEach((recipe) => {
      const recipeItem = document.createElement("li");
      recipeItem.classList.add("recipe-item");

      const recipeName = document.createElement("h3");
      recipeName.textContent = recipe.name;
      recipeItem.appendChild(recipeName);

      const ingredientsList = document.createElement("ul");
      recipe.ingredients.forEach((ingredient) => {
        const ingredientItem = document.createElement("li");
        ingredientItem.textContent = ingredient;
        ingredientsList.appendChild(ingredientItem);
      });
      recipeItem.appendChild(ingredientsList);

      const instructions = document.createElement("p");
      instructions.textContent = recipe.instructions;
      recipeItem.appendChild(instructions);

      recipeList.appendChild(recipeItem);
    });
  }
}
const recipeForm = document.getElementById("recipe-form");

recipeForm.addEventListener("submit", handleRecipeFormSubmit);

function handleRecipeFormSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("recipe-name").value.trim();
  const ingredients = document
    .getElementById("recipe-ingredients")
    .value.trim();
  const instructions = document
    .getElementById("recipe-instructions")
    .value.trim();

  if (name === "" || ingredients === "" || instructions === "") {
    alert("Please fill in all fields");
    return;
  }

  addRecipe(name, ingredients, instructions);
  recipeForm.reset();
}

function addRecipe(name, ingredients, instructions) {
  const data = { name, ingredients, instructions };

  fetch("/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((message) => {
      alert(message);
      searchRecipes("");
    })
    .catch((error) => console.error("Error adding recipe:", error));
}

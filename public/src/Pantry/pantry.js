import {
  apiID,
  apiKey,
  apiCredentialsPromise,
} from "../shared_util/API/API.js";

let currentObject = null;
let currentQuery = null;
let container = document.querySelector(".results");

async function fetchRecipes(query) {
  // Wait for API credentials to be fetched
  await apiCredentialsPromise;

  console.log("fetching recipes for query:", query);

  let queryAppend = `?type=public&q=${query}&app_id=${apiID}&app_key=${apiKey}`;
  currentQuery = query;

  try {
    let response = await fetch(
      `https://api.edamam.com/api/recipes/v2${queryAppend}`
    );
    let data = await response.json();
    // Cut off the number of recipes to 1 (random recipe from 1 - 20 hits)
    let randomIndex = Math.floor(Math.random() * data.hits.length);
    data.hits = data.hits.slice(randomIndex, randomIndex + 1);
    currentObject = data;
    renderRecipes(data);
  } catch (err) {
    console.log(err);
  }
}

async function renderRecipes(data, isMore = false) {
  if (data.hits.length > 0) {
    console.log("rendering recipes in: ", data);
    // updateRecipes will remove all recipes, this will only add more

    data.hits.forEach((hit) => {
      let recipe = hit.recipe;

      let card = document.createElement("div");
      card.classList.add("result");
      card.innerHTML = `
        <div class="result-title">
            <h3>${recipe.label}</h3>
          </div>
          <div class="result-link">
            <a href="${recipe.url}" target="_blank">View Recipe</a>
          </div>
            <img class="result-image" src="${recipe.image}" alt="${recipe.label}">
        </div>
          `;
      container.appendChild(card);
    });
  }
}

// Define the media query
let mediaQuery = window.matchMedia("(max-width: 768px)");

const navbarContainer = document.querySelector(".navbar-container");
const navbarIcon = document.getElementById("icon-image");
const navbarCheckbox = document.getElementById("icon-checkbox");

// Grab the ingredient search input
let ingredientSearch = document.getElementById("search-input");

// If enter key is pressed, add ingredient to the list
ingredientSearch.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    let ingredient = document.getElementById("search-input").value;
    if (ingredient === "") {
      return;
    }
    // Add ingredient to the list
    addIngredient(ingredient);
  }
});
// If search button is pressed, add ingredient to the list
document.getElementById("search-button").addEventListener("click", () => {
  let ingredient = document.getElementById("search-input").value;
  if (ingredient === "") {
    return;
  }
  // Add ingredient to the list
  addIngredient(ingredient);
});

// Funtion to add ingredient to current list
let ingredientList = document.querySelector(".ingredient-list");

// Ingredient array to store ingredients actively
let ingredientArray = [];

function addIngredient(ingredient) {
  // Debounce the updateRecipes function
  debouncedUpdateRecipes(10 * 1000);

  // Create a new list item
  let newIngredient = document.createElement("li");
  newIngredient.classList.add("ingredient-list-item");
  newIngredient.innerHTML = `
  <button class="fa-solid fa-xmark"></button>&nbsp;${ingredient}
  `;
  ingredientList.appendChild(newIngredient);

  // Add ingredient to the array
  ingredientArray.push(ingredient);

  // Add event listener on the button to remove ingredient from list
  newIngredient.querySelector("button").addEventListener("click", () => {
    newIngredient.remove();

    // Filter out the removed ingredient from the array (remove it)
    ingredientArray = ingredientArray.filter((item) => item !== ingredient);

    // Update the stored ingredients
    localStorage.setItem("ingredients", JSON.stringify(ingredientArray));

    // Update the recipes
    debouncedUpdateRecipes(10 * 1000);
  });

  // Clear the search input
  ingredientSearch.value = "";

  // Update the stored ingredients
  localStorage.setItem("ingredients", JSON.stringify(ingredientArray));
}

// Function to update the recommended recipes
function updateRecipes() {
  console.log("updating recipes...");
  // Clear the current recommended recipes
  let recipeList = document.querySelector(".results");

  // If there are no ingredients, send a message
  if (ingredientArray.length === 0) {
    let message = document.createElement("div");
    message.innerHTML = `
    <h3>Add more ingredients to see recommended recipes!</h3>`;
    message.style.textAlign = "center";
    message.style.fontStyle = "italic";
    // Grab color variable from CSS
    message.style.color = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--secondary-color");
    // Clear the skeleton loader
    recipeList.innerHTML = "";
    recipeList.appendChild(message);
    return;
  }

  recipeList.innerHTML = "";

  // Generate new recipes (random number of random ingredients)
  let numberOfRecipes = 4;

  for (let i = 0; i < numberOfRecipes; i++) {
    // Recipe ingredients to query
    let randomRecipe = [];

    // Random number of ingredients
    let numberOfIngredients =
      Math.floor(Math.random() * ingredientArray.length) + 1;

    // Limit number of ingredients to 5
    if (numberOfIngredients > 5) numberOfIngredients = 5;

    // Random ingredients
    for (let j = 0; j < numberOfIngredients; j++) {
      let randomIngredient =
        ingredientArray[Math.floor(Math.random() * ingredientArray.length)];

      // Add random ingredient to random recipe (if ingredient is not already present)
      if (!randomRecipe.includes(randomIngredient))
        randomRecipe.push(randomIngredient);
    }

    // Query the recipe API with randomRecipe, and take the first result
    let ingredientString = randomRecipe.join(", ");
    fetchRecipes(ingredientString);
  }
}

// Debounce updateRecipes function
function debounceUpdateRecipes() {
  let timeout;
  return function (delay = 10 * 1000) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      updateRecipes();
    }, delay);
    // Clear the current recommended recipes and show a skeleton loader

    // Add a skeleton loader card while fetching recipes
    container.innerHTML = "";
    let skeletonLoader = document.createElement("div");
    skeletonLoader.classList.add("result-skeleton");
    container.appendChild(skeletonLoader);
  };
}

let debouncedUpdateRecipes = debounceUpdateRecipes();

// On page load, after ingredients are loaded, update the recipes
// Total time to wait: 1 second
setTimeout(() => {
  debouncedUpdateRecipes(0); // Clear the timeout and update immediately
}, 1000);

// Check if there are stored ingredients
let storedIngredients = JSON.parse(localStorage.getItem("ingredients"));
if (storedIngredients && storedIngredients.length !== 0) {
  storedIngredients.forEach((ingredient) => {
    addIngredient(ingredient);
  });
} else {
  // If no stored ingredients, send user a message
  fetchRecipes("Sending user a message");
  console.log("No stored ingredients");
}

// Function to check screen size and apply the appropriate styles
function checkScreenSize() {
  if (mediaQuery.matches) {
    // Small screen: hide sidebar, show icon
    navbarContainer.classList.add("hidden");
    navbarIcon.classList.remove("hidden");
    navbarCheckbox.classList.remove("hidden");
    navbarContainer.classList.remove("expanded");
  } else {
    // Large screen: show sidebar in default state, hide icon
    navbarContainer.classList.remove("hidden");
    navbarIcon.classList.add("hidden");
    navbarCheckbox.classList.add("hidden");
    navbarContainer.classList.remove("expanded");
  }
}

// Listen for changes in screen size
mediaQuery.addEventListener("change", checkScreenSize);

// Initial check on page load
checkScreenSize();

// Toggle sidebar on icon click
navbarCheckbox.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent click from bubbling to document
  navbarContainer.classList.toggle("expanded");
  navbarContainer.classList.toggle("hidden");
});

// Close sidebar when clicking outside of it
document.addEventListener("click", (e) => {
  if (
    !navbarContainer.contains(e.target) &&
    !navbarCheckbox.contains(e.target) &&
    navbarContainer.classList.contains("expanded")
  ) {
    navbarContainer.classList.remove("expanded");
    navbarContainer.classList.add("hidden");
  }
});

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

  let queryAppend = `?type=public&q=${query}&app_id=${apiID}&app_key=${apiKey}`;
  currentQuery = query;

  try {
    let response = await fetch(
      `https://api.edamam.com/api/recipes/v2${queryAppend}`
    );
    let data = await response.json();
    console.log(data);
    currentObject = data;
    renderRecipes(data);
  } catch (err) {
    console.log(err);
  }
}

async function fetchMore() {
  try {
    let response = await fetch(`${currentObject._links.next.href}`);
    let data = await response.json();
    console.log(data);
    if (data.hits.length === 0) {
      console.log("no more results");
      return;
    }
    currentObject = data;

    let isMore = true;
    renderRecipes(data, isMore);
  } catch (err) {
    console.log(err);
  }
}

async function renderRecipes(data, isMore = false) {
  if (data.hits.length > 0) {
    if (!isMore) {
      container.innerHTML = "";
    }
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

  if (data.to !== data.count) {
    // if there are more results
    // adding load more button
    let button = document.createElement("button");
    button.classList.add("load-button");
    button.classList.add("nice-button");
    button.innerHTML = "Load More";
    container.appendChild(button);
    button.addEventListener("click", () => {
      // delete load button
      button.remove();
      fetchMore();
    });
  }

  // if no results
  if (data.hits.length === 0) {
    container.innerHTML = `
          <h3 class="no-results">no results found</h3>
        `;
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
  console.log("search button clicked");
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
    updateRecipes();
  });

  // Clear the search input
  ingredientSearch.value = "";

  // Update the recommended recipes
  updateRecipes();
}

// Function to update the recommended recipes
function updateRecipes() {
  // Update the stored ingredients
  localStorage.setItem("ingredients", JSON.stringify(ingredientArray));
  // Clear the current recipes
  let recipeList = document.querySelector(".results");
  recipeList.innerHTML = "";

  // Generate new recipes (random number of random ingredients)
  let numberOfRecipes = 5;

  // Random number
  for (let i = 0; i < numberOfRecipes; i++) {
    // Recipe to query
    let randomRecipe = [];

    // Grabbing number of ingredients to use
    let numberOfIngredients =
      Math.floor(Math.random() * ingredientArray.length) + 1;

    // Random ingredients
    for (let i = 0; i < numberOfIngredients; i++) {
      let randomIngredient =
        ingredientArray[Math.floor(Math.random() * ingredientArray.length)];
      // Add random ingredient to random recipe
      randomRecipe.push(randomIngredient);
    }

    // Query the recipe API with randomRecipe, and take the first result
    let ingredientString = ingredientArray.join(", ");
    fetchRecipes(ingredientString);
  }
}

// Check if there are stored ingredients
let storedIngredients = JSON.parse(localStorage.getItem("ingredients"));
if (storedIngredients && storedIngredients.length > 0) {
  storedIngredients.forEach((ingredient) => {
    addIngredient(ingredient);
  });
} else {
  // If no stored ingredients, send user a message
  fetchRecipes("No recipes to display");
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

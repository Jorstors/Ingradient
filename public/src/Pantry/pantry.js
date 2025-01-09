// Define the media query
let mediaQuery = window.matchMedia("(max-width: 768px)");

const navbarContainer = document.querySelector(".navbar-container");
const navbarIcon = document.getElementById("icon-image");
const navbarCheckbox = document.getElementById("icon-checkbox");

// Ingredient adding

// Grab the ingredient search input

let ingredientSearch = document.getElementById("search-input");

// If enter key is pressed, add ingredient to the list
ingredientSearch.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    console.log("enter key pressed");
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

function addIngredient(ingredient) {
  // Create a new list item
  let newIngredient = document.createElement("li");
  newIngredient.classList.add("ingredient-list-item");
  newIngredient.innerHTML = `
  <button class="fa-solid fa-xmark"></button>&nbsp;${ingredient}
  `;
  ingredientList.appendChild(newIngredient);

  // Add event listener on the button to remove ingredient from list
  newIngredient.querySelector("button").addEventListener("click", () => {
    newIngredient.remove();
  });

  // Clear the search input
  ingredientSearch.value = "";
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

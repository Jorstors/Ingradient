import {
  apiID,
  apiKey,
  apiCredentialsPromise,
} from "../shared_util/API/API.js";

let currentObject = null;
let currentQuery = null;
let container = document.querySelector(".results");

async function fetchRecipes(query) {
  // Add a skeleton loader card while fetching recipes
  container.innerHTML = "";
  let skeletonLoader = document.createElement("div");
  skeletonLoader.classList.add("result-skeleton");
  container.appendChild(skeletonLoader);

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

// Default search
fetchRecipes("Chicken, Paprika, Spinach");

// Queried search
document.getElementById("search-button").addEventListener("click", () => {
  console.log("search button clicked");
  let query = document.getElementById("search-input").value;
  if (query === "") {
    return fetchRecipes("breakfast lunch dinner");
  }
  fetchRecipes(query);
});
document.getElementById("search-input").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    console.log("enter key pressed");
    let query = document.getElementById("search-input").value;
    if (query === "") {
      return fetchRecipes("breakfast lunch dinner");
    }
    fetchRecipes(query);
  }
});

// Define the media query
let mediaQuery = window.matchMedia("(max-width: 768px)");

const navbarContainer = document.querySelector(".navbar-container");
const navbarIcon = document.getElementById("icon-image");
const navbarCheckbox = document.getElementById("icon-checkbox");

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

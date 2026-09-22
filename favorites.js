// North Star Bakery - Save for Pickup feature (Touchstone 4)
// Lets a visitor build a short pickup list from the products page.
// Data is stored as an array of objects in localStorage so the list
// survives page reloads and repeat visits.

const FAVORITES_STORAGE_KEY = "northStarBakeryFavorites";

// Reads the saved favorites array of objects from localStorage.
// Returns an empty array if nothing has been saved yet.
function loadFavorites() {
  const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

// Writes the favorites array of objects back to localStorage as JSON.
function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

// Adds one product object ({ name, price, category }) to the favorites
// array if it is not already saved, then persists the updated array.
function addFavorite(favorites, product) {
  const alreadySaved = favorites.some((item) => item.name === product.name);
  if (alreadySaved) {
    return favorites;
  }
  const updated = favorites.concat([product]);
  saveFavorites(updated);
  return updated;
}

// Removes one product (by name) from the favorites array and persists
// the updated array.
function removeFavorite(favorites, productName) {
  const updated = favorites.filter((item) => item.name !== productName);
  saveFavorites(updated);
  return updated;
}

// Renders the current favorites array into the #favorites-list element,
// toggling the empty-state message and clear button as needed.
function renderFavorites(favorites) {
  const list = document.getElementById("favorites-list");
  const emptyMessage = document.getElementById("favorites-empty-message");
  const clearButton = document.getElementById("clear-favorites-btn");

  list.innerHTML = "";

  if (favorites.length === 0) {
    emptyMessage.hidden = false;
    clearButton.hidden = true;
    return;
  }

  emptyMessage.hidden = true;
  clearButton.hidden = false;

  favorites.forEach((product) => {
    const item = document.createElement("li");

    const label = document.createElement("span");
    label.textContent = product.name + " (" + product.category + ") – " + product.price;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("data-remove-name", product.name);
    removeButton.addEventListener("click", handleRemoveClick);

    item.appendChild(label);
    item.appendChild(removeButton);
    list.appendChild(item);
  });
}

// Click handler for a product's "Save for Pickup" button.
function handleSaveClick(event) {
  const productItem = event.target.closest(".product-item");
  const product = {
    name: productItem.getAttribute("data-name"),
    price: productItem.getAttribute("data-price"),
    category: productItem.getAttribute("data-category"),
  };

  let favorites = loadFavorites();
  favorites = addFavorite(favorites, product);
  renderFavorites(favorites);
}

// Click handler for a saved item's "Remove" button.
function handleRemoveClick(event) {
  const name = event.target.getAttribute("data-remove-name");
  let favorites = loadFavorites();
  favorites = removeFavorite(favorites, name);
  renderFavorites(favorites);
}

// Click handler for "Clear Saved Items".
function handleClearClick() {
  saveFavorites([]);
  renderFavorites([]);
}

// Wires up all Save buttons and the Clear button, then renders whatever
// was already saved from a previous visit.
function initFavorites() {
  const saveButtons = document.querySelectorAll(".save-btn");
  saveButtons.forEach((button) => {
    button.addEventListener("click", handleSaveClick);
  });

  const clearButton = document.getElementById("clear-favorites-btn");
  clearButton.addEventListener("click", handleClearClick);

  const favorites = loadFavorites();
  renderFavorites(favorites);
}

document.addEventListener("DOMContentLoaded", initFavorites);

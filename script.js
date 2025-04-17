document.getElementById("searchButton").addEventListener("click", function () {
  const searchQuery = document.getElementById("productSearch").value.trim();
  if (!searchQuery) {
    alert("Please enter a product name to search.");
    return;
  }

  clearPreviousResults();

  showLoadingBar();

  setTimeout(function () {
    searchProduct(searchQuery);
    hideLoadingBar();
  }, 2000); // Simulate 2 seconds of processing
});

function showLoadingBar() {
  document.getElementById("loadingBar").classList.remove("hidden");
  document.getElementById("progress").style.width = "0%";
}

function hideLoadingBar() {
  document.getElementById("loadingBar").classList.add("hidden");
}

function clearPreviousResults() {
  // Clear previous search result text and content
  document.getElementById("searchResult").textContent = "";

  // Hide previous product and alternatives
  document.getElementById("israel-product-container").classList.add("hidden");
  document.getElementById("alternatives-container").classList.add("hidden");

  // Clear suggestions list
  document.getElementById("suggestionsList").innerHTML = '';

  // Hide the search result container initially
  document.getElementById("searchResultContainer").classList.add("hidden");
}

async function searchProduct(query) {
  try {
    // Load the boycott list from the JSON file
    const response = await fetch("boycott_list_formatted (1).json");
    const data = await response.json();

    // Log the first item in the fetched data to inspect the structure
    console.log("First item in the data:", data[0]);

    // Check if data is valid
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid data structure.');
    }

    // Find the product that matches the search query by checking p.attributes.name
    const product = data.find(p => p.attributes && p.attributes.name && p.attributes.name.toLowerCase().includes(query.toLowerCase()));

    // Log the product that is found
    console.log("Found product:", product);

    if (!product) {
      // If no product is found
      document.getElementById("searchResult").textContent = "Product not found.";
      document.getElementById("israel-product-container").classList.add("hidden");
      document.getElementById("alternatives-container").classList.add("hidden");
    } else {
      // If the product is found, display it
      displayCart(product);
      suggestAlternatives(product.attributes.alternative); // Ensure alternatives are passed correctly
    }
  } catch (error) {
    console.error("Error loading or parsing the JSON file:", error);
    document.getElementById("searchResult").textContent = `Failed to load product data: ${error.message}`;
    document.getElementById("searchResultContainer").classList.remove("hidden");
  }
}

function displayCart(product) {
  const productData = product.attributes; // Accessing the nested `attributes` object
  document.getElementById("productName").textContent = `Product Name: ${productData.name}`;
  document.getElementById("productImage").src = productData.imageUrl;

  document.getElementById("israel-product-container").classList.remove("hidden");
}

function suggestAlternatives(alternative) {
  // Log the alternative data to check if it exists
  console.log("Alternative data:", alternative);

  let list = document.getElementById("suggestionsList");
  list.innerHTML = ''; // Clear any previous suggestions

  // Check if alternatives are available (alternative is an object with a `data` array)
  if (alternative && Array.isArray(alternative.data) && alternative.data.length > 0) {
    // Iterate over the alternatives and render each one
    alternative.data.forEach(function (alt) {
      if (alt.attributes) {
        let productElement = document.createElement("div");
        productElement.classList.add("suggested-product");

        // Left side: Product Info
        let productInfo = document.createElement("div");
        productInfo.classList.add("product-info");

        productInfo.innerHTML = `
          <p id="alt-name"><strong>Product Name: ${alt.attributes.name}</strong></p>
          <p>${alt.attributes.company ? `Company: ${alt.attributes.company}` : ''}</p>
          <div class="palestine-banner">
            <p>From the River to the Sea,<br>Palestine Will be Free.</p>
          </div>
        `;

        // Right side: Product Image
        let productImage = document.createElement("div");
        productImage.classList.add("product-image");
        productImage.innerHTML = `<img src="${alt.attributes.imageUrl}" alt="${alt.attributes.name}" />`;

        productElement.appendChild(productInfo);
        productElement.appendChild(productImage);

        list.appendChild(productElement);
      }
    });

    // Show the alternatives container
    document.getElementById("alternatives-container").classList.remove("hidden");
  } else {
    // If there are no alternatives, hide the alternatives section
    console.log("No alternative available.");
    document.getElementById("alternatives-container").classList.add("hidden");
  }
}

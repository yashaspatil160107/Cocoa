/* Shared catalogue, cart, and page interactions for Cocoa World. */
const products = [
  { name: "Midnight Orchard", category: "Dark", country: "Ghana", price: 690, image: "photo-1606313564200-e75d5e30476c", note: "72% cacao · tart cherry" },
  { name: "Alpine Milk", category: "Milk", country: "Switzerland", price: 540, image: "photo-1548907040-4d42cfc8c", note: "Silky milk · honey crunch" },
  { name: "Brussels Praline No. 4", category: "Pralines", country: "Belgium", price: 890, image: "photo-1575377427642-087cf684f29d", note: "Hazelnut praline · sea salt" },
  { name: "Rosewater Ruby", category: "Ruby", country: "India", price: 740, image: "photo-1511381939415-e44015466834", note: "Ruby cacao · rose petal" },
  { name: "White Peach Cloud", category: "White", country: "Japan", price: 620, image: "photo-1582176604856-e824b4736522", note: "White chocolate · yuzu" },
  { name: "The Paris Truffle", category: "Truffles", country: "France", price: 980, image: "photo-1606312619070-d48b4c652a52", note: "Dark ganache · cocoa dust" },
  { name: "Pistachio Postcard", category: "Filled", country: "Italy", price: 820, image: "photo-1606313564200-e75d5e30476c", note: "Pistachio cream · wafer" },
  { name: "Miso Caramel Bar", category: "Milk", country: "Japan", price: 720, image: "photo-1548907040-4d42cfc8c", note: "Brown butter · white miso" },
  { name: "Cocoa Coast 80", category: "Dark", country: "Ecuador", price: 760, image: "photo-1575377427642-087cf684f29d", note: "Single origin · citrus" },
  { name: "Café Noisette", category: "Pralines", country: "France", price: 860, image: "photo-1511381939415-e44015466834", note: "Coffee praline · roasted hazelnut" },
  { name: "Saffron Silk", category: "White", country: "India", price: 680, image: "photo-1582176604856-e824b4736522", note: "Kashmiri saffron · almond" },
  { name: "Theatre Box Truffles", category: "Truffles", country: "UK", price: 1100, image: "photo-1606312619070-d48b4c652a52", note: "Six-piece velvet ganache" },
  { name: "Black Forest Bite", category: "Filled", country: "Germany", price: 790, image: "photo-1606313564200-e75d5e30476c", note: "Sour cherry · dark chocolate" },
  { name: "Maple Campfire", category: "Milk", country: "USA", price: 640, image: "photo-1548907040-4d42cfc8c", note: "Maple sugar · toasted pecan" },
  { name: "Ruby Afterglow", category: "Ruby", country: "Belgium", price: 770, image: "photo-1575377427642-087cf684f29d", note: "Berry bright · smooth finish" },
  { name: "Golden Hour 65", category: "Dark", country: "Ghana", price: 590, image: "photo-1511381939415-e44015466834", note: "Golden raisin · warm spice" },
  { name: "Lemon Grove Praline", category: "Pralines", country: "Italy", price: 840, image: "photo-1582176604856-e824b4736522", note: "Piedmont hazelnut · lemon" },
  { name: "Matcha Daydream", category: "White", country: "Japan", price: 710, image: "photo-1606312619070-d48b4c652a52", note: "Ceremonial matcha · white cacao" },
  { name: "Almond Croquant", category: "Filled", country: "Switzerland", price: 750, image: "photo-1606313564200-e75d5e30476c", note: "Gianduja · caramelised almond" },
  { name: "Velvet Fig", category: "Truffles", country: "India", price: 990, image: "photo-1548907040-4d42cfc8c", note: "Fig conserve · 68% ganache" }
];

const categories = ["All", "Dark", "Milk", "White", "Ruby", "Truffles", "Pralines", "Filled"];
const money = (amount) => `₹${amount.toLocaleString("en-IN")}`;
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const imageUrl = (photoId, width = 900) => `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=85`;
const fallbackImage = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 1000%22%3E%3Crect width=%22800%22 height=%221000%22 fill=%22%23fefae0%22/%3E%3Cpath d=%22M250 390h300v220H250z%22 fill=%22%2339251f%22/%3E%3Cpath d=%22M350 390v220m100-220v220M250 500h300%22 stroke=%22%23a3b18a%22 stroke-width=%2210%22/%3E%3C/svg%3E";

// localStorage can be unavailable for some file:// browser configurations.
function readCart() {
  try { return JSON.parse(localStorage.getItem("cocoaWorldCart") || "{}"); } catch { return {}; }
}
function saveCart(cart) {
  try { localStorage.setItem("cocoaWorldCart", JSON.stringify(cart)); } catch { /* Keep the current page usable without storage. */ }
}
function updateCartBadge() {
  const count = Object.values(readCart()).reduce((sum, quantity) => sum + quantity, 0);
  document.querySelectorAll(".cart-count").forEach((badge) => { badge.textContent = count; });
  document.querySelectorAll(".cart-button").forEach((button) => button.setAttribute("aria-label", `Shopping cart, ${count} ${count === 1 ? "item" : "items"}`));
}
function addToCart(name) {
  const cart = readCart();
  cart[name] = (cart[name] || 0) + 1;
  saveCart(cart);
  updateCartBadge();
}

// Add staggered display lettering and activate scroll reveals.
document.querySelectorAll("[data-split]").forEach((heading) => {
  const word = heading.textContent.trim();
  heading.setAttribute("aria-label", word);
  heading.innerHTML = [...word].map((letter, index) => `<span aria-hidden="true" style="--i:${index}">${letter}</span>`).join("");
});
let revealObserver;
function observeReveals() {
  const targets = document.querySelectorAll(".reveal:not(.is-visible)");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }
  if (!revealObserver) revealObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  targets.forEach((target) => revealObserver.observe(target));
}

// Shared product cards link to the dedicated detail page.
function productCard(product, index) {
  const slug = slugify(product.name);
  return `<article class="product-card reveal" style="--delay:${(index % 3) * 70}ms">
    <div class="product-image-wrap"><a href="product.html?id=${slug}" aria-label="View ${product.name}"><img class="product-image" src="${imageUrl(product.image)}" alt="${product.name} chocolate" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImage}'"></a>
      <div class="image-wash"><button class="quick-add" type="button" data-add="${product.name}">Quick Add&nbsp; +</button></div></div>
    <div class="product-meta"><span class="category-tag">${product.category}</span><span class="product-origin">${product.country}</span></div>
    <div class="product-title-row"><h3 class="product-title"><a href="product.html?id=${slug}">${product.name}</a></h3><span class="product-price">${money(product.price)}</span></div>
  </article>`;
}

// Catalogue page: category pills, country selector, and price sorting.
const grid = document.querySelector("#products");
if (grid) {
  const categoryFilters = document.querySelector("#category-filters");
  const countryFilter = document.querySelector("#country-filter");
  const priceSort = document.querySelector("#price-sort");
  const emptyState = document.querySelector("#empty-state");
  const resultCount = document.querySelector("#result-count");
  let activeCategory = "All";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `category-pill${category === activeCategory ? " is-active" : ""}`;
    button.type = "button"; button.textContent = category;
    button.setAttribute("aria-pressed", String(category === activeCategory));
    button.addEventListener("click", () => {
      activeCategory = category;
      categoryFilters.querySelectorAll("button").forEach((pill) => {
        const selected = pill === button;
        pill.classList.toggle("is-active", selected); pill.setAttribute("aria-pressed", String(selected));
      });
      renderProducts();
    });
    categoryFilters.append(button);
  });
  [...new Set(products.map((product) => product.country))].sort().forEach((country) => {
    const option = document.createElement("option"); option.value = country; option.textContent = country; countryFilter.append(option);
  });
  function renderProducts() {
    const country = countryFilter.value;
    const sort = priceSort.value;
    let visible = products.filter((product) => (activeCategory === "All" || product.category === activeCategory) && (country === "all" || product.country === country));
    if (sort === "low") visible = [...visible].sort((a, b) => a.price - b.price);
    if (sort === "high") visible = [...visible].sort((a, b) => b.price - a.price);
    grid.innerHTML = visible.map(productCard).join("");
    emptyState.hidden = visible.length > 0;
    resultCount.textContent = `${visible.length} little ${visible.length === 1 ? "obsession" : "obsessions"}`;
    observeReveals();
  }
  countryFilter.addEventListener("change", renderProducts);
  priceSort.addEventListener("change", renderProducts);
  renderProducts();
}

// Home page: a small featured edit from the complete collection.
const featuredGrid = document.querySelector("#featured-products");
if (featuredGrid) {
  [products[0], products[2], products[4]].forEach((product, index) => {
    featuredGrid.insertAdjacentHTML("beforeend", productCard(product, index));
  });
  observeReveals();
}

// Dedicated product detail page, addressed by ?id=product-slug.
const detailRoot = document.querySelector("#product-detail-content");
if (detailRoot) {
  const slug = new URLSearchParams(window.location.search).get("id");
  const product = products.find((item) => slugify(item.name) === slug) || products[0];
  document.title = `${product.name} — Cocoa World`;
  detailRoot.innerHTML = `<div class="detail-image"><img src="${imageUrl(product.image, 1200)}" alt="${product.name} chocolate" onerror="this.onerror=null;this.src='${fallbackImage}'"></div>
    <div class="detail-info"><p class="eyebrow">${product.category} · FROM ${product.country}</p><h1>${product.name}</h1><p class="detail-note">${product.note}. A small-batch favourite, made for slow afternoons and generous sharing (if you’re feeling generous).</p><p class="detail-price">${money(product.price)}</p><button class="quick-add detail-add" type="button" data-add="${product.name}">ADD TO CART&nbsp; +</button><p class="detail-shipping">Packed with care · Free shipping over ₹2,500</p></div>`;
}

// Cart page: quantities persist between standalone HTML pages.
const cartRoot = document.querySelector("#cart-items");
if (cartRoot) {
  const summary = document.querySelector("#cart-summary");
  function renderCart() {
    const cart = readCart();
    const entries = Object.entries(cart).filter(([, quantity]) => quantity > 0).map(([name, quantity]) => ({ product: products.find((item) => item.name === name), quantity })).filter((entry) => entry.product);
    if (!entries.length) {
      cartRoot.innerHTML = `<p class="cart-empty">Your cart is taking a little breather.</p>`;
      summary.innerHTML = "";
      return;
    }
    cartRoot.innerHTML = entries.map(({ product, quantity }) => `<article class="cart-row"><img src="${imageUrl(product.image, 260)}" alt="" onerror="this.onerror=null;this.src='${fallbackImage}'"><div><a class="cart-item-name" href="product.html?id=${slugify(product.name)}">${product.name}</a><p>${product.category} · ${product.country}</p><div class="quantity-control"><button type="button" data-cart-change="-1" data-product="${product.name}" aria-label="Remove one ${product.name}">−</button><span>${quantity}</span><button type="button" data-cart-change="1" data-product="${product.name}" aria-label="Add one ${product.name}">+</button><button class="remove-item" type="button" data-cart-remove="${product.name}">REMOVE</button></div></div><strong>${money(product.price * quantity)}</strong></article>`).join("");
    const total = entries.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
    summary.innerHTML = `<span>SUBTOTAL</span><strong>${money(total)}</strong><small>Shipping calculated at checkout.</small><button type="button" class="checkout-button" disabled>CHECKOUT COMING SOON</button>`;
  }
  cartRoot.addEventListener("click", (event) => {
    const change = event.target.closest("[data-cart-change]");
    const remove = event.target.closest("[data-cart-remove]");
    const cart = readCart();
    if (change) {
      const name = change.dataset.product;
      cart[name] = (cart[name] || 0) + Number(change.dataset.cartChange);
      if (cart[name] <= 0) delete cart[name];
      saveCart(cart); renderCart(); updateCartBadge();
    } else if (remove) {
      delete cart[remove.dataset.cartRemove]; saveCart(cart); renderCart(); updateCartBadge();
    }
  });
  renderCart();
}

// Quick Add works from both the catalogue and detail page.
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  addToCart(button.dataset.add);
  button.textContent = "Added ✓";
  window.setTimeout(() => { if (button.isConnected) button.innerHTML = button.classList.contains("detail-add") ? "ADD TO CART&nbsp; +" : "Quick Add&nbsp; +"; }, 1100);
});

// Gentle scroll parallax for the floating home-page photos.
let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    document.querySelectorAll("[data-parallax]").forEach((photo) => { photo.style.marginTop = `${window.scrollY * Number(photo.dataset.parallax)}px`; });
    ticking = false;
  });
}, { passive: true });

// Newsletter signup feedback (frontend-only demo).
const newsletterForm = document.querySelector("#newsletter-form");
if (newsletterForm) newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const emailInput = document.querySelector("#newsletter-email");
  document.querySelector("#form-message").textContent = `You're on the list, ${emailInput.value.trim()} — something sweet is coming.`;
  emailInput.value = "";
});

updateCartBadge();
observeReveals();

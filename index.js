let cart = []; // array to store cart items

async function loadProducts() {
  try {
    const response = await fetch("./data.json");
    const products = await response.json();

    const productList = document.getElementById("product-list");

    // render products
    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");

      productDiv.innerHTML = `
          <div class="image">
            <img src="${product.image.mobile}" alt="${product.name}" />
            <button class="add-to-cart">
              <i class="bi bi-cart-plus"></i>
              <span>Add to Cart</span>
            </button>
          </div>
          <p class="category">${product.category}</p>
          <p class="name">${product.name}</p>
          <p class="price">$${product.price.toFixed(2)}</p>
        `;

      // Add to cart button
      productDiv.querySelector(".add-to-cart").addEventListener("click", () => {
        addToCart(product);
      });

      productList.appendChild(productDiv);
    });
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function addToCart(product) {
  // check if item already in cart
  const existingItem = cart.find((item) => item.name === product.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
}

function removeFromCart(name) {
  cart = cart.filter((item) => item.name !== name);
  renderCart();
}

function changeQuantity(name, amount) {
  const item = cart.find((i) => i.name === name);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(name);
  } else {
    renderCart();
  }
}

function renderCart() {
  const cartList = document.getElementById("cart-list");
  const cartCount = document.getElementById("cartCount");

  cartList.innerHTML = ""; // clear cart list

  if (cart.length === 0) {
    cartList.innerHTML = `<img src="assets/images/illustration-empty-cart.svg" alt="">`;
    cartCount.textContent = "(0)";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <div class="text">
        <p class="name">${item.name}</p>
        <div>
          <span class="quantity">${item.quantity}x</span>
          <span class="price">
            <span class="single-price">@$${item.price.toFixed(2)}</span>
            <span class="computed-price">$${itemTotal.toFixed(2)}</span>
          </span>
          <div class="action">
            <button class="decrease">-</button>
            <button class="increase">+</button>
          </div>
        </div>
      </div>
      <div class="actions">
        <i id="remove" class="bi bi-x-circle"></i>
      </div>
      <hr/>
    `;

    // attach button handlers
    div.querySelector(".decrease").addEventListener("click", () =>
      changeQuantity(item.name, -1)
    );
    div.querySelector(".increase").addEventListener("click", () =>
      changeQuantity(item.name, 1)
    );
    div.querySelector("#remove").addEventListener("click", () =>
      removeFromCart(item.name)
    );

    cartList.appendChild(div);
  });

  // total section
  const totalDiv = document.createElement("div");
  totalDiv.classList.add("total");
  totalDiv.innerHTML = `
    <p>Order Total</p>
    <p class="total-price">$${total.toFixed(2)}</p>
  `;

  const confirmBtn = document.createElement("button");
  confirmBtn.textContent = "Confirm Order";
  confirmBtn.addEventListener("click", () => {
    showModal(total);
  });

  cartList.appendChild(totalDiv);
  cartList.appendChild(confirmBtn);

  cartCount.textContent = `(${cart.reduce((acc, i) => acc + i.quantity, 0)})`;
}

/* ======================
   MODAL LOGIC
====================== */
function showModal(total) {
  const backdrop = document.querySelector(".backdrop");
  const modalList = backdrop.querySelector(".cart-list");
  const startNewBtn = backdrop.querySelector("button");

  // Clear old modal content
  modalList.innerHTML = "";

  // Add cart items into modal
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image.mobile}" />
      <div class="text">
        <p class="name">${item.name}</p>
        <div>
          <span class="quantity">${item.quantity}x</span>
          <span class="price">$${itemTotal.toFixed(2)}</span>
        </div>
      </div>
      <hr>
    `;
    modalList.appendChild(div);
  });

  // Show total in modal
  const totalDiv = document.createElement("div");
  totalDiv.classList.add("total");
  totalDiv.innerHTML = `
    <p>Order Total</p>
    <p class="total-price">$${total.toFixed(2)}</p>
  `;
  modalList.appendChild(totalDiv);

  // Show modal
  backdrop.classList.add("active");

  // Start new order button
  startNewBtn.onclick = () => {
    cart = [];
    renderCart();
    backdrop.classList.remove("active");
  };
  backdrop.onclick = () => {
    cart = [];
    renderCart();
    backdrop.classList.remove("active");
  }
}


document.addEventListener("DOMContentLoaded", loadProducts);

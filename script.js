let table = document.querySelector("table tbody");
let total = document.querySelector("table #total");
let modalDiv = document.querySelector(".myModal");
let modal = document.querySelectorAll(".myModal .modal-box");
let modalAlert = document.querySelectorAll(".modal-box .alert");
let removeBtn = document.querySelectorAll(".myModal .modal-box #remove");
let productName = document.querySelector("#product-name");
let productPrice = document.querySelector("#product-price");
let productId = document.querySelector("#product-id");
let addPhoneBtn = document.querySelector("#addPhone");
let resetBtn = document.querySelector("#resetBtn");
let alert = document.querySelector(`.content .alert`);
let alertIco = document.querySelector(`.content .alert i`);
let msg = document.createElement("div");
let allButtons = document.querySelectorAll("button");
let productsDiv = document.querySelector(`#productsDiv`);
let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
alert.appendChild(msg);
let alertTimeout;
let showData = () => {
  table.innerHTML = "";
  renderProducts(products);
  renderCart();
};
let showAlert = (type, message) => {
  alert.classList.add("d-none");
  clearTimeout(alertTimeout);
  alert.classList.remove("bg-success", "bg-danger", "bg-primary");
  alertIco.classList.remove("fa-circle-check", "fa-circle-exclamation");

  if (type === "success") {
    alert.classList.add("bg-success");
    alertIco.classList.add("fa-circle-check");
  } else if (type === "warning") {
    alert.classList.add("bg-primary");
    alertIco.classList.add("fa-circle-exclamation");
  } else if (type === "error") {
    alert.classList.add("bg-danger");
    alertIco.classList.add("fa-circle-exclamation");
  }
  msg.textContent = message;
  alert.classList.remove("animate__fadeInDown", "animate__fadeOutUp");
  setTimeout(() => {
    alert.classList.remove("d-none");
    alert.classList.add("d-flex", "animate__fadeInDown");
  }, 50);

  alertTimeout = setTimeout(() => {
    alert.classList.remove("animate__fadeInDown");
    alert.classList.add("animate__fadeOutUp");
    setTimeout(() => {
      alert.classList.remove("animate__fadeOutUp", "d-flex");
      alert.classList.add("d-none");
    }, 1000);
  }, 6000);
};
let closeAlert = () => {
  alertTimeout = setTimeout(() => {
    alert.classList.remove("animate__fadeInDown");
    alert.classList.add("animate__fadeOutUp");
    setTimeout(() => {
      alert.classList.remove("animate__fadeOutUp", "d-flex");
      alert.classList.add("d-none");
    }, 1000);
  }, 100);
};
let showModalAlert = (index, text) => {
  modalAlert[index].classList.replace("d-none", "d-flex");
  modalAlert[index].innerText = text;
  setTimeout(() => {
    modalAlert[index].classList.replace("opacity-0", "opacity-100");
  }, 1000);
};
let closeModalAlert = (index, type) => {
  if (type == "animate") {
    setTimeout(() => {
      modalAlert[index].classList.replace("opacity-100", "opacity-0");
      setTimeout(() => {
        modalAlert[index].classList.replace("d-flex", "d-none");
      }, 1500);
    }, 6000);
  } else if (type == "quick") {
    modalAlert[index].classList.replace("opacity-100", "opacity-0");
    modalAlert[index].classList.replace("d-flex", "d-none");
  }
};
let addProduct = () => {
  let idExists = products.some((el) => el.id == productId.value);
  let nameExists = products.some((el) => el.name == productName.value);
  if (productName.value.trim() === "" || productPrice.value.trim() === "" || productId.value.trim() === "") {
    text = `Please fill in all fields.`;
    showModalAlert(0, text);
  } else if (idExists === true && nameExists === true) {
    text = `The ID and name cannot be entered. They already exist.`;
    showModalAlert(0, text);
  } else if (idExists === true && nameExists === false) {
    text = `You must not enter an existing ID.`;
    showModalAlert(0, text);
  } else if (nameExists === true && idExists === false) {
    text = `You must not enter an existing Name.`;
    showModalAlert(0, text);
  } else if (!isNaN(productName.value)) {
    text = `Please enter valid values: Numbers are not allowed in the product name field.`;
    showModalAlert(0, text);
  } else if (isNaN(productPrice.value)) {
    text = `Please enter valid values: You are not allowed to enter letters or texts in the product price field.`;
    showModalAlert(0, text);
  } else if (isNaN(productId.value)) {
    text = `Please enter valid values: You are not allowed to enter letters or texts in the product ID field.`;
    showModalAlert(0, text);
  } else if (idExists === false && nameExists == false) {
    let newProduct = { id: productId.value, name: productName.value, price: productPrice.value, qty: 1 };
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts(products);
    closeModal(0)
    showAlert("success", "A new product has been successfully created.");
  }
};
let showCart = (productId) => {
  let addedProduct = products.find((el) => +el.id === +productId);
  let isMatch = cart.find((el) => {
    return el.id == addedProduct.id;
  });
  if (isMatch === undefined) {
    cart.push(addedProduct);
    showAlert("success", "The product has been added to the cart.");
  } else {
    isMatch.qty += 1;
    showAlert("warning", "The quantity has been increased.");
  }
  renderCart();
  localStorage.setItem("cart", JSON.stringify(cart));
};
let renderCart = () => {
  table.innerHTML = "";
  let cartTotal = 0;
  cart.forEach((el, index) => {
    let totalProductPrice = el.price * el.qty;
    cartTotal += totalProductPrice;
    table.innerHTML += `<tr>
              <td>${index + 1}</td>
              <td>${el.name}</td>
              <td>${el.price}</td>
              <td>
                <div class="col-12 d-flex justify-content-between align-items-center">
                <button class="btn btn-secondary px-3" onclick="editQty(0,${index})"><i class="fa-solid fa-minus"></i></button>
                <span>${el.qty}</span>
                <button class="btn btn-secondary px-3" onclick="editQty(1,${index})"><i class="fa-solid fa-plus"></i></button>
                </div>
              </td>
              <td>${totalProductPrice}</td>
              <td>
              <div class="col-12 d-flex gap-2 justify-content-center align-align-items-center">
                <button class="btn btn-secondary col-4" onclick="showModal(1,${index})">Edit</button>
                <button class="btn btn-danger col-4" onclick="showModal(2,${index})">delete</button>
                </div>
              </td>
            </tr>`;
    total.innerText = cartTotal;
  });
  if (cart.length === 0) {
    cartTotal = 0;
    total.innerText = "0";
  }
};
let editQty = (operatorIndex, index) => {
  if (operatorIndex == 0) {
    if (cart[index].qty > 1) {
      cart[index].qty -= 1;
      renderCart();
    }
  } else {
    if (cart[index].qty < 100) {
      cart[index].qty += 1;
      renderCart();
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};
let deleteProduct = (index) => {
  let deleteProductName = cart[index].name;
  cart[index].qty = 1;
  cart.splice(index, 1);
  showAlert("error", `The product named "${deleteProductName}" has been removed.`);
  renderCart();
  localStorage.setItem("cart", JSON.stringify(cart));
};
let editProduct = (index) => {
  showModal(1, index);
};
let showModal = (modalIndex, index) => {
  addPhoneBtn.disabled = true;
  addPhoneBtn.style.pointerEvents = "none";
  modalDiv.classList.replace("d-none", "d-flex");
  modal[modalIndex].classList.remove("d-none");
  let confirmBtn = modal[modalIndex].querySelector("#confirm-btn");
  if (modalIndex == 1) {
    let oldQty = cart[index].qty;
    confirmBtn.onclick = null;
    confirmBtn.onclick = () => {
      let NewQty = document.querySelector("#product-qty");
      if (NewQty.value < 1 || NewQty.value > 100 || isNaN(NewQty.value)) {
        showModalAlert(1, "Please enter a quantity greater than 0 and less than or equal to 100 and must be a number");
        NewQty.value = "";
        return;
      }
      cart[index].qty = +NewQty.value;
      renderCart();
      NewQty.value = "";
      closeModal(modalIndex);
      modalAlert[1].classList.replace("opacity-100", "opacity-0");
      modalAlert[1].classList.replace("d-flex", "d-none");
      if (oldQty == cart[index].qty) {
        showAlert("error", `No changes made — the new quantity is the same as the old one`);
      } else {
        showAlert("warning", `The quantity was updated from ${oldQty} to ${cart[index].qty}`);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    };
  } else if (modalIndex == 2) {
    confirmBtn.onclick = null;
    confirmBtn.onclick = () => {
      deleteProduct(index);
      closeModal(modalIndex);
    };
  }
};
let closeModal = (modalIndex) => {
  modal[modalIndex].classList.replace("animate__fadeInDown", "animate__fadeOutUp");

  setTimeout(() => {
    modalDiv.classList.add("opacity-0");
    modal[modalIndex].classList.add("opacity-0");
  }, 750);

  setTimeout(() => {
    modalDiv.classList.replace("d-flex", "d-none");
    modal[modalIndex].classList.add("d-none");

    modalDiv.classList.remove("opacity-0");
    modal[modalIndex].classList.remove("opacity-0");

    modal[modalIndex].classList.replace("animate__fadeOutUp", "animate__fadeInDown");

    addPhoneBtn.disabled = false;
    addPhoneBtn.style.pointerEvents = "auto";
  }, 1250);
  closeModalAlert(0, "quick");
  closeModalAlert(1, "quick");
};
let resetCart = () => {
  cart.forEach((el) => {
    el.qty = 1;
  });
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  closeModal(3);
};
let renderProducts = (productsArray) => {
  productsDiv.innerHTML = "";

  productsArray.forEach((el) => {
    productsDiv.innerHTML += `<div class="col-12 p-3 bg-white shadow rounded border">
      <h1>${el.name}</h1>
      <div class="d-flex justify-content-between align-items-center">
        <p class="mb-0">Price : ${el.price}</p>
        <button class="btn btn-success" onclick="showCart(${el.id})">Add To Cart</button>
      </div>
    </div>`;
  });
};
let search = () => {
  let searchInput = document.querySelector(`#search-input`);
  searchInput.addEventListener("input", () => {
    let searchValue = searchInput.value.toLowerCase();
    let filteredProducts = products.filter((el) => {
      return el.name.toLowerCase().includes(searchValue);
    });
    renderProducts(filteredProducts);
  });
};
search();
showData();
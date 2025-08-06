let table = document.querySelector("table tbody");
let total = document.querySelector("table #total");
let modalDiv = document.querySelector(".myModal");
let modal = document.querySelectorAll(".myModal .modal-box");
let modalAlert = document.querySelector(".modal-box .alert");
let removeBtn = document.querySelectorAll(".myModal .modal-box #remove");
let productName = document.querySelector("#product-name");
let productPrice = document.querySelector("#product-price");
let productId = document.querySelector("#product-id");
let addPhoneBtn = document.querySelector("#addPhone");
let alert = document.querySelector(`.content .alert`);
let alertIco = document.querySelector(`.content .alert i`);
let msg = document.createElement("div");
let allButtons = document.querySelectorAll("button");
let products = [];
let cart = [];
let productsDiv = document.querySelector(`#productsDiv`);
alert.appendChild(msg);
let alertTimeout;

let showAlert = (type, message) => {
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
  }, 800);

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
let addProduct = () => {
  let idExists = products.some((el) => el.id == productId.value);
  let nameExists = products.some((el) => el.name == productName.value);
  if (idExists === false && nameExists == false) {
    let newProduct = { id: productId.value, name: productName.value, price: productPrice.value, qty: 1 };
    products.push(newProduct);
    productsDiv.innerHTML = "";
    products.forEach((el, productIndex) => {
      productsDiv.innerHTML += `<div class="col-12 p-3 bg-white shadow rounded border">
          <h1>${el.name}</h1>
          <div class="d-flex justify-content-between align-items-center">
            <p class="mb-0">Price : ${el.price}</p>
            <button class="btn btn-success" onclick="showCart(${productIndex})">Add To Cart</button>
          </div>`;
    });
    productName.value = "";
    productPrice.value = "";
    productId.value = "";
    newProduct = "";
    closeModal(0);
    showAlert("success", "A new product has been successfully created.");
  } else if (idExists === true && nameExists === true) {
    text = `The ID and name cannot be entered. They already exist.`;
    showModalAlert(text);
  } else if (idExists === true && nameExists === false) {
    text = `You must not enter an existing ID.`;
    showModalAlert(text);
  } else if (nameExists === true && idExists === false) {
    text = `You must not enter an existing Name.`;
    showModalAlert(text);
  }
};
let showModalAlert = (text) => {
  modalAlert.classList.replace("d-none", "d-flex");
  modalAlert.innerText = text;
  setTimeout(() => {
    modalAlert.classList.replace("opacity-0", "opacity-100");
  }, 1000);

  setTimeout(() => {
    modalAlert.classList.replace("opacity-100", "opacity-0");
    setTimeout(() => {
      modalAlert.classList.replace("d-flex", "d-none");
    }, 1500);
  }, 6000);
};
let showCart = (productIndex) => {
  let addedProduct = products[productIndex];
  let isMatch = cart.find((el) => {
    return products[productIndex].name === el.name;
  });
  if (isMatch === undefined) {
    cart.push(addedProduct);
    showAlert("success", "The product has been added to the cart.");
  } else {
    isMatch.qty += 1;
    showAlert("warning", "The quantity has been increased.");
  }
  renderCart();
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
};
let editQty = (operatorIndex, index) => {
  if (operatorIndex == 0) {
    if (cart[index].qty > 1) {
      cart[index].qty -= 1;
      renderCart();
    }
  } else {
    cart[index].qty += 1;
    renderCart();
  }
};
let deleteProduct = (index) => {
  let deleteProductName = cart[index].name;
  cart.splice(index, 1);
  showAlert("error", `The product named (${deleteProductName}) has been removed.`);
  renderCart();
  if (cart.length === 0) {
    total.innerText = "";
  }
};
let editProduct = (index) => {
  showModal(2);
  let NewQty = document.querySelector("#product-qty").value;
  while (NewQty < 1 || NewQty > 100) {
    NewQty = +prompt(`Please enter the quantity greater than 0 and less than or equal to 100`);
  }
  cart[index] = { id: 1, name: "iPhone x", price: 400, qty: NewQty };
  renderCart();
  NewQty = "";
};
let showModal = (modalIndex, index) => {
  addPhoneBtn.disabled = true;
  addPhoneBtn.style.pointerEvents = "none";
  modalDiv.classList.replace("d-none", "d-flex");
  modal[modalIndex].classList.remove("d-none");
  let confirmBtn = modal[modalIndex].querySelector("#confirm-btn");
  if (modalIndex == 1) {
    confirmBtn.onclick = null;
    confirmBtn.onclick = () => {
      editProduct(index);
      closeModal(modalIndex);
    };
  }
  if (modalIndex == 2) {
    confirmBtn.onclick = null;
    confirmBtn.onclick = () => {
      deleteProduct(index);
      closeModal(modalIndex);
    };
  }
};
let closeModal = (modalIndex) => {
  // تبدأ أنيميشن الإغلاق
  modal[modalIndex].classList.replace("animate__fadeInDown", "animate__fadeOutUp");

  // بعد 750ms: نبدأ نخفي المودال تدريجيًا
  setTimeout(() => {
    modalDiv.classList.add("opacity-0");
    modal[modalIndex].classList.add("opacity-0");
  }, 750);

  // بعد 1250ms (750 + 500ms): نخفيه تمامًا ونشيل الكلاسات
  setTimeout(() => {
    modalDiv.classList.replace("d-flex", "d-none");
    modal[modalIndex].classList.add("d-none");

    modalDiv.classList.remove("opacity-0");
    modal[modalIndex].classList.remove("opacity-0");

    modal[modalIndex].classList.replace("animate__fadeOutUp", "animate__fadeInDown");

    // نرجّع الزر يشتغل هنا بعد الإغلاق بالكامل
    addPhoneBtn.disabled = false;
    addPhoneBtn.style.pointerEvents = "auto";
  }, 1250);
};

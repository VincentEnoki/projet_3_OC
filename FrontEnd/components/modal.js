let modalState = null;
const prevModal = document.querySelector(".previous-modal");
const hr = document.querySelector(".hr");
const modalForm = document.querySelector(".modal-form");
const imagePreview = document.querySelector("#image-preview");

const openModal = (e) => {
  e.preventDefault();
  modalAddForm.style.display = "none";
  const modal = document.querySelector(".modal");
  modal.style.display = null;
  document.querySelector(".delete-page").style.display = "flex";
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modalState = modal;
  modalState.addEventListener("click", closeModal);
  modalState
    .querySelector(".close-modal")
    .addEventListener("click", closeModal);
  modalState
    .querySelector(".modal-stop")
    .addEventListener("click", stopPropagation);
};

const closeModal = (e) => {
  if (modalState === null) return;
  e.preventDefault();
  modalState.style.display = "none";
  modalState.setAttribute("aria-hidden", "true");
  modalState.removeAttribute("aria-modal");
  modalState.removeEventListener("click", closeModal);
  modalState
    .querySelector(".close-modal")
    .removeEventListener("click", closeModal);
  modalState
    .querySelector(".modal-stop")
    .removeEventListener("click", stopPropagation);
  modalState = null;
  modalForm.reset();
  imagePreview.src = "";
  formWrapper.style.display = "flex";
  filePreview.style.display = "none";
};

const stopPropagation = (e) => {
  e.stopPropagation();
};
document.querySelectorAll(".modif-button").forEach((p) => {
  p.addEventListener("click", (event) => {
    openModal(event);
    prevModal.style.visibility = "hidden";
  });
});


window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

const modalWorks = document.querySelector(".modal-works");

async function fetchWork() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("error, can't fetch data");
    throw error;
  }
}
fetchWork().then((data) => {
  data.forEach((work) => {
    const figure = createFigureElementModal(work);
    figure.id = "modal-"+work.id;
    modalWorks.appendChild(figure);
  });
});

function createFigureElementModal(work) {
  const figure = document.createElement("figure");
  figure.classList.add("modal-figure");
  const img = document.createElement("img");
  const text = document.createElement("p");
  const modalButtons = document.createElement("div");
  const deleteButton = document.createElement("button");
  const deleteIcon = document.createElement("i");
  const moveButton = document.createElement("button");
  const moveIcon = document.createElement("i");

  text.textContent = "éditer";
  deleteIcon.classList.add("fas", "fa-trash-alt");
  deleteButton.appendChild(deleteIcon);
  deleteButton.addEventListener("click", () => {
    deleteWork(work.id);
  });

  moveIcon.classList.add("fas", "fa-arrows-alt");
  moveButton.appendChild(moveIcon);

  img.src = work.imageUrl;

  modalButtons.classList.add("modal-buttons");
  modalButtons.appendChild(moveButton);
  modalButtons.appendChild(deleteButton);

  figure.appendChild(img);
  figure.appendChild(text);
  figure.appendChild(modalButtons);
  return figure;
}

function deleteWork(workId) {
  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }).then(() => {
    const figureElement = document.getElementById(workId);
    if (figureElement) {
      figureElement.remove();
    }
    const modalFigureElement = document.getElementById("modal-"+workId);
    if (modalFigureElement) {
      modalFigureElement.remove();
    }
  })
}

const buttonAddWork = document.querySelector(".add-project");
const modalAddForm = document.querySelector(".modal-add-form");
buttonAddWork.addEventListener("click", () => {
  document.querySelector(".delete-page").style.display = "none";
  modalAddForm.style.display = "flex";
  prevModal.style.visibility = "visible";
});

const formCategorySelect = document.querySelector(".form-category");
fetchCategories().then((data) => {
  data.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    formCategorySelect.appendChild(option);
  });
});


modalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(modalForm);

  const image = formData.get("image");
  const title = formData.get("title");
  const category = formData.get("category");

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      document.querySelector(".delete-page").style.display = "flex";
      modalAddForm.style.display = "none";
      const figureModal = createFigureElementModal(data);
      figureModal.id = "modal-"+data.id;
      modalWorks.appendChild(figureModal);
      const figure = createFigureElement(data);
      figure.id = data.id;
      document.querySelector('.gallery').appendChild(figure);
      modalForm.reset();
      imagePreview.src = "";
      formWrapper.style.display = "flex";
      filePreview.style.display = "none";

    }
  );
  });

  const fileInput = document.querySelector("input[type=file]");
  const submitButton = document.querySelector(".modal-submit");
  const filePreview = document.querySelector(".form-file-preview");
  const formWrapper = document.querySelector(".form-file-form");
  
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      filePreview.style.display = "flex";
      formWrapper.style.display = "none";
      submitButton.disabled = false;
      submitButton.classList.remove("disabled");
      submitButton.style.backgroundColor = "#1D6154";
    } else {
      filePreview.style.display = "none";
      formWrapper.style.display = "flex";
      submitButton.disabled = true;
      submitButton.classList.add("disabled");
      submitButton.style.backgroundColor = "#A7A7A7";
    }
  });

  prevModal.addEventListener("click", () => {
    document.querySelector(".delete-page").style.display = "flex";
    modalAddForm.style.display = "none";
    prevModal.style.visibility = "hidden";
    modalForm.reset();
    imagePreview.src = "";
    formWrapper.style.display = "flex";
  }
  );


  
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        imagePreview.src = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = "";
    }
  });
  
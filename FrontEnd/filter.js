async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("error, can't fetch data");
    throw error;
  }
}

fetchCategories().then((data) => {
  const filter = document.querySelector(".filter");
  console.log(data);
  data.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("filter-button");
    button.setAttribute("id", category.id);
    filter.appendChild(button);
    button.addEventListener("click", handleFilter);
  });
});

const gallery = document.querySelector(".gallery");

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
    const figure = createFigureElement(work);
    gallery.appendChild(figure);
  });
});

function handleFilter(event) {
  const id = event.target.id;
  gallery.innerHTML = "";

  fetchWork().then((data) => {
    if (id === "0" ) { 
      data.forEach((work) => {
        const figure = createFigureElement(work);
        gallery.appendChild(figure);
      });
    } else { 
      const filteredData = data.filter((workFilter) => workFilter.categoryId == id);
      filteredData.forEach((work) => {
        const figure = createFigureElement(work);
        gallery.appendChild(figure);
      });
    }
  });
}

function createFigureElement(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  img.src = work.imageUrl;
  img.alt = work.title;
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);

  return figure;
}

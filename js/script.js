document.addEventListener("DOMContentLoaded", () => {
  fetchCities();
});

async function fetchCities() {
  try {
    const response = await fetch(
      "https://api-turismo.vercel.app/api/destinations"
    );
    const cities = await response.json();
    displayCities(cities);
    populateCarousel(cities); // Adiciona as imagens ao carrossel
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
  }
}

function displayCities(cities) {
  const citiesContainer = document.getElementById("cities");
  citiesContainer.innerHTML = "";

  cities.forEach((city) => {
    const cityElement = document.createElement("div");
    cityElement.classList.add("card");
    cityElement.innerHTML = `
      <img src="${city.image_url}" alt="${city.name}">
      <h3>${city.name}</h3>
      <p>${city.description}</p>
      <p>${city.location}</p>
      <button onclick="fetchAttractions(${city.id})">Ver Pontos Turísticos</button>
    `;
    citiesContainer.appendChild(cityElement);
  });

  // Garantir que a seção das cidades esteja visível
  citiesContainer.style.display = "flex";
}

function populateCarousel(cities) {
  const carouselInner = document.getElementById("carouselInner");
  carouselInner.innerHTML = "";

  cities.forEach((city, index) => {
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item");
    if (index === 0) carouselItem.classList.add("active"); // Torna o primeiro item ativo

    carouselItem.innerHTML = `
      <img src="${city.image_url}" class="d-block w-100" alt="${city.name}">
    `;

    carouselInner.appendChild(carouselItem);
  });
}

async function fetchAttractions(cityId) {
  try {
    const response = await fetch(
      `https://api-turismo.vercel.app/api/attractions?destination_id=${cityId}`
    );
    const attractions = await response.json();
    displayAttractions(attractions);
  } catch (error) {
    console.error("Erro ao buscar atrações:", error);
  }
}

function displayAttractions(attractions) {
  const citiesContainer = document.getElementById("cities");
  const attractionsContainer = document.getElementById("attractions");
  const attractionsList = document.getElementById("attractions-list");

  // Oculta a seção de cidades e mostra a seção de atrações
  citiesContainer.style.display = "none";
  attractionsContainer.style.display = "flex";
  attractionsList.innerHTML = "";

  if (attractions.length > 0) {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: {
        lat: parseFloat(attractions[0].latitude),
        lng: parseFloat(attractions[0].longitude),
      },
    });

    attractions.forEach((attraction) => {
      const attractionElement = document.createElement("div");
      attractionElement.classList.add("card");
      attractionElement.innerHTML = `
        <img src="${attraction.image_url}" alt="${attraction.name}">
        <h3>${attraction.name}</h3>
        <p>${attraction.type}</p>
        <p>${attraction.description}</p>
      `;
      attractionsList.appendChild(attractionElement);

      const marker = new google.maps.Marker({
        position: {
          lat: parseFloat(attraction.latitude),
          lng: parseFloat(attraction.longitude),
        },
        map: map,
        title: attraction.name,
      });
    });
  } else {
    attractionsList.innerHTML =
      "<p>Não há atrações disponíveis para este destino.</p>";
  }
}

function backToCities() {
  const attractionsContainer = document.getElementById("attractions");
  const citiesContainer = document.getElementById("cities");

  // Oculta a seção de atrações e mostra a seção de cidades
  attractionsContainer.style.display = "none";
  citiesContainer.style.display = "flex";

  // Garante que a lista de atrações esteja limpa
  document.getElementById("attractions-list").innerHTML = "";
  document.getElementById("map").innerHTML = "";
}

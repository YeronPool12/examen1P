// Obtener datos de los Pokémon desde la API
const getPokemonData = async (page) => {
    try {
        const offset = (page - 1) * 10;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`);
        if (!response.ok) {
            throw new Error('Failed to fetch Pokemon data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};



// Variable para almacenar la cantidad de Pokémon atrapados
let pokemonCount = 0;

// Función para capturar un Pokémon
const capturePokemon = (pokemonName) => {
    alert(`¡Pokémon Capturado, has capturado a: ${pokemonName}!`);
    pokemonCount++;
    console.log(`Has capturado un total de: ${pokemonCount} Pokémon.`);
    console.log(`Último Pokémon capturado: ${pokemonName}`);
};



// Actualizar el HTML con la información de los Pokémon
const updatePokemonCards = async (page) => {
    try {
        const pokemonData = await getPokemonData(page);
        const cardsContainer = document.querySelector('.row.justify-content-center');
        cardsContainer.innerHTML = ''; // Limpiar contenedor antes de agregar nuevas tarjetas

        for (const pokemon of pokemonData.results) {
            const response = await fetch(pokemon.url);
            const pokemonInfo = await response.json();

            const card = document.createElement('div');
            card.classList.add('col-auto');
            card.innerHTML = `
                <div class="card m-2" style="width: 18rem;">
                    <img src="${pokemonInfo.sprites.front_default}" class="card-img-top" alt="${pokemon.name}">
                    <div class="card-body">
                        <h5 class="card-title">${pokemon.name}</h5>
                        <p class="card-text">
                            Altura: ${pokemonInfo.height}, 
                            Peso: ${pokemonInfo.weight},
                            Experiencia base: ${pokemonInfo.base_experience},
                            Habilidades: ${pokemonInfo.abilities.map(ability => ability.ability.name).join(', ')},
                            Tipos: ${pokemonInfo.types.map(type => type.type.name).join(', ')}
                        </p>
                        <button class="btn btn-danger capture-btn">Obtener Pokémon</button>
                    </div>
                </div>
            `;
            cardsContainer.appendChild(card);

            // Agrega un event listener al botón de captura
            card.querySelector('.capture-btn').addEventListener('click', () => {
                capturePokemon(pokemon.name);
            });
        }

        // Actualiza el atributo de data-current-page en la paginación
        document.querySelector('.pagination').dataset.currentPage = page;

    } catch (error) {
        console.error(error);
    }
};

// Agrega un event listener al botón "Previous" para manejar el cambio de página hacia atrás
document.getElementById('previousBtn').addEventListener('click', async () => {
    const currentPage = parseInt(document.querySelector('.pagination').dataset.currentPage);
    const previousPage = currentPage - 1;
    if (previousPage >= 1) { // Verifica si hay una página anterior válida
        await updatePokemonCards(previousPage);
    }
});

// Agrega un event listener al botón "Next" para manejar el cambio de página hacia adelante
document.getElementById('nextBtn').addEventListener('click', async () => {
    const currentPage = parseInt(document.querySelector('.pagination').dataset.currentPage);
    await updatePokemonCards(currentPage + 1);
});

// Llamar a la función para actualizar las tarjetas de los Pokémon cuando la página se cargue
window.addEventListener('load', () => {
    // Inicialmente, carga la página 1
    updatePokemonCards(1);
});







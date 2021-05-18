const pokemonRepository = (() => {
  const pokemonList = [];
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  // let modalContainer = document.getElementById('modal-container');

  function getArray() {
    return pokemonList;
  }

  function addToArray(pokemon) {
    if (typeof pokemon === 'object') {
      const newPokeProperty = Object.keys(pokemon);
      if (
        newPokeProperty.includes('name') &&
        newPokeProperty.includes('detailsUrl')
      ) {
        pokemonList.push(pokemon);
      } else {
        alert('Incorrect Keys');
      }
    } else {
      alert('All inputs must be objects.');
    }
  }

  function addListener(element, method, object) {
    element.addEventListener('click', () => method(object));
  }
  // go back in and correct syntax to match rest of code
  function loadDetails(pokemon) {
    const url = pokemon.detailsUrl;
    return fetch(url)
      .then((response) => response.json())
      .then((details) => {
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.height = details.height;
        pokemon.weight = details.weight;
        pokemon.types = details.types;
      })
      .catch((err) => console.log(err));
  }
  function showDetails(pokemon) {
    loadDetails(pokemon).then(() => {
      /* eslint-disable no-console */
      console.log(pokemon);
      const modalBody = document.querySelector('.modal-body');

      // clear modalBody
      modalBody.innerHTML = '';

      // display pokemon name
      document.querySelector('.modal-title').innerHTML = pokemon.name;

      // element to display pokemon height
      const heightElement = document.createElement('p');
      heightElement.innerText = `Pokemon Height: ${pokemon.height} meters`;

      // element to display pokemon height
      const weightElement = document.createElement('p');
      weightElement.innerText = `Pokemon Weight: ${pokemon.weight} hectograms`;

      // element to display list of pokemon types
      const typeContainer = document.createElement('ul');
      typeContainer.classList.add('poketype');
      typeContainer.innerText = 'Pokemon Type:';

      pokemon.types.forEach((item) => {
        const typeData = item.type.name;
        const newListItem = document.createElement('li');
        typeContainer.appendChild(newListItem);
        newListItem.innerText += typeData;
      });

      // element to display pokemon image
      const imgContainer = document.createElement('img');
      imgContainer.setAttribute('src', pokemon.imageUrl);

      // add close button, pokemon title, height, image to modal
      modalBody.appendChild(heightElement);
      modalBody.appendChild(weightElement);
      modalBody.appendChild(typeContainer);
      modalBody.appendChild(imgContainer);
    });
  }
  function addListItem(pokemon) {
    const list = document.querySelector('.list-group');
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'col-md-4', 'col-12');
    const listButton = document.createElement('button');
    listButton.innerText = pokemon.name;
    listButton.classList.add('btn', 'btn-primary');
    listButton.setAttribute('type', 'button');
    listButton.setAttribute('data-bs-toggle', 'modal');
    listButton.setAttribute('data-bs-target', '#exampleModal');
    listItem.appendChild(listButton);
    list.appendChild(listItem);
    addListener(listButton, showDetails, pokemon);
  }

  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          const pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          addToArray(pokemon);
        });
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  function pokemonLookup(searchValue) {
    const list = document.querySelector('.list-group');
    list.innerHTML = '';
    /* eslint array-callback-return: ["error", { allowImplicit: true }] */
    pokemonList.filter((pokemon) => {
      const pokemonNames = pokemon.name;
      if (pokemonNames.includes(searchValue)) addListItem(pokemon);
    });
  }

  return {
    getArray,
    addToArray,
    addListItem,
    loadList,
    loadDetails,
    pokemonLookup,
  };
})();
pokemonRepository.loadList().then(() => {
  // when promise fullfilled get array of pokemon.  For each array item add it to page's HTML
  pokemonRepository
    .getArray()
    .forEach((pokemon) => pokemonRepository.addListItem(pokemon));
});

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
  pokemonRepository.pokemonLookup(searchInput.value);
});

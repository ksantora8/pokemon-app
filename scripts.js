let pokemonRepository = (() => {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  //let modalContainer = document.getElementById('modal-container');

  function getArray(){
      return pokemonList;
  }

  function addToArray(pokemon){
    if(typeof(pokemon)=='object'){
      let newPokeProperty = Object.keys(pokemon);
      if (newPokeProperty.includes('name') && newPokeProperty.includes('detailsUrl')){
        pokemonList.push(pokemon);
      }else{
        alert('Incorrect Keys');
      }
    } else {
      alert ('All inputs must be objects.');
    }
  }

  function addListItem(pokemon){
    let list = document.querySelector('.list-group');
    let listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'col-md-4', 'col-12');
    let listButton = document.createElement('button');
    listButton.innerText = pokemon.name;
    listButton.classList.add('btn','btn-primary');
    listButton.setAttribute('type', 'button');
    listButton.setAttribute('data-bs-toggle', 'modal');
    listButton.setAttribute('data-bs-target', '#exampleModal');
    listItem.appendChild(listButton);
    list.appendChild(listItem);
    addListener(listButton, showDetails, pokemon);
  }
  function addListener(element, method , object){
      element.addEventListener('click', () => method(object));
  }

  function showDetails(pokemon){

      loadDetails(pokemon)
          .then(() => {
            /* eslint-disable no-console */
            console.log(pokemon);
            let modalBody = document.querySelector('.modal-body');

            //clear modalBody
            modalBody.innerHTML = '';

            //display pokemon name
            document.querySelector('.modal-title').innerHTML = pokemon.name;

            //element to display pokemon height
            let heightElement = document.createElement('p');
            heightElement.innerText = `Pokemon Height: ${pokemon.height} meters`;

            //element to display pokemon height
            let weightElement = document.createElement('p');
            weightElement.innerText = `Pokemon Weight: ${pokemon.weight} hectograms`;

            //element to display list of pokemon types
            let typeContainer = document.createElement('ul');
            typeContainer.classList.add('poketype');
            typeContainer.innerText = 'Pokemon Type:';

              pokemon.types.forEach((item) => {
                  let typeData = item.type.name;
                  let newListItem = document.createElement('li');
                  typeContainer.appendChild(newListItem);
                  newListItem.innerText += typeData;
              });

            //element to display pokemon image
            let imgContainer = document.createElement('img');
            imgContainer.setAttribute('src', pokemon.imageUrl);

            //add close button, pokemon title, height, image to modal
            modalBody.appendChild(heightElement);
            modalBody.appendChild(weightElement);
            modalBody.appendChild(typeContainer);
            modalBody.appendChild(imgContainer);
          });
    }


  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        addToArray(pokemon);
      });
    }).catch(function (err) {
      console.error(err);
    });
  }
  //go back in and correct syntax to match rest of code
  function loadDetails(pokemon){
    let url = pokemon.detailsUrl;
    return fetch(url)
          .then(response => response.json())
          .then(details => {
             pokemon.imageUrl = details.sprites.front_default;
             pokemon.height = details.height;
             pokemon.weight = details.weight;
             pokemon.types = details.types;
          })
          .catch(err => console.log(err));
  }

  function pokemonLookup(searchValue){
    let list = document.querySelector('.list-group');
    list.innerHTML = '';
    let searched = pokemonList.filter(pokemon => {
      let pokemonNames = pokemon.name;
      if(pokemonNames.includes(searchValue))
      addListItem(pokemon);
    });
  }

  return{
    getArray: getArray,
    addToArray: addToArray,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails : loadDetails,
    pokemonLookup: pokemonLookup,
  };
})();
pokemonRepository.loadList()
  .then(() => {
      //when promise fullfilled get array of pokemon.  For each array item add it to page's HTML
      pokemonRepository.getArray().forEach(pokemon => pokemonRepository.addListItem(pokemon));
  });
searchInput.addEventListener('input', () => {
  pokemonRepository.pokemonLookup(searchInput.value);
});

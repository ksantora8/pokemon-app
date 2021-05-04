let pokemonRepository = (() => {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  let modalContainer = document.getElementById('modal-container');

  function getArray(){
      return pokemonList;
    }
  function addToArray(pokemon){
    if(typeof(pokemon)=='object'){
      let newPokeProperty = Object.keys(pokemon);
      if (newPokeProperty.includes('name') && newPokeProperty.includes('detailsUrl')){
        pokemonList.push(pokemon)
      }else{
        alert('Incorrect Keys');
      }
    } else {
      alert ('All inputs must be objects.');
    }
  }
  function addListItem(pokemon){
    let list = document.querySelector('.pokemon-list');
    let listItem = document.createElement('li');
    let listButton = document.createElement('button');
    listButton.innerText = pokemon.name;
    listButton.classList.add('custom-button');
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
            //when promise is returned with details data from API...

              //clear modal container of any previous content
              modalContainer.innerHTML = '';
              // create modal within modal container
              let modal = document.createElement('div');
              //add class to modal for styling
              modal.classList.add('modal');

              // button to close modal
              let closeButtonElement = document.createElement('button');
               closeButtonElement.classList.add('modal-close');
               closeButtonElement.innerText = 'Close';
               closeButtonElement.addEventListener('click', hideModal);

               //close modal via esc key
               window.addEventListener('keydown', (e)=>{
                 //if key is 'Escape' and modal is current visible call hideModal() to close
                   if(e.key === 'Escape' && modalContainer.classList.contains('is-visible')){
                     hideModal();
                   }
               });

              //close modal via clicking outside modal container
               modalContainer.addEventListener('click', (e) => {
                 //close if user clicks only on modal container and not modal itself
                 let target = e.target;
                 if(target === modalContainer){
                   hideModal();
                 }
               });

              //display pokemon name
               let titleElement = document.createElement('h1');
               titleElement.innerText = pokemon.name;

              //display pokemon height
               let heightElement = document.createElement('p');
               heightElement.innerText = `Pokemon Height:  ${pokemon.height} meters`;

              //display list of pokemon types
               let typeElement = document.createElement('ul');
               typeElement.innerText = 'Pokemon Type: ';
               //let typeElement = document.createElement('li');

               pokemon.types.forEach((item) => {
                   let typeData = item.type.name;
                   let newListItem = document.createElement('li');
                   typeElement.appendChild(newListItem);
                   newListItem.innerText += typeData;
               });


              //display pokemon image
              let imgContainer = document.createElement('img');
              imgContainer.setAttribute('src', pokemon.imageUrl);


              //add close button, pokemon title, height, image to modal
              modal.appendChild(closeButtonElement);
              modal.appendChild(titleElement);
              modal.appendChild(heightElement);
              modal.appendChild(typeElement);
              modal.appendChild(imgContainer);
              //add modal to modal container
              modalContainer.appendChild(modal);

              //make modal visible
              modalContainer.classList.add('is-visible');
          });
    }

function hideModal(){
      modalContainer.classList.remove('is-visible');
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
    })
  }
  //go back in and correct syntax to match rest of code
  function loadDetails(pokemon){
    let url = pokemon.detailsUrl;
    return fetch(url)
          .then(response => response.json())
          .then(details => {
             pokemon.imageUrl = details.sprites.front_default;
             pokemon.height = details.height;
             pokemon.types = details.types;
          })
          .catch(err => console.log(err))
}
  return{
    getArray: getArray,
    addToArray: addToArray,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails : loadDetails,
  }
})();
pokemonRepository.loadList().then(function() {
  pokemonRepository.getArray().forEach(pokemon => pokemonRepository.addListItem(pokemon));
});
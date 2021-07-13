const fsPromises = require('fs/promises');
const fetch = require('node-fetch');


//let pokemonToCheck =
let pokemonArray = fsPromises.readFile('./pokemon_names.txt', 'utf8')
  .then((fileData) => { return fileData.split('\n') }) //right now we have [ 'bulbasaur', 'charmander']
  .then((pokemonArray) => {
    Promise.all(pokemonArray.map((pokemon) => {
      return pokemonPromise (pokemon);
    }))
      .then((pokemonRowArray) => {
        return pokemonRowArray.map((pokemonRow) => {
          return printPokemonRow (pokemonRow)
        }).join('\n');
      })
      .then((finalPrint) => {console.log(finalPrint)});
      // Charizard: flying, fire
      // Pikachu: electric


    //console.log(pokemonArray);

    // for (let i = 0; i < pokemonArray.length; i++) {
    //   //build URL for API call
    //   let url = `https://pokeapi.co/api/v2/pokemon/${pokemonArray[i]}`
    //   fetch(url)
    //     .then((response) => {return response.json()})
    //     .then((response) => {
    //       let types = response.types.map(typeSlot => {
    //         return typeSlot.type.name
    //       });
    //       console.log(types);

    //     });
    // }
  });

function pokemonPromise (name) {
  return new Promise((resolve, reject) => {
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw `invalid pokemon: ${name}`;
        }
      })
      .then((response) => {
        let types = response.types.map(typeSlot => {
          return typeSlot.type.name
        });
        resolve({name, types});

      })
      .catch((err) => {
        console.error(err)
        resolve(null);
      });
  })
}
/// Charizard: flying, fire
// Pikachu: electric
// { name: 'bulbasaur', types: [ 'grass', 'poison' ] },
function printPokemonRow (pokemonRow) {
  if (pokemonRow) {
    return `${pokemonRow.name}: ${pokemonRow.types.join(", ")}`
  }
}

//let pokemonPromises = pokemonArray.map((name) => pokemonPromise(name));//okemonPromise("charizard").then((data) => console.log(data));

//console.log(pokemonToCheck.);
//libraries to import:
// node fs (fs/promises?)
// https://www.npmjs.com/package/node-fetch
// https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies
// node fetch


//DONE: make the setup for the list of name file
//example input
// charizard
// pikachu

//TODO: processes a file list of pokemon names
//read from a file and get the list of names into something

//TODO: API Stuff
// api syntax: https://pokeapi.co/api/v2/pokemon/POKEMON_NAME
// https://pokeapi.co/api/v2/pokemon/charmander
// node wrapped API: https://github.com/PokeAPI/pokedex-promise-v2


//TODO: call the api for each name that was in the file list
//process API return for each name
//save all that into some data structure

//TODO: logs each Pokemon's types (for some there are many) according to the pokeapi.co API.
//example output
// Charizard: flying, fire
// Pikachu: electric


//extra time
//write test suite with mocha and chai
//rebuild using the node wrapper
//dynamically define input file
//pre-check input names before making individual call

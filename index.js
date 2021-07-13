const fsPromises = require('fs/promises');
const fetch = require('node-fetch');


//let pokemonToCheck =
readPokemonNamesFile('./pokemon_names.txt') //right now we have [ 'bulbasaur', 'charmander']
  .then((pokemonArray) => {
    Promise.all(pokemonArray.map((pokemon) => {
      return fetchPokeAPI (pokemon);
    }))
      .then((pokemon) => { return printPokemon(pokemon) })
      .then((finalPrint) => {console.log(finalPrint)});
  });


/**
 * returns a promise with an array of pokemon names read from the input file
 * @param {*} file the file path to read from
 * @returns Promise array of pokemon names
 */
function readPokemonNamesFile (file) {
  return fsPromises.readFile(file, 'utf8')
    .then((fileData) => { return fileData.split('\n') })
}

/**
 * Returns an individual promise with data from the poke api get request
 *
 * @param {*} name the name of the pokemon you want to fetch
 * @returns Promise the response data from fetch
 * @throws any invalid pokemon names will be caught here and resolves as null
 */
function fetchPokeAPI (name) {
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

/**
 * Takes in an array of objects including pokemon data
 * and prints it correct
 * @param {*} pokemon the array of pokemon objects
 * @returns String Charizard: flying, fire
 */
function printPokemon (pokemon) {
  return pokemon.map((pokemonRow) => {
    if (pokemonRow) {
      return `${pokemonRow.name}: ${pokemonRow.types.join(", ")}`
    }
  }).join('\n');
}

//extra time
//write test suite with mocha and chai
//rebuild using the node wrapper
//dynamically define input file
//pre-check input names before making individual call
// node wrapped API: https://github.com/PokeAPI/pokedex-promise-v2

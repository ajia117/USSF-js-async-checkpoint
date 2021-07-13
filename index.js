const fsPromises = require('fs/promises');
const fetch = require('node-fetch');


let args = process.argv; // arguments
main(args[2]);

function main (fileName='pokemon_names.txt') {
  readPokemonNamesFile(fileName)
    .then((pokemonArray) => { return fetchAllPokemon(pokemonArray)})
    .then((pokemon) => { return printPokemon(pokemon)})
    .then((finalPrint) => {console.log(finalPrint)})
    .catch((err) => {console.error(err)})
}


/*
 * I/O (FILE and CONSOLE)
 */

/**
 * returns a promise with an array of pokemon names read from the input file
 * @param {*} file the file path to read from
 * @returns Promise array of pokemon names
 */
function readPokemonNamesFile (file) {
  return fsPromises.readFile(file, 'utf8')
    .then((fileData) => { return fileData.split('\n') })
    .catch((err) => {throw err});
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
      return `${pokemonRow.name}: ${pokemonRow.types.join(', ')}`;
    }
  }).join('\n');
}


/*
 * POKE API calls with node-fetch
 */

/**
 * Returns an individual promise with data from the poke api get request
 *
 * @param {*} name the name of the pokemon you want to fetch
 * @returns Promise the response data from fetch
 * @throws any invalid pokemon names will be caught here and resolves as null
 */
function fetchPokeAPI (name) {
  return new Promise((resolve, reject) => {
    let url = '';

    // Check if name is empty string
    if(name === '') {
      resolve(null);
    } else {
      url = `https://pokeapi.co/api/v2/pokemon/${name}`;
        fetch(url)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw `invalid pokemon: ${name}`;
            }
          })
          .then((response) => {
            //console.log("name: " + name, response);
            let types = response.types.map(typeSlot => {
              return typeSlot.type.name;
            });
            resolve({name, types});

          })
          .catch((err) => {
            console.error(err);
            resolve(null);
          });
    }
  })
}

/**
 * fetch all pokemon
 *
 * @param {*} pokemonArray an array of pokemon names
 * @returns an array of all fetches from the pokemon API
 */
function fetchAllPokemon (pokemonArray) {
  return Promise.all(pokemonArray.map((pokemon) => {
    return fetchPokeAPI(pokemon);
  }));
}


//extra time
// DONE: dynamically define input file
// DONE: pre-check input names before making individual call
//
//write test suite with mocha and chai
// rebuild using the node wrapper
// node wrapped API: https://github.com/PokeAPI/pokedex-promise-v2

// 1) Add error handling for "bad arguments" using .catch().
// * What happens if I pass in a non-existent file?
// * What happens if I pass in NO arguments

// 2) Log the output of the HTTP pokemon to a JSON file called "PokemonAttributes".
//  * If the pokemon is already on your attribute list - then return the pokemon from the PokemonAttributes file instead of making a costly HTTP call.

// 3) Accept an argument (T or F) that checks if the first two pokemon were to fight - which pokemon would have the advantage (based on types).
//  * Check out damage_relations in the Pokemon.Type section
//      https://pokeapi.co/docs/v2#types
//  * If pokemon1 would have the advantage log out something like "Bulbasaur has the advantage over Goldeen".

// 4) Some other fun functionality you and you partner agree to!

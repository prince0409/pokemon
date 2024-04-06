const base = "https://pokeapi.co/api/v2";

export const fetchAllPokemon = () => {
  return fetch(`${base}/pokemon/?limit=151`).then((response) =>
    response.json()
  );
};

export const fetchPokemonSpeciesByName = (name) => {
  return fetch(`${base}/pokemon-species/${name}`).then((response) =>
    response.json()
  );
};

export const fetchPokemonDetailsByName = (name) => {
  return fetch(`${base}/pokemon/${name}`).then((response) => response.json());
};

export const fetchEvolutionChainById = (id) => {
  return fetch(`${base}/evolution-chain/${id}`).then((response) =>
    response.json()
  );
};

export const getEvolutionChain = (evolutionData) => {
  let evolutionNames = [];

  function extractNames(evolutionStage) {
    if (evolutionStage.species) {
      evolutionNames.push(evolutionStage.species.name);
    }
    evolutionStage.evolves_to.forEach((nextStage) => extractNames(nextStage));
  }

  extractNames(evolutionData.chain);
  return evolutionNames;
};

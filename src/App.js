import { useEffect, useMemo, useState } from "react";
import {
  fetchAllPokemon,
  fetchEvolutionChainById,
  fetchPokemonDetailsByName,
  fetchPokemonSpeciesByName,
  getEvolutionChain,
} from "./api";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [pokemonDetails, setPokemonDetails] = useState();

  useEffect(() => {
    const fetchPokemon = async () => {
      const { results: pokemonList } = await fetchAllPokemon();
      setPokemon(pokemonList);
    };

    fetchPokemon().then(() => {
      /** noop **/
    });
  }, [searchValue]);

  //   TODO: debounce
  const onSearchValueChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);
  };

  const filteredPokemon = useMemo(() => {
    return pokemon.filter((monster) =>
      monster.name.toLowerCase().includes(searchValue)
    );
  }, [searchValue, pokemon]);

  const onGetDetails = (name) => async () => {
    const details = await fetchPokemonDetailsByName(name);
    const species = await fetchPokemonSpeciesByName(name);
    const evolutionChainUrl = species.evolution_chain.url;
    const evolutionChainId = evolutionChainUrl.split("/").filter(Boolean).pop();
    const evolutionChain = await fetchEvolutionChainById(evolutionChainId);

    setPokemonDetails({
      name,
      types: details.types.map((typeInfo) => typeInfo.type.name),
      moves: details.moves.map((moveInfo) => moveInfo.move.name),
      evolutionChain: getEvolutionChain(evolutionChain), // You'll need to implement getEvolutionChain
    });
  };

  return (
    <div className={"pokedex__container"}>
      <div className={"pokedex__search-input"}>
        <input
          value={searchValue}
          onChange={onSearchValueChange}
          placeholder={"Search Pokemon"}
        />
      </div>
      <div className={"pokedex__content"}>
        {filteredPokemon.length > 0 ? (
          <div className={"pokedex__search-results"}>
            {filteredPokemon.map((monster) => (
              <div className={"pokedex__list-item"} key={monster.name}>
                <span>{monster.name}</span>
                <button onClick={onGetDetails(monster.name)}>
                  Get Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div>No Results Found</div>
        )}
        {pokemonDetails && (
          <div className={"pokedex__details"}>
            <h3>{pokemonDetails.name}</h3>
            <div className="pokedex__details_content">
              <div className="pokedex__types">
                <strong>Types</strong>
                <ul>
                  {pokemonDetails.types.map((type) => (
                    <li key={type}>{type}</li>
                  ))}
                </ul>
              </div>
              <div className="pokedex__moves">
                <strong>Moves</strong>
                <ul>
                  {pokemonDetails.moves.slice(0, 3).map((move) => (
                    <li key={move}>{move}</li>
                  ))}
                  {pokemonDetails.moves.length > 3 ? <li>...</li> : null}
                </ul>
              </div>
            </div>
            <div className="pokedex__evolutions">
              <strong className="">Evolutions</strong>

              <div className="pokedex__evolutions_item">
                {pokemonDetails.evolutionChain.map((evo) => (
                  <span key={evo}>{evo}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

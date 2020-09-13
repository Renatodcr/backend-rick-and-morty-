const axios = require('axios');
let episodeNames = {};

exports.getAllCharacters = async function (urlBase) {
  let res = await getCharacters(urlBase)
  let all = [...res.results]
  while (res.next !== null) {
    res = await getCharacters(res.next)
    all.push(...res.results)
  }
  return all;
};

async function getCharacters(url) {
  const { data } = await axios(url);
  const { results } = data;
  let response = results.filter((item) => item.location.name == 'Earth (C-137)').map((item) => {
    let character = {
      name: item.name,
      species: item.species,
      status: item.status,
      gender: item.gender,
      image: item.image,
      episode: item.episode,
    };

    return character;

  });
  
  let responseFull = await refreshEpisodeName(response);

  return {
    next: data.info.next,
    results: responseFull
  };
}

const getAxios = async (url) => {
  try {
    return await axios.get(url)
  } catch (error) {
    console.error(error)
  }
}

async function getEpisodes(urlEpisodes) {
  let episodes = [];
  for (url in urlEpisodes){
    if (!(urlEpisodes[url] in episodeNames)) {
      let ep = await getAxios(urlEpisodes[url]);
      episodeNames[urlEpisodes[url]] = ep.data.name;
    }; 

    episodes.push(episodeNames[urlEpisodes[url]]);
    }

  return episodes;
}

async function refreshEpisodeName(characters) {
  for (index in characters)
    characters[index].episode = await getEpisodes(characters[index].episode);
  return characters;
}
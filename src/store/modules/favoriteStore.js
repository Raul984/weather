export default {
  namespaced: true,
  state() {
    return {
      favoriteCities: JSON.parse(localStorage.getItem("favoriteCities")) || [],
      favoriteOverload: false,
    };
  },
  mutations: {
    addCityToFavorites(state, city) {
      const cityExists = state.favoriteCities.find(
        (el) => el.city.id === city.city.id
      );
      if (state.favoriteCities.length >= 5 || cityExists) {
        state.favoriteOverload = true;
      } else {
        state.favoriteCities.push(city);
        localStorage.setItem(
          "favoriteCities",
          JSON.stringify(state.favoriteCities)
        );
      }
    },
    removeCityFromFavorites(state, id) {
      state.favoriteOverload = false;
      state.favoriteCities = state.favoriteCities.filter(
        (item) => item.city.id !== id
      );
      localStorage.setItem(
        "favoriteCities",
        JSON.stringify(state.favoriteCities)
      );
    },
  },
  getters: {
    favoriteCities(state) {
      return state.favoriteCities;
    },
    favoriteOverload(state) {
      return state.favoriteOverload;
    },
  },
};

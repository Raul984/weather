import axios from "axios";
import Cookies from "js-cookie";

export default {
  namespaced: true,
  state() {
    return {
      homeCities: [],
      status: {
        loading: false,
        error: null,
      },
      quantityError: false,
      language: Cookies.get("language") || "en",
      queryResult: [],
      searchError: null,
    };
  },
  getters: {
    homeCities(state) {
      return state.homeCities;
    },
    status(state) {
      return state.status;
    },
    quantityError(state) {
      return state.quantityError;
    },
    language(state) {
      return state.language;
    },
    queryResult(state) {
      return state.queryResult;
    },
    searchError(state) {
      return state.searchError;
    },
  },
  mutations: {
    addHomeCity(state, city) {
      const cityExists = state.homeCities.find(
        (el) => el.city.id === city.city.id
      );
      if (state.homeCities.length >= 5 || cityExists !== undefined) {
        state.quantityError = true;
      } else {
        state.homeCities.push(city);
      }
    },
    removeHomeCity(state, id) {
      state.homeCities = state.homeCities.filter((item) => item.city.id !== id);
      state.quantityError = false;
    },
    setQuantityError(state, status) {
      state.quantityError = status;
    },
    setStatus(state, { loading, error }) {
      state.status = { loading, error };
    },
    setLanguage(state, language) {
      state.language = language;
      Cookies.set("language", language);
    },
    clearHomeCities(state) {
      state.homeCities = [];
    },
    setQueryResult(state, results) {
      state.queryResult = results;
    },
    setSearchError(state, error) {
      state.searchError = error;
    },
    clearQueryResult(state) {
      state.queryResult = [];
    },
  },
  actions: {
    async fetchCity({ commit, state }, { lat, lon, period }) {
      try {
        commit("setStatus", { loading: true, error: null });
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/forecast`,
          {
            params: {
              lat,
              lon,
              units: "metric",
              cnt: period,
              lang: state.language,
              APPID: import.meta.env.VITE_API_KEY,
            },
          }
        );
        commit("addHomeCity", response.data);
        commit("setStatus", { loading: false, error: null });
      } catch (error) {
        console.log({ error });
        commit("setStatus", {
          loading: false,
          error: error.response?.data?.message,
        });
      }
    },
    async refetchCities({ commit, state }, { cities, path }) {
      try {
        commit("setStatus", { loading: true, error: null });
        const promises = cities.map((city) => {
          return axios.get(`${import.meta.env.VITE_BASE_URL}/forecast`, {
            params: {
              lat: city.city.coord.lat,
              lon: city.city.coord.lon,
              units: "metric",
              cnt: 40,
              lang: state.language,
              APPID: import.meta.env.VITE_API_KEY,
            },
          });
        });
        const responses = await Promise.all(promises);
        if (path === "home") {
          commit("clearHomeCities");
          responses.forEach((response) => {
            commit("addHomeCity", response.data);
          });
        } else {
          localStorage.removeItem("favoriteCities");
          responses.forEach((response) => {
            commit(
              "favoriteStore/removeCityFromFavorites",
              response.data.city.id,
              { root: true }
            );
            commit("favoriteStore/addCityToFavorites", response.data, {
              root: true,
            });
          });
        }
        commit("setStatus", { loading: false, error: null });
      } catch (error) {
        console.log({ error });
        commit("setStatus", {
          loading: false,
          error: error.response?.data?.message,
        });
      }
    },
    async searchCity({ commit, state }, { query }) {
      if (query.length > 2) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/find`,
            {
              params: {
                q: query,
                type: "like",
                sort: "population",
                cnt: 5,
                lang: state.language,
                APPID: import.meta.env.VITE_API_KEY,
              },
            }
          );
          commit("setQueryResult", response.data.list);
        } catch (error) {
          commit("setSearchError", error.message);
        }
      } else {
        commit("clearQueryResult");
      }
    },
  },
};

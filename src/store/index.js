
import { createStore } from 'vuex';
import favoriteStore from './modules/favoriteStore';
import cityStore from './modules/cityStore';

const store = createStore({
  modules: {
    favoriteStore: favoriteStore,
    cityStore: cityStore,
  }
});

export default store;
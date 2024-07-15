<template>
  <div class="search-city">
    <div class="search-city__input-wrapper">
      <input
        type="text"
        v-model="query"
        class="search-city__input"
        @input="debounceGetSearch"
        :placeholder="$t('search.placeholder')"
        autocomplete="off"
      />
      <button @click="addCityCard" class="add-city-button">+</button>
    </div>
    <div
      v-if="queryResult.length < 1 && query.length > 1 && !selectedCity"
      class="search-city__error-message"
    >
      {{ $t("search.nonCityError") }}
    </div>

    <ul v-if="queryResult.length" class="search-city__dropdown-list">
      <li
        v-for="city in queryResult"
        :key="city.id"
        class="search-city__dropdown-item"
        @click="selectCity(city)"
      >
        {{ city.name }}, {{ city.sys.country }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import { useStore } from "vuex";

const query = ref("");
const searchTimeout = ref(null);
const selectedCity = ref(null);

const store = useStore();

const queryResult = computed(() => store.state.cityStore.queryResult);
const quantityError = computed(() => store.state.cityStore.quantityError);

const debounceGetSearch = () => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    store.dispatch("cityStore/searchCity", { query: query.value });
  }, 300);
};

const selectCity = (city) => {
  selectedCity.value = city;
  store.commit("cityStore/clearQueryResult");
};

const addCityCard = async () => {

  if (selectedCity.value) {
    const lat = selectedCity.value.coord.lat;
    const lon = selectedCity.value.coord.lon;
    await store.dispatch("cityStore/fetchCity", { lat, lon, period: 40 });
    query.value = "";
    selectedCity.value = null;
    if (!quantityError.value) {
      await nextTick();
      const weatherBlocks = document.querySelectorAll(".weather-block");
      const lastWeatherBlock = weatherBlocks[weatherBlocks.length - 1];
      lastWeatherBlock.scrollIntoView({ behavior: "smooth" });
    }
  }
};
</script>

<style scoped>
.search-city {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 auto 50px;
}
.search-city__input {
  display: block;
  padding: 10px;
  width: 100%;
  margin-right: 10px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  outline: none;
  background: none;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
  background-color: hsla(0, 0%, 100%, 0.5);
  border-radius: 16px 0 16px 0;
  font-size: 1rem;
  color: #22264b;
}
.search-city__input:hover,
.search-city__input:focus {
  border: 1.5px solid #009688;
  background-color: white;
}
.search-city__error-message {
  position: absolute;
  top: 40px;
  color: red;
  margin-top: 5px;
  z-index: 1;
}

.search-city__dropdown-list {
  position: absolute;
  top: 40px;
  width: calc(100% - 60px);
  max-height: 220px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: hsl(188.34deg 61.57% 84.53%);
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  padding: 0;
  list-style: none;
}

.search-city__dropdown-item {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-city__dropdown-item:hover {
  background-color: #f0f0f0;
}
.search-city__input-wrapper {
  display: flex;
}
</style>

<!-- OPTIONS API
<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "SearchCity",
  data() {
    return {
      query: "",
      searchTimeout: null,
      selectedCity: null,
    };
  },
  computed: {
    ...mapState("cityStore", ["queryResult"]),
    ...mapState("cityStore", ["quantityError"]),
  },
  methods: {
    ...mapActions("cityStore", ["fetchCity", "searchCity"]),
    ...mapMutations("cityStore", ["clearQueryResult"]),
    
    debounceGetSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.searchCity({ query: this.query });
      }, 300);
    },
    selectCity(city){
      selectedCity = city;
      this.clearQueryResult();
    };
    async addCityCard() {
      const lat = city.coord.lat;
      const lon = city.coord.lon;
      await this.fetchCity({ lat, lon, period: 40 });
      this.query = "";

      if (selectedCity.value) {
        const lat = this.selectedCity.coord.lat;
        const lon = this.selectedCity.coord.lon;
        await store.dispatch('cityStore/fetchCity', { lat, lon, period: 40 });
        this.query = "";
        this.selectedCity = null;
        if (!this.quantityError) {
          await nextTick();
          const weatherBlocks = document.querySelectorAll('.weather-block');
          const lastWeatherBlock = weatherBlocks[weatherBlocks.length - 1];
          lastWeatherBlock.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
  },
};
</script> -->

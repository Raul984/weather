<template>
  <div class="favorites">
    <h2 class="favorites__title">{{ $t("nav.favorite") }}</h2>
    <PreLoader v-if="loading" />
    <div class="favorites__block" v-else>
      <div
        v-for="city in favoriteCities"
        :key="city.city.id"
        class="favorites__block-item"
      >
        <WeatherBlock :city="city" :isFavoritePage="true" />
        <span
          @click="confirmRemoveFavorite(city.city.id)"
          class="favorites__delete-icon"
          >&#128465;</span
        >
      </div>
      <h4 v-if="favoriteCities.length === 0" class="favorites__no-cities">
        {{ $t("noFavorites") }}
      </h4>
    </div>
    <ModalConfirm
      v-if="showRemoveConfirm"
      :visible="showRemoveConfirm"
      :title="$t('titleModal.removeFavorite')"
      :message="$t('deleteConfirm')"
      @confirm="removeFavorite"
      @cancel="showRemoveConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";

import ModalConfirm from "../components/ModalConfirm.vue";
import WeatherBlock from "../components/WeatherBlock.vue";
import PreLoader from "../components/PreLoader.vue";

const store = useStore();

const showRemoveConfirm = ref(false);
const cityToRemove = ref(null);

const favoriteCities = computed(
  () => store.getters["favoriteStore/favoriteCities"]
);
const status = computed(() => store.getters["cityStore/status"]);
const loading = computed(() => status.value.loading);

const confirmRemoveFavorite = (cityId) => {
  cityToRemove.value = cityId;
  showRemoveConfirm.value = true;
};

const removeFavorite = () => {
  store.commit("favoriteStore/removeCityFromFavorites", cityToRemove.value);
  cityToRemove.value = null;
  showRemoveConfirm.value = false;
};

if (favoriteCities.value.length > 0) {
  store.dispatch("cityStore/refetchCities", {
    cities: favoriteCities.value,
    path: "favorite",
  });
}
</script>

<style scoped>
.favorites__block-item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-top: 20px;
}

.favorites__delete-icon {
  position: absolute;
  top: 5%;
  right: 5%;
  font-size: 2em;
  cursor: pointer;
}

.favorites__delete-icon:hover {
  color: #ccc;
}

@media (max-width: 550px) {
  .favorites__delete-icon {
    font-size: 1.5em;
  }
}
</style>

<!-- OPTIONS API
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import ModalConfirm from '../components/ModalConfirm.vue';
import WeatherBlock from '../components/WeatherBlock.vue';
import PreLoader from '../components/PreLoader.vue';

export default {
  name: "FavoritePage",
  components: { ModalConfirm, WeatherBlock, PreLoader },
  data() {
    return {
      showRemoveConfirm: false,
      cityToRemove: null
    };
  },
  created() {
    if (this.favoriteCities.length > 0) {
      this.refetchCities({ cities: this.favoriteCities, path: 'favorite'}) 
    }
  },
  methods: {
    ...mapMutations('favoriteStore', ['removeCityFromFavorites']),
    ...mapActions('cityStore', ['refetchCities']),
    confirmRemoveFavorite(cityId) {
      this.cityToRemove = cityId;
      this.showRemoveConfirm = true;
    },
    removeFavorite() {
      this.removeCityFromFavorites(this.cityToRemove);
      this.cityToRemove = null;
      this.showRemoveConfirm = false;
    }
  },
  computed: {
    ...mapGetters('favoriteStore', ['favoriteCities']),
    ...mapGetters('cityStore', ['status']),
      loading() {
          return this.status?.loading;
      }
  },
};
</script>-->


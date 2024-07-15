<template>
  <div class="home">
    <h2 class="home__title">{{ $t("nav.home") }}</h2>
    <SearchCity />
    <PreLoader v-if="loading" />
    <div class="home__block" v-else>
      <div
        v-for="city in homeCities"
        :key="city.city.id"
        class="home__block-item"
      >
        <WeatherBlock :city="city" @remove="removeBlock" />
      </div>
      <h4 v-if="homeCities.length === 0" class="home__no-cities">
        {{ $t("noCities") }}
      </h4>
    </div>
    <ModalConfirm
      v-if="alertMessage"
      :visible="alertMessage"
      :title="$t('titleModal.attention')"
      :message="$t('overflow.home')"
      :alert="true"
      @understand="setAlertmessage"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";

import WeatherBlock from "../components/WeatherBlock.vue";
import SearchCity from "../components/SearchCity.vue";
import PreLoader from "../components/PreLoader.vue";
import ModalConfirm from "../components/ModalConfirm.vue";

const store = useStore();

const alertMessage = ref(false);
const homeCities = computed(() => store.getters["cityStore/homeCities"]);
const status = computed(() => store.getters["cityStore/status"]);
const quantityError = computed(() => store.getters["cityStore/quantityError"]);
const loading = computed(() => status.value.loading);

const getUserCity = () => {
  if (homeCities.value.length === 0) {
    store.commit("cityStore/setStatus", { loading: true, error: null });
    const geoOptions = { enableHighAccuracy: true };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lon = position.coords.longitude;
        const lat = position.coords.latitude;
        store.dispatch("cityStore/fetchCity", { lat, lon, period: 40 });
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      geoOptions
    );
  }
};

const removeBlock = (city) => {
  store.commit("cityStore/removeHomeCity", city.city);
};
const setAlertmessage = () => {
  alertMessage.value = false;
  store.commit("cityStore/setQuantityError", false);
};

watch(quantityError, (newVal) => {
  if (newVal) {
    alertMessage.value = true;
  }
});

onMounted(() => {
  getUserCity();
});
</script>

<style scoped>
.home {
  width: 100%;
}

.home__block-item {
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-top: 20px;
}
</style>

<!-- 
  <script>
  import WeatherBlock from '../components/WeatherBlock.vue';
  import SearchCity from '../components/SearchCity.vue';
  import PreLoader from '../components/PreLoader.vue';
  import ModalConfirm from '../components/ModalConfirm.vue';
  import { mapGetters, mapMutations, mapActions } from "vuex";
  
  export default {
    name: 'HomePage',
    components: { WeatherBlock, SearchCity, PreLoader, ModalConfirm },
    data() {
      return {
        alertMessage: false
      }
    },
    methods: {
      ...mapMutations('cityStore', {
        removeHomeCity: 'removeHomeCity',
        setQuantityError: 'setQuantityError',
        setStatus: 'setStatus'
      }),
      ...mapActions('cityStore', {
        fetchCity: 'fetchCity'
      }),
      getUserCity() {
        if (this.homeCities.length === 0) {
          this.setStatus({ loading: true, error: null });
          const geoOptions = {
            enableHighAccuracy: true,
          };
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lon = position.coords.longitude;
              const lat = position.coords.latitude;
              this.fetchCity({ lat, lon, period: 40 });
            },
            (error) => {
              console.error('Error getting location:', error);
            },
            geoOptions
          );
        }
      },
      removeBlock(city) {
        this.removeHomeCity(city.city);
      },
      setAlertmessage() {
        this.alertMessage = false;
        this.setQuantityError(false);
      }
    },
    computed: {
      ...mapGetters('cityStore', {
        homeCities: 'homeCities',
        status: 'status',
        quantityError: 'quantityError'
      }),
      loading() {
          return this.status?.loading;
      },
      homeOverload() {
          return this.quantityError
      },
    },
    created() {
      this.getUserCity();
    },
    watch: {
        homeOverload: {
            handler() {
                this.alertMessage = true;
            }

        }
    }
  };
  </script>
   -->

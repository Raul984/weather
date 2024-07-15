<template>
  <div class="weather-block">
    <PreLoader v-if="loading" />
    <div v-else>
      <div class="weather-block__buttons">
        <button @click="showRemoveConfirm = true" v-if="!isFavoritePage">
          {{ $t("remove") }}
        </button>
        <button @click="showDay">{{ $t("day") }}</button>
        <button @click="showWeek">{{ $t("week") }}</button>
        <button @click="addFavorite" v-if="!isFavoriteCity">
          {{ $t("add") }}
        </button>
        <span
          v-if="isFavoriteCity && !isFavoritePage"
          class="weather-block__favorite-icon"
          >&#9829;</span
        >
      </div>
      <WeatherCard v-if="city" :data="city" />
      <ForecastBlock
        v-if="city"
        :data="filteredDataWeather"
        :view="view"
        :cityName="city.city.name"
        :cityId="city.city.id"
      />

      <ModalConfirm
        v-if="showRemoveConfirm"
        :visible="showRemoveConfirm"
        :title="$t('titleModal.remove')"
        :message="$t('deleteConfirm')"
        @confirm="removeBlock"
        @cancel="showRemoveConfirm = false"
      />

      <ModalConfirm
        v-if="alertMessage"
        :visible="alertMessage"
        :title="$t('titleModal.attention')"
        :message="$t('overflow.favorite')"
        :alert="true"
        @understand="alertMessage = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import WeatherCard from "./WeatherCard.vue";
import ModalConfirm from "./ModalConfirm.vue";
import ForecastBlock from "./ForecastBlock.vue";
import PreLoader from "./PreLoader.vue";

const props = defineProps({
  city: Object,
  isFavoritePage: Boolean,
});

const emit = defineEmits(["remove"]);

const store = useStore();
const view = ref("day");
const showRemoveConfirm = ref(false);
const filteredDataWeather = ref([]);
const alertMessage = ref(false);
const loading = computed(() => store.getters["cityStore/status"].loading);
const favoriteCities = computed(
  () => store.getters["favoriteStore/favoriteCities"]
);
const favoriteOverload = computed(
  () => store.getters["favoriteStore/favoriteOverload"]
);
const isFavoriteCity = computed(() =>
  favoriteCities.value.some((city) => city.city.id === props.city.city.id)
);

const getCurrentDayWeather = (data) => data.list.slice(0, 8);
const getWeekWeather = () => {
  const weekWeather = [];
  const uniqueDays = new Set();

  for (let item of props.city.list) {
    const itemDate = item.dt_txt.split(" ")[0];
    if (!uniqueDays.has(itemDate)) {
      uniqueDays.add(itemDate);
      weekWeather.push(item);
    }
  }
  return weekWeather;
};

const showDay = () => {
  view.value = "day";
  filteredDataWeather.value = getCurrentDayWeather(props.city);
};

const showWeek = () => {
  view.value = "5days";
  filteredDataWeather.value = getWeekWeather();
};

const addFavorite = () => {
  store.commit("favoriteStore/addCityToFavorites", props.city);
  if (favoriteOverload.value) {
    alertMessage.value = true;
  }
};

const removeBlock = () => {
  showRemoveConfirm.value = false;
  emit("remove", { city: props.city.city.id });
};

onMounted(() => {
  filteredDataWeather.value = getCurrentDayWeather(props.city);
});
</script>

<style scoped>
.weather-block {
  position: relative;
  min-height: 35rem;
  padding: 2rem;
  background: #7e85c5;
  transition: 0.4s;
  border-radius: 10px;
  margin-bottom: 20px;
}

.weather-block__buttons {
  display: flex;
  justify-content: center;
  column-gap: 20px;
  margin-top: 20px;
}

.weather-block__favorite-icon {
  position: absolute;
  top: 5%;
  right: 5%;
  color: red;
  scale: 3;
}

@media (max-width: 768px) {
  .weather-block__buttons {
    column-gap: 10px;
  }
  .weather-block__buttons button {
    font-size: 12px;
    padding: 7px 5px;
  }
  .weather-block__favorite-icon {
    scale: 2;
  }
}
</style>

<!-- OPTIONS API
<script>
import WeatherCard from './WeatherCard.vue';
import ModalConfirm from './ModalConfirm.vue';
import ForecastBlock from "./ForecastBlock.vue";
import PreLoader from './PreLoader.vue';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'WeatherBlock',
  components: { ModalConfirm, WeatherCard, ForecastBlock, PreLoader },
  props: {
    city: Object,
    isFavoritePage: Boolean
  },
  emits: ['remove'],
  data() {
    return {
      view: 'day',
      showRemoveConfirm: false,
      filteredDataWeather: [],
      alertMessage: false
    };
  },
  computed: {
    ...mapGetters('cityStore', ['status']),
    ...mapGetters('favoriteStore', {
        favoriteCities: 'favoriteCities',
        favoriteOverload: 'favoriteOverload'
      }),
    loading() {
        return this.status.loading;
    },
    isFavoriteCity() {
      return this.favoriteCities.some(city => city.city.id === this.city.city.id);
    },
  },
  mounted() {
    this.filteredDataWeather = this.getCurrentDayWeather(this.city);
  },
  methods: {
    ...mapMutations('favoriteStore', ['addCityToFavorites']),
    removeBlock() {
      this.showRemoveConfirm = false;
      this.$emit('remove', { city: this.city.city.id });
    },
    getCurrentDayWeather(data) {
      return data.list.slice(0, 8)
    },
    getWeekWeather() {
      const weekWeather = [];
      const uniqueDays = new Set();

      for (let item of this.city.list) {
        const itemDate = item.dt_txt.split(' ')[0];
        if (!uniqueDays.has(itemDate)) {
          uniqueDays.add(itemDate);
          weekWeather.push(item);
        }
      }
      return weekWeather;
    },
    showDay() {
      this.view = 'day';
      this.filteredDataWeather = this.getCurrentDayWeather(this.city);
    },
    showWeek() {
      this.view = '5days';
      this.filteredDataWeather = this.getWeekWeather();
    },
    addFavorite() {
      this.addCityToFavorites(this.city);
      if (this.favoriteOverload) {
        this.alertMessage = true;
      }
    },
  },
}
</script>-->

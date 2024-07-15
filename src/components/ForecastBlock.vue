<template>
  <div class="forecast-block">
    <h2 v-if="view === 'day'" class="forecast-block__title">
      {{ $t("hourlyTitle") }}
    </h2>
    <h2 v-else class="forecast-block__title">{{ $t("weekTitle") }}</h2>
    <hr class="forecast-block__separator" />
    <div class="forecast-block__container">
      <div class="forecast-block__list">
        <div
          class="forecast-block__item"
          v-for="weather in data"
          :key="weather.dt"
        >
          <p v-if="view === 'day'" class="forecast-block__time">
            {{ timeFormat(weather.dt_txt) }}
          </p>
          <p v-else class="forecast-block__time">
            {{ dateFormat(weather.dt_txt) }}
          </p>
          <img
            class="forecast-block__weather-img"
            :src="weatherIconUrl(weather.weather[0].icon)"
            alt="weather-icon"
          />
          <p class="forecast-block__description">
            {{ weather.weather[0].description }}
          </p>
          <p class="forecast-block__temp">
            {{ Math.trunc(weather.main.temp) }}°C
          </p>
        </div>
      </div>
    </div>
  </div>
  <WeatherChart :data="data" :view="view" :chartId="chartId" />
</template>

<script setup>
import { computed } from "vue";
import WeatherChart from "./WeatherChart.vue";
import { useStore } from "vuex";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  view: {
    type: String,
    default: "day",
  },
  cityName: {
    type: String,
    default: "",
  },
  cityId: {
    type: Number,
    default: null,
  },
});

const store = useStore();
const timeFormat = (dt_txt) => {
  const time = new Date(dt_txt);
  return `${time.getHours()}:${time.getMinutes()}0`;
};

const dateFormat = (dt_txt) => {
  const locale = store.getters["cityStore/language"];
  return new Date(dt_txt).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
};

const chartId = computed(() => props.cityName + props.cityId + props.view);

const weatherIconUrl = (iconCode) => {
  return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
};
</script>

<style scoped>
.forecast-block {
  margin-bottom: 20px;
}

.forecast-block__separator {
  border: none;
  border-top: 1px solid #ccc;
  margin: 10px 0;
}

.forecast-block__container {
  overflow: auto;
}

.forecast-block__list {
  display: flex;
  justify-content: space-between;
  column-gap: 5px;
  flex-wrap: nowrap;
}

.forecast-block__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.forecast-block__item p {
  text-align: center;
  color: #e8edf3;
  font-weight: 400;
  font-size: 14px;
}

.forecast-block__title {
  color: #e8edf3;
}

.forecast-block__weather-img {
  width: 50px;
  height: 50px;
}

.forecast-block__description {
  font-size: 14px;
}

.forecast-block__temp {
  font-weight: bold;
  font-size: 16px;
}
</style>

<!-- OPTIONS API
<script>
import WeatherChart from "./WeatherChart.vue"

export default {
    name: "ForecastBlock",
    props: {
        data: {
            type: Array,
            default: []
        },
        view: {
            type: String,
            default: "day"
        },
        cityName: {
            type: String,
            default: ""
        }
    },
    components: {
        WeatherChart
    },
    methods: {
        timeFormat(dt_txt) {
            const time = new Date(dt_txt)
            return `${time.getHours()}:${time.getMinutes()}0`
        },
        dateFormat(dt_txt) {
            const locale = this.$i18n.locale
            const data = new Date(dt_txt).toLocaleDateString(locale, { month: "short", day: "numeric" });
            return `${data}`
        },
    },
}
</script> -->

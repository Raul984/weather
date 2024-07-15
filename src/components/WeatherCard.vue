<template>
  <div class="weather-card">
    <img :src="iconUrl" alt="weather icon" class="weather-card__icon" />
    <h3 class="weather-card__city-name">{{ data.city.name }} ({{ data.city.country }})</h3>
    <div class="weather-card__info">
      <p v-if="currentDescription" class="weather-card__description">
        {{ currentDescription }}
      </p>
      <p v-if="currentTemp" class="weather-card__temp">{{ currentTemp }}°C</p>
      <p v-if="currentFeelsTemp" class="weather-card__feels-like">
        {{ $t("feelsLike") }}: {{ currentFeelsTemp }}°C
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  data: Object,
});

const iconUrl = computed(
  () =>
    `http://openweathermap.org/img/wn/${props.data.list[0].weather[0].icon}@2x.png`
);
const currentTemp = computed(() =>
  props.data?.list[0]?.main ? Math.round(props.data.list[0].main.temp) : ""
);
const currentFeelsTemp = computed(() =>
  props.data?.list[0]?.main
    ? Math.round(props.data.list[0].main.feels_like)
    : ""
);
const currentDescription = computed(() =>
  props.data?.list[0]?.weather?.length
    ? props.data.list[0].weather[0].description
    : ""
);
</script>
<style scoped>
.weather-card {
  border: 1px solid #ccc;
  padding: 20px;
  margin: 20px auto;
  max-width: 300px;
  text-align: center;
  border-radius: 10px;
}

.weather-card__city-name {
  font-weight: 100;
  font-size: 1.6rem;
  color: #e8edf3;
  margin: 0;
}

.weather-card__info {
  width: 200px;
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
}

.weather-card__description,
.weather-card__temp,
.weather-card__feels-like {
  font-size: 1.2rem;
  font-weight: 900;
  color: #e6cf8b;
}
</style>

<!-- 
  <script>
  export default {
    name: 'WeatherCard',
    props: {
      data: Object,
      view: String
    },
    computed: {
      currentTemp() {
        if (this.data && this.data.list[0].main) {
          return Math.round(this.data.list[0].main.temp);
        }
        return '';
      },
      currentFeelsTemp() {
        if (this.data && this.data.list[0].main) {
          return Math.round(this.data.list[0].main.feels_like);
        }
        return '';
      },
      currentDescription() {
        if (this.data && this.data.list[0].weather && this.data.list[0].weather.length > 0) {
          return this.data.list[0].weather[0].description;
        }
        return '';
      },
    },
  };
  </script>
   -->

<template>
  <div class="weather-chart">
    <canvas :id="chartId"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { Chart, registerables } from "chart.js";
import { useI18n } from "vue-i18n";

Chart.register(...registerables);

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  view: {
    type: String,
    default: "day",
  },
  chartId: {
    type: String,
    default: "",
  },
});

const chartInstance = ref(null);
const { t, locale } = useI18n();

const timeFormat = (dt_txt) => {
  const time = new Date(dt_txt);
  return `${time.getHours()}:${time.getMinutes()}0`;
};

const dateFormat = (dt_txt) => {
  const data = new Date(dt_txt).toLocaleDateString(locale.value, {
    month: "short",
    day: "numeric",
  });
  return `${data}`;
};

const chartData = (dayOrWeek, dt) => {
  return dayOrWeek === "day" ? timeFormat(dt) : dateFormat(dt);
};

const createChart = () => {
  const ctx = document.getElementById(props.chartId);
  if (!ctx) {
    console.error("Canvas context not found");
    return;
  }
  chartInstance.value = new Chart(ctx, {
    type: "line",
    data: {
      labels: props.data.map((period) => chartData(props.view, period.dt_txt)),
      datasets: [
        {
          label: t("temperature"),
          data: props.data.map((item) => item.main.temp),
          borderColor: "#e8edf3",
          backgroundColor: "#e8edf3",
          borderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#e8edf3",
          },
        },
        title: {
          display: true,
          text: props.view === "day" ? t("graphDay") : t("graphWeek"),
          color: "#e8edf3",
        },
      },
      scales: {
        x: {
          title: { display: true, text: t("time"), color: "#e8edf3" },
          ticks: { color: "#e8edf3" },
        },
        y: {
          title: { display: true, text: t("temperature"), color: "#e8edf3" },
          ticks: { color: "#e8edf3" },
        },
      },
    },
  });
};

const updateChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  setTimeout(() => {
    createChart();
  }, 300);
};

onMounted(() => {
  updateChart();
});

onBeforeUnmount(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
});

watch(
  () => props.chartId,
  () => {
    updateChart();
  }
);
</script>

<style scoped>
.weather-chart {
  max-width: 700px;
  width: 100%;
  margin: 15px auto 0 auto;
}
</style>

<!-- OPTIONS API
<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  name: "WeatherChart",
  props: {
    data: {
      type: Array,
      required: true,
    },
    view: {
      type: String,
      default: 'day',
    },
    chartId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      chartInstance: null,
    };
  },
  methods: {
    timeFormat(dt_txt) {
      const time = new Date(dt_txt);
      return `${time.getHours()}:${time.getMinutes()}0`;
    },
    dateFormat(dt_txt) {
      const locale = this.$i18n.locale;
      const data = new Date(dt_txt).toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
      });
      return `${data}`;
    },
    chartData(dayOrWeek, dt) {
      return dayOrWeek === "day" ? this.timeFormat(dt) : this.dateFormat(dt);
    },
    createChart() {
      const ctx = document.getElementById(this.chartId);
      if (!ctx) {
        console.error("Canvas context not found");
        return;
      }
      this.chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.data.map((hour) => this.chartData(this.view, hour.dt_txt)),
          datasets: [
            {
              label: this.$t('temperature'),
              data: this.data.map((hour) => hour.main.temp),
              borderColor: "#e8edf3",
              backgroundColor: "#e8edf3",
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
              labels: {
                color: '#e8edf3'
              }
            },
            title: {
              display: true,
              text: this.view === "day" ? this.$t('graphDay') : this.$t('graphWeek'),
              color: '#e8edf3'
            },
          },
          scales: {
            x: { title: { display: true, text: this.$t('time'), color: '#e8edf3' }, ticks: { color: '#e8edf3' } },
            y: { title: { display: true, text: this.$t('temperature'), color: '#e8edf3' }, ticks: { color: '#e8edf3' } },
          },
        },
      });
    },
    updateChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      setTimeout(() => {
        this.createChart();
      }, 300);
    },
  },
  watch: {
    chartId: {
      handler() {
        this.updateChart();
      },
    },
  },
  mounted() {
    setTimeout(() => {
      this.createChart();

    }, 300);
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  },
};
</script>

<style scoped>
.weather-chart {
    max-width: 700px;
    width: 100%;
    margin: 15px auto 0 auto;
}
</style>
 -->

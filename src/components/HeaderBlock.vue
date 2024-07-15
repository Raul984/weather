<template>
  <header class="header">
    <div class="header__wrapper">
      <h1 class="header__logo">{{ $t("logo") }}</h1>
      <div class="header__block">
        <nav class="header__nav">
          <RouterLink class="header__link" to="/">{{
            $t("nav.home")
          }}</RouterLink>
          <RouterLink class="header__link" to="/favorites">{{
            $t("nav.favorite")
          }}</RouterLink>
        </nav>
        <button @click="languageToggle" class="header__change-language">
          {{ $t("changeLanguage") }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const store = useStore();
const route = useRoute();
const { locale } = useI18n();

const homeCities = computed(() => store.getters["cityStore/homeCities"]);
const favoriteCities = computed(
  () => store.getters["favoriteStore/favoriteCities"]
);

const languageToggle = async () => {
  const language = locale.value === "uk" ? "en" : "uk";
  locale.value = language;
  store.commit("cityStore/setLanguage", language);

  if (route.path === "/") {
    await store.dispatch("cityStore/refetchCities", {
      cities: homeCities.value,
      path: "home",
    });
  } else if (route.path === "/favorites") {
    await store.dispatch("cityStore/refetchCities", {
      cities: favoriteCities.value,
      path: "favorite",
    });
  }
};
</script>

<style scoped>
.header {
  width: 100%;
}
.header__wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.header__logo {
  font-size: 2rem;
}
.header__block {
  display: flex;
  justify-content: space-between;
}
.header__nav {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 20px;
}
.header__link {
  text-decoration: none;
  color: #213547;
}
.header__link.router-link-exact-active {
  font-weight: bold;
}
@media (max-width: 768px) {
  .header__change-language {
    font-size: 12px;
    padding: 7px;
  }
}
@media (max-width: 550px) {
  .header__logo {
    font-size: 32px;
  }
}
</style>

<!-- <script>
import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
    name: 'HeaderBlock',
    methods: {
        ...mapActions('cityStore', ['refetchCities']),
        ...mapMutations('cityStore', ['setLanguage']),
        async languageToggle() {
            const language = this.$i18n.locale === "uk" ? "en" : "uk"
            this.$i18n.locale = language
            this.setLanguage(language)
            if (this.$route.path === "/") {
                await this.refetchCities({ cities: this.homeCities, path: 'home'})
            } else if (this.$route.path === "/favorites") {
                await this.refetchCities({ cities: this.favoriteCities, path: 'favorite'})
            }
            localStorage.setItem("language", language)
        },
    },
    computed: {
        ...mapGetters('cityStore', ['homeCities']),
        ...mapGetters('favoriteStore', ['favoriteCities']),
    }
}

</script>-->

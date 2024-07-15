<template>
  <div class="container">
    <header-block />
    <router-view />
  </div>
</template>

<script>
import HeaderBlock from './components/HeaderBlock.vue';
export default {
  name: 'App',
  components: {
    HeaderBlock
  }
};
</script>


<template>
  <div v-if="visible" class="modal">
    <div class="modal__content">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <button @click="understand" v-if="alert">{{ $t("understand") }}</button>
      <div v-else class="modal__buttons">
        <button @click="confirm">{{ $t("yes") }}</button>
        <button @click="cancel">{{ $t("no") }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Confirm",
  },
  message: {
    type: String,
    default: "Are you sure?",
  },
  alert: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["confirm", "cancel", "understand"]);

const confirm = () => emit("confirm");
const cancel = () => emit("cancel");
const understand = () => emit("understand");
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal__content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin: 0 5px;
}
.modal__buttons {
  display: flex;
  justify-content: center;
  column-gap: 20px;
}
</style>

<!-- OPTIONS API
<script>
export default {
  name: 'ModalConfirm',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: 'Confirm'
    },
    message: {
      type: String,
      default: 'Are you sure?'
    },
    alert: {
      type: Boolean,
      default: false
    }
  },
  emits: ['confirm', 'cancel', 'understand'],
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    cancel() {
      this.$emit('cancel');
    },
    understand() {
      this.$emit('understand');
    }
  }
};
</script>-->

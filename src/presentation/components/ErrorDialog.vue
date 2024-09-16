<template>
  <div class="error-dialog" v-if="error">
    <p>{{ error }}</p>
    <button @click="closeDialog">Close</button>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: String,
      default: '',
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.error-dialog {
  color: red;
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 5px;
  position: fixed;
  top: 20px;
  right: 20px;
  width: 300px;
  z-index: 1000;
}
button {
  margin-top: 10px;
  background-color: #f5c6cb;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
</style>

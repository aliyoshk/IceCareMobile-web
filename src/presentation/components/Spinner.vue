<template>
  <div v-if="loading" class="spinner-overlay">
    <div class="spinner-container">
      <div class="spinner-element"></div>
      <p class="loading-text">Loading, Please wait...</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');

/* Spinner Overlay: Takes up full screen and centers the spinner */
.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3); /* Slightly darker overlay for visibility */
  z-index: 9999; /* Ensures spinner is above all other elements */
}

/* Spinner Container: Holds the spinner and the loading text */
.spinner-container {
  text-align: center; /* Ensures the text is centered below the spinner */
}

/* Spinner styles: Increased size */
.spinner-element {
  border: 8px solid rgba(0, 0, 0, 0.1);
  border-top: 8px solid #F3B923;
  border-radius: 50%;
  width: 80px; /* Increased size */
  height: 80px; /* Increased size */
  animation: spin 1s linear infinite;
  margin: 0 auto; /* Center the spinner itself */
}

/* Loading text styles */
.loading-text {
  margin-top: 5px;
  color: red;
  font-size: 12px;
  font-family: 'Inter', sans-serif;
  text-align: center; /* Ensures the loading text is centered */
}

/* Spinner animation */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

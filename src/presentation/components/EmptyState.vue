<template>
    <div class="empty-state">
      <img :src="image" alt="Empty State" class="empty-state-image" />
      <h2 class="empty-state-title">{{ title }}</h2>
      <p class="empty-state-message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      image: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 16px;
  }
  .empty-state-image {
    width: 100px;
  }
  .empty-state-title {
    margin-top: 16px;
    font-size: 24px;
  }
  .empty-state-message {
    margin-top: 8px;
    font-size: 16px;
  }
  h2, p {
    align-content: center;
  }
  </style>
  
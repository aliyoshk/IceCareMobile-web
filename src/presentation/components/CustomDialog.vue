<template>
    <div v-if="show" class="dialog-overlay">
      <div class="dialog-content">

        <img :src="success ? ic_success : ic_error " alt="icon" class="icon" />
        <h3>{{ success ? 'Success' : 'Error' }}</h3>
        <p>{{ message }}</p>
        <div class="dialog-actions">
          <button @click="onConfirm">Done</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  import ic_success from '@/assets/ic_thumbup.svg';
  import ic_error from '@/assets/ic_thumbdown.svg';
  
  const props = defineProps({
    message: {
      type: String,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
    success: {
        type: Boolean,
        required: true,
    }
  });
  
  const emit = defineEmits(['confirm']);
  
  const onConfirm = () => {
    emit('confirm');
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');

  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .dialog-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 300px;
    text-align: center;
    font-family: 'Inter', sans-serif;
  }

  h3{
    font-weight: bold;
    padding-bottom: 10px;
  }

  h3, p{
    color: black;
  }
  
  .dialog-actions {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  
  button {
    background-color: #bf8022;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    border-radius: 4px;
    width: 40%;
  }
  
  button:hover {
    background-color: #A90836;
  }

  .icon {
  max-width: 40px;
  height: 40px;
  border-radius: 4px;
}

  </style>
  
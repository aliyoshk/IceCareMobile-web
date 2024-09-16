<template>
    <div class="payment-form">
        <h2>Add New Record</h2>
        <div class="form-content">
            <div class="form-item">
                <label for="name">Customer Name</label>
                <input type="text" id="name" v-model="payment.CustomerName" placeholder="Enter customer name" />
            </div>

            <div class="form-item">
                <label for="balance">Amount($)</label>
                <input type="text" id="balance" v-model="payment.DollarAmount" placeholder="Enter dollar amount" />
            </div>

            <div class="form-actions">
                <button @click="submitForm" class="submit-btn">Submit</button>
                <button @click="closeForm" class="close-btn">&#x2715;</button>
            </div>

        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue';

const payment = ref({
  CustomerName: '',
  DollarAmount: ''
});

const emit = defineEmits(['formSubmitted', 'formClosed']);

const closeForm = () => {
  emit('formClosed');
};

const submitForm = () => {
  emit('formSubmitted', payment.value);
};

</script>

<style scoped>
.payment-form {
    display: flex;
    flex-direction: column;
    padding: 10px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-height: 80vh;
    overflow-y: auto;
}

.payment-form h2 {
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
    color: black;
}

.form-item {
    margin-bottom: 15px;
}

.form-item label {
    display: block;
    font-weight: 600;
    color: black;
    margin-bottom: 5px;
}

.form-item input,
.form-item select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: center;
}

.form-actions button {
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 30px;
}

.form-actions button:hover {
  background-color: red;
}

.submit-btn{
    background-color: #B6720F;
    color: white;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  color: black;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 20px;
}

</style>
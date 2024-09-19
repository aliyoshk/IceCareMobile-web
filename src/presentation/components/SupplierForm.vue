<template>
  <div class="supplier-form">
    <h2>Add New Supplier</h2>
    <div class="form-content">
      <div class="form-item">
        <label for="name">Supplier Name</label>
        <input type="text" id="name" v-model="supplier.name" placeholder="Enter supplier name" />
      </div>

      <div class="form-item horizontal-group">
        <div class="form-item-wrapper">
          <label for="phone">Phone Number</label>
          <input type="number" id="phone" v-model="supplier.phone" placeholder="Enter phone number" />
        </div>
        <div class="form-item-wrapper">
          <label for="payment">Mode of Payment</label>
          <div class="dropdown-container">
            <select id="payment" v-model="supplier.modeOfPayment">
              <option value="">Select Mode</option>
              <option value="Cash">Cash</option>
              <option value="Transfer">Transfer</option>
            </select>
            <span class="dropdown-icon">&#9662;</span>
          </div>
        </div>
      </div>

      <div class="form-item" v-if="supplier.modeOfPayment === 'Transfer'">
        <label for="banks">Banks</label>
        <div v-for="(bank, index) in supplier.banks" :key="index" class="bank-item">
          <input type="text" v-model="bank.name" placeholder="Bank Name" />
          <input type="number" v-model="bank.amount" placeholder="Amount" />
          <span class="remove-bank" @click="removeBank(index)">&#x2715;</span>
        </div>
        <div class="add-bank-container">
          <span class="add-bank" @click="addBank">Add another bank</span>
        </div>
      </div>

      <div class="form-item horizontal-group">
        <div class="form-item-wrapper">
          <label for="total-amount-naira">Total Amount (Naira)</label>
          <input type="number" id="total-amount-naira" v-model="supplier.totalAmountNaira"
            placeholder="Enter total amount in Naira" :disabled="shouldDisableTotalAmount" value=""/>
        </div>
        <div class="form-item-wrapper">
          <label for="balance">Balance</label>
          <input type="number" id="balance" v-model="supplier.balance" placeholder="Enter balance" />
        </div>
      </div>

      <div class="form-item horizontal-group">
        <div class="form-item-wrapper">
          <label for="dollar-rate">Dollar Rate</label>
          <input type="number" id="dollar-rate" v-model="supplier.dollarRate" placeholder="Enter dollar rate" />
        </div>
        <div class="form-item-wrapper">
          <label for="amount-dollar">Amount in Dollar</label>
          <input type="number" id="amount-dollar" v-model="supplier.amountDollar" placeholder="Enter amount in Dollar" />
        </div>
      </div>

      <div class="form-actions">
        <button @click="submitForm">Submit</button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      supplier: {
        name: '',
        phone: '',
        modeOfPayment: '',
        banks: [{ name: '', amount: '' }],
        totalAmountNaira: '',
        balance: '',
        dollarRate: '',
        amountDollar: ''
      }
    };
  },
  methods: {
    addBank() {
      this.supplier.banks.push({ name: '', amount: '' });
    },
    removeBank(index) {
      this.supplier.banks.splice(index, 1);
    },
    submitForm() {
      this.$emit('formSubmitted', this.supplier);
    },
    closeForm() {
      this.$emit('formClosed');
    }
  },
  computed: {
    shouldDisableTotalAmount() {
      this.supplier.totalAmountNaira = "";
      return this.supplier.modeOfPayment === 'Transfer' && (
        !this.supplier.banks.every(bank => bank.name.trim() !== '' && bank.amount.trim() !== '')
      );
    }
  }
};
</script>

<style scoped>
.supplier-form {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  /* Limit the form height */
  overflow-y: auto;
  /* Enable vertical scrolling */
}

.supplier-form h2 {
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

.horizontal-group {
  display: flex;
  gap: 20px;
  width: 100%;
}

.form-item-wrapper {
  flex: 1;
}

.dropdown-container {
  position: relative;
}

.dropdown-container select {
  appearance: none;
  /* Remove default styling */
  background-color: white;
  /* Match background color */
}

.dropdown-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: black;
}

.bank-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.bank-item input {
  flex: 1;
}

.remove-bank {
  color: gold;
  cursor: pointer;
  font-size: 20px;
}

.add-bank-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.add-bank {
  color: #e64d4d;
  /* Maroon color */
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  display: inline-block;
  margin-top: 20px;
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  justify-content: center;
}

.form-actions button {
  background-color: #B6720F;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 30px;
}

.form-actions button:hover {
  background-color: #0056b3;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    -moz-appearance: textfield; /* For Firefox */
}
</style>
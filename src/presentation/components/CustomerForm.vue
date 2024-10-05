<template>
  <div class="customer-form">
    <h2>Add New customer</h2>
    <div class="form-content">
      <div class="form-item">
        <label for="name">Customer Name</label>
        <input type="text" id="name" v-model="customer.name" placeholder="Enter customer name" />
      </div>

      <div class="form-item">
        <label for="phone">Phone Number</label>
        <input type="number" id="phone" v-model="customer.phone" placeholder="Enter phone number" />
      </div>

      <div class="form-item horizontal-group">

        <div class="form-item-wrapper">
          <label for="paymentCurrency">Payment Currency</label>
          <div class="dropdown-container">
            <select id="paymentCurrency" v-model="customer.paymentCurrency">
              <option value="">Select Currency</option>
              <option value="Naira">Naira(₦)</option>
              <option value="Dollar">Dollar($)</option>
            </select>
            <span class="dropdown-icon">&#9662;</span>
          </div>
        </div>

        <div class="form-item-wrapper">
          <label for="payment">Mode of Payment</label>
          <div class="dropdown-container">
            <select id="payment" v-model="customer.modeOfPayment" :disabled="shouldDisableTransferOption">
              <option value="">Select Mode</option>
              <option value="Cash">Cash</option>
              <option value="Transfer">Transfer</option>
            </select>
            <span class="dropdown-icon">&#9662;</span>
          </div>
        </div>
      </div>


      <div class="form-item" v-if="customer.modeOfPayment === 'Transfer'">
        <label for="banks">Banks</label>
        <div v-for="(bank, index) in customer.banks" :key="index" class="bank-item">
          <div class="dropdown-container">
            <select v-model="bank.name">
              <option value="">Select Bank</option>
              <option v-for="bankOption in banks" :key="bankOption.bankName" :value="bankOption.bankName">
                {{ bankOption.bankName }}
              </option>
            </select>
            <span class="dropdown-icon">&#9662;</span>
          </div>
          <input type="number" v-model="bank.amount" placeholder="Amount" required />
          <span class="remove-bank" @click="removeBank(index)">&#x2715;</span>
        </div>
        <div class="add-bank-container">
          <span class="add-bank" @click="addBank">Add another bank</span>
        </div>
      </div>

      <!-- <div class="form-item" v-if="customer.modeOfPayment === 'Transfer'">
        <label for="banks">Banks</label>
        <div v-for="(bank, index) in customer.banks" :key="index" class="bank-item">
          <input type="text" v-model="bank.name" placeholder="Bank Name" />
          <input type="number" v-model="bank.amount" placeholder="Amount" />
          <span class="remove-bank" @click="removeBank(index)">&#x2715;</span>
        </div>
        <div class="add-bank-container">
          <span class="add-bank" @click="addBank">Add another bank</span>
        </div>
      </div> -->

      <div class="form-item horizontal-group">
        <div class="form-item-wrapper">
          <label for="total-amount-naira">Total Amount (Naira)</label>
          <input type="number" id="total-amount-naira" v-model="customer.totalAmountNaira"
            placeholder="Enter total amount in Naira"
            :disabled="shouldDisableTotalAmount || shouldDisableNairaFields" />
        </div>
        <div class="form-item-wrapper">
          <label for="balance">Balance (if any)</label>
          <input type="number" id="balance" v-model="customer.balance" placeholder="Enter balance" />
        </div>
      </div>

      <div class="form-item horizontal-group">
        <div class="form-item-wrapper">
          <label for="dollar-rate">Dollar Rate</label>
          <input type="number" id="dollar-rate" v-model="customer.dollarRate" placeholder="Enter dollar rate"
            disabled />
        </div>
        <div class="form-item-wrapper">
          <label for="amount-dollar">Amount (Dollar)</label>
          <input type="number" id="amount-dollar" v-model="customer.amountDollar"
            placeholder="Enter amount in Dollar" />
        </div>
      </div>

      <div class="form-actions">
        <button @click="submitForm">Submit</button>
      </div>
    </div>
  </div>
</template>


<script>
import { Title } from 'chart.js';
import { localStorageSource } from '@/data/sources/localStorage';

export default {
  data() {
    return {
      customer: {
        name: '',
        phone: '',
        paymentCurrency: '',
        modeOfPayment: '',
        banks: [{ name: '', amount: '' }],
        totalAmountNaira: '',
        balance: '',
        dollarRate: '',
        amountDollar: ''
      },
      banks: [],
    };
  },
  methods: {
    addBank() {
      this.customer.banks.push({ name: '', amount: '' });
    },
    removeBank(index) {
      if (this.customer.banks.length > 1) {
        this.customer.banks.splice(index, 1);
      }
    },
    submitForm() {
      this.$emit('formSubmitted', this.customer);
    },
    closeForm() {
      this.$emit('formClosed');
    },
    fetchBanks() {
      const dashboardData = localStorageSource.getDashboardData();
      if (dashboardData && dashboardData.companyAccounts) {
        this.banks = dashboardData.companyAccounts;
      } else {
        this.banks = [];
      }
    },
  },
  computed: {
    shouldDisableTotalAmount() {

      if (this.customer.modeOfPayment === 'Transfer' && this.customer.banks.length) {
      this.customer.totalAmountNaira = 0;
        this.customer.banks.forEach(bank => {
          if (bank.amount) {
            this.customer.totalAmountNaira += Number(bank.amount);
          }
        });
      }

      return this.customer.modeOfPayment === 'Transfer';
    },
    shouldDisableTransferOption() {
      this.customer.totalAmountNaira = '';

      if (this.customer.paymentCurrency === 'Dollar') {
        this.customer.modeOfPayment = 'Cash';
      }

      return this.customer.paymentCurrency === 'Dollar';
    },
    shouldDisableNairaFields() {
      this.customer.dollarRate = this.rate;

      if (this.customer.paymentCurrency === 'Dollar' && this.customer.dollarRate && this.customer.amountDollar) {
        this.customer.totalAmountNaira = this.customer.amountDollar * this.customer.dollarRate;
      }

      return this.customer.paymentCurrency === 'Dollar';
    },
  },
  props: {
    rate: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.fetchBanks();
  }
};
</script>

<style scoped>
.customer-form {
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

.customer-form h2 {
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
  flex: 1;
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
  background-color: #6e4302;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>
<template>
  <div class="payment-container">
    <section class="info-card">
      <div class="card small-card" v-for="(card, index) in cardsData.slice(0, 3)" :key="index">
        <img :src="card.image" alt="Card Image" class="card-image" />
        <div class="content">
          <h3>{{ card.title }}</h3>
          <p>{{ card.value }}</p>
        </div>
      </div>

      <div class="card large-card" v-if="cardsData.length > 3">
        <img :src="cardsData[3].image" alt="Card Image" class="card-image" />
        <div class="content" id="bankHeader">
          <h3>{{ cardsData[3].title }}</h3>
          <!-- <p>{{ cardsData[3].value }}</p> -->

          <div class="dropdown-container">
            <select id="banks" v-model="onBankChanged">
              <option v-for="(bank, index) in banks" :key="index" v-value="bank.name"> {{ bank.name }} </option>
            </select>
          </div>

        </div>
      </div>
    </section>

    <div class="table-container">
      <div class="table-header" v-if="(onBankChanged)">
        <h2>{{ onBankChanged }} History</h2>
        <div class="search-add-container">
          <input type="text" v-model="searchQuery" placeholder="Search..." />
          <button @click="exportToPDF">Export as PDF</button>
          <button @click="exportToExcel">Export as Excel</button>
          <button @click="addPayment">Add Record</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Transaction Date</th>
            <th>Name</th>
            <th>Entity Type</th>
            <th>Bank</th>
            <th>Credit</th>
            <th>Debit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bank, index) in filteredBanks" :key="bank.id">
            <td>{{ index + 1 }}</td>
            <td>{{ formatDate(bank.date) }}</td>
            <td>{{ bank.entityName }}</td>
            <td>{{ bank.personType }}</td>
            <td>{{ bank.bankName }}</td>
            <td class="credit"> {{ bank.expenseType === 'Credit' ? formatCurrency(bank.amount) : '-' }} </td>
            <td class="debit"> {{ bank.expenseType === 'Debit' ? formatCurrency(bank.amount) : '-' }} </td>
            <td class="delete" @click="deleteRecord(payment)">Delete</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="modal-overlay">
      <div class="modal">
        <BankForm @formSubmitted="handleFormSubmission" @formClosed="showForm = false" />
      </div>
    </div>

    <Spinner :loading="loading" />

    <CustomDialog v-if="showApiDialog" :message="responseMessage" :show="showApiDialog" @confirm="done"
      :success="apiStatus" />

  </div>
</template>



<script setup>

import { ref, computed, onMounted, watchEffect } from 'vue';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import Spinner from '../components/Spinner.vue';
import { getBankByNameUseCase, addBankUseCase } from '@/domain/useCases/dashboardUseCase';
import { formatCurrency, formatDate } from '@/core/utils/helpers';
import BankForm from '@/presentation/components/BankForm.vue';
import signal from '@/assets/ic_signal.svg';
import naira from '@/assets/ic_naira.svg';
import bank from '@/assets/ic_bank.svg';
import CustomDialog from '../components/CustomDialog.vue';
import { exportPDF } from '@/core/utils/exportToPDF';
import { exportExcel } from '@/core/utils/exportToExcel';


const loading = ref(false);
const showForm = ref(false);
const toast = useToast();
const searchQuery = ref('');
const isBankAdded = ref(false);
const getBankResponse = ref([]);
const totalRecord = ref(0);
const transactionVolume = ref(0);
const totalTransaction = ref(formatCurrency(0, 'NGN'));
const onBankChanged = ref('');
const responseMessage = ref('')
const apiStatus = ref(false);
const showApiDialog = ref(false);

const cardsData = [
  { image: signal, title: 'Total No of Customers', value: totalRecord },
  { image: signal, title: 'Transaction Count', value: totalRecord },
  { image: naira, title: 'Total Amount', value: totalTransaction },
  { image: bank, title: 'Bank', value: totalTransaction },
];

const banks = [
  { name: 'Wema Bank' }, { name: 'Jaiz Bank' }, { name: 'Union Bank' }, { name: 'UBA Bank' },
];

const addPayment = () => showForm.value = true;


watchEffect(() => {
  if (isBankAdded.value === true || onBankChanged.value !== '') {
    onMountedHandler()
    isBankAdded.value === false;
  }
});


onMounted(async () => {
  if (onBankChanged.value !== '') {
    onMountedHandler();
  }
});

const onMountedHandler = async () => {
  loading.value = true;
  totalRecord.value = 0;
  totalTransaction.value = formatCurrency(0, 'NGN');
  getBankResponse.value = ref([]);

  try {
    const response = await getBankByNameUseCase(onBankChanged.value);
    console.log('Bank record:', response);

    getBankResponse.value = response.data || [];

    totalRecord.value = response.data.length;

    getBankResponse.value.forEach((item, index) => {
      transactionVolume.value += item.amount;
    });

    totalTransaction.value = formatCurrency(transactionVolume.value, 'NGN');
    console.log('Transaction volume in loop', 'item', formatCurrency(transactionVolume.value, 'USD'));

  }
  catch (error) {
    getBankResponse.value = [];
    showApiDialog.value = true;
    apiStatus.value = false;
    responseMessage.value = error.message;
  }
  finally {
    loading.value = false;
  }
};

const filteredBanks = computed(() => {
  return Array.isArray(getBankResponse.value) ? getBankResponse.value.filter(bank =>
    bank.date.toLowerCase().includes(searchQuery.value.toLowerCase())
  ) : [];
});

const validateFormField = (request) => {
  if (request.Name.trim() === '') {
    toast.success('Enter Customer name');
    return false;
  } else if (request.Amount === '' || request.Amount <= 0) {
    toast.success('Enter dollar amount');
    return false;
  }

  return true;
};

const handleFormSubmission = async (bankRequest) => {
  console.log('New payment:', bankRequest);
  showForm.value = false;

  if (!validateFormField(bankRequest)) {
    showForm.value = true;
    return;
  }

  try {

    const bankRequestData = {
      entityName: bankRequest.Name,
      bankName: onBankChanged.value.replace(' ', ''),
      personType: 'Others',
      expenseType: 'Debit',
      amount: bankRequest.amount,
    };

    console.log('This is the content of:', bankRequestData);

    const response = await addBankUseCase(bankRequestData);


    console.log('This is the response of:', response);


    if (response.success || response.data.success) {
      isBankAdded.value = true;

      showApiDialog.value = true;
      apiStatus.value = response.success;
      responseMessage.value = response.message || "Record added Successful";
    }
  }
  catch (error) {
    showApiDialog.value = true;
    apiStatus.value = false;
    responseMessage.value = error.message;
  }
};

const deleteRecord = (bank) => {
  console.log('Viewing record for:', bank);
  // toast.success('Delete clicked on: ' + bank.id + '-:-' + payment.bankName);
  toast.success('Delete clicked on: ' + payment.bankName);
};

const done = () => {
  showApiDialog.value = false;
};

const columns = ['#', 'Transaction Date', 'Name', 'Entity Type', 'Bank', 'Credit', 'Debit'];
const rows = computed(() =>
  filteredBanks.value.map((bank, index) => [
    index + 1,
    formatDate(bank.date),
    bank.entityName,
    bank.personType,
    bank.bankName,
    bank.expenseType === 'Credit' ? "#"+bank.amount : '-',
    bank.expenseType === 'Debit' ? "#"+bank.amount : '-'
  ])
);

const exportToPDF = () => {
  if (filteredBanks.value.length) {
    exportPDF(columns, rows.value, onBankChanged.value + ' History');
  }
};

const exportToExcel = () => {
  if (filteredBanks.value.length) {
    exportExcel(columns, rows.value, onBankChanged.value + ' History');
  }
};

</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');

.payment-container {
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  background-color: #E9E5E5;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
  font-family: 'Inter', sans-serif;
}

.info-card {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 10px;
  max-width: 300px;
}

.card img {
  max-width: 40px;
  height: 40px;
  border-radius: 4px;
}

.card .content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card h3,
.card p {
  margin: 0;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card h3 {
  font-size: 12px;
  color: black;
}

.card p,
.content-item span {
  font-size: 14px;
  color: black;
  font-weight: bold;
}

.small-card {
  width: 200px;
  height: 90px;
}

.large-card {
  margin-left: 220px;
  width: 200px;
  height: 90px;
  flex-grow: 1;
}

.large-card .content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.content-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.content-item h3 {
  font-size: 14px;
  color: black;
  margin: 0;
}

.content-item span {
  font-size: 16px;
  color: black;
  font-weight: bold;
}

.table-container {
  margin-top: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  padding-left: 30px;
  padding-right: 30px;
}

.table-header h2 {
  margin: 0;
  font-size: 14px;
  color: black;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
}

.search-add-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

input[type="text"] {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #B6720F;
  color: white;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

button:hover {
  background-color: #452900;
}

table,
.table-header {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

th,
td {
  padding: 14px;
  border: none;
  color: black;
  text-align: center;
}

td {
  font-size: 14px;
}

th {
  padding: 30px 20px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
}

.delete {
  color: #A90836;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  text-decoration: underline;
}

.delete:hover {
  color: #855105;
  font-weight: bold;
}

.credit {
  color: green;
  padding: 5px 10px;
  cursor: pointer;
  font-weight: bold;
}

.debit {
  color: rgb(130, 78, 241);
  padding: 5px 10px;
  cursor: pointer;
  font-weight: bold;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  position: relative;
}

.dropdown-container {
  position: relative;
}

.dropdown-container select {
  color: red;
  border-color: #855105;
  font-weight: bold;
  size: 20px;
}

#bankHeader {
  margin-left: 20px;
}
</style>
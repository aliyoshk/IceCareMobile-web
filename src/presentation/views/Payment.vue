<template>
  <div class="payment-container">
    <section class="info-card">
      <div class="card small-card" v-for="(card, index) in cardsData.slice(0, 2)" :key="index">
        <img :src="card.image" alt="Card Image" class="card-image" />
        <div class="content">
          <h3>{{ card.title }}</h3>
          <p>{{ card.value }}</p>
        </div>
      </div>

      <div class="card large-card" v-if="cardsData.length > 2">
        <img :src="cardsData[2].image" alt="Card Image" class="card-image" />
        <div class="content">
          <h3>{{ cardsData[2].title }}</h3>
          <p>{{ cardsData[2].value }}</p>
        </div>
      </div>
    </section>

    <div class="table-container">
      <div class="table-header">
        <h2>Payments History</h2>
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
            <th>Customer Name</th>
            <th>Amount ($)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(payment, index) in filteredPayments" :key="payment.id">
            <td>{{ index + 1 }}</td>
            <td>{{ formatDate(payment.date) }}</td>
            <td>{{ payment.customerName }}</td>
            <td>{{ formatCurrency(payment.dollarAmount, 'USD') }}</td>
            <td class="delete" @click="deleteRecord(payment)">Delete record</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="modal-overlay">
      <div class="modal">
        <PaymentForm @formSubmitted="handleFormSubmission" @formClosed="showForm = false" />
      </div>
    </div>

    <Spinner :loading="loading" />

    <CustomDialog v-if="showApiDialog" :message="responseMessage" :show="showApiDialog" @confirm="done"
      :success="apiStatus" />

    <ConfirmDialog v-if="isDialogVisible" :title="dialogTitle" :message="dialogMessage" :show="isDialogVisible"
      @confirm="handleDelete" @cancel="cancelDialog" />
  </div>
</template>



<script setup>

import { ref, computed, onMounted, watchEffect, nextTick } from 'vue';
import imgx from '@/assets/ic_supplier.svg';
import { customerData } from '@/data/mockData/customerData';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import Spinner from '../components/Spinner.vue';
import { getPaymentsUseCase, addPaymentUseCase, deletePaymentUseCase } from '@/domain/useCases/dashboardUseCase';
import { formatCurrency, formatDate } from '@/core/utils/helpers';
import PaymentForm from '@/presentation/components/PaymentForm.vue';
import { localStorageSource } from '@/data/sources/localStorage';
import CustomDialog from '../components/CustomDialog.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import { exportPDF } from '@/core/utils/exportToPDF';
import { exportExcel } from '@/core/utils/exportToExcel';
import router from '../router';

const loading = ref(false);
const showForm = ref(false);
const toast = useToast();
const searchQuery = ref('');
const getPaymentResponse = ref([]);
const isEndPointHit = ref(false);
const totalRecord = ref(0);
const transactionVolume = ref(0);
const totalTransaction = ref(0);
const responseMessage = ref('')
const apiStatus = ref(false);
const showApiDialog = ref(false);
const isDialogVisible = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const seletedPayment = ref([]);

const cardsData = [
  { image: imgx, title: 'Total No of Customers', value: totalRecord },
  { image: imgx, title: 'Transaction Count', value: totalRecord },
  { image: imgx, title: 'Total Amount', value: totalTransaction },
];


watchEffect(() => {
  if (isEndPointHit.value === true) {
    nextTick(() => {
      onMountedHandler();
      isEndPointHit.value = false;
    });
  }
});


onMounted(async () => {
  onMountedHandler();
});

const addPayment = () => showForm.value = true;

const onMountedHandler = async () => {
  loading.value = true;

  try {
    const response = await getPaymentsUseCase();
    console.log('Payment record:', response);

    getPaymentResponse.value = response.data || [];

    totalRecord.value = response.data.length;

    getPaymentResponse.value.forEach((item, index) => {
      transactionVolume.value += item.dollarAmount;
    });

    totalTransaction.value = formatCurrency(transactionVolume.value, 'USD');
    console.log('Transaction volume in loop', 'item', formatCurrency(transactionVolume.value, 'USD'));

  }
  catch (error) {
    getPaymentResponse.value = [];
    showApiDialog.value = true;
    apiStatus.value = false;
    responseMessage.value = error.message;
  }
  finally {
    loading.value = false;
  }
};


const filteredPayments = computed(() => {
  return Array.isArray(getPaymentResponse.value) ? getPaymentResponse.value.filter(payment =>
    payment.customerName.toLowerCase().includes(searchQuery.value.toLowerCase())
  ) : [];
});

const validateFormField = (request) => {
  if (request.CustomerName.trim() === '') {
    toast.success('Enter Customer name');
    return false;
  } else if (request.DollarAmount === '') {
    toast.success('Enter dollar amount');
    return false;
  }

  return true;
};

const handleFormSubmission = async (paymentRequest) => {
  console.log('New payment:', paymentRequest);
  showForm.value = false;

  if (!validateFormField(paymentRequest)) {
    showForm.value = true;
    return;
  }

  try {

    const paymentRequestData = {
      CustomerName: paymentRequest.CustomerName,
      DollarAmount: paymentRequest.DollarAmount,
    };

    console.log('This is the content of:', paymentRequestData);

    const response = await addPaymentUseCase(paymentRequestData);


    console.log('This is the response of:', response);

    if (response.success || response.data.success) {
      showApiDialog.value = true;
      apiStatus.value = response.success;
      responseMessage.value = response.message || "Record added Successful";
      router.go();
    }
  }
  catch (error) {
    showApiDialog.value = true;
    apiStatus.value = false;
    responseMessage.value = error.message;
  }
};

const deleteRecord = (payment) => {

seletedPayment.value = [];

dialogTitle.value = 'Delete Record';
dialogMessage.value = `Proceeding would delete ${payment.customerName} record`;
isDialogVisible.value = true;

seletedPayment.value = payment;

console.log('Viewing record for:', payment);
toast.success('Viewing details for: ' + payment.name);
};

const cancelDialog = () => {
  isDialogVisible.value = false;
  showApiDialog.value = false;
}

const handleDelete = async () => {
  isDialogVisible.value = false;

  try {
    const response = await deletePaymentUseCase(seletedPayment.value.id);

    if (response.success || response.data.success) {
      isEndPointHit.value = true;
      showApiDialog.value = true;
      apiStatus.value = true;
      responseMessage.value = response.message || "Record deleted Successful";
    }
  }
  catch (error) {
    console.log('Error occurred:', error.message);
    showApiDialog.value = true;
    apiStatus.value = false;
    responseMessage.value = error.message;
  }
};

const done = () => {
  showApiDialog.value = false;
};

const columns = ['#', 'Transaction Date', 'Customer Name', 'Amount($)'];
const rows = computed(() =>
  filteredPayments.value.map((payment, index) => [
    index + 1,
    formatDate(payment.date),
    payment.customerName,
    formatCurrency(payment.dollarAmount, 'USD')
  ])
);

const exportToPDF = () => {
  exportPDF(columns, rows.value, 'Payments History');
};

const exportToExcel = () => {
  exportExcel(columns, rows.value, 'Payments History');
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
  flex: 1 1 200px; /* Flex to make cards responsive */
}

.small-card {
  height: 90px;
  flex-grow: 1;
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

.card p {
  font-size: 14px;
  color: black;
  font-weight: bold;
}

.table-container {
  margin-top: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  color: black;
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

table {
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
  cursor: pointer;
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

/* Media Queries */
@media (max-width: 768px) {
  .info-card {
    flex-direction: column; /* Stack cards on smaller screens */
  }

  .large-card {
    margin-left: 0; /* Remove left margin on smaller screens */
  }

  .search-add-container {
    flex-direction: column; /* Stack search and buttons */
  }

  input[type="text"] {
    width: 100%; /* Full width for input on small screens */
  }

  button {
    width: 100%; /* Full width for buttons on small screens */
  }

  table {
    font-size: 12px; /* Smaller font size for tables */
  }

  th, td {
    padding: 10px; /* Reduce padding in table cells */
  }
}
</style>
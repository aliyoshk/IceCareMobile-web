<template>
  <div class="supplier-container">
    <section class="info-card">
      <div class="card small-card" v-for="(card, index) in cardsData.slice(0, 3)" :key="index">
        <img :src="card.image" alt="Card Image" class="card-image" />
        <div class="content">
          <h3>{{ card.title }}</h3>
          <p>{{ card.value }}</p>
        </div>
      </div>

      <div class="card large-card" v-if="cardsData.length > 3">
        <div class="content">
          <div class="content-item">
            <h3>Total Amount($)</h3>
            <span>{{ cardsData[3].value }}</span>
          </div>
          <div class="content-item">
            <h3>Total Amount(₦)</h3>
            <span>{{ cardsData[3].additionalValue }}</span>
          </div>
        </div>
      </div>
    </section>

    <div class="table-container">
      <div class="table-header">
        <h2>Suppliers History</h2>
        <div class="search-add-container">
          <input type="text" v-model="searchQuery" placeholder="Search..." />
          <button @click="exportToPDF">Export as PDF</button>
          <button @click="exportToExcel">Export as Excel</button>
          <button @click="addSupplier">Add Supplier</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Name</th>
            <th>Amount (Naira)</th>
            <th>Rate</th>
            <th>Amount (Dollar)</th>
            <th>Deposit</th>
            <th>Balance</th>
            <th>Mode of Payment</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(supplier, index) in filteredSuppliers" :key="supplier.id">
            <td>{{ index + 1 }}</td>
            <td>{{ formatDate(supplier.date) }}</td>
            <td>{{ supplier.name }}</td>
            <td>{{ formatCurrency(supplier.amount, 'NGN') }}</td>
            <td>{{ supplier.dollarRate }}</td>
            <td>{{ formatCurrency(supplier.dollarAmount, 'USD') }}</td>
            <td>{{ formatCurrency(supplier.deposit) }}</td>
            <td>{{ formatCurrency(supplier.balance) }}</td>
            <td>{{ supplier.modeOfPayment }}</td>
            <td class="delete" @click="deleteRecord(supplier)">Delete</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Supplier Form Modal -->
    <div v-if="showForm" class="modal-overlay">
      <div class="modal">
        <SupplierForm @formSubmitted="handleFormSubmission" />
        <button class="close-btn" @click="showForm = false">Close</button>
      </div>
    </div>

    <!-- <Spinner v-if="!loading" /> -->
    <Spinner :loading="loading" />

    <CustomDialog v-if="showApiDialog" :message="responseMessage" :show="showApiDialog" @confirm="done"
      :success="apiStatus" :emptyList="isEmptyList" 
    />

    <ConfirmDialog v-if="isDialogVisible" :title="dialogTitle" :message="dialogMessage" :show="isDialogVisible"
      @confirm="handleDelete" @cancel="cancelDialog" 
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect, nextTick } from 'vue';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import Spinner from '../components/Spinner.vue';
import SupplierForm from '@/presentation/components/SupplierForm.vue';
import { getSuppliersUseCase, addSupplierUseCase, deleteSupplierUseCase } from '@/domain/useCases/dashboardUseCase';
import { supplierRequest } from '../../data/model/supplierRequest';
import { formatCurrency, formatDate } from '@/core/utils/helpers';
import CustomDialog from '../components/CustomDialog.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import { exportPDF } from '@/core/utils/exportToPDF';
import { exportExcel } from '@/core/utils/exportToExcel';
import signal from '@/assets/ic_signal.svg';
import naira from '@/assets/ic_naira.svg';
import { parseCurrencyValue } from '@/core/utils/helpers';
import router from '../router';


const showForm = ref(false);
const searchQuery = ref('');
const suppliers = ref([]);
const toast = useToast();
const loading = ref(false);
const isEndPointHit = ref(false);
const totalAmount = ref('');
const totalDollar = ref('');
const totalSuppliers = ref('');
const errorMessage = ref('');
const responseMessage = ref('')
const apiStatus = ref(false);
const showApiDialog = ref(false);
const isDialogVisible = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const seletedSupplier = ref([]);
const isEmptyList = ref(false);

const cardsData = [
  { image: signal, title: 'Total No of Suppliers', value: totalSuppliers || '0' },
  { image: signal, title: 'Transaction Count', value: totalSuppliers || '0' },
  { image: naira, title: 'Transaction Volume', value: totalAmount },
  { image: '', title: 'Dollar Rate', value: totalDollar, additionalValue: totalAmount }
];

const validateFormField = (supplierRequest) => {

  errorMessage.value = '';
  supplierRequest.banks.forEach(bank => {
    if (bank.name === '') {
      errorMessage.value = 'Bank name should be filled';
      return;
    }
    if (parseCurrencyValue(bank.amount) <= 0) {
      errorMessage.value = 'Bank amount should be greather than 0';
      return;
    }
  });

  if (supplierRequest.name.trim() === '') {
    toast.success('Enter supplier name');
    return false;
  } else if (supplierRequest.modeOfPayment.trim() === '') {
    toast.success('Select mode of payment');
    return false;
  } else if (supplierRequest.modeOfPayment.trim() === 'Cash' && parseCurrencyValue(supplierRequest.totalAmountNaira) === '') {
    toast.success('Enter the amount');
    return false;
  } else if (supplierRequest.modeOfPayment.trim() === 'Transfer' && errorMessage.value !== '') {
    toast.success(errorMessage.value);
    return false;
  } else if (parseCurrencyValue(supplierRequest.dollarRate) === '') {
    toast.success('Enter the dollar rate');
    return false;
  } else if (parseCurrencyValue(supplierRequest.amountDollar) === '') {
    toast.success('Enter amount of dollar');
    return false;
  } else if (parseCurrencyValue(supplierRequest.balance) === '') {
    toast.success('Enter balance');
    return false;
  }

  return true;
};

const handleFormSubmission = async (supplierRequest) => {
  console.log('New Supplier:', supplierRequest);
  showForm.value = false;

  if (!validateFormField(supplierRequest)) {
    showForm.value = true;
    return;
  }

  try {
    const banksData = supplierRequest.banks.map(bank => ({
      bankName: bank.name,
      amountTransferred: parseCurrencyValue(bank.amount) || 0
    }));

    const supplierRequestData = {
      name: supplierRequest.name,
      phoneNumber: supplierRequest.phone,
      modeOfPayment: supplierRequest.modeOfPayment,
      banks: banksData,
      balance: parseCurrencyValue(supplierRequest.balance),
      dollarRate: parseCurrencyValue(supplierRequest.dollarRate),
      dollarAmount: parseCurrencyValue(supplierRequest.amountDollar),
      amount: parseCurrencyValue(supplierRequest.totalAmountNaira) || 0,
      deposit: 0.0,
      channel: 'Web'
    };

    console.log('This is the content of:', supplierRequestData);

    const response = await addSupplierUseCase(supplierRequestData);

    if (response.success || response.data.success) {
      isEndPointHit.value = true;

      showApiDialog.value = true;
      apiStatus.value = true;
      responseMessage.value = response.data.message;
    }
  }
  catch (error) {
    showApiDialog.value = true;
    apiStatus.value = false;
    responseMessage.value = error.message;
  }
};

const deleteRecord = (supplier) => {

  seletedSupplier.value = [];

  dialogTitle.value = `Delete ${supplier.name}`;
  dialogMessage.value = `Proceeding will delete the record from the list`;
  isDialogVisible.value = true;
  
  seletedSupplier.value = supplier;

  console.log('Viewing record for:', supplier);
};

const cancelDialog = () => {
  isDialogVisible.value = false;
  showApiDialog.value = false;
}

const handleDelete = async () => {
  isDialogVisible.value = false;
  try {
    console.log('Deleting record of:', seletedSupplier.value);
    const response = await deleteSupplierUseCase(seletedSupplier.value.id);

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

const addSupplier = () => {
  console.log('Add Supplier clicked');
  showForm.value = true;
};

const filteredSuppliers = computed(() => {
  return (suppliers.value || []).filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});


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

const onMountedHandler = async () => {
  loading.value = true;

  try {
    const response = await getSuppliersUseCase();
    console.log('Suppliers record:', response.data);
    suppliers.value = response.data.suppliers;

    totalAmount.value = formatCurrency(response.data.totalNairaAmount);
    totalDollar.value = formatCurrency(response.data.totalDollarAmount, 'USD');
    totalSuppliers.value = response.data.totalSuppliers;
  }
  catch (error) {
    showApiDialog.value = true;
    apiStatus.value = false;
    responseMessage.value = error.message;
    isEmptyList.value = error.message.includes('No suppliers found');
  }
  finally {
    loading.value = false;
  }
};


const columns = ['#', 'Date', 'Supplier Name', 'Amount(Naira)', 'Rate', 'Amount(Dollar)', 'Deposit', 'Balance', 'MOP'];
const rows = computed(() =>
  filteredSuppliers.value.map((supplier, index) => [
    index + 1,
    formatDate(supplier.date),
    supplier.name,
    "#" + supplier.amount,
    supplier.dollarRate,
    formatCurrency(supplier.dollarAmount, 'USD'),
    formatCurrency(supplier.deposit),
    formatCurrency(supplier.balance),
    supplier.modeOfPayment,
  ])
);

const exportToPDF = () => {
  exportPDF(columns, rows.value, 'Suppliers History');
};

const exportToExcel = () => {
  exportExcel(columns, rows.value, 'Suppliers History');
};


</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');

.supplier-container {
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  background-color: #E9E5E5;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
  padding-bottom: 10px;
  padding-right: 15px;
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
  color: black;
  font-weight: bold;
}

.small-card {
  width: 200px;
  height: 90px;
}

.large-card {
  width: calc(100% - 420px);
  height: 90px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-left: 100px;

}

.large-card .content {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}

@media (max-width: 1200px) {
  .large-card {
    width: calc(100% - 300px);
    margin-left: 50px;
  }
}

@media (max-width: 992px) {
  .large-card {
    width: calc(100% - 20px);
    margin-left: 10px;
    margin-right: 10px;
  }
}

@media (max-width: 768px) {
  .large-card {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
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
  font-size: 14px;
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
  padding-bottom: 10px;
}

.table-header h2 {
  margin: 0;
  color: black;
  font-size: 14px;
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
  background-color: #FFFFFF;
}

th,
td {
  padding: 15px;
  margin: 15px;
  text-align: center;
  border: none;
  font-family: 'Inter', sans-serif;
}

td {
  color: black;
}

th {
  padding: 30px 20px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
  color: black;
}

.delete {
  color: #A90836;
  border: none;
  padding: 5px 10px;
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

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>

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
        <img :src="cardsData[3].image" alt="Card Image" class="card-image" />
        <div class="content">
          <div class="content-item">
            <h3>Total Amount($)</h3>
            <span>{{ formatCurrency(cardsData[3].value, 'USD') }}</span>
          </div>
          <div class="content-item">
            <h3>Total Amount(N)</h3>
            <span>{{ formatCurrency(cardsData[3].additionalValue, 'NGN') }}</span>
          </div>
        </div>
      </div>
    </section>

    <div class="table-container">
      <div class="table-header">
        <h2>Suppliers History</h2>
        <div class="search-add-container">
          <input type="text" v-model="searchQuery" placeholder="Search..." />
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
            <th>Mode of Payment</th>
            <th>Action</th>
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
            <td>{{ supplier.modeOfPayment }}</td>
            <td class="view" @click="viewRecord(supplier)">View Details</td>
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

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue';
import { supplierData } from '@/data/mockData/supplierData';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import imgx from '@/assets/ic_supplier.svg';
import Spinner from '../components/Spinner.vue';
import ErrorDialog from '../components/ErrorDialog.vue';
import SupplierForm from '@/presentation/components/SupplierForm.vue';
import { getSuppliersUseCase, addSupplierUseCase } from '@/domain/useCases/dashboardUseCase';
import { supplierRequest } from '../../data/model/supplierRequest';
import { formatCurrency, formatDate } from '@/core/utils/helpers';


const showForm = ref(false);
const searchQuery = ref('');
const suppliers = ref(supplierData);
const toast = useToast();
const loading = ref(false);
const isSupplierAdded = ref(false);
const totalAmount = ref('');
const totalDollar = ref('');
const totalSuppliers = ref('');

const cardsData = [
  { image: imgx, title: 'Total No of Suppliers', value: totalSuppliers || '' },
  { image: imgx, title: 'Transaction Count', value: totalSuppliers || '' },
  { image: imgx, title: 'Transaction Volume', value: totalAmount || '' },
  { image: imgx, title: 'Dollar Rate', value: '8,543', additionalValue: '13,668,800' }
];

const validateFormField = (supplierRequest) => {
  if (supplierRequest.name.trim() === '') {
    toast.success('Enter supplier name');
    return false;
  } else if (supplierRequest.phone.trim() === '') {
    toast.success('Enter phone number');
    return false;
  } else if (supplierRequest.modeOfPayment.trim() === '') {
    toast.success('Select mode of payment');
    return false;
  } else if (supplierRequest.modeOfPayment.trim() === 'Cash' && supplierRequest.totalAmountNaira.trim() === '') {
    toast.success('Enter the amount');
    return false;
  }else if (supplierRequest.modeOfPayment.trim() === 'Transfer' && (supplierRequest.banks[0].bank === '' || supplierRequest.banks[0].amount === '')) {
    toast.success('Banks record should be filled');
    return false;
  } else if (supplierRequest.dollarRate.trim() === '') {
    toast.success('Enter the dollar rate');
    return false;
  } else if (supplierRequest.amountDollar.trim() === '') {
    toast.success('Enter amount of dollar');
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
      amountTransferred: bank.amount
    }));

    const supplierRequestData = {
      name: supplierRequest.name,
      phoneNumber: supplierRequest.phone,
      modeOfPayment: supplierRequest.modeOfPayment,
      banks: banksData,
      dollarRate: supplierRequest.dollarRate,
      dollarAmount: supplierRequest.amountDollar,
      amount: supplierRequest.totalAmountNaira,
      channel: 'Web'
    };

    console.log('This is the content of:', supplierRequestData);

    const response = await addSupplierUseCase(supplierRequestData);

    if (response.success) {
      isSupplierAdded.value = true;
      alert(response.message || "Record added successful");
    }
  }
  catch (error) {
    console.log('Error occurred:', error.message);
    alert('Error occurred:', error.message);
  }
};

const viewRecord = (supplier) => {
  console.log('Viewing record for:', supplier);
  toast.success('Viewing details for: ' + supplier.name);
  // Implement navigation or modal display
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
  if (isSupplierAdded.value === true) {
    onMountedHandler()
    isSupplierAdded.value === false;
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

    totalAmount.value = response.data.totalNairaAmount;
    totalDollar.value = response.data.totalDollarAmount;
    totalSuppliers.value = response.data.totalSuppliers;
  }
  catch (error) {
    console.log('Error occurred:', error.message);
    alert('Error occurred:', error.message);
  }
  finally {
    loading.value = false;
  }
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
  margin-left: 100px;
}

.large-card .content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  background-color: #0056b3;
}

table,
.table-header {
  width: 100%;
  border-collapse: collapse;
  background-color: beige;
}

th,
td {
  padding: 14px;
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

.view {
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

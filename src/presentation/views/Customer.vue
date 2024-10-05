<template>
  <div class="customer-container">
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
        <h2>Customer History</h2>
        <div class="search-add-container">
          <input type="text" v-model="searchQuery" placeholder="Search..." />
          <button @click="exportToPDF">Export as PDF</button>
          <button @click="exportToExcel">Export as Excel</button>
          <button @click="addCustomer">Add Customer</button>
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
            <th>Payment Currency</th>
            <th>Balance</th>
            <th>Mode of Payment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(customer, index) in filteredCustomers" :key="customer.id">
            <td>{{ index + 1 }}</td>
            <td>{{ formatDate(customer.date) }}</td>
            <td>{{ customer.name }}</td>
            <td>{{ formatCurrency(customer.amount, 'NGN') }}</td>
            <td>{{ formatCurrency(customer.dollarRate) }}</td>
            <td>{{ formatCurrency(customer.dollarAmount, 'USD') }}</td>
            <td>{{ customer.paymentCurrency }}</td>
            <td>{{ formatCurrency(customer.balance) }}</td>
            <td>{{ customer.modeOfPayment }}</td>
            <td class="done" @click="complete(customer)">Complete</td>
            <td class="delete" @click="deleteRecord(customer)">Delete</td>
          </tr>
        </tbody>
      </table>
    </div>


    <div v-if="showCompletionForm" class="modal-overlay">
      <div class="modal">
        <form @submit.prevent="completePayment">

          <div class="completion-form-header">
            <!-- <label for="upshoreCharges">Enter charges rate for {{ seletedCustomer.name }}</label> -->
            <button class="close" @click="showCompletionForm = false">&#x2715;</button>
          </div>

          <div class="completion-form">
            <label for="upshoreCharges" class="chargeText">Charge($) for {{ seletedCustomer.name }}</label>
            <input type="number" step="0.01" id="upshoreCharges" name="upshoreCharges" v-model="upshoreCharges">
            <button class="dollar-button" type="submit">Proceed</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showForm" class="modal-overlay">
      <div class="modal">
        <CustomerForm @formSubmitted="handleFormSubmission" :rate="localStorageSource.getDashboardData().dollarRate" />
        <button class="close-btn" @click="showForm = false">Close</button>
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
import { customerData } from '@/data/mockData/customerData';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import Spinner from '../components/Spinner.vue';
import { getCustomersUseCase, addCustomerUseCase, deleteCustomerUseCase, completeCustomerPaymentUseCase } from '@/domain/useCases/dashboardUseCase';
import { formatCurrency, formatDate } from '@/core/utils/helpers';
import CustomerForm from '@/presentation/components/CustomerForm.vue';
import { localStorageSource } from '@/data/sources/localStorage';
import CustomDialog from '../components/CustomDialog.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import { exportPDF } from '@/core/utils/exportToPDF';
import { exportExcel } from '@/core/utils/exportToExcel';
import signal from '@/assets/ic_signal.svg';
import naira from '@/assets/ic_naira.svg';
import router from '../router';

const loading = ref(false);
const showForm = ref(false);
const toast = useToast();
const searchQuery = ref('');
const customers = ref(customerData);
const isEndPointHit = ref(false);
const totalAmount = ref('');
const totalDollar = ref('');
const totalCustomers = ref('');
const errorMessage = ref('');
const responseMessage = ref('')
const apiStatus = ref(false);
const showApiDialog = ref(false);
const isDialogVisible = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const seletedCustomer = ref([]);
const showCompletionForm = ref(false);
const upshoreCharges = ref('');

const cardsData = [
  { image: signal, title: 'Total No of Customers', value: totalCustomers },
  { image: signal, title: 'Transaction Count', value: totalCustomers },
  { image: naira, title: 'Transaction Volume', value: totalAmount },
  { image: naira, title: 'Dollar Rate', value: totalDollar, additionalValue: totalAmount }
];


const filteredCustomers = computed(() => {
  return (customers.value || []).filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const complete = (customer) => {
  seletedCustomer.value = [];
  if (localStorageSource.getDashboardData().availableDollarAmount < customer.dollarAmount) {
    showCompletionForm.value = true;
  }
  else {
    alert('There is no suffiecient dollar to complete customer payment');
  }
};

const completePayment = async () => {
  if (upshoreCharges.value !== '' && upshoreCharges.value > 0) {
    console.log(upshoreCharges.value + "has been added");

    loading.value = true;

    const completeCustomerRequest = {
      customerId: seletedCustomer.value.id,
      dollarAmount: seletedCustomer.value.dollarAmount,
      phoneNumber: seletedCustomer.value.phoneNumber,
      charges: upshoreCharges.value
    };

    try {
      const response = await completeCustomerPaymentUseCase(completeCustomerRequest);
      console.log("Complete customer payment response", response)

      upshoreCharges.value = '';
      showCompletionForm.value = false;

      if (response.data.success) {
        isEndPointHit.value = true;
        showApiDialog.value = true;
        apiStatus.value = response.data.success;
        responseMessage.value = response.data.message;
      }
    }
    catch (error) {
      showApiDialog.value = true;
      apiStatus.value = false;
      responseMessage.value = error.message;
    } finally {
      loading.value = false;
    }
  }
  else {
    toast.success("Field should not be empty and should be greather than 0");
  }
};

const deleteRecord = (customer) => {

  seletedCustomer.value = [];

  dialogTitle.value = 'Delete Record';
  dialogMessage.value = `Proceeding would delete ${customer.name} record`;
  isDialogVisible.value = true;

  seletedCustomer.value = customer;

  console.log('Viewing record for:', customer);
  toast.success('Viewing details for: ' + customer.name);
};

const cancelDialog = () => {
  isDialogVisible.value = false;
  showApiDialog.value = false;
}

const handleDelete = async () => {
  isDialogVisible.value = false;
  try {
    const response = await deleteCustomerUseCase(seletedCustomer.value.id);

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

const addCustomer = () => {
  console.log('Add Customer clicked');
  showForm.value = true;
};

const done = () => {
  showApiDialog.value = false;
};

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
    const response = await getCustomersUseCase();
    console.log('Customers record:', response.data);

    customers.value = response.data.customers;
    totalAmount.value = formatCurrency(response.data.totalNairaAmount);
    totalDollar.value = formatCurrency(response.data.totalDollarAmount, 'USD');
    totalCustomers.value = response.data.totalCustomers;
  }
  catch (error) {
    showApiDialog.value = true;
    apiStatus.value = false;
    responseMessage.value = error.message;
  }
  finally {
    loading.value = false;
  }
};

const validateFormField = (customerRequest) => {

  errorMessage.value = '';
  customerRequest.banks.forEach(bank => {
    if (bank.name === '') {
      errorMessage.value = 'Bank name should be filled';
      return;
    }
    if (bank.amount <= 0) {
      errorMessage.value = 'Bank amount should be greather than 0';
      return;
    }
  });

  if (customerRequest.name.trim() === '') {
    toast.success('Enter supplier name');
    return false;
  } else if (customerRequest.phone === '') {
    toast.success('Enter phone number');
    return false;
  } else if (customerRequest.paymentCurrency.trim() === '') {
    toast.success('Select payment currency');
    return false;
  } else if (customerRequest.modeOfPayment.trim() === '') {
    toast.success('Select mode of payment');
    return false;
  } else if (customerRequest.modeOfPayment.trim() === 'Transfer' && errorMessage.value !== '') {
    toast.success(errorMessage.value);
    return false;
  } else if (customerRequest.dollarRate === '') {
    toast.success('Enter the dollar rate');
    return false;
  } else if (customerRequest.amountDollar === '') {
    toast.success('Enter amount of dollar');
    return false;
  }

  return true;
};

const handleFormSubmission = async (customerRequest) => {
  console.log('New Supplier:', customerRequest);
  showForm.value = false;

  if (!validateFormField(customerRequest)) {
    showForm.value = true;
    return;
  }

  try {

    const banksData = customerRequest.banks.map(bank => ({
      bankName: bank.name,
      amountTransferred: bank.amount || 0
    }));

    const customerRequestData = {
      name: customerRequest.name,
      phoneNumber: customerRequest.phone.toString(),
      modeOfPayment: customerRequest.modeOfPayment,
      banks: banksData,
      dollarRate: customerRequest.dollarRate,
      balance: customerRequest.balance,
      paymentCurrency: customerRequest.paymentCurrency,
      paymentEvidence: [{ receipt: "-" }],
      dollarAmount: customerRequest.amountDollar,
      amount: customerRequest.totalAmountNaira || 0,
      channel: 'Web'
    };

    console.log('This is the content of:', customerRequestData);

    const response = await addCustomerUseCase(customerRequestData);

    if (response.success || response.data.success) {
      isEndPointHit.value = true;

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

const columns = ['#', 'Date', 'Name', 'Amount(Naira)', 'Rate', 'Amount(Dollar)', 'Payment Currency', 'Mode of Payment'];
const rows = computed(() =>
  filteredCustomers.value.map((customer, index) => [
    index + 1,
    formatDate(customer.date),
    customer.name,
    "#" + customer.amount,
    customer.dollarRate,
    formatCurrency(customer.dollarAmount, 'USD'),
    customer.paymentCurrency,
    customer.modeOfPayment,
  ])
);

const exportToPDF = () => {
  exportPDF(columns, rows.value, 'Customers History');
};

const exportToExcel = () => {
  exportExcel(columns, rows.value, 'Customers History');
};

</script>




<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');

.customer-container {
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
  flex: 1 1 200px;
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
  height: auto;
}

.large-card {
  width: calc(100% - 420px);
  height: auto;
  flex-grow: 1;
  margin-left: 50px;
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
  padding: 20px 30px;
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
  flex-wrap: nowrap;
}

input[type="text"] {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
  min-width: 150px;
  max-width: 300px;
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
  text-align: center;
  border: none;
  color: black;
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
}

.done {
  color: green;
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

.completion-form-header {
  display: flex;
  top: 0;
  left: 0;
  padding: 5px 20px;
  color: black;
}

.completion-form {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  margin-top: 15px;
  margin-bottom: 50px;
  margin-left: 20%;
  margin-right: 20%;
}

.completion-form input {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  color: black;
  height: 60px;
}

.close {
  position: absolute;
  right: 20px;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.chargeText {
  color: black;
  padding-bottom: 20px;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}


@media (max-width: 1024px) {
  .large-card {
    margin-left: 20px;
    width: calc(100% - 40px);
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .info-card {
    flex-direction: column;
    align-items: center;
  }

  .large-card {
    margin-left: 0;
    width: 100%;
  }

  .card {
    max-width: 100%;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-add-container {
    width: 100%;
    flex-wrap: wrap;
  }

  input[type="text"] {
    width: 100%;
    min-width: 150px;
    max-width: none;
  }

  button {
    width: auto;
  }

  .completion-form {
    margin-left: 10%;
    margin-right: 10%;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 5px;
  }

  .table-header h2 {
    font-size: 14px;
  }

  .content-item h3 {
    font-size: 12px;
  }

  .completion-form {
    margin-left: 5%;
    margin-right: 5%;
  }
}
</style>

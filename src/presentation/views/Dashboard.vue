<template>
  <div class="dashboard">
    <!-- Top Metric Cards Section -->
    <section class="metric-cards">
      <div class="card metric" v-for="(metric, index) in metrics" :key="index">
        <img :src="metric.icon" alt="icon" class="metric-icon" />
        <div class="metric-content">
          <h2>{{ metric.title }}</h2>
          <p>{{ metric.value }}</p>
        </div>
      </div>
    </section>

    <!-- New sections for bar chart, transfers, transaction history, etc. -->
    <section class="top-section">
      <div class="chart-card">
        <div class="chart-container">
          <apexchart type="bar" :options="barChartOptions" :series="barChartSeries"></apexchart>
        </div>
      </div>
      <!-- <div class="chart-card">
        <div class="chart-container">
          <Bar :data="barChartData" :options="barChartOptions" />
        </div>
      </div> -->

      <div class="info-cards">
        <div class="card available-dollar">
          <h4>Available Dollar</h4>
          <p class="available-dollar-value">{{ availableDollar }}</p>
        </div>
        <img alt="hand_logo" class="logo" src="@/assets/ic_hand.svg" width="35" height="35" />
        <div class="card dollar-rate">
          <h4 class="dollar-rate">Dollar Rate</h4>
          <p class="dollar-rate-value">{{ dollarRate }}</p>
          <small class="edit-price" @click="editPrice">Edit Price →</small>
        </div>
      </div>
    </section>

    <!-- Fund Transfers and Transaction History Section -->
    <section class="transfer-transaction-section">
      <div class="transfer-list">
        <h3 id="title">Recent Incoming Transfer</h3>

        <div v-if="recentTransfers.length === 0" class="empty-state">
          <EmptyState :image="ic_no_transfer" :title="'No transfer history'"
            :message="'You cannot view  transaction history at the moment until a transfer has been performed'" />
        </div>

        <div v-else v-for="(transfer, index) in recentTransfers" :key="index" class="transfer-data">
          <div class="transfer-header">
            <h4 class="transfer-name">{{ transfer.name }}</h4>
            <h4 class="amount">{{ formatCurrency(transfer.amount) }}</h4>
          </div>
          <h5 class="transfer-date">{{ moment(transfer.date).fromNow() + ', ' + moment(transfer.date).format('h:mmA') }}
          </h5>
        </div>
        <!-- <ul>
          <li >
            {{ transfer }}
          </li>
        </ul> -->
      </div>

      <div class="transaction-history">
        <h3 id="title">Transaction History</h3>

        <div v-if="recentTransactions.length === 0" class="empty-state">
          <EmptyState :image="ic_no_history" :title="'No transaction history'"
            :message="'You cannot view transaction history at the moment until a transfer has been performed'" />
        </div>

        <div v-else class="transactions-table">
          <div class="table-header">
            <div>#</div>
            <div>Date</div>
            <div>Name</div>
            <div>Amount</div>
            <div>M.O.P</div>
          </div>
          <div class="table-body">
            <div v-for="(transaction, index) in recentTransactions" :key="index" class="table-row">
              <div>{{ index + 1 }}</div>
              <div>{{ transaction.date }}</div>
              <div>{{ transaction.name }}</div>
              <div>{{ transaction.amount }}</div>
              <div>{{ transaction.paymentMethod }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Details and Transaction Trend Section -->
    <section class="pricing-trend-section">
      <div class="pricing-details">
        <h3 id="title">Pending Registrations</h3>

        <div v-if="pendingRegistration.length === 0" class="empty-state">
          <EmptyState :image="ic_barchart" :title="'No registration history'"
            :message="'You cannot view anything at the moment, until request has been made'" />
        </div>

        <div v-else class="transactions-table">
          <div class="table-header">
            <div>#</div>
            <div>Date</div>
            <div>Name</div>
          </div>
          <div class="table-body">
            <div v-for="(registration, index) in pendingRegistration" :key="index" class="table-row">
              <div>{{ index + 1 }}</div>
              <div>{{ registration.date }}</div>
              <div>{{ transaction.name }}</div>
            </div>
          </div>
        </div>

      </div>


      <div class="transaction-trend">
        <h3>Pricing Trend</h3>

        <div v-if="pieChartData.length === 0" class="empty-state">
          <EmptyState :image="ic_pieChart" :title="'No pricing trends'"
            :message="'You cannot view your settlements at the moment, no transaction performed'" />
        </div>

        <div v-else class="pie-chart-container">
          <Pie :data="pieChartData" :options="pieChartOptions" />
        </div>
      </div>
    </section>

    <Spinner :loading="loading" />

    <div v-if="showDollarForm" class="modal-overlay">
      <div class="modal">
        <form @submit.prevent="updateDollar">

          <div class="dollar-form-header">
            <label for="newDollarValue">Update Dollar rate</label>
            <button class="close-btn" @click="showDollarForm = false">&#x2715;</button>
          </div>

          <div class="dollar-form">
            <label for="newDollarValue">Price (Naira)</label>
            <input type="number" step="0.01" id="newDollarValue" name="newDollarValue" v-model="newDollarValue">
            <button class="dollar-button" type="submit">Save</button>
          </div>

        </form>
      </div>
    </div>

    <CustomDialog v-if="showApiDialog" :message="responseMessage" :show="showApiDialog" @confirm="showApiDialog = false"
      :success="apiStatus" />

  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, nextTick } from 'vue';
import { Bar, Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { fetchDashboardDataUseCase, updateDollarRateUseCase } from '../../domain/useCases/dashboardUseCase';
import Spinner from '../components/Spinner.vue';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import ic_image from '@/assets/ic_supplier.svg';
import { storesManager } from '@/presentation/store/userStore';
import { formatCurrency, formatDate } from '@/core/utils/helpers';
import { localStorageSource } from '@/data/sources/localStorage';
import CustomDialog from '../components/CustomDialog.vue';
import EmptyState from '../components/EmptyState.vue';
import router from '../router';
import moment from 'moment';
import ic_barchart from '@/assets/ic_barchart_null.svg';
import ic_pieChart from '@/assets/ic_piechart_null.svg';
import ic_no_history from '@/assets/ic_history_null.svg';
import ic_no_transfer from '@/assets/ic_transfer_null.svg';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const store = storesManager();
const toast = useToast();
const loading = ref(false);
const responseMessage = ref('')
const apiStatus = ref(false);
const showApiDialog = ref(false);
const isDollarUpdated = ref(false);
const showDollarForm = ref(false);
const metrics = ref([]);
const availableDollar = ref(0);
const dollarRate = ref(0);
const recentTransfers = ref([]);
const recentTransactions = ref([]);
const newDollarValue = ref('');
const pendingRegistration = ref([]);

const barChartSeries = ref([]);
const barChartOptions = ref({
  chart: {
    height: '100px',
    type: 'bar',
    toolbar: {
      show: true,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      endingShape: 'rounded',
      columnWidth: '55%'
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  colors: ['#F3B923'],
  title: {
    text: 'Total Monthly Income',
    align: 'left',
  },
});

const pieChartData = ref({
  labels: ['In App (Credit)', 'Bank Transfer (Walk in)', 'Cash (Walk in)', 'In App (Debit)'],
  datasets: [
    {
      label: 'Transaction Distribution',
      backgroundColor: ['#A90836', '#0223CF', '#23B454', '#FF9900'],
      data: [15, 15, 5, 15],
    },
  ],
});

const pieChartOptions = ref({
  responsive: true,
  cutout: '60%',
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      callbacks: {
        label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`,
      },
    },
  }
});

const editPrice = () => {
  showDollarForm.value = true;
};

const updateDollar = async () => {
  if (newDollarValue.value !== '' && newDollarValue.value > 0) {
    console.log(newDollarValue.value + "has been inserted");

    loading.value = true;
    try {
      const response = await updateDollarRateUseCase(newDollarValue.value);
      console.log("Dollar update response", response)

      newDollarValue.value = '';
      showDollarForm.value = false;
      toast.success(response.message);

      if (response.success) {
        isDollarUpdated.value = true;
        showApiDialog.value = true;
        apiStatus.value = response.success;
        responseMessage.value = response.message;
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


watchEffect(() => {
  if (isDollarUpdated.value === true) {
    nextTick(() => {
      onMountedHandler();
      isDollarUpdated.value = false;
    });
  }
});

onMounted(async () => {
  onMountedHandler();
});

const onMountedHandler = async () => {
  loading.value = true;

  try {
    const dashboardData = await fetchDashboardDataUseCase();
    console.log('Dashboard data:', dashboardData);

    localStorageSource.savedDashboardData(dashboardData.data);
    localStorageSource.savedCompanyAccount(dashboardData.data.companyAccounts);
    localStorageSource.saveCompanyPhone(dashboardData.data.companyPhoneNumbers);
    store.setName(dashboardData.data.adminName);

    // Initialize monthly income array
    const monthlyIncome = Array(12).fill(0);
    // Populate the monthly income array
    dashboardData.data.monthlyTransfers.forEach(item => {
      const monthIndex = item.month - 1; // Convert to 0-based index
      monthlyIncome[monthIndex] += item.totalAmount;
    });
    // Set the bar chart series data
    barChartSeries.value = [{
      name: 'Total Monthly Income ($)',
      data: monthlyIncome,
    }];


    //   barChartSeries.value = [{
    //   name: 'Total Monthly Income ($)',
    //   data: dashboardData.data.monthlyTransfers.map(item => item.totalAmount),
    // }];

    metrics.value = dashboardData.metrics || [
      { title: 'Current Month Earnings', value: formatCurrency(dashboardData.data.totalMonthlyNairaTransfer) || formatCurrency(0), icon: ic_image },
      { title: 'Total No of Transactions', value: dashboardData.data.monthlyTransfers.length, icon: ic_image },
      { title: 'Received Today', value: formatCurrency('0.00'), icon: ic_image },
      { title: 'Monthly Dollar Spent', value: formatCurrency(dashboardData.data.totalMonthlyDollarSpent, 'USD') || formatCurrency(0, 'USD'), icon: ic_image },
    ];

    availableDollar.value = formatCurrency(dashboardData.data.availableDollarAmount, 'USD') || '';
    dollarRate.value = formatCurrency(dashboardData.data.dollarRate);


    recentTransfers.value = dashboardData.data.pendingTransfer || [];
    pendingRegistration.value = dashboardData.data.pendingRegistration || [];

    // recentTransactions.value = dashboardData.recentTransactions || [
    //   { date: '2024-09-01', reference: 'Ref123', name: 'John Doe', amount: '$100', paymentMethod: 'Transfer', status: 'Completed' },
    //   { date: '2024-09-02', reference: 'Ref124', name: 'Jane Smith', amount: '$150', paymentMethod: 'Cash', status: 'Pending' },
    //   { date: '2024-09-02', reference: 'Ref124', name: 'Jane Smith', amount: '$150', paymentMethod: 'Transfer', status: 'Pending' },
    //   { date: '2024-09-01', reference: 'Ref123', name: 'John Doe', amount: '$100', paymentMethod: 'Transfer', status: 'Completed' },
    // ];

    pieChartData.value.labels = dashboardData.pieChartLabels || ['Category A', 'Category B', 'Category C', 'Category D'];
    pieChartData.value.datasets[0].data = dashboardData.pieChartData || [300, 450, 100, 150];

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

</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');

.dashboard {
  padding-bottom: 10px;
  padding-right: 15px;
  color: black;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

/* Top Metric Cards */
.metric-cards {
  width: 100%;
  height: 90px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  flex-direction: column;
}

.card.metric {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 10px;
  max-width: 300px;
}

.metric-icon {
  max-width: 40px;
  height: 40px;
  border-radius: 4px;
}

.metric-content h2 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;
}

.metric-content p {
  margin: 0;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 600;
}

.top-section {
  display: flex;
  /* Allows items to wrap */
  gap: 15px;
  margin-bottom: 20px;
}

.chart-card {
  flex: 1 1 calc(70% - 15px);
  /* Adjust width considering the gap */
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  height: 300px;
}

.chart-container {
  padding: 0px 0;
  height: calc(100% - 5px);
  overflow: auto;
}

.info-cards {
  flex: 1 1 calc(30% - 15px);
  /* Adjust width considering the gap */
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card {
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.edit-price {
  color: red;
  cursor: pointer;
  font-size: 14px;
}

/* Fund Transfers and Transaction History Section */
.transfer-transaction-section {
  display: flex;
  flex-wrap: wrap;
  /* Allows items to wrap */
  gap: 15px;
  margin-bottom: 20px;
}

.transfer-list,
.transaction-history {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-sizing: border-box;
}

.transfer-list {
  flex: 1 1 calc(40% - 15px);
  /* Adjust width considering the gap */
}

.transaction-history {
  flex: 1 1 calc(60% - 15px);
  /* Adjust width considering the gap */
  height: 300px;
  overflow-y: auto;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header,
.table-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 10px;
}

.table-header {
  font-weight: bold;
}

.table-row {
  border-bottom: 1px solid #ddd;
}

.table-header>div,
.table-row>div {
  flex: 1;
}

/* Pricing Details and Transaction Trend Section */
.pricing-trend-section {
  display: flex;
  flex-wrap: wrap;
  /* Allows items to wrap */
  gap: 15px;
}

.pricing-details,
.transaction-trend {
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  flex: 1 1 calc(50% - 15px);
  /* Adjust width considering the gap */
}

.pricing-details h4,
.transaction-trend h4 {
  margin: 0;
  font-size: 14px;
  color: #333;
}

/* Add styles for the Pie Chart container */
.pie-chart-container {
  padding: 15px 0;
  height: 300px;
}

.transaction-trend {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Spinner Styling */
.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.dollar-form-header {
  display: flex;
  top: 0;
  left: 0;
  padding: 5px 20px;
}

.close-btn {
  position: absolute;
  right: 20px;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.dollar-form {
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

input {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  color: black;
  height: 60px;
}

.dollar-button {
  background-color: #B6720F;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 20px;
  margin-left: 40%;
  margin-right: 40%;
}

.dollar-button:hover {
  background-color: #953131;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
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

.form-item input,
.form-item select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.available-dollar,
.dollar-rate {
  text-align: center;
  color: #7C7878;
  font-weight: bold;
  font-size: 18px;
}

.logo {
  margin-left: 45%;
  margin-right: 45%;
}

.available-dollar-value {
  padding-top: 10px;
  font-weight: 600;
  font-size: 26px;
  text-align: center;
  color: black;
}

.dollar-rate-value {
  font-weight: 600;
  font-size: 20px;
  text-align: center;
  color: black;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
  /* For Firefox */
}


/* Add a media query for tablets and smaller devices */
@media (max-width: 1024px) {
  .metric-cards .card.metric {
    flex: 1 1 calc(33% - 15px);
    /* 3 cards per row on larger tablets */
  }

  .chart-card,
  .info-cards {
    flex: 1 1 100%;
    /* Stack chart and info cards vertically */
    margin-bottom: 15px;
  }

  .transfer-list,
  .transaction-history {
    flex: 1 1 100%;
    /* Stack transfer list and transaction history vertically */
  }

  .pricing-details,
  .transaction-trend {
    flex: 1 1 100%;
    /* Stack pricing details and transaction trend vertically */
  }
}

/* Media query for mobile devices */
@media (max-width: 768px) {
  .metric-cards .card.metric {
    flex: 1 1 calc(50% - 10px);
    /* 2 cards per row on smaller screens */
  }

  .top-section,
  .pricing-trend-section,
  .transfer-transaction-section {
    flex-direction: column;
    /* Stack sections vertically */
  }

  .dollar-form {
    margin-left: 10%;
    margin-right: 10%;
    /* Reduce margin for smaller screens */
  }

  .dollar-button {
    margin-left: 30%;
    margin-right: 30%;
    /* Adjust button margin for mobile */
  }
}

/* Media query for very small devices (e.g., phones in portrait mode) */
@media (max-width: 480px) {
  .metric-cards .card.metric {
    flex: 1 1 100%;
    /* 1 card per row on very small devices */
  }

  .dollar-form {
    margin-left: 5%;
    margin-right: 5%;
    /* Further reduce margin for very small devices */
  }

  .dollar-button {
    margin-left: 20%;
    margin-right: 20%;
    /* Center the button for very small devices */
  }

  .available-dollar-value,
  .dollar-rate-value {
    font-size: 20px;
    /* Adjust font sizes for very small screens */
  }
}

.transfer-header {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.transfer-name {
  font-weight: bold;
}

.amount {
  margin-left: auto;
  color: green;
  font-weight: bold;
}

.transfer-date {
  display: block;
  color: #999;
  margin-bottom: 5px;
}

#title {
  font-weight: bold;
}

.chart-canvas {
  height: 250px;
  /* Adjust the height as needed */
}
</style>

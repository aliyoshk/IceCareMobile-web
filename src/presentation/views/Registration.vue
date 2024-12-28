<template>
  <div class="registration-container">
    <section class="info-card">

      <button class="back-button" @click="goBack">← Back</button>

      <div class="card small-card">
        <img src="@/assets/ic_supplier.svg" alt="Card Image" class="card-image" />
        <div class="content">
          <h3>Total Count</h3>
          <p>{{ totalRecord }}</p>
        </div>
      </div>
    </section>

    <div class="table-container">
      <div class="table-header">
        <h2>{{ selectedCard }} Requests</h2>
        <div class="search-add-container">
          <input type="text" v-model="searchQuery" placeholder="Search..." />
          <button @click="exportToPDF">Export to PDF</button>
          <button @click="exportToExcel">Export to Excel</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th v-if="!(isPending || isRejected)">Account No</th>
            <th>Status</th>
            <th v-if="!isPending">Reviewer</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredResponse" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.fullName }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.email }}</td>
            <td v-if="!(isPending || isRejected)">{{ item.accountNumber }}</td>
            <td>{{ item.status }}</td>
            <td v-if="!isPending">{{ item.reviewedBy.split(' ')[0] }}</td>
            <div class="action" v-if="isPending">
              <td class="approve" @click="approve(item, 'Approve')">Approve</td>
              <td class="reject" @click="Reject(item, 'Reject')">Reject</td>
            </div>
            <td class="delete" @click="deleteRecord(item)">Delete</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmDialog v-if="isDialogVisible" :title="dialogTitle" :message="dialogMessage" :show="isDialogVisible"
      @confirm="handleAction" @cancel="cancelDialog" />

    <Spinner :loading="loading" />

    <CustomDialog v-if="showApiDialog" :message="responseMessage" :show="showApiDialog" @confirm="done"
        :success="apiStatus" :emptyList="isEmptyList" 
    />

  </div>
</template>



<script setup>

import { useRouter, useRoute } from 'vue-router';
import { ref, computed, onMounted, watchEffect } from 'vue';
import imgx from '@/assets/ic_supplier.svg';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import Spinner from '../components/Spinner.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import CustomDialog from '../components/CustomDialog.vue';
import { handleApiError } from '../../core/utils/errorHandler';
import { getPendingRegistration, getApprovedUsers, getRejectedUsers, attestRegistration, deleteUserUseCase } from '@/domain/useCases/dashboardUseCase';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const showForm = ref(false);
const toast = useToast();
const searchQuery = ref('');
const totalRecord = ref(0);
const totalTransaction = ref(0);
const response = ref([]);
const isPending = ref(false);
const isRejected = ref(false);
const isEndPointHit = ref(false);
const responseMessage = ref('')
const apiStatus = ref(false);
const showApiDialog = ref(false);
const isEmptyList = ref(false);

const isDialogVisible = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const selectedItem = ref(null);
const status = ref('');
const userId = ref(0);

const selectedCard = route.query.selectedCard;


watchEffect(() => {
  if (isEndPointHit.value === true) {
    onMountedHandler()
    isEndPointHit.value === false;
  }
});

onMounted(async () => {
  onMountedHandler();
});

const onMountedHandler = async () => {
  loading.value = true;
  isPending.value = false;
  isRejected.value = false;

  try {
    if (selectedCard === 'Pending') {
      isPending.value = true;
      const pendingResponse = await getPendingRegistration();
      response.value = pendingResponse.data || [];
    } else if (selectedCard == 'Approved') {
      const pendingResponse = await getApprovedUsers();
      response.value = pendingResponse.data || [];
    } else {
      isRejected.value = true;
      const pendingResponse = await getRejectedUsers();
      response.value = pendingResponse.data || [];
    }
    console.log(selectedCard + ' registration record:', response);



    totalRecord.value = response.value.length;
    console.log("Total record lenght" + totalRecord.value);
  }
  catch (error) {
      showApiDialog.value = true;
      apiStatus.value = false;
      responseMessage.value = error.message;
      isEmptyList.value = error.message.includes('No record found');
    } 
    finally {
      loading.value = false;
      isEmptyList.value = false;
    }
};

const done = () => {
  showApiDialog.value = false;
  if (responseMessage.value.includes('No record found')) {
    goBack();
  }
};

const filteredResponse = computed(() => {
  return Array.isArray(response.value) ? response.value.filter(data =>
    data.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    data.date.includes(searchQuery.value.toLowerCase())
  ) : [];
});

const goBack = () => {
  router.push({ name: 'BackOffice' });
};

const approve = (item, state) => {

  status.value = state;

  selectedItem.value = item.id;
  dialogTitle.value = 'Approve Request';
  dialogMessage.value = `Are you sure you want to approve the request for ${item.fullName}?`;
  isDialogVisible.value = true;
};

const handleAction = async () => {
  console.log('Approved:', selectedItem.value);
  isDialogVisible.value = false;
  
  if (status.value === 'Delete') {
    try {
      console.log('Deleting record of:', selectedItem.value);
      const response = await deleteUserUseCase(selectedItem.value.id);

      if (response.success || response.data.success) {
        isEndPointHit.value = true;
        showApiDialog.value = true;
        apiStatus.value = true;
        responseMessage.value = response.message || "Record deleted Successful";
      }
    }
    catch (error) {
      console.log('Error occurred:', error.message);
      alert(error.message);
    }
    finally {
      loading.value = false;
      isEmptyList.value = false;
      status.value = '';
    }
  }
  else {
    console.log("The selected status" + status.value);
    try {
      if (status.value === 'Reject') {
        userId.value = 1;
      }

      const requestData = {
          userId: selectedItem.value,
          action: userId.value,
        };

      console.log('This is the content of:', requestData);
      const response = await attestRegistration(requestData);
      console.log('This is the response of:', response);

      if (response.success || response.data.success) {
        alert(response.data.data)
        isEndPointHit.value = true;
      }
    }
    catch (error) {
      console.log('Error occurred:', error.message);
      alert(error.message);
    }
    finally {
      loading.value = false;
      isEmptyList.value = false;
      status.value = '';
    }
  }
};

const Reject = (item, state) => {
  status.value = state;
  selectedItem.value = item.id;

  dialogTitle.value = 'Reject Request';
  dialogMessage.value = `Are you sure you want to reject the request for ${item.fullName}?`;
  isDialogVisible.value = true;
};

const cancelDialog = () => {
  toast.success('Cancel:', selectedItem.value);
  isDialogVisible.value = false;
};

const deleteRecord = (item) => {
  selectedItem.value = [];
  console.log('Deleting record of:', item);
  dialogTitle.value = `Delete ${item.fullName}`;
  dialogMessage.value = `Proceeding will delete the record from the list`;
  isDialogVisible.value = true;

  selectedItem.value = item;
  status.value = "Delete"
};

// Function to export table data to Excel
class ExcelExporter {
  constructor(tableData) {
    this.tableData = tableData;
  }

  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Add table headers
    worksheet.columns = [
      { header: '#', key: 'index', width: 10 },
      { header: 'Name', key: 'fullName', width: 25 },
      { header: 'Phone Number', key: 'phone', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Reviewer', key: 'reviewedBy', width: 20 }
    ];

    // Add table rows
    this.tableData.forEach((row, index) => {
      worksheet.addRow({
        index: index + 1,
        fullName: row.fullName,
        phone: row.phone,
        email: row.email,
        status: row.status,
        reviewedBy: row.reviewedBy ? row.reviewedBy.split(' ')[0] : '',
      });
    });

    // Export the file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${selectedCard}_requests.xlsx`);
    }).catch(err => {
      console.error('Error generating Excel file:', err);
    });
  }
}

const exportToExcel = () => {
  const exporter = new ExcelExporter(filteredResponse.value);
  exporter.exportToExcel();
}; 

// Export table data to PDF
const exportToPDF = () => {
  const doc = new jsPDF();
  const tableColumn = ['#', 'Name', 'Phone Number', 'Email', 'Status', 'Reviewer'];
  const tableRows = [];

  filteredResponse.value.forEach((item, index) => {
    const rowData = [
      index + 1,
      item.fullName,
      item.phone,
      item.email,
      item.status,
      item.reviewedBy ? item.reviewedBy.split(' ')[0] : '',
    ];
    tableRows.push(rowData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
  });

  doc.save(`${selectedCard}_requests.pdf`);
};


</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');

.registration-container {
  display: flex;
  flex-direction: column;
  padding-top: 5%;
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
  justify-content: space-between;
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
  justify-content: end;
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
  display: flex;
  flex-wrap: wrap;
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

table,
.table-header {
  width: 100%;
  border-collapse: collapse;
  background-color: beige;
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

.reject,
.approve {
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  text-decoration: underline;
}

.reject {
  color: #A90836;
}

.approve {
  color: green;
}

.action {
  padding: 30px 20px;
}

.delete {
  color: #A90836;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.back-button {
  font-size: 18px;
  border: none;
  background: none;
  cursor: pointer;
  color: #A90836;
  padding-right: 20px;
}

</style>
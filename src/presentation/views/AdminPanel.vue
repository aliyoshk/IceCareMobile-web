<template>
  <div class="admin-container">
    <section class="info-card">
      <div class="card small-card">
        <img src="@/assets/ic_signal.svg" alt="Card Image" class="card-image" />
        <div class="content">
          <h3>Total Count</h3>
          <p>{{ totalRecord }}</p>
        </div>
      </div>
    </section>

    <div class="table-container">
      <div class="table-header">
        <h2>Administrators List</h2>
        <div class="search-add-container">
          <input type="text" v-model="searchQuery" placeholder="Search..." />
          <button @click="addAdmin">Add Admin</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Name</th>
            <th>Username</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(admin, index) in filteredAdmins" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ formatDate(admin.date) }}</td>
            <td>{{ admin.name }}</td>
            <td>{{ admin.email }}</td>
            <td>{{ admin.password }}</td>
            <td class="delete" @click="deleteRecord(admin)">Delete Admin</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="modal-overlay">
      <div class="modal">
        <AdminForm @formSubmitted="handleFormSubmission" @formClosed="showForm = false" />
      </div>
    </div>

    <Spinner :loading="loading" />

    <CustomDialog v-if="showApiDialog" :message="responseMessage" :show="showApiDialog" @confirm="done"
      :success="apiStatus" />

  </div>
</template>



<script setup>

import { ref, computed, onMounted, watchEffect, nextTick } from 'vue';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import Spinner from '../components/Spinner.vue';
import { getAdminsUseCase, addAdminUseCase, deleteAdminUseCase } from '@/domain/useCases/dashboardUseCase';
import { formatCurrency, formatDate } from '@/core/utils/helpers';
import AdminForm from '@/presentation/components/AdminForm.vue';
import { localStorageSource } from '@/data/sources/localStorage';
import CustomDialog from '../components/CustomDialog.vue';

const loading = ref(false);
const showForm = ref(false);
const toast = useToast();
const searchQuery = ref('');
const isAlteration = ref(false);
const getAdminResponse = ref([]);
const totalRecord = ref(0);
const responseMessage = ref('')
const apiStatus = ref(false);
const showApiDialog = ref(false);

const addAdmin = () => showForm.value = true;


watchEffect(() => {
  if (isAlteration.value === true) {
    nextTick(() => {
      onMountedHandler();
      isAlteration.value = false;
    });
  }
});

onMounted(async () => {
  onMountedHandler();
});

const onMountedHandler = async () => {
  loading.value = true;

  try {
    const response = await getAdminsUseCase();
    console.log('Admin record:', response);

    getAdminResponse.value = response.data || [];

    totalRecord.value = response.data.length;
  }
  catch (error) {
    getAdminResponse.value = [];
    showApiDialog.value = true;
    apiStatus.value = false;
    responseMessage.value = error.message;
  }
  finally {
    loading.value = false;
  }
};

const filteredAdmins = computed(() => {
  return Array.isArray(getAdminResponse.value) ? getAdminResponse.value.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  ) : [];
});

const validateFormField = (data) => {
  if (data.Name.trim() === '') {
    toast.success('Enter admin name');
    return false;
  } else if (data.Email.trim() === '') {
    toast.success('Enter admin email');
    return false;
  }
  else if (data.Password === '') {
    toast.success('Choose admin password');
    return false;
  }

  return true;
};

const done = () => {
  showApiDialog.value = false;
};

const handleFormSubmission = async (data) => {
  console.log('New Admin:', data);
  showForm.value = false;

  if (!validateFormField(data)) {
    showForm.value = true;
    return;
  }

  try {
    const adminRequest = {
      name: data.Name,
      email: data.Email,
      password: data.Password.toString(),
      role: ''
    };

    console.log('This is the content of:', adminRequest);
    const response = await addAdminUseCase(adminRequest);
    console.log('This is the response of:', response);

    if (response.data.success) {
      isAlteration.value = true;

      showApiDialog.value = true;
      apiStatus.value = response.data.success;
      responseMessage.value = response.message || "Record added Successful";
    }
  }
  catch (error) {
    console.log('Error occurred:', error.message);
    showApiDialog.value = true;
    apiStatus.value = false;
    responseMessage.value = error.message;
  }
};

const deleteRecord = async (admin) => {
  try {
    console.log("The admin records are:", admin);
    const response = await deleteAdminUseCase(admin.id);
    console.log("The response of delete is:", response);

    if (response.success) {
      isAlteration.value = true;
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

</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');

.admin-container {
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
  width: 100%; /* Make the card full width on smaller screens */
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
  flex-grow: 1;
}

.content-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.table-container {
  margin-top: 20px;
  overflow-x: auto; /* Ensure table scrolls on smaller screens */
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  padding-left: 30px;
  padding-right: 30px;
  flex-wrap: wrap; /* Allows items to wrap on smaller screens */
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

/* Media queries for responsiveness */
@media screen and (max-width: 768px) {
  .payment-container {
    padding: 10px;
  }

  .info-card {
    flex-direction: column;
  }

  .card {
    width: 100%; /* Full width for cards on small screens */
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  table {
    font-size: 12px; /* Smaller font size for mobile */
  }

  th, td {
    padding: 10px;
  }

  .modal {
    width: 95%; /* Smaller modal on mobile */
  }
}
</style>

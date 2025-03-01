<template>
    <div class="registration-container">
        <section class="info-card">

            <button class="back-button" @click="goBack">← Back</button>

            <div class="card-header">
                <div class="card small-card">
                    <img src="@/assets/ic_supplier.svg" alt="Card Image" class="card-image" />
                    <div class="content">
                        <h3>Total Count</h3>
                        <p>{{ totalRecord }}</p>
                    </div>
                </div>

                <div class="card small-card">
                    <img src="@/assets/ic_supplier.svg" alt="Card Image" class="card-image" />
                    <div class="content">
                        <h3>Total Amount</h3>
                        <p>{{ formatCurrency(totalAmount) }}</p>
                    </div>
                </div>

                <div class="card small-card">
                    <img src="@/assets/ic_account.svg" alt="Card Image" class="card-image" />
                    <div class="content">
                        <h3>Option</h3>
                        <div class="dropdown-container">
                            <select id="banks" v-model="onOptionChanged">
                                <option value=""> Select Category </option>
                                <option v-for="(item, index) in options" :key="index" v-value="item.name"> {{ item.name
                                    }} </option>
                            </select>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <div class="table-container" v-if="onOptionChanged && selectedOption !== 'Select Category'">
            <div class="table-header">
                <h2>{{ selectedCard }} {{ onOptionChanged }} Requests</h2>
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
                        <th>Date</th>
                        <th>Transaction ID</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Category</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(item, index) in filteredResponse" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ formatDate(item.transactionDate) }}</td>
                        <td>{{ item.transferReference || '-' }}</td>
                        <td>{{ item.customerName || '-' }}</td>
                        <td>{{ formatCurrency(item.bankDetails && item.bankDetails.length > 0 ?
                            calculateTotalAmount(item.bankDetails) : item.totalAmount) }}</td>
                        <!-- <td>{{ formatCurrency(calculateTotalAmount(item.bankDetails)) }}</td> -->
                        <td>{{ item.status }}</td>
                        <td> {{ item.category }}</td>
                        <td class="view" @click="view(item)">View</td>
                        <td class="Delete" @click="deleteItem(item)">Delete</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <Spinner :loading="loading" />

        <CustomDialog v-if="showApiDialog" :message="responseMessage" :show="showApiDialog" @confirm="done"
            :success="apiStatus" :emptyList="isEmptyList" />

    </div>
</template>



<script setup>

import { useRouter, useRoute } from 'vue-router';
import { ref, computed, onMounted, watchEffect, nextTick } from 'vue';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import Spinner from '../components/Spinner.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import CustomDialog from '../components/CustomDialog.vue';
import { formatCurrency, formatDate } from '@/core/utils/helpers';
import { getPendingTransfer, getApprovedTransfer, deleteTransferUseCase } from '@/domain/useCases/dashboardUseCase';
import { getAccountPaymentUseCase, deleteAccountPaymentUseCase } from '@/domain/useCases/dashboardUseCase';
import { getThirdPartyUseCase, deleteThirdPartyUseCase } from '@/domain/useCases/dashboardUseCase';
import { getAccountTopUpUseCase, deleteAccountTopUpUseCase } from '@/domain/useCases/dashboardUseCase';
import { useTransferStore } from '@/presentation/store/transferStore';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const toast = useToast();
const searchQuery = ref('');
const totalRecord = ref(0);
const response = ref([]);
const totalAmount = ref(0);
const responseMessage = ref('')
const apiStatus = ref(false);
const showApiDialog = ref(false);
const isEmptyList = ref(false);
const onOptionChanged = ref('');
const options = ref([]);
const selectedOption = ref([]);
const isEndPointHit = ref(false);
const customerStore = useTransferStore();
const selectedCard = route.query.selectedCard;

options.value = [{ name: 'Transfer' }, { name: 'Account Payment' }, { name: 'Third party' }, { name: 'Account Top Up' }];

watchEffect(() => {
    if (isEndPointHit.value === true || onOptionChanged.value !== '') {
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
    response.value = [];
    totalAmount.value = 0;
    totalRecord.value = 0;

    try {
        if (selectedCard === 'Pending') {

            if (onOptionChanged.value === 'Transfer') {
                const pendingResponse = await getPendingTransfer();
                response.value = pendingResponse.data || [];
            }
            else if (onOptionChanged.value === 'Account Payment') {
                const pendingResponse = await getAccountPaymentUseCase("Pending");
                console.log('Account Payment Response:', pendingResponse);
                response.value = pendingResponse.data || [];
            }
            else if (onOptionChanged.value === 'Third party') {
                const pendingResponse = await getThirdPartyUseCase("Pending");
                console.log('Third party Response:', pendingResponse);
                response.value = pendingResponse.data || [];
            }
            else if (onOptionChanged.value === 'Account Top Up') {
                const pendingResponse = await getAccountTopUpUseCase("Pending");
                console.log('Account Top Up Response:', pendingResponse);
                response.value = pendingResponse.data || [];
            }

        } else {
            if (onOptionChanged.value === 'Transfer') {
                const pendingResponse = await getApprovedTransfer();
                response.value = pendingResponse.data || [];
            }
            else if (onOptionChanged.value === 'Account Payment') {
                const pendingResponse = await getAccountPaymentUseCase("Confirmed");
                console.log('Account Payment Response:', pendingResponse);
                response.value = pendingResponse.data || [];
            }
            else if (onOptionChanged.value === 'Third party') {
                const pendingResponse = await getThirdPartyUseCase("Confirmed");
                console.log('Third party Response:', pendingResponse);
                response.value = pendingResponse.data || [];
            }
            else if (onOptionChanged.value === 'Account Top Up') {
                const pendingResponse = await getAccountTopUpUseCase("Confirmed");
                console.log('Account Top Up Response:', pendingResponse);
                response.value = pendingResponse.data || [];
            }
        }

        response.value.forEach((item) => {
            if (item.bankDetails && item.bankDetails.length) {
                item.bankDetails.forEach((bankDetail) => {
                    totalAmount.value += bankDetail.amountTransferred;
                });
            }
            else {
                totalAmount.value += item.totalAmount;
            }
        });
        totalRecord.value = response.value.length;
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
};

const calculateTotalAmount = (bankDetails) => {
    return bankDetails.reduce((total, bankDetail) => total + (bankDetail.amountTransferred || 0), 0);
};

const filteredResponse = computed(() => {
    return Array.isArray(response.value) ? response.value.filter(data =>
        data.customerName?.toLowerCase()?.includes(searchQuery.value.toLowerCase() || '') ||
        data.customerEmail.includes(searchQuery.value.toLowerCase())
    ) : [];
});

const goBack = () => {
    router.push({ name: 'BackOffice' });
};

const view = (item) => {
    toast.success('Selected is:' + item.customerName);

    sessionStorage.setItem('selectedCustomer', JSON.stringify(item));
    customerStore.setSelectedCustomer(item);
    router.push({ name: 'TransferDetails' });
};

const deleteItem = (item) => {
    toast.success('Selected is:' + item.customerName);
    deleteRecord(item);
};

const deleteRecord = async (item) => {
    loading.value = true;
    try {
        if (onOptionChanged.value === 'Transfer') {
            const response = await deleteTransferUseCase(item.id);
            console.log('Delete Transfer Response:', response);
            if (response.success) {
                isEndPointHit.value = true;
                showApiDialog.value = true;
                apiStatus.value = true;
                responseMessage.value = response.message;
            }
        }
        else if (onOptionChanged.value === 'Account Payment') {
            console.log("Deleting account payment");
            const response = await deleteAccountPaymentUseCase(item.id);
            console.log('Delete Account Payment Response:', response);
            if (response.success) {
                isEndPointHit.value = true;
                showApiDialog.value = true;
                apiStatus.value = true;
                responseMessage.value = response.message;
            }
        }
        else if (onOptionChanged.value === 'Third party') {
            const response = await deleteThirdPartyUseCase(item.id);
            console.log('Delete Third party Response:', response);
            if (response.success) {
                isEndPointHit.value = true;
                showApiDialog.value = true;
                apiStatus.value = true;
                responseMessage.value = response.message;
            }
        }
        else if (onOptionChanged.value === 'Account Top Up') {
            const response = await deleteAccountTopUpUseCase(item.id);
            console.log('Delete Account Top Up Response:', response);
            if (response.success) {
                isEndPointHit.value = true;
                showApiDialog.value = true;
                apiStatus.value = true;
                responseMessage.value = response.message;
            }
        }
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
    height: 100vh;
    width: 100vw;
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
    margin: 20px;
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

.view {
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    text-decoration: underline;
    color: #0b8406;
}

.Delete {
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    text-decoration: underline;
    color: #A90836;
}

.back-button {
    font-size: 18px;
    border: none;
    background: none;
    cursor: pointer;
    color: #A90836;
    padding-right: 20px;
}

.card-header {
    display: flex;
    gap: 15px;
}
</style>
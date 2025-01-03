<template>
    <div class="transfer_details">

        <section class="header-section">
            <div class="header">
                <!-- <button class="back-button" @click="goBack">← Back</button> -->
                <button @click="goBack" class="back-button">← Back</button>
                <h1 class="title">Customer {{ selectedCustomer.category }} Details</h1>
            </div>
        </section>

        <div class="general">

            <section class="details-section">
                <div class="customer-details-card">
                    <div class="details-container">
                        <h3 id="boldText">Customer Details</h3>
                        <hr>
                        <br>
                        <h5>Name</h5>
                        <div class="name">
                            <h3 id="boldText">{{ selectedCustomer.customerName.split(' ')[0] }}</h3>
                            <h3 id="boldText">{{ selectedCustomer.customerName.split(' ')[1] }}</h3>
                        </div>
                        <div class="name" id="spacer">
                            <h5>Email</h5>
                            <h5>Phone Number</h5>
                        </div>
                        <div class="name">
                            <h3 id="boldText">{{ formatEmail(selectedCustomer.customerEmail) }}</h3>
                            <h3 id="boldText">{{ selectedCustomer.phoneNumber }}</h3>
                        </div>
                    </div>
                </div>

                <div class="customer-details-card">
                    <div class="details-container">
                        <h3 id="boldText">Transaction Details</h3>
                        <hr>
                        <br>
                        <div class="name">
                            <h5>Total Amount</h5>
                            <h5>Dollar Rate</h5>
                        </div>
                        <div class="name">
                            <h3 id="boldText">{{ formatCurrency(totalAmount) }}</h3>
                            <h3 id="boldText">{{ formatCurrency(selectedCustomer.dollarRate) }}</h3>
                        </div>
                        <div class="name" id="spacer">
                            <h5>Transfer Category</h5>
                            <h5>Dollar Quantity</h5>
                        </div>
                        <div class="name">
                            <h3 id="boldText">{{ selectedCustomer.category }}</h3>
                            <h3 id="boldText">{{ formatCurrency(selectedCustomer.dollarAmount, 'USD') }}</h3>
                        </div>
                    </div>
                </div>

                <div class="receipts-card">
                    <div class="receipts-container">
                        <h3 id="boldText">Transfer receipt(s)</h3>
                        <hr />
                        <br>
                        <div class="receipt-holder">
                            <div v-for="(receipt, index) in receipts" :key="index" class="receipt-item">
                                <img :src="getImage(receipt.receipts)" alt="Receipt Image" class="receipt-image"
                                    @click="openModal(receipt.receipts)" />
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            <section>
                <div class="bank-card">
                    <div class="bank-container">
                        <h3 id="boldText">Bank(s) Involve</h3>
                        <hr />
                        <br>
                        <div id="spacer" v-for="(bank, index) in banks" :key="index">
                            <h5 id="boldText">{{ bank.bankName }}</h5>
                            <h3>{{ bank.accountName }}</h3>
                            <h3>{{ bank.accountNumber }}</h3>
                            <h3>{{ formatCurrency(bank.amountTransferred, 'NGN') }}</h3>
                        </div>
                    </div>
                </div>

                <button class="btn-approve" @click="approve">Approve</button>

            </section>

        </div>

    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <img :src="currentImage" alt="Enlarged Receipt" class="modal-image" />
        </div>
    </div>

    <ConfirmDialog v-if="isDialogVisible" :title="dialogTitle" :message="dialogMessage" :show="isDialogVisible"
        @confirm="handleApprove" @cancel="cancelDialog" />

    <CustomDialog v-if="showApiDialog" :message="responseMessage" :show="showApiDialog" @confirm="goBack"
        :success="apiStatus" />

    <Spinner :loading="loading" />

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { formatCurrency, formatDate, formatEmail } from '@/core/utils/helpers';
import Spinner from '../components/Spinner.vue';
import { approveTransfer, approveAccountPaymentUseCase, approveThirdPartyUseCase, approveAccountTopUpUseCase } from '@/domain/useCases/dashboardUseCase';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import CustomDialog from '../components/CustomDialog.vue';

const router = useRouter();
const route = useRoute();
const showModal = ref(false);
const currentImage = ref('');
const receipts = ref([]);
const banks = ref([]);
const totalAmount = ref(0);
const loading = ref(false);
const isDialogVisible = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const responseMessage = ref('')
const apiStatus = ref(false);
const showApiDialog = ref(false);

//const selectedCustomer = JSON.parse(route.query.selectedCustomer) || [];
const selectedCustomer = JSON.parse(sessionStorage.getItem('selectedCustomer'));
console.log(selectedCustomer);

const approve = () => {

    console.log("Approv clicked");

    dialogTitle.value = 'Approve Transfer';
    dialogMessage.value = `Proceeding would mark ${selectedCustomer.customerName} transfer as confirmed`;
    isDialogVisible.value = true;
};

const cancelDialog = () => {
    isDialogVisible.value = false;
    showApiDialog.value = false;
};

const goBack = () => {
    window.history.back();
    //router.push({ name: 'Transfer' });
};

const handleApprove = async () => {

    loading.value = true;

    try {
        isDialogVisible.value = false;
        const requestData = {
            id: selectedCustomer.id,
            email: selectedCustomer.customerEmail,
            confirmed: true
        };

        if (selectedCustomer.category.includes('SingleBankPayment') || selectedCustomer.category.includes('MultipleBankPayment')) {
            const response = await approveTransfer(requestData);
            if (response.success || response.data.success) {
                showApiDialog.value = true;
                apiStatus.value = true;
                responseMessage.value = response.data.data ?? response.data.message;
            }
        }
        else if (selectedCustomer.category === 'AccountBalancePayment') {
            const response = await approveAccountPaymentUseCase(selectedCustomer.id);
            if (response.success || response.data.success) {
                showApiDialog.value = true;
                apiStatus.value = true;
                responseMessage.value = response.data.data ?? response.data.message;
            }
        }
        else if (selectedCustomer.category === 'ThirdPartyPayment') {
            const response = await approveThirdPartyUseCase(selectedCustomer.id);
            if (response.success || response.data.success) {
                showApiDialog.value = true;
                apiStatus.value = true;
                responseMessage.value = response.data.data ?? response.data.message;
            }
        }
        else if (selectedCustomer.category === 'AccountTopUp') {
            const response = await approveAccountTopUpUseCase(requestData);
            if (response.success || response.data.success) {
                showApiDialog.value = true;
                apiStatus.value = true;
                responseMessage.value = response.data.data ?? response.data.message;
            }
        }
    }
    catch (error) {
        console.log('The error response is:', error);
        showApiDialog.value = true;
        apiStatus.value = false;
        responseMessage.value = error.message;
    }
    finally {
        loading.value = false;
    }
};

const fetchData = () => {

    if (selectedCustomer?.transferEvidence?.length > 0) {
        selectedCustomer.transferEvidence.forEach((evidence) => {
            receipts.value.push(evidence);
        });
    }

    if (selectedCustomer?.bankDetails?.length > 0) {
        selectedCustomer.bankDetails.forEach((bankDetail) => {
            totalAmount.value += bankDetail.amountTransferred || 0;
            banks.value.push(bankDetail);
        });
    }

    console.log('Receipts', receipts.value)
    console.log('Banks', banks.value)
    console.log('Banks', banks.value.bankName)
};

const getImage = (receipt) => {
    return `data:image/jpeg;base64,${receipt}`;
};

const openModal = (receipt) => {
    currentImage.value = getImage(receipt);
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

onMounted(() => {
    fetchData();
});

</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');

.transfer_details {
    padding-bottom: 10px;
    padding-right: 15px;
    color: black;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
    padding-top: 40px;
    overflow-x: auto;
    width: 100vw;
    height: 100vh;

}

h3,
h5 {
    font-size: 14px;
    text-align: left;
}

#boldText {
    font-weight: bold;
}

#spacer {
    padding-top: 10px;
}

.header-section {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    flex-direction: column;
}

.header {
    display: flex;
    flex-wrap: wrap;

}

.title {
    flex-grow: 1;
}

.back-button {
    font-size: 18px;
    border: none;
    background: none;
    cursor: pointer;
    color: #A90836;
    padding-right: 20px;
}

.details-section {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
    width: 70%;
    padding: 8px;
    border-radius: 8px;
    height: auto;
}

.general {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1px;
}

.customer-details-card {
    background-color: #FCF3F4;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
    padding: 10px;
    margin-bottom: 15px;
    flex-wrap: wrap;
    display: flex;
    height: fit-content;
}

.details-container {
    margin: 5px;
    background-color: #f9f9f9;
    padding: 15px;
    width: 270px;
}

.bank-card {
    text-align: left;
    width: auto;
    height: fit-content;
    background-color: #fde7e7;
    padding: 5px;
}

.bank-container {
    margin: 5px;
    background-color: #f9f9f9;
    padding: 15px;
    width: 270px;
    height: 50vh;
    overflow-x: auto;
}

.receipts-card {
    background-color: #FCF3F4;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
    padding: 10px;
    margin-bottom: 15px;
    width: 92%;
    height: 40vh;
}

.receipts-container {
    background-color: #f9f9f9;
    padding: 15px;
    margin: 5px;
    height: 95%;
    overflow-x: auto;
}

.receipt-holder {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.receipt-image {
    width: 100%;
    height: auto;
    object-fit: cover;
}

.receipt-item {
    flex: 1 1 auto;
    max-width: 150px;
    box-sizing: border-box;
}

.name {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.btn-approve {
    background-color: #B6720F;
    color: white;
    border: none;
    padding: 10px 40%;
    cursor: pointer;
    margin-top: 40%;
}

.btn-approve:hover {
    background-color: maroon;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 40%;
    max-height: 80%;
    overflow: auto;
}

.modal-image {
    max-width: 100%;
    max-height: 100%;
}

.receipt-image {
    width: 100%;
    cursor: pointer;
    object-fit: fill;
    max-height: 70%;
}
</style>
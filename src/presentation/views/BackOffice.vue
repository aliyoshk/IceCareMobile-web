<template>
    <div class="back-office-container">

        <!-- Header Cards Section -->
        <section class="header-cards">
            <div class="card header" v-for="(content, index) in headerCardContents" :key="index"
                :class="{ selected: selectedIndex === index }" @click="selectCard(index, content.title)">
                <img :src="content.icon" alt="icon" class="header-icon" />
                <div class="header-content">
                    <h2>{{ content.title }}</h2>
                </div>
            </div>
        </section>

        <!-- Registration Request Section -->
        <section class="items-section" v-if="selectedCardName === 'Registration Request'">
            <div class="item-list" v-for="(item, index) in itemList" :key="index">
                <div class="items-top">
                    <h3 id="bold-value">{{ item.heading }}</h3>
                    <h3 :class="{ 'approved': item.status === 'Approved', 'pending': item.status === 'Pending' }"
                        id="status">
                        {{ item.status }}
                    </h3>
                </div>
                <h5>{{ item.subheading }}</h5>
                <h5 id="count-section">Total count</h5>
                <h4 id="bold-value">{{ item.count }}</h4>
                <hr>
                <h4 id="view" @click="viewRegistrationRecord(item.status)">View</h4>
            </div>
        </section>

        <!-- Incoming Transfer Section -->
        <section class="items-section" v-if="selectedCardName === 'Incoming Transfer'">
            <div class="item-list" v-for="(item, index) in transferItems" :key="index">
                <div class="items-top">
                    <h3 id="bold-value">{{ item.heading }}</h3>
                    <h3 :class="{ 'approved': item.status === 'Approved', 'pending': item.status === 'Pending', 'rejected': item.status === 'Rejected' }"
                        id="status">
                        {{ item.status }}
                    </h3>
                </div>
                <h5>{{ item.subheading }}</h5>
                <h5 id="count-section">Total count</h5>
                <h4 id="bold-value">{{ item.count }}</h4>
                <hr>
                <h4 id="view" @click="viewTransferRecord(item.status)">View</h4>
            </div>
        </section>

        <!-- Help Section -->
        <section class="phone-card-section" v-if="selectedCardName === 'Help'">
            <div class="phone-list">
                <img src="@/assets/ic_phone.svg" alt="Phone Icon" />
                <h4>Company Phone Number(s)</h4>
                <hr id="line">
                <div v-for="(phone, index) in phoneNumbers" :key="index">
                    <h3>{{index+1 +".\t\t\t"+ phone.phoneNumber }}</h3>
                    <hr id="line">
                </div>
                <div class="btn-container">
                    <button class="btn" @click="addPhoneClick">Add Another Number</button>
                </div>

                <div v-if="showPhoneForm" class="modal-overlay">
                    <div class="modal">
                        <form @submit.prevent="addNumber">
                            <div class="form-header">
                                <button class="close-btn" @click="showPhoneForm = false">&#x2715;</button>
                            </div>
                            <div class="form">
                                <label for="newPhoneValue">Phone Number</label>
                                <input type="text" id="newPhoneValue" name="newPhoneValue" v-model="newPhoneValue"
                                    required>
                                <button class="form-btn" type="submit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Accounts Section -->
            <div class="phone-list">
                <img src="@/assets/ic_faq.svg" alt="Account Icon" />
                <h4>Company Accounts</h4>
                <hr />
                <div class="account-details" v-for="(account, index) in companyAccount" :key="index">
                    <h4>{{ account.accountName }}</h4>
                    <div class="bank-details">
                        <h5>{{ account.accountNumber }}</h5>&nbsp; &nbsp; &nbsp;
                        <h5>{{ account.bankName }}</h5>
                        <h5 id="delete" @click="DeleteCompanyAccount(account)">Delete</h5>
                    </div>
                </div>
                <div class="btn-container">
                    <button class="btn" @click="addAccountClick">Add New Account</button>
                </div>

                <div v-if="showAccountForm" class="modal-overlay">
                    <div class="modal">
                        <AccountDetailsForm @formSubmitted="handleAccountFormSubmission"
                            @formClosed="showAccountForm = false" />
                    </div>
                </div>
            </div>

            <!-- FAQ Section -->
            <div class="phone-list">
                <img src="@/assets/ic_faq.svg" alt="FAQ Icon" />
                <h4>FAQ</h4>
                <ul>
                    <!-- <li v-for="(phone, index) in phoneNumbers" :key="index">{{ phone.phoneNumber }}</li> -->
                </ul>
            </div>
        </section>

        <Spinner :loading="loading" />

        <CustomDialog v-if="showApiDialog" :message="responseMessage" :show="showApiDialog"
            @confirm="showApiDialog = false" :success="apiStatus" />

    </div>
</template>


<script setup>
import { ref, onMounted, watchEffect, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import ic_reg from '@/assets/ic_registration.svg';
import ic_people from '@/assets/ic_people.svg';
import ic_bag from '@/assets/ic_bag.svg';
import { localStorageSource } from '@/data/sources/localStorage';
import { addCompanyPhoneUseCase, addCompanyAccountUseCase, deleteCompanyAccountUseCase } from '@/domain/useCases/dashboardUseCase';
import Spinner from '../components/Spinner.vue';
import CustomDialog from '../components/CustomDialog.vue';
import AccountDetailsForm from '@/presentation/components/AccountDetailsForm.vue'
import { elements } from 'chart.js';


const router = useRouter();
const toast = useToast();
const loading = ref(false);
const showApiDialog = ref(false);
const responseMessage = ref('')
const apiStatus = ref(false);
const headerCardContents = ref([]);
const itemList = ref([]);
const selectedIndex = ref(null);
const selectedCardName = ref('');
const transferItems = ref([]);
const showPhoneForm = ref(false);
const newPhoneValue = ref('');
const isApiTriggered = ref(false);
const phoneNumbers = ref([]);
const showAccountForm = ref(false);
const companyAccount = ref([]);

headerCardContents.value = [
    { icon: ic_people, title: 'Incoming Transfer' },
    { icon: ic_reg, title: 'Registration Request' },
    { icon: ic_bag, title: 'Help' },
];

itemList.value = [
    { heading: 'Pending Request', subheading: 'Incoming request', count: '', status: 'Pending' },
    { heading: 'Approved Request', subheading: 'Request Approved', count: '', status: 'Approved' },
    { heading: 'Rejected Request', subheading: 'Request Rejected', count: '', status: 'Rejected' },
];

transferItems.value = [
    { heading: 'Incoming Notification', subheading: 'Incoming transfer list', count: '', status: 'Pending' },
    { heading: 'Confirmed Transfer', subheading: 'Approved transfer list', count: '', status: 'Approved' }
];

const viewRegistrationRecord = (item) => {
    toast.success('Viewing details for: ' + item);
    router.push({ name: 'Registration', query: { selectedCard: item } });
};

const viewTransferRecord = (item) => {
    toast.success('Viewing details for: ' + item);
    router.push({ name: 'Transfer', query: { selectedCard: item } });
};

const addPhoneClick = () => {
    newPhoneValue.value = ''
    showPhoneForm.value = true;
};

const addAccountClick = () => {
    showAccountForm.value = true;
};

const addNumber = async () => {
    if (newPhoneValue.value.length !== 11) {
        toast.error("Phone number should be 11 digit long");
        return;
    }
    showPhoneForm.value = false;
    const phoneNumberRequest = { 
        phoneNumber: newPhoneValue.value 
    };

    loading.value = true;
    try {
        const response = await addCompanyPhoneUseCase(phoneNumberRequest);
        console.log("Add phone number response" + response);
        
        if (response.data.success) {
            isApiTriggered.value = true;
            showApiDialog.value = true;
            apiStatus.value = response.data.success;
            responseMessage.value = response.data.message;

            phoneNumbers.value.push(newPhoneValue.value);
            localStorageSource.saveCompanyPhone(phoneNumbers.value);
        }
    }
    catch (error) {
        showApiDialog.value = true;
        apiStatus.value = false;
        responseMessage.value = error.message;
    } finally {
        loading.value = false;
    }
};

const selectCard = (index, content) => {
    selectedIndex.value = index;
    selectedCardName.value = content;
};

const validateFormField = (request) => {
    if (request.BankName.trim() === '') {
        toast.error('Enter bank name');
        return false;
    } else if (request.AccountNumber === '') {
        toast.error('Enter account number');
        return false;
    } else if (request.AccountNumber.length !== 10) {
        toast.error('Account number should be 10 digits');
        return false;
    } else if (request.AccountName === '') {
        toast.error('Enter account name');
        return false;
    }
    return true;
};

const handleAccountFormSubmission = async (accountDetailsRequest) => {
    showAccountForm.value = false;

    if (!validateFormField(accountDetailsRequest)) {
        showAccountForm.value = true;
        return;
    }
    loading.value = true;
    const accountRequest = {
        bankName: accountDetailsRequest.BankName,
        accountNumber: accountDetailsRequest.AccountNumber,
        accountName: accountDetailsRequest.AccountName
    };

    try {
        const response = await addCompanyAccountUseCase(accountRequest);
        if (response.success) {
            isApiTriggered.value = true;
            showApiDialog.value = true;
            apiStatus.value = response.success;
            responseMessage.value = response.message || "Record added Successful";
                
            localStorageSource.savedCompanyAccount(response.data.data);
        }
    }
    catch (error) {
        showApiDialog.value = true;
        apiStatus.value = false;
        responseMessage.value = error.message;
    } finally {
        loading.value = false;
    }
};

const DeleteCompanyAccount = async (account) => {

    loading.value = true;
    try {
        const response = await deleteCompanyAccountUseCase(account.id);
        console.log("The delete company account response ", response);

        if (response.success) {
            isApiTriggered.value = true;
            showApiDialog.value = true;
            apiStatus.value = true;
            responseMessage.value = response.message || "Record deleted Successful";
            localStorageSource.savedCompanyAccount(response.data);
        }
    }
    catch (error) {
        console.log('Error occurred:', error.message);
        showApiDialog.value = true;
        apiStatus.value = false;
        responseMessage.value = error.message;
    } finally {
        loading.value = false;
    }
};

watchEffect(() => {
    if (isApiTriggered.value === true) {
        nextTick(() => {
            onMountedHandler();
            isApiTriggered.value = false;
        });
    }
});

const onMountedHandler = async () => {
    selectedIndex.value = 0;
    selectedCardName.value = 'Incoming Transfer'
    phoneNumbers.value = [];
    companyAccount.value = [];

    // localStorageSource.getDashboardData().companyPhoneNumbers.forEach(element => {
    //     phoneNumbers.value.push(element.phoneNumber);
    //     console.log("Phone Number", phoneNumbers.value);
    // });
    localStorageSource.getCompanyPhone().forEach(element => {
        phoneNumbers.value.push(element);
    });

    localStorageSource.getCompanyAccount().forEach(account => {
        companyAccount.value.push(account);
        console.log("Account Number", companyAccount.value);
    });
};

onMounted(() => {
    onMountedHandler();
});

</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');

.back-office-container {
    padding: 10px 15px;
    color: black;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
}

.header-cards {
    width: 100%;
    height: auto;
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
}

.card.header {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    padding: 20px;
    gap: 10px;
    max-width: 300px;
    cursor: pointer;
    transition: border-color 0.3s;
    border: 2px solid transparent;
    flex: 1 1 45%;
}

.card.header.selected {
    border-color: #bd0d3f;
    background: #efd7dd;
}

.header-icon {
    max-width: 40px;
    height: 40px;
    border-radius: 4px;
}

.header-content h2 {
    font-size: 14px;
}

.items-section {
    padding: 20px 0;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
}

.item-list {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    flex-basis: calc(45% - 20px);
    margin: 20px;
}

.items-top {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

#status {
    border-radius: 5px;
    margin-top: 5px;
    padding: 0 10px;
    color: white;
    font-size: 14px;
}

.pending {
    background: #FEA800;
}

.approved {
    background: green;
}

.rejected {
    background: red;
}

#count-section {
    margin-top: 50px;
}

#bold-value {
    font-weight: bold;
}

hr {
    margin-top: 15px;
}

#view {
    color: #A90836;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    text-align: right;
    font-weight: bold;
}

.phone-card-section {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin: 50px 0;
}

.phone-list {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    box-sizing: border-box;
    flex: 1 1 calc(30% - 15px);
}

img {
    margin-bottom: 10px;
    max-width: 50px;
    height: 50px;
    border-radius: 4px;
}

#line {
    border-top: 2px dashed;
    color: #9E9E9E;
    margin-bottom: 10px;
}

.btn-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.btn {
    background-color: #F3B923;
    color: white;
    border: none;
    padding: 10px 30%;
    cursor: pointer;
    margin-top: 30%;
}

.btn:hover {
    background-color: rgb(172, 161, 161);
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
}

.form-header {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.close-btn {
    border: none;
    padding: 5px 10px;
    cursor: pointer;
}

.form {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    margin: 20px 20px 10px;
}

input {
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
    color: black;
    height: 70px;
}

.form-btn {
    background-color: #B6720F;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 10%;
    cursor: pointer;
    margin-top: 30px;
    width: 40%;
    align-self: center;
}

.account-details {
    padding-top: 10px;
    padding-bottom: 10px;
}

.bank-details {
    display: flex;
    justify-content: space-between;
}

#delete {
    color: #A90836;
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
}

.spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Media Queries for Responsiveness */
@media (max-width: 1200px) {
    .card.header {
        flex: 1 1 30%;
        /* Adjust for medium screens */
    }

    .item-list {
        flex-basis: calc(50% - 20px);
        /* Adjust for medium screens */
    }
}

@media (max-width: 768px) {
    .card.header {
        flex: 1 1 100%;
        /* Full width on smaller screens */
    }

    .item-list {
        flex-basis: 100%;
        /* Full width on smaller screens */
    }

    .phone-list {
        flex: 1 1 100%;
        /* Full width for phone lists */
    }

    .btn {
        padding: 10px 20%;
        /* Adjust button padding */
    }
}

@media (max-width: 480px) {
    .header-cards {
        flex-direction: column;
        /* Stack cards vertically on very small screens */
    }

    .btn {
        width: 80%;
        /* Wider buttons on small screens */
    }
}
</style>
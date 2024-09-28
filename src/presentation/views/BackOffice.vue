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
                <h4 id="view" @click="viewRecord(item.status)">View</h4>
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
                <h4 id="view" @click="viewRegistrationRecord(item.status)">View</h4>
            </div>
        </section>

        <!-- Help Section -->
        <section class="phone-card-section" v-if="selectedCardName === 'Help'">
            <div class="phone-list">
                <img src="@/assets/ic_phone.svg" alt="Phone Icon" />
                <h4>Company Phone Number(s)</h4>
                <hr id="line">
                <div v-for="(phone, index) in phoneNumbers" :key="index">
                    <h3>{{ phone }}</h3>
                    <hr id="line">
                </div>
                <div class="btn-container">
                    <button class="btn" @click="addNewNumberClick">Add Another Number</button>
                </div>

                <div v-if="showPhoneForm" class="modal-overlay">
                    <div class="modal">
                        <form @submit.prevent="addNumber">
                            <div class="form-header">
                                <button class="close-btn" @click="showPhoneForm = false">&#x2715;</button>
                            </div>
                            <div class="form">
                                <label for="newPhoneValue">Phone Number</label>
                                <input type="number" id="newPhoneValue" name="newPhoneValue" v-model="newPhoneValue"
                                    required>
                                <button class="form-btn" type="submit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Email Section -->
            <div class="phone-list">
                <img src="@/assets/ic_phone.svg" alt="Email Icon" />
                <h4>Email</h4>
                <ul>
                    <li v-for="(phone, index) in phoneNumbers" :key="index">{{ phone }}</li>
                </ul>
            </div>

            <!-- FAQ Section -->
            <div class="phone-list">
                <img src="@/assets/ic_faq.svg" alt="FAQ Icon" />
                <h4>FAQ</h4>
                <ul>
                    <li v-for="(phone, index) in phoneNumbers" :key="index">{{ phone }}</li>
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
import { addCompanyPhoneUseCase } from '@/domain/useCases/dashboardUseCase';
import Spinner from '../components/Spinner.vue';
import CustomDialog from '../components/CustomDialog.vue';


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
const isPhoneAdded = ref(false);
const phoneNumbers = ref([]);

headerCardContents.value = [
    { icon: ic_people, title: 'Incoming Transfer' },
    { icon: ic_reg, title: 'Registration Request' },
    { icon: ic_bag, title: 'Help' },
];

itemList.value = [
    { heading: 'Pending Request', subheading: 'Incoming request', count: 120, status: 'Pending' },
    { heading: 'Approved Request', subheading: 'Request Approved', count: 20, status: 'Approved' },
    { heading: 'Rejected Request', subheading: 'Request Rejected', count: 12, status: 'Rejected' },
];

transferItems.value = [
    { heading: 'Incoming Notification', subheading: 'Incoming transfer list', count: 120, status: 'Pending' },
    { heading: 'Confirmed Transfer', subheading: 'Approved transfer list', count: 120, status: 'Approved' }
];

const viewRecord = (item) => {
    toast.success('Viewing details for: ' + item);
    router.push({ name: 'Registration', query: { selectedCard: item } });
};

const viewRegistrationRecord = (item) => {
    toast.success('Viewing details for: ' + item);
    router.push({ name: 'Transfer', query: { selectedCard: item } });
};

const addNewNumberClick = () => {
    showPhoneForm.value = true;
};

const addNumber = async () => {
    showPhoneForm.value = false
    loading.value = true;
    try {
        const phoneNumber = ref([]);
        // phoneNumber.value[0] = newPhoneValue.value.toString();

        phoneNumber.value.push(newPhoneValue.value);

        console.log("Request value for phone number", phoneNumber.value);

        const response = addCompanyPhoneUseCase(phoneNumber.value)
        console.log("Company add phone response", response)

        newPhoneValue.value = '';
        toast.success(response.message);

        if (response.success) {

            isPhoneAdded.value = true;
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
};

const selectCard = (index, content) => {
    selectedIndex.value = index;
    selectedCardName.value = content;
};


watchEffect(() => {
    if (isPhoneAdded.value === true) {
        nextTick(() => {
            onMountedHandler();
            isPhoneAdded.value = false;
        });
    }
});

const onMountedHandler = async () => {
    selectedIndex.value = 0;
    selectedCardName.value = 'Incoming Transfer'
    console.log('Local storage', localStorageSource.getDashboardData());


    // const phoneNumbersString = '123456789;987654321;123123123; 123456789; 987654321; 123123123';
    // const sHolder = phoneNumbersString.split(';').map(phone => phone.trim());
    // phoneNumbers.value.push(...sHolder);

    console.log('Local storage test', phoneNumbers.value);

    const holder = localStorageSource.getDashboardData().companyPhoneNumbers.split(';').map(phone => phone.trim()) || '';
    phoneNumbers.value.push(...holder);
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
    /* Flex item for responsiveness */
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
    background-color: rgb(164, 8, 8);
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
    /* Adjust for responsiveness */
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
    /* Flex item for responsiveness */
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
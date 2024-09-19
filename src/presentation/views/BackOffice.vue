<template>
    <div class="back-office-container">

        <section class="header-cards">
            <div class="card header" v-for="(content, index) in headerCardContents" :key="index"
                :class="{ selected: selectedIndex === index }" @click="selectCard(index, content.title)">

                <img :src="content.icon" alt="icon" class="header-icon" />
                <div class="header-content">
                    <h2>{{ content.title }}</h2>
                </div>

            </div>
        </section>

        <section class="items-section" v-if="selectedCardName === 'Registration Request'">
            <div class="item-list" v-for="(item, index) in itemList" :key="index">
                <div class="items-top">
                    <h3 id="bold-value">{{ item.heading }}</h3>
                    <h3 :class="{'approved': item.status === 'Approved', 'pending': item.status === 'Pending'}" id="status">
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


        <section class="items-section" v-if="selectedCardName === 'Incoming Transfer'">

            <div class="item-list" v-for="(item, index) in transferItems" :key="index">
                <div class="items-top">
                    <h3 id="bold-value">{{ item.heading }}</h3>
                    <h3 :class="{'approved': item.status === 'Approved', 'pending': item.status === 'Pending','rejected': item.status === 'Rejected'}" id="status">
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


    </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import ic_reg from '@/assets/ic_registration.svg';
import ic_people from '@/assets/ic_people.svg';
import ic_bag from '@/assets/ic_bag.svg';


const router = useRouter(); 
const toast = useToast();
const loading = ref(false);
const headerCardContents = ref([]);
const itemList = ref([]);
const selectedIndex = ref(null);
const selectedCardName = ref('');
const transferItems = ref([]);


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

  //router.push({ name: 'Registration' });
  router.push({ name: 'Registration', query: { selectedCard: item } });
};

const viewRegistrationRecord = (item) => {
  toast.success('Viewing details for: ' + item);

  //router.push({ name: 'Registration' });
  router.push({ name: 'Transfer', query: { selectedCard: item } });
};

const selectCard = (index, content) => {
    selectedIndex.value = index;
    selectedCardName.value = content;
};

onMounted(() => {
    selectedIndex.value = 0;
    selectedCardName.value = 'Incoming Transfer'
});

</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');

.back-office-container {
    padding-bottom: 10px;
    padding-right: 15px;
    color: black;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
}

.header-cards {
    width: 100%;
    height: 90px;
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    flex-direction: column;
}

.card.header:hover{
    background: #F3B923;
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
    display: flex;
    flex-direction: column;
    font-size: 14px;
}

.items-section {
    padding-top: 20px;
    padding-bottom: 20px;
    background-color: rgb(164, 8, 8);
    flex-wrap: wrap;
    gap: 20px;
    display: flex;
    justify-content: space-between;
}

.item-list {
    background-color: #f9f9f9;
    padding: 15px;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 8px;
    flex-basis: 40%;
    
}

.items-top{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

#status{
    border-radius: 5px;
    margin-top: 5px;
    padding-left: 10px;
    padding-right: 10px;
    color: white;
    font-size: 14px;
}

.pending{
    background: #FEA800;
}

.approved {
    background: green;
}

.rejected {
    background: red;
}

#count-section{
    margin-top: 50px;
}

#bold-value {
    font-weight: bold;
}

hr{
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

/* Spinner Styling */
.spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
<template>
  <!-- <div class="app-container"> -->
  <div
    :class="isLoginRoute || isRegistrationRoute || isTransferRoute || isTransferDetailsRoute ? 'app-container-white' : 'app-container'">
    <!-- Sidebar Section -->
    <aside v-if="!isLoginRoute && !isRegistrationRoute && !isTransferRoute && !isTransferDetailsRoute" class="sidebar">

      <div class="logo-container">
        <img alt="App Logo" class="logo" src="@/assets/logo.svg" width="100" height="100" />
        <h4>
          <span class="grey-text">Ice </span>
          <span class="golden-text">Care </span>
          <span class="grey-text">Nig </span>
          <span class="golden-text">Ltd</span>
        </h4>
      </div>

      <nav class="nav-links">
        <RouterLink to="/dashboard" exact-active-class="active-link">
          <img class="nav-icon" src="@/assets/ic_dashboard.svg" alt="Dashboard Icon" />
          Dashboard
        </RouterLink>
        <RouterLink to="/supplier" exact-active-class="active-link">
          <img class="nav-icon" src="@/assets/ic_supplier.svg" alt="Supplier Icon" />
          Supplier
        </RouterLink>
        <RouterLink to="/customer" exact-active-class="active-link">
          <img class="nav-icon" src="@/assets/ic_customers.svg" alt="Customer Icon" />
          Customer
        </RouterLink>
        <RouterLink to="/payment" exact-active-class="active-link">
          <img class="nav-icon" src="@/assets/ic_transactions.svg" alt="Transactions Icon" />
          Payment
        </RouterLink>
        <RouterLink to="/bank" exact-active-class="active-link">
          <img class="nav-icon" src="@/assets/ic_bank.svg" alt="Bank Icon" />
          Bank
        </RouterLink>
        <RouterLink to="/back-office" exact-active-class="active-link">
          <img class="nav-icon" src="@/assets/ic_back_office.svg" alt="Back Office Icon" />
          Back Office
        </RouterLink>
        <RouterLink v-if="showAdminPanel" to="/admin-panel" exact-active-class="active-link">
          <img class="nav-icon" src="@/assets/ic_admin_panel.svg" alt="Admin Panel Icon" />
          Admin Panel
        </RouterLink>
      </nav>

      <div class="logout" @click="logout">
        <img class="nav-icon" src="@/assets/ic_logout.svg" alt="Logout Icon" />
        <h4> Logout </h4>
      </div>

    </aside>


    <!-- Greeting and Header Section (outside sidebar, but hidden on login route) -->
    <div class="content-container">
      <header v-if="!isLoginRoute && !isRegistrationRoute && !isTransferRoute && !isTransferDetailsRoute"
        class="header">
        <div class="greeting">
          <span>Hi, {{ adminName }}</span>
        </div>
        <div class="actions">
          <img src="@/assets/ic_account.svg">
          <span class="dropdown-icon" @click="showDropdown = !showDropdown;">&#9662;</span>
          <ul v-if="showDropdown" class="dropdown-options">
            <li>
              <a @click="logout">Logout</a>
            </li>
          </ul>
        </div>
      </header>

      <!-- Main Content -->
      <div v-if="isLoginRoute" class="logo-only">
        <img alt="App Logo" class="logo" src="@/assets/logo.svg" width="100" height="100" />
        <h4>
          <span class="grey-text">Ice </span>
          <span class="golden-text">Care </span>
          <span class="grey-text">Nig </span>
          <span class="golden-text">Ltd</span>
        </h4>
      </div>
      <main :class="{
        'main-content': !isLoginRoute && !isRegistrationRoute && !isTransferRoute && !isTransferDetailsRoute,
        'login-content': isLoginRoute,
        'registration-content': isRegistrationRoute || isTransferRoute || isTransferDetailsRoute
      }">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script>

import { computed, ref, onMounted, onBeforeUnmount, watchEffect, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { storesManager } from '@/presentation/store/userStore';
import { localStorageSource } from '@/data/sources/localStorage';
import { useUserStore } from '@/presentation/store/userStore';
import { startSessionTimer, stopSessionTimer } from '@/core/utils/sessionManager';


export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const adminStore = storesManager();
    const showDropdown = ref(false);
    const userStore = useUserStore();

    const isLoginRoute = computed(() => route.path === '/login');
    const isRegistrationRoute = computed(() => route.path === '/registration');
    const isTransferRoute = computed(() => route.path === '/transfer')
    const isTransferDetailsRoute = computed(() => route.path === '/transfer-details');

    console.log('app.vuestored admin name:', adminStore?.name);
    console.log('local storage admin name:', localStorageSource.getDashboardData()?.adminName);


    const logout = () => {
      userStore.logout();
      showDropdown.value = false;
      router.go();
    };

    const onMountedHandler = async () => {
      startSessionTimer();
    };

    watchEffect(() => {
      nextTick(() => {
      onMountedHandler();
    });
    });

    onMounted(() => {
      onMountedHandler();
    });

    onBeforeUnmount(() => {
      stopSessionTimer();
    });


    return {
      isLoginRoute,
      isRegistrationRoute,
      isTransferRoute,
      isTransferDetailsRoute,
      adminName: computed(() => localStorageSource.getDashboardData()?.adminName ?? adminStore.name),
      showDropdown,
      showAdminPanel: computed(() => localStorageSource.getUserData().showAdminPanel),
      logout,
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;700&display=swap');

body {
  margin: 0;
  overflow: hidden;
}

.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  font-family: 'Inter', sans-serif;
  background-color: #E9E5E5;
}

.app-container-white {
  display: flex;
  height: 100vh;
  width: 100vw;
  font-family: 'Inter', sans-serif;
  background-color: white;
}

.sidebar {
  width: 250px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

.logo-container {
  margin-bottom: 20px;
  text-align: center;
  background: white;
}

.nav-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background: white;
}

.nav-links a {
  color: black;
  text-decoration: none;
  padding: 15px;
  width: 100%;
  display: flex;
  align-items: center;
}

.nav-links a:hover {
  background-color: #aea9a9;
}

.nav-links a.active-link {
  background-color: #F3B923;
  color: white;
}

.nav-icon {
  width: 50px;
  height: 24px;
}

.content-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  /* Adds space for the sidebar */
  overflow: hidden;
}

.main-content {
  flex-grow: 1;
  /* padding: 20px; */
  padding-top: 15px;
  padding-right: 15px;
  overflow-y: auto;
}

.login-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.registration-content {
  flex-grow: 1;
  width: 70%;
  /* Set width to 50% of the screen */
  margin: 0 auto;
  /* Center the content horizontally */
  overflow-y: hidden;
  text-align: center;
  display: flex;
  /* Enable flexbox */
  justify-content: center;
  /* Center horizontally */
  align-items: center;
  /* Center vertically */
}

.logo-only {
  position: absolute;
  top: 20px;
  left: 10%;
  text-align: center;
}

h4 {
  text-align: center;
  font-size: 20px;
}

.grey-text {
  color: #837D7D;
  font-family: 'Rubik', sans-serif;
  font-weight: 300;
}

.golden-text {
  color: #F3B923;
  font-family: 'Rubik', sans-serif;
  font-weight: 300;
}

header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ccc;
  background-color: white;
}

.greeting {
  font-size: 18px;
  font-weight: bold;
  color: black;
}

.actions {
  display: flex;
  gap: 10px;
}

.dropdown-icon {
  font-size: 16px;
  color: black;
  cursor: pointer;
}

.dropdown-options {
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
}

.dropdown-options li {
  padding: 10px;
  /* Add padding to items */
}

.dropdown-options li a {
  text-decoration: none;
  /* Remove underline */
  color: black;
  /* Set text color */
  display: block;
  /* Make the whole area clickable */
}

.dropdown-options li a:hover {
  background-color: #f0f0f0;
  /* Highlight on hover */
}

.logout {
  display: flex;
  justify-content: center;
  color: #6C6C6C;
  margin-bottom: 20%;
  cursor: pointer;
}

.logout:hover {
  color: #fa6e6e
}

.logout h4 {
  font-size: 15px;
  font-family: 'Inter', sans-serif;
}
</style>

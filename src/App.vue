<template>
  <!-- <div class="app-container"> -->
  <div :class="isLoginRoute || isRegistrationRoute || isTransferRoute || isTransferDetailsRoute ? 'app-container-white' : 'app-container'">
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
        <RouterLink to="/admin-panel" exact-active-class="active-link">
          <img class="nav-icon" src="@/assets/ic_admin_panel.svg" alt="Admin Panel Icon" />
          Admin Panel
        </RouterLink>
      </nav>
    </aside>


    <!-- Greeting and Header Section (outside sidebar, but hidden on login route) -->
    <div class="content-container">
      <header v-if="!isLoginRoute && !isRegistrationRoute && !isTransferRoute && !isTransferDetailsRoute" class="header">
        <div class="greeting">
          <span>Hi, {{ adminName }}</span>
        </div>
        <div class="actions">
          <button class="dropdown">Dropdown</button>
          <button class="icon">Icon</button>
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
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { storesManager } from '@/presentation/store/userStore';
import { localStorageSource } from '@/data/sources/localStorage';


export default {
  setup() {
    const route = useRoute();
    const adminStore = storesManager();

    console.log('app.vuestored admin name:', adminStore.name);

    const isLoginRoute = computed(() => route.path === '/login');
    const isRegistrationRoute = computed(() => route.path === '/registration');
    const isTransferRoute = computed(() => route.path === '/transfer')
    const isTransferDetailsRoute = computed(() => route.path === '/transfer-details');

    return {
      isLoginRoute,
      isRegistrationRoute,
      isTransferRoute,
      isTransferDetailsRoute,
      adminName: computed(() => localStorageSource.getAdminName() ?? adminStore.name)
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;700&display=swap');

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
  width: 70%;             /* Set width to 50% of the screen */
  margin: 0 auto;          /* Center the content horizontally */
  overflow-y: hidden;
  text-align: center;
  display: flex;           /* Enable flexbox */
  justify-content: center; /* Center horizontally */
  align-items: center;     /* Center vertically */
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

.dropdown,
.icon {
  padding: 8px 16px;
  background-color: #42A5F5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}



</style>

export const localStorageSource = {
    saveUserData(userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    },
    getUserData() {
      return JSON.parse(localStorage.getItem('user'));
    },
    clearUserData() {
      localStorage.removeItem('user');
    },

    savedDashboardData(dashboardResponse) {
      localStorage.setItem('dashboardData', JSON.stringify(dashboardResponse));
    },
    getDashboardData() {
      return JSON.parse(localStorage.getItem('dashboardData'));
    },
    clearDashboardData() {
      localStorage.removeItem('dashboardData');
    },

    savedCompanyAccount(accountDetails) {
      localStorage.setItem('accountData', JSON.stringify(accountDetails));
    },
    getCompanyAccount() {
      return JSON.parse(localStorage.getItem('accountData'));
    },
    clearComapanyAccountData() {
      localStorage.removeItem('accountData');
    },
  };
  
  
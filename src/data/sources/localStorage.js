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

    savedAdminName(adminName){
      localStorage.setItem('admin', JSON.stringify(adminName));
    },
    getAdminName(){
      return JSON.parse(localStorage.getItem('admin'));
    },
    clearAdminName(){
      localStorage.removeItem('admin');
    },

    savedDollarRate(dollarRate){
      localStorage.setItem('dollar', JSON.stringify(dollarRate));
    },
    getDollarRate(){
      return JSON.parse(localStorage.getItem('dollar'));
    },
    clearDollarRate(){
      localStorage.removeItem('dollar');
    },

    savedAvailableDollar(availableDollar){
      localStorage.setItem('availableDollar', JSON.stringify(availableDollar));
    },
    getAvailableDollar(){
      return JSON.parse(localStorage.getItem('availableDollar'));
    },
    clearAvailableDollar(){
      localStorage.removeItem('availableDollar');
    },
  };
  
  
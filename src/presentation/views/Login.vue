<template>
  <div>
    <div class="title_texts">
      <h2><b>Ice Care Nig Ltd Support Tool</b></h2>
      <h5 class="light_subhead">Provide your details below to continue</h5>
    </div>

    <div class="login">
      <form @submit.prevent="handleLogin">
        <div class="login-frame">
          <h5>Email Address</h5>
          <input type="email" v-model="email" placeholder="hello@email.com" required />
          &nbsp;
          <h5>Password</h5>
          <input type="password" v-model="password" placeholder="Enter password" required />
        </div>

        <!-- Button disabled when logging in -->
        <button type="submit" :disabled="loggingIn">
          {{ loggingIn ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <!-- Display the error message if present -->
      <!-- <ErrorDialog v-if="error" :error="error" @close="clearError" /> -->
    </div>

    <Spinner :loading="loggingIn" />


    <CustomDialog v-if="error" :message="error" :show="error" @confirm="clearError"
      :success="apiStatus" />

  </div>
</template>

<script>
import { nextTick } from 'vue';
import { useUserStore } from '../store/userStore';
import ErrorDialog from '../components/ErrorDialog.vue';
import Spinner from '../components/Spinner.vue';
import CustomDialog from '../components/CustomDialog.vue';

export default {
  components: { ErrorDialog, Spinner, CustomDialog },
  data() {
    return {
      email: '',
      password: '',
      loggingIn: false
    };
  },
  computed: {
    error() {
      return this.userStore.error;
    },
  },
  methods: {
    async handleLogin() {
      this.loggingIn = true;
      try {
        await this.userStore.login(this.email, this.password);
        //console.log('Stored token:', localStorage.getItem('authToken'));
        if (this.userStore.user) {
          await nextTick();
          this.$router.push({ name: 'Dashboard' });
        } 
        else {
          console.error('User is not defined.');
        }
      } 
      catch (error) {
        console.error('Logging failed:', error.message);
      } 
      finally {
        this.loggingIn = false;
      }
    },
    clearError() {
      this.userStore.clearError();
    },
  },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

.title_texts {
  text-align: center;
  margin: 20px 0;
}

.login {
  max-width: 800px;
  margin: 0 auto;
  padding: 0px;
  position: relative;
  top: 20px;
}

.login label {
  display: block;
  margin-bottom: 5px;
}

.login input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.login button {
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  background-color: #F3B923;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.login-frame {
  width: 100%;
  border-radius: 4px;
  padding: 20px;
  background-color: #6464640f;
}

h2 {
  color: black;
  font-weight: bold;
  font-family: 'Inter', sans-serif;
}

h5 {
  color: black;
  font-family: 'Inter', sans-serif;
}

.light_subhead {
  font-weight: 300;
}
</style>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">MinhaApp</router-link>

      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item" v-if="isAuthenticated">
            <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/register">Registo</router-link>
          </li>
        </ul>

        <div class="d-flex" v-if="isAuthenticated">
          <button class="btn btn-outline-light" @click="logout">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from 'axios';
export default {
  name: 'AppHeader',
  data() {
    return {
      isAuthenticated: false
    };
  },
  created() {
    this.checkAuth();
  },
  watch: {
    // revalida sempre que muda de página
    $route() {
      this.checkAuth();
    }
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem('token');
      this.isAuthenticated = !!token;
    },
    logout() {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      this.isAuthenticated = false;
      this.$router.push('/login');
    }
  }
};
</script>

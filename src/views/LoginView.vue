<template>
  <div class="container mt-5">
    <h2 class="mb-4">Iniciar Sessão</h2>

    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="username" class="form-label">Nome de Utilizador</label>
        <input
          v-model="username"
          type="text"
          class="form-control"
          id="username"
          placeholder="Introduza o nome"
          required
        />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Palavra-passe</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          id="password"
          placeholder="Introduza a palavra-passe"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary">Entrar</button>
    </form>

    <div v-if="message" class="alert mt-3" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      message: '',
      messageType: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('/user/login',null,{params:  {
          username: this.username,
          password: this.password
        }});

        const token = response.data.token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

        this.message = 'Login efetuado com sucesso!';
        this.messageType = 'alert-success';

        // Redireciona para rota protegida, como /dashboard
        this.$router.push('/dashboard');
      } catch (error) {
        this.message = error.response?.data?.error || 'Erro ao iniciar sessão.';
        this.messageType = 'alert-danger';
      }
    }
  }
};
</script>

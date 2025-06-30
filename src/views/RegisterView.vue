<template>
  <div class="container mt-5">
    <h2 class="mb-4">Criar Conta</h2>
    <form @submit.prevent="handleRegister">
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

      <button type="submit" class="btn btn-primary">Registar</button>
    </form>

    <div v-if="message" class="alert mt-3" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegisterView',
  data() {
    return {
      username: '',
      password: '',
      message: '',
      messageType: ''
    };
  },
  methods: {
    async handleRegister() {
      try {
        const response = await axios.post('/user/register',null, {
          params: {
            username: this.username,
            password: this.password
          }
        });

        this.message = response.data.message || 'Registo feito com sucesso!';
        this.messageType = 'alert-success';
        this.username = '';
        this.password = '';
      } catch (error) {
        this.message = error.response?.data?.error || 'Erro ao registar.';
        this.messageType = 'alert-danger';
      }
    }
  }
};
</script>

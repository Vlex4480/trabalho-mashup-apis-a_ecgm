<template>
  <div class="container mt-5">
    <div class="p-5 mb-4 bg-light rounded-3">
      <div class="container-fluid py-5">
        <h1 class="display-5 fw-bold">Bem-vindo à MinhaApp</h1>
        <p class="col-md-8 fs-4">
          Esta é uma aplicação de autenticação com Vue 3 + Express + MongoDB.
          Regista-te para começar a usar!
        </p>
        <router-link to="/register" class="btn btn-primary btn-lg me-2">
          Criar Conta
        </router-link>
        <router-link to="/login" class="btn btn-outline-secondary btn-lg">
          Iniciar Sessão
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
};
</script>

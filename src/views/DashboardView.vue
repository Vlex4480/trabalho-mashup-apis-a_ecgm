<template>
  <div class="container mt-5">
    <h2 class="mb-4">Dashboard</h2>

    <!-- Random User Search -->
    <form @submit.prevent="fetchRandomUser" class="mb-4">
      <div class="row g-2 align-items-end">
        <div class="col-md-4">
          <label class="form-label">Género</label>
          <select v-model="gender" class="form-select">
            <option value="">Todos</option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Nacionalidade (código ISO)</label>
          <input v-model="nat" type="text" class="form-control" placeholder="ex: US, FR, BR" />
        </div>
        <div class="col-md-4">
          <button class="btn btn-primary w-100" type="submit">Buscar Utilizador Aleatório</button>
        </div>
      </div>
    </form>

    <!-- Country Search -->
    <form @submit.prevent="searchCountry" class="mb-4">
      <div class="input-group">
        <input
          v-model="countryQuery"
          type="text"
          class="form-control"
          placeholder="Pesquisar País"
          required
        />
        <button class="btn btn-success" type="submit">Pesquisar País</button>
      </div>
      <div v-if="countryResult" class="mt-3 alert alert-secondary">
        {{ countryResult.name.common }} - Capital: {{ countryResult.capital?.[0] }},
        População: {{ countryResult.population }}
      </div>
    </form>

        <!-- Result -->
    <div v-if="randomUser" class="card mt-4 mtb-4 d-flex justify-content-center" style="max-width: 500px;">
      <img :src="randomUser.picture.large" class="card-img-top" :alt="randomUser.name.first" />
      <div class="card-body">
        <h5 class="card-title">
          {{ randomUser.name.title }} {{ randomUser.name.first }} {{ randomUser.name.last }}
        </h5>
        <p class="card-text">
          📧 {{ randomUser.email }} <br />
          📞 {{ randomUser.phone }} <br />
          🌍 {{ randomUser.location.country }}
        </p>
      </div>
    </div>

    <!-- Search History -->
    <h4>Histórico de Pesquisas</h4>
    <table class="table table-striped mt-3">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Consulta</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in searchHistory" :key="item._id">
          <td>{{ item.type }}</td>
          <td>{{ item.query }}</td>
          <td>{{ new Date(item.timestamp).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DashboardView',
  data() {
    return {
      movieQuery: '',
      movieResult: null,
      countryQuery: '',
      countryResult: null,
      searchHistory: []
    };
  },
  methods: {
    async fetchRandomUser() {
      try {
        const params = {};
        if (this.gender) params.gender = this.gender;
        if (this.nat) params.nat = this.nat;

        const res = await axios.get('https://randomuser.me/api/', { params });
        this.randomUser = res.data.results[0];

        const querySummary = `gender=${this.gender || 'any'} nat=${this.nat || 'any'}`;
        await this.saveSearch('randomuser', querySummary);
      } catch (err) {
        alert('Erro ao buscar utilizador aleatório.');
        console.error(err);
      }
    },

    async searchCountry() {
      try {
        const res = await axios.get(
          `https://restcountries.com/v3.1/name/${this.countryQuery}`
        );
        this.countryResult = res.data[0];
        this.saveSearch('country', this.countryQuery);
      } catch (error) {
        alert('Erro ao pesquisar país.');
      }
    },

    async saveSearch(type, query) {
      try {
        await axios.post('/searches', { type, query });
        this.getSearchHistory();
      } catch (error) {
        console.error('Erro ao salvar pesquisa:', error);
      }
    },

    async getSearchHistory() {
      try {
        const res = await axios.get('/searches');
        this.searchHistory = res.data;
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      }
    }
  },
  mounted() {
    this.getSearchHistory();
  }
};
</script>

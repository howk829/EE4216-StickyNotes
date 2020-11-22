<template>
  <div class="container col-12 col-md-6 my-3">
    <b-card class="mt-3" header="Login" variant="primary">
      <b-form>
        <b-form-input required v-model="username" placeholder="Username"></b-form-input>

        <b-form-input
          v-model="password"
          class="mt-2"
          type="password"
          required
          placeholder="Password"
        ></b-form-input>

        <b-button type="submit" class="mt-3" variant="primary">Login</b-button>

        <b-row class="mt-3">
          <b-col cols="12" class="text-right">
            <b-link :to="{ name: 'register' }">Create new account</b-link>
          </b-col>
        </b-row>
      </b-form>
    </b-card>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    form: {
      username: null,
      password: null,
      errors: [],
      show: true
    }
  }),
  methods: {
    async onSubmit() {
      const user = {
        username: this.form.username,
        password: this.form.password
      };
      this.form.errors = [];
      await axios
        .post("http://54.161.118.5:8080/api/login/", user)
        .then(res => {
          const { user } = res;
          if (user) {
            this.$router.push("/");
          }
        })
        .catch(err => {
          if (err.code && err.code == 400) {
            this.form.errors.push(err.message);
            return;
          }
        });
    }
  }
};
</script>
<style></style>

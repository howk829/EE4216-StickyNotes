<template>
  <div class="container col-12 col-md-6 my-3">
    <b-card class="mt-3" header="Register" variant="primary">
      <b-form @submit.stop.prevent="onSubmit">
        <b-form-input
          v-model="form.username"
          required
          placeholder="Username"
        ></b-form-input>

        <b-form-input
          v-model="form.password"
          class="mt-2"
          type="password"
          required
          placeholder="Password"
        ></b-form-input>

        <b-form-input
          v-model="form.confirmPassword"
          class="mt-2"
          type="password"
          required
          placeholder="Confirm Password"
        ></b-form-input>

        <b-form-invalid-feedback :state="form.errors.length == 0">
          <ul class="form-errors">
            <li v-for="(error, index) in form.errors" :key="index">
              {{ error }}
            </li>
          </ul>
        </b-form-invalid-feedback>

        <b-button
          pill
          style="background-color: #f1b200"
          type="submit"
          class="mt-3"
          variant="primary"
          >Register</b-button
        >
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
      name: null,
      password: null,
      confirmPassword: null,
      errors: [],
      show: true
    }
  }),
  methods: {
    isValidForm() {
      this.form.errors = [];
      if (this.form.password != this.form.confirmPassword) {
        this.form.errors.push("confirm password must equal to password");
        return false;
      }
      return true;
    },
    async onSubmit() {
      if (!this.isValidForm()) {
        return;
      }
      const user = {
        username: this.form.username,
        password: this.form.password
      };
      this.form.errors = [];
      await axios
        .post("http://54.161.118.5:8080/api/register/", user)
        .then(data => {
          const { user } = data;
          if (user) {
            this.$router.push("/login");
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

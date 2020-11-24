<template>
  <div class="container col-12 col-md-6 my-3">
    <b-card class="mt-3" header="Login" variant="primary">
      <b-form>
        <b-form-input
          required
          v-model="form.username"
          placeholder="Username"
        ></b-form-input>

        <b-form-input
          v-model="form.password"
          class="mt-2"
          type="password"
          required
          placeholder="Password"
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
          @click="onSubmit"
          class="mt-3"
          variant="primary"
          >Login</b-button
        >

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
import store from "../store";

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
          console.log(res);
          const { userID } = res.data;
          if (res) {
            store.dispatch("LOGIN", { userID });
            console.log(this.$store.state.userID);

            this.$router.push("/");
          }
        })
        .catch(err => {
          if (err) {
            this.form.errors.push("Wrong username or password");
            return;
          }
        });
    }
  }
};
</script>
<style></style>

<template>
  <header class="sticky-top">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand @click="$router.push('/')" href="#"
        >Sticky Notes</b-navbar-brand
      >

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse class="float: left" id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav align="left" class="ml-auto">
          <b-nav-item>
            Sign Out
          </b-nav-item>
          <b-nav-item-dropdown right v-if="this.$store.state.user">
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              User
            </template>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<style>
.navbar-toggle.navbar-left {
  float: left;
  margin-left: 10px;
}
</style>

<template>
<section>
	<div class="component-padding tabs">
		<button @click="activeTab='users'" :disabled="activeTab == 'users'">Users</button>
		<button @click="activeTab='visitors'" :disabled="activeTab == 'visitors'">Visitors</button>
		<button @click="activeTab='visitorsCreate'" :disabled="activeTab == 'visitorsCreate'">Create Visitors</button>
	</div>
	<users-listings v-if="activeTab == 'users'"></users-listings>
	<visitors-create v-if="activeTab == 'visitorsCreate'"></visitors-create>
	<visitors-listings v-if="activeTab == 'visitors'"></visitors-listings>
</section>
</template>

<script>
import UsersListings from '@/components/users-listings.vue'
import VisitorsCreate from '@/components/visitors-create.vue'
import VisitorsListings from '@/components/visitors-listings.vue'

export default {
	name: 'adminUsers',
	components: {
    UsersListings,
    VisitorsCreate,
    VisitorsListings
	},
	data: function() {
		return {
      activeTab: 'users'
		}
	},
	computed: {
		hasToken() {
			return this.$store.state.auth.hasToken;
		}
	},
	watch: {
		hasToken: function() {
			this.handleAccess();
		}
	},
	created: function() {
		this.handleAccess();
	},
	methods: {
		handleAccess: function() {
			if (!this.$store.getters.authToken) {
				this.redirectToLogin();
				return;
			}
		},
		redirectToLogin: function() {
			this.$router.push({ path: 'Login'})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
<template>
<section>
	<site-users-listings></site-users-listings>
</section>
</template>

<script>
import SiteUsersListings from '@/components/site-users-listings.vue'

export default {
	name: 'siteUsers',
	components: {
    SiteUsersListings
	},
	data: function() {
		return {}
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
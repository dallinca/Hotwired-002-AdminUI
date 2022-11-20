<template>
<section>
	<div class="profile component-padding">
		<div v-if="!hasToken">
			<h1>Please Login</h1>
		</div>
		<div v-if="hasToken">
			<h1>Welcome {{ userName }}!</h1>

			<span>Email:</span><span>{{ userEmail }}</span>
		</div>
	</div>
</section>
</template>

<script>
import { ALERT_WARN, ALERT_ERROR } from '@/action-types'

export default {
	name: 'v-profile',
	data: function() {
		return {
			// data
			userName: "",
			userEmail: "",

			// Mobile tapping data
			siteNavTapped: false,
			userNavTapped: false,
			lastTapped: null,
			onlyOneActiveTap: true
		}
	},
	computed: {
		hasToken() {
			return this.$store.state.auth.hasToken;
		},
    token() {
      return this.$store.getters.authToken;
    }
	},
	watch: {
		hasToken: function() {
			this.updateUserInfo();
		}
	},
	created: function() {
		this.updateUserInfo();
	},
	methods: {
		updateUserInfo: function() {
      this.handleAccess();
      this.$store.state.auth.hasToken;

			// If token exists attempt to get user information
			var vueContext = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
        if (this.readyState == 0) { // request not initialized
        } else if (this.readyState == 1) { // server connection established
        } else if (this.readyState == 2) { // request received
        } else if (this.readyState == 3) { // processing request
        } else if (this.readyState == 4) { //request finished and response is ready
					var responseObj = JSON.parse(this.responseText);
          if (!this.responseText || !responseObj) {
						vueContext.$store.dispatch(ALERT_ERROR, { message: 'Error - Please contact your system administrator' })
            return
          }

          if (this.status != 200) {
						vueContext.$store.dispatch(ALERT_WARN, { message: responseObj.message })
            return
          }

          if (this.status == 200) {
						vueContext.userName = responseObj.data.user.name;
						vueContext.userEmail = responseObj.data.user.email;
					}
				}
			};
			xhttp.open("GET", "/api/v1/admin/user/me", true);
			xhttp.setRequestHeader('x-access-token', this.token);
			xhttp.send();
		},
    handleAccess: function() {
			if (this.token) return

      this.clearUserInfo();
      this.redirectToLogin();
      this.$store.dispatch(ALERT_WARN, { 'message': 'You must login before accessing this page' })
    },
		redirectToLogin: function() {
			this.$router.push({ path: 'Login'})
		},
		clearUserInfo: function() {
			this.userName = '';
			this.userEmail = '';
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
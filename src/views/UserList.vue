<template>
<section>
	<div class="userList component-padding">
		<div v-if="!hasToken">
			<h1>Please Login</h1>
		</div>
		<div v-if="hasToken">
			<h1>User Listings</h1>

		</div>
	</div>
</section>
</template>

<script>
export default {
	name: 'userList',
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
			// Check if a token exists
			var token = this.$store.getters.authToken;
			if (!token) {
				this.userName = '';
				this.userEmail = '';
				this.redirectToLogin();
				return;
			}

			// If token exists attempt to get user information
			var vueContext = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
					var responseObj = JSON.parse(this.responseText);

					if (false == responseObj.auth) {
						alert("Not authorized to view this page");
					}

					if (this.status == 200 && true == responseObj.auth) {
						vueContext.userName = responseObj.user.name;
						vueContext.userEmail = responseObj.user.email;
					} else {
						alert("Error: " + this.responseText);
					}

					console.log(responseObj);
				}
			};
			xhttp.open("GET", "/api/v1/admin/auth/me", true);
			xhttp.setRequestHeader('x-access-token', token);
			xhttp.send();
		},
		redirectToLogin: function() {
			this.$router.push({ path: 'Login'})
		},
		getUserInfo: function(/*target, tapGroup*/) {

		},
		clearUserInfo: function() {

		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
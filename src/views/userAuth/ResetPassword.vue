<template>
<section class="component-padding">
<div class="form">
    <h1 class="form__title">Reset Password</h1>
    <div class="form__field">
        <label>Email</label>
        <input type="text" v-model="email" placeholder="example@email.com">
    </div>
	<div class="form__field--two">
		<input class="form__actions__submit" type="button" value="Send Code" v-on:click="sendEmailVerificationCode">
		<input class="form__actions__submit" type="button" value="I have my Code" v-if="!showFullForm" v-on:click="hasCode">
		<input class="" type="text" v-model="emailVerificationCode" placeholder="000000" v-if="showFullForm">
	</div>
    <div class="form__field" v-if="showFullForm">
        <label>New Password</label>
        <input v-bind:type="passwordFieldType" v-model="password" placeholder="super secret password" >
    </div>
    <div class="form__field form__field--checkbox" v-if="showFullForm">
        <input type="checkbox" v-model="showPassword">
        <label for="checkbox">Show Password</label>
    </div>
    <div class="form__field--two" v-if="showFullForm">
        <input class="form__actions__submit" type="button" value="Reset Password" v-on:click="submit">
        <input class="form__actions__cancel" type="button" value="Cancel" v-on:click="cancel">
    </div>
    <div class="form__messages" v-if="messages.length">
        <div v-for="message in messages" v-bind:key="message"
            class="form__messages__message"
            v-bind:class="{
                form__messages__error: message.type == 'error',
                form__messages__success: message.type == 'success',
                form__messages__warn: message.type == 'warn' }"
        >
            <span>{{ message.message }}</span>
        </div>
    </div>
</div>
</section>
</template>

<script>
//import { UPDATE_AUTH_TOKEN, CLEAR_AUTH_TOKEN } from '@/action-types'

export default {
    name: 'resetPassword',
    data: function() {
        return {
			email: '',
			emailVerificationCode: '',
			showFullForm: false,
			password: '',
			showPassword: false,
			messages: []
        }
	},
	computed: {
		passwordFieldType: function() {
			if (this.showPassword) {
				return 'text';
			} else {
				return 'password';
			}
		},
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
			/*var vueContext = this;
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
			xhttp.open("GET", "/api/v1/site/auth/me", true);
			xhttp.setRequestHeader('x-access-token', token);
			xhttp.send();*/
		},
		redirectToLogin: function() {
			this.$router.push({ path: 'ForgotPassword'})
		},
		submit: function() {
			this.messages = [];
			var body = 'email=' + this.email + '&emailVerificationCode=' + this.emailVerificationCode + '&password=' + this.password;

			var vueContext = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
                    if (this.status == 404) {
						return vueContext.messages.push({ type: 'error', message: this.statusText });
                    }
					var responseObj = JSON.parse(this.responseText);

					if (this.status == 200) {
						//vueContext.$store.dispatch({ 'type': UPDATE_AUTH_TOKEN, 'newToken': responseObj.token});
						vueContext.messages.push({ type: 'success', message: responseObj.message });
						vueContext.cleanup();
					} else {
						//vueContext.$store.dispatch(CLEAR_AUTH_TOKEN);
						vueContext.messages.push({ type: 'error', message: responseObj.message });
					}

					// vueContext.$emit('closeAuth');
				}
			};
			xhttp.open("POST", "/api/v1/admin/user/auth/resetPassword", true);
			xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhttp.send(body);
		},
		cancel: function() {
			this.$emit('cancel');
			this.cleanup();
		},
		hasCode: function() {
			this.showFullForm = !this.showFullForm;
		},
		cleanup: function() {
			this.email = '';
			this.emailVerificationCode = '';
			this.password = '';
		},
		sendEmailVerificationCode: function() {
			var token = this.$store.getters.authToken;
			var body = 'email=' + this.email;

			var vueContext = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
                    if (this.status == 404) {
						return vueContext.messages.push({ type: 'error', message: this.statusText });
                    }
					var responseObj = JSON.parse(this.responseText);

					if (this.status == 200) {
						vueContext.messages.push({ type: 'success', message: responseObj.message });
					} else {
						vueContext.messages.push({ type: 'error', message: responseObj.message });
					}

					// vueContext.$emit('closeAuth');
				}
			};
			xhttp.open("POST", "/api/v1/admin/user/email/sendEmailVerificationCode", true);
			xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhttp.setRequestHeader('x-access-token', token);
			xhttp.send(body);
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
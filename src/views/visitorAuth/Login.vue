<template>
<section class="component-padding">
<div class="form">
    <h1 class="form__title">Login</h1>
    <div class="form__field">
        <label>Email</label>
        <input type="text" v-model="email" placeholder="example@email.com">
    </div>
    <div class="form__field">
        <label>Password</label>
        <input v-bind:type="passwordFieldType" v-model="password" placeholder="super secret password" >
    </div>
    <div class="form__field form__field--checkbox">
        <input id="showPassword" type="checkbox" v-model="showPassword">
        <label for="showPassword">Show password</label>
    </div>
    <div class="form__field--three">
        <input class="form__actions__submit" type="button" value="Submit" v-on:click="submit">
        <input class="form__actions__cancel" type="button" value="Cancel" v-on:click="cancel">
        <input class="form__actions__forgotPassword" type="button" value="Forgot Password" v-on:click="this.$router.push({ path: 'ForgotPassword'})">
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
import { UPDATE_AUTH_TOKEN, CLEAR_AUTH_TOKEN } from '@/action-types'

export default {
    name: 'login',
    data: function() {
        return {
			email: '',
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
		}
	},
	methods: {
		submit: function() {
			this.messages = [];
			var body = 'email=' + this.email + '&password=' + this.password;

			var vueContext = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
                    if (this.status == 404) {
						return vueContext.messages.push({ type: 'error', message: this.statusText });
                    }
					var responseObj = JSON.parse(this.responseText);

					if (this.status == 200 && true == responseObj.auth) {
						vueContext.$store.dispatch({ 'type': UPDATE_AUTH_TOKEN, 'newToken': responseObj.token});
						vueContext.messages.push({ type: 'success', message: responseObj.message });
						vueContext.cleanup();
						vueContext.$router.push({ path: 'Profile'})
					} else {
						vueContext.$store.dispatch(CLEAR_AUTH_TOKEN);
						vueContext.messages.push({ type: 'error', message: responseObj.message });
					}

				}
			};
			xhttp.open("POST", "/api/v1/admin/user/auth/login", true);
			xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhttp.send(body);
		},
		cancel: function() {
			this.$emit('cancel');
			this.cleanup();
		},
		forgotPassword: function() {
			if (!this.email) {
				this.messages.push({ type: 'error', message: 'Need to supply an email!' });
			}
		},
		cleanup: function() {
			this.email = '';
			this.password = '';
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
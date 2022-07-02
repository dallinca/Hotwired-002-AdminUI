<template>
<section class="component-padding">
<div class="form">
  <h1 class="form__title">Forgot Password</h1>
  <div class="form__field">
    <label>Email</label>
    <input type="text" v-model="email" placeholder="example@email.com">
  </div>
<div class="form__field--two form__field--left">
  <span class="form__field--message">Contact your administrator to send your code</span>
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
  <div class="form__field--two form__field--center" v-if="showFullForm">
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
import { ALERT_SUCCESS, ALERT_WARN, ALERT_ERROR, UPDATE_AUTH_TOKEN, CLEAR_AUTH_TOKEN } from '@/action-types'

export default {
  name: 'forgotPassword',
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
		}
	},
	methods: {
		submit: function() {
			this.messages = [];
			var body = window.__HW__.utils.formatBodyParams({
        'email': this.email,
        'emailVerificationCode': this.emailVerificationCode,
        'password': this.password
      });

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
						vueContext.$store.dispatch(CLEAR_AUTH_TOKEN);
						vueContext.$store.dispatch(ALERT_WARN, { message: responseObj.message })
            return
          }

					if (this.status == 200) {
						vueContext.$store.dispatch({ 'type': UPDATE_AUTH_TOKEN, 'newToken': responseObj.token});
						vueContext.$store.dispatch(ALERT_SUCCESS, { message: responseObj.message })
						vueContext.cleanup();
					}
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
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
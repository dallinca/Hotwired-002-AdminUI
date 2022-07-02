<template>
<section>
  <div class="form">
    <h2 class="form__title">Add New Visitor</h2>
    <div class="form__field">
      <label>Email</label>
      <input type="text" v-model="email" placeholder="example@email.com">
    </div>
    <div class="form__field--two form__field--left">
      <input class="form__actions__submit" type="button" value="Add Visitor" v-on:click="addVisitor">
      <input class="form__actions__cancel" type="button" value="Cancel" v-on:click="cleanup">
    </div>
  </div>
</section>
</template>

<script>
import { ALERT_SUCCESS, ALERT_WARN, ALERT_ERROR } from '@/action-types'

export default {
	name: 'addVisitor',
	data: function() {
		return {
      email: ''
		}
	},
	computed: {
    token() {
      return this.$store.getters.authToken;
    }
	},
	methods: {
    addVisitor: function() {
      var endpointURL = '/api/v1/admin/visitor/add';
      var body = window.__HW__.utils.formatBodyParams({
        'email': this.email
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
						vueContext.$store.dispatch(ALERT_WARN, { message: responseObj.message })
            return
          }

					if (this.status == 200) {
            vueContext.$store.dispatch(ALERT_SUCCESS, { message: responseObj.message })
            vueContext.cleanup()
					}
				}
			};
			xhttp.open("POST", endpointURL, true);
			xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhttp.setRequestHeader('x-access-token', this.token);
			xhttp.send(body);
    },
    cleanup: function() {
      this.email = ''
    }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
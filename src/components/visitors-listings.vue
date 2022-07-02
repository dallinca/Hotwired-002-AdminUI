<template>
  <pagination v-bind="paginationVisitors">
    <template #codeExpirationTime="{ email, codeExpirationTime }">
      <div>
        <div v-if="Date.now() < codeExpirationTime || emails[email]">Code Still valid</div>
        <div v-if="Date.now() > codeExpirationTime && !emails[email]"><button @click="sendEmailVerificationCode(email)">Send Code</button></div>
      </div>
    </template>
    <template #approvedForAccount="{ email, approvedForAccount }">
      <div>
        <div v-if="approvedForAccount || emailsApproved[email]">Approved<button @click="approveForAccount(email, false)">Unapprove</button></div>
        <div v-if="!approvedForAccount && !emailsApproved[email]">Not Approved<button @click="approveForAccount(email, true)">Approve</button></div>
      </div>
    </template>
  </pagination>
</template>

<script>
import Pagination from '@/components/pagination.vue'
import { ALERT_SUCCESS, ALERT_WARN, ALERT_ERROR } from '@/action-types'

export default {
	name: 'visitorsListings',
	components: {
		Pagination
	},
	data: function() {
		return {
      paginationVisitors: {
        title: 'Visitor Listings',
        keyField: 'email',
        baseUrl: '/api/v1/admin/visitor/all',
        fieldKeys: ['email', 'codeExpirationTime', 'approvedForAccount'], 

				limit: 2,
				radius: 2
      },
      emails: {},
      emailsApproved: {}
		}
	},
	computed: {
    token() {
      return this.$store.getters.authToken;
    }
	},
	watch: {
	},
	created: function() {
	},
	methods: {
    sendEmailVerificationCode: function(email) {
      var sendEmailVerificationCodeURL = '/api/v1/admin/user/email/sendOtherEmailVerificationCode';
      var body = window.__HW__.utils.formatBodyParams({
        'email': email
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
            vueContext.emails[email] = 'sent';
					}
				}
			};
			xhttp.open("POST", sendEmailVerificationCodeURL, true);
			xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhttp.setRequestHeader('x-access-token', this.token);
			xhttp.send(body);
    },
    approveForAccount: function(email, approve) {
      var sendEmailVerificationCodeURL = '/api/v1/admin/visitor/approve';
      var body = window.__HW__.utils.formatBodyParams({
        'email': email,
        'approveVisitor': approve
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
            vueContext.emailsApproved[email] = approve;
					}
				}
			};
			xhttp.open("POST", sendEmailVerificationCodeURL, true);
			xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhttp.setRequestHeader('x-access-token', this.token);
			xhttp.send(body);
    }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
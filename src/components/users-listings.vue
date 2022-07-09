<template>
  <Pagination v-bind="paginationUsers">
    <template #permissions="permissionsProps">
			<PermissionsEditField v-bind="permissionsProps" :allPermissions="permissionsAdditionalProps.allPermissions"></PermissionsEditField>
    </template>
  </Pagination>
</template>

<script>
import Pagination from '@/components/pagination.vue'
import PermissionsEditField from '@/components/admin/user/permissions-edit-field.vue'
import { ALERT_WARN, ALERT_ERROR } from '@/action-types'

export default {
	name: 'usersListings',
	components: {
		Pagination,
		PermissionsEditField
	},
	data: function() {
		return {
      paginationUsers: {
        title: 'User Listings',
        keyField: 'name',
        baseUrl: '/api/v1/admin/user/all',
        fieldKeys: ['name', 'email', 'permissions'], 

				limit: 5,
				radius: 3
      },
			permissionsAdditionalProps: { allPermissions: [] }
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
		this.getPossiblePermissions();
	},
	methods: {
		getPossiblePermissions: function() {      
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
						vueContext.permissionsAdditionalProps.allPermissions = responseObj.data.items;
					}
				}
			};
			xhttp.open("GET", '/api/v1/admin/user/permissions/all', true);
			xhttp.setRequestHeader('x-access-token', this.token);
			xhttp.send();
		},
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
<template>
  <EditField>
    <template #viewing>
      <div v-if="permissions.length">
        <div v-for="permission in oldSelections" :key="permission">{{ permission }}</div>
      </div>
      <div v-else>
        No Permissions
      </div>
    </template>
    <template #editing>
      <div v-for="permission in allPermissions" :key="permission">
        <input type="checkbox" :value="permission" v-model="oldSelections" disabled>
        <input type="checkbox" :id="permission" :value="permission" v-model="currentSelections">
        <label :for="permission">{{ permission }}</label>
      </div>
      <button @click="submitPermissionsUpdate">Submit</button>
    </template>
    <slot></slot>
  </EditField>
</template>

<script>
import EditField from '@/components/edit-field.vue'
import { ALERT_SUCCESS, ALERT_WARN, ALERT_ERROR } from '@/action-types'

export default {
	name: 'permissionsEditField',
	components: {
		EditField
	},
  props: {
    name: String,
    email: String,
    permissions: Array,
    allPermissions: Array
  },
	data: function() {
		return {
      currentSelections: [],
      oldSelections: []
		}
	},
	computed: {
    token() {
      return this.$store.getters.authToken;
    }
	},
	watch: {
    permissions: { handler() { this.updateCurrentPermissions() }, deep: true}
	},
	created: function() {
    this.updateCurrentPermissions()
    console.log(this.currentSelections)
	},
	methods: {
		updateCurrentPermissions: function() {
      this.currentSelections = [...this.permissions]
      this.oldSelections = [...this.permissions]
    },
    submitPermissionsUpdate: function() {
      var body = {
        email: this.email,
        permissions: this.currentSelections
      }
      
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
						vueContext.oldSelections = [...vueContext.currentSelections];
					}
				}
			};
			xhttp.open("POST", '/api/v1/admin/user/permissions/update', true);
			xhttp.setRequestHeader('x-access-token', this.token);
			xhttp.setRequestHeader('Content-Type', 'application/json');
			xhttp.send(JSON.stringify(body));
    }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
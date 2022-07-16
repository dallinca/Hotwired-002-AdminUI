<template>
  <EditField>
    <template #viewing>
      <slot name="trueText" v-if="booleanValue">True</slot>
      <slot name="falseText" v-else>False</slot>
    </template>
    <template #editing>
      <button @click="updateBooleanValue(false)" v-if="booleanValue"><slot name="setFalseText">Set False</slot></button>
      <button @click="updateBooleanValue(true)" v-if="!booleanValue"><slot name="setTrueText">Set True</slot></button>
    </template>
  </EditField>
</template>

<script>
import EditField from '@/components/edit-field.vue'
import { ALERT_SUCCESS, ALERT_WARN, ALERT_ERROR } from '@/action-types'

export default {
	name: 'editFieldBoolean',
	components: {
		EditField
	},
  props: {
    idObject: { type: Object, required: true }, // Passed back in update event for identification
    booleanValue: { type: Boolean, required: true }, // Value being displayed
    baseUrl: { type: String, required: true }, // API for updating the value
    updateParams: Object
  },
	data: function() {
		return {
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
    updateBooleanValue: function(newValue) {
      var paramObj = { 'newValue': newValue }
      if (this.idObject.email) paramObj.email = this.idObject.email

      var bodyParams = window.__HW__.utils.formatBodyParams({ ...paramObj, ...this.updateParams })

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
            vueContext.$emit('updatedValue', { 'idObject': vueContext.idObject, newValue })
					}
				}
			};
			xhttp.open("POST", this.baseUrl, true);
			xhttp.setRequestHeader('x-access-token', this.token);
			xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhttp.send(bodyParams);
    }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

<template>
  <div class="site__alerts">
    <div class="site__alert__wrap" v-for="(alert, index) in alerts" :key="index">
      <div class="site__alert site__alert--success" v-if="alert.type == ALERT_SUCCESS" :class="{'site__alert--showing': alert.show}">
        {{ alert.message }}
      </div>
      <div class="site__alert site__alert--warning" v-else-if="alert.type == ALERT_WARN" :class="{'site__alert--showing': alert.show}">
        {{ alert.message }}
      </div>
      <div class="site__alert site__alert--error" v-else-if="alert.type == ALERT_ERROR" :class="{'site__alert--showing': alert.show}">
        {{ alert.message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ALERT_SUCCESS, ALERT_WARN, ALERT_ERROR } from '@/action-types'

export default {
	name: 'alerts',
	data: function() {
		return {
      ALERT_SUCCESS,
      ALERT_WARN,
      ALERT_ERROR,
      alerts: {},
      alertTTShow: 10,
      alertTTHide: 2800,
		}
	},
	computed: {
    alert() {
      return this.$store.state.alert;
    }
	},
	watch: {
    alert: {
      handler(newAlert) {
        this.alerts[newAlert.id] = newAlert
        this.handleTransitions(newAlert.id);
      },
      deep: false
    }
	},
	created: function() {
    // Example
    // let vueContext = this;
    // this.$store.dispatch(ALERT_ERROR, { 'message': 'This is an example ADDITIONAL error alert' })
	},
	methods: {
    handleTransitions: function(id) {
      var vueContext = this;
      setTimeout(function() { vueContext.alerts[id].show = true}, this.alertTTShow);
      setTimeout(function() { vueContext.alerts[id].show = false}, this.alertTTHide);
    }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.site__alerts {
  width: 100%;
}
.site__alerts .site__alert {
  width: 100%;
  border: none;
  padding: 0rem;
  max-height: 0px;
  overflow: hidden;
  transition: all .2s;
}
.site__alerts .site__alert--showing {
  max-height: 200px;
  padding: .6rem;
  transition: all .2s;
}
.site__alert--success {
    background: #a4db9b;
    border: 1px solid #1da60577;
}
.site__alert--warning {
    background: #f2e49c;
    border: 1px solid #e0bc0977;
}
.site__alert--error {
    background: #dc9ba0;
    border: 1px solid #a8071277;
}
</style>
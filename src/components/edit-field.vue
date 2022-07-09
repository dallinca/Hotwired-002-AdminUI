<template>
<div>
  <EditButton v-if="!editing" @click="handleEdit"></EditButton>
  <XButton v-if="editing" @click="cancelEdit"></XButton>
  <slot v-if="!editing" name="viewing">Viewing Field</slot>
  <slot v-if="editing" name="editing">Editing Field</slot>
</div>
</template>

<script>
import EditButton from '@/components/edit-button.vue'
import XButton from '@/components/x-button.vue'

export default {
	name: 'editField',
	components: {
		EditButton,
		XButton
	},
	data: function() {
		return {
      editing: false
		}
	},
	methods: {
		handleEdit: function() {
			this.editing = true
		},
    cancelEdit: function() {
      this.editing = false
    }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
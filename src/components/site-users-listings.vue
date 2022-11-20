<template>
  <Pagination-layout v-bind="paginationSiteUsers" ref="pagination">
    <template #isGameDev="isGameDevProps">
      <EditFieldBoolean
        :baseUrl="'/api/v1/admin/siteUser/isGameDev'"
        :booleanValue="isGameDevProps.isGameDev"
        :idObject="isGameDevProps"
        @updatedValue="$refs.pagination.fieldUpdated($event)"
      >
      <template #trueText>GameDev</template>
      <template #falseText>-</template>
      <template #setTrueText>Promote</template>
      <template #setFalseText>Demote</template>
      </EditFieldBoolean>
    </template>
  </Pagination-layout>
</template>

<script>
import PaginationLayout from '@/components/pagination-layout.vue'
import EditFieldBoolean from '@/components/edit-field-boolean.vue'

export default {
	name: 'siteUsersListings',
	components: {
		PaginationLayout,
    EditFieldBoolean
	},
	data: function() {
		return {
      paginationSiteUsers: {
        title: 'Site User Listings',
        keyField: 'name',
        baseUrl: '/api/v1/admin/siteUser/all',
        fieldKeys: ['name', 'email', 'canJoin', 'hostMax', 'guestMax', 'isGameDev'], 

				limit: 5,
				radius: 3
      }
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
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
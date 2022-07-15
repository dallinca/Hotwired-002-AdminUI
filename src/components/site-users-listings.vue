<template>
  <Pagination v-bind="paginationSiteUsers">
  </Pagination>
</template>

<script>
import Pagination from '@/components/pagination.vue'

export default {
	name: 'siteUsersListings',
	components: {
		Pagination
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
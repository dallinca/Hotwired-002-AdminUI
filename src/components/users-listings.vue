<template>
  <pagination v-bind="paginationUsers">
    <template #permissions="{ permissions }">
      <div>
        <div v-for="permission in permissions" :key="permission">{{ permission }}</div>
      </div>
    </template>
  </pagination>
</template>

<script>
import Pagination from '@/components/pagination.vue'

export default {
	name: 'usersListings',
	components: {
		Pagination
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
      }
		}
	},
	computed: {
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
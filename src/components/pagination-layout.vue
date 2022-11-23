<template>
<section ref="root">
	<div class="component-padding">
		<h1>{{ title }}</h1>
		<div class="pagination-layout__table-wrap" v-if="tableView">
			<table class="table--simple">
			<tr>
				<th v-for="fieldKey in pageItems.fieldKeys" :key="fieldKey">{{ fieldKey }}</th>
			</tr>
			<tr v-for="listing in pageItems.listings" :key="listing[keyField]">
				<td v-for="fieldKey in pageItems.fieldKeys" :key="fieldKey"><slot v-bind:name=fieldKey v-bind="listing" v-bind:__fieldKey="fieldKey">{{ listing[fieldKey] }}</slot></td>
			</tr>
			</table>
		</div>
		<div class="pagination-layout__stack-wrap" v-if="!tableView">
			<div class="stack stack--simple">
				<div class="sr" v-for="listing in pageItems.listings" :key="listing[keyField]">
					<div class="sd" v-for="fieldKey in pageItems.fieldKeys" :key="fieldKey">
						<div class="sd__label" v-bind:title="fieldKey">{{ fieldKey }}</div>
						<div class="sd__content"><slot v-bind:name=fieldKey v-bind="listing" v-bind:__fieldKey="fieldKey">{{ listing[fieldKey] }}</slot></div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<pagination-controls v-bind="paginationControls" @pageSelection="getPageItems"></pagination-controls>
</section>
</template>

<script>
import PaginationControls from '@/components/pagination-controls.vue'
import { ALERT_WARN, ALERT_ERROR } from '@/action-types'

export default {
	name: 'paginationLayout',
  props: {
      title: { type: String, default: "Paginated Items" },
      keyField: { type: String, required: true },
      baseUrl: { type: String, required: true },
      fieldKeys: { type: Array },
			viewBreakpoint: { type: Number, default: 800 },

      limit: { type: Number, default: 5 },
      radius: { type: Number, default: 3 }
  },
	expose: ['fieldUpdated'],
	components: {
		PaginationControls
	},
	computed: {
    token() {
      return this.$store.getters.authToken;
    }
	},
	watch: {
		sectionWidth: function(newValue) {
			if (newValue > 500) {
				this.tableView = true;
			}
		}
	},
	mounted() {
		window.addEventListener("resize", this.rootResize)
		this.rootResize();
	},
	unmounted() {
		window.removeEventListener("resize", this.rootResize)
	},
	data: function() {
		return {
			// data
			paginationControls: {
				totalItems: 0,
				currentPage: 0,
				limit: 0,
				radius: 0
			},
			pageItems: {
				total: 0,
				listings: [],
        fieldKeys: this.fieldKeys || []
			},

			// Table view vs Stacked view
			tableView: true,

			// Mobile tapping data
			siteNavTapped: false,
			userNavTapped: false,
			lastTapped: null,
			onlyOneActiveTap: true
		}
	},
	created: function() {
    this.paginationControls.limit = this.limit;
    this.paginationControls.radius = this.radius;
    this.getPageItems(1);
	},
	methods: {
		rootResize: function() {
			var sectionWidth = this.$refs.root.offsetWidth;
			this.tableView = sectionWidth > this.viewBreakpoint;
		},
		getPageItems: function(newPage) {
      var params = window.__HW__.utils.formatUrlParams({
        page: newPage,
        limit: this.paginationControls.limit
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
						vueContext.pageItems.listings = responseObj.data.items;
            vueContext.paginationControls.totalItems = responseObj.data.count;
            vueContext.paginationControls.currentPage = newPage;
            vueContext.updateFieldKeys()
					}
				}
			};
			xhttp.open("GET", this.baseUrl + params, true);
			xhttp.setRequestHeader('x-access-token', this.token);
			xhttp.send();
		},
    updateFieldKeys: function() {
      if (this.pageItems.fieldKeys.length) return
      this.pageItems.fieldKeys = Object.keys(this.pageItems.listings[0])
    },
		fieldUpdated: function({ idObject, newValue }) {
			var recordToUpdate = this.pageItems.listings.find(listing => listing[this.keyField] == idObject[this.keyField])
			recordToUpdate[idObject.__fieldKey] = newValue
		},
		updateViewType: function(viewType) {
			this.viewType = viewType;
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pagination-layout__table-wrap {
	overflow-x: auto;
	/*display: none;*/
}
/*
@media only screen and (min-width: 768px) {
	.pagination-layout__table { display: block; }
	.pagination-layout__stacked { display: none; }
}*/
</style>
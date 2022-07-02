<template>
	<div class="pagination-controls component-padding">
    <div class="pagination-controls__wrap">
      <div class="pagination-controls__first-page-wrap">
        <a class="pagination-controls__page pagination-controls__first-page"
        v-if="showFirst"
        @click="$emit(events.pageSelection, 1)"
        >{{ firstPage }}</a>
      </div>
      <div class="pagination-controls__pages-wrap pagination-controls__left-pages-wrap">
        <a class="pagination-controls__page"
        v-for="page in leftPages" :key="page"
        @click="$emit(events.pageSelection, page)"
        >{{ page }}</a>
      </div>
      <div class="pagination-controls__pages-wrap pagination-controls__current-page-wrap">
        <span class="pagination-controls__current-page">{{ currentPage }}</span>
      </div>
      <div class="pagination-controls__pages-wrap pagination-controls__right-pages-wrap">
        <a class="pagination-controls__page"
        v-for="page in rightPages" :key="page"
        @click="$emit(events.pageSelection, page)"
        >{{ page }}</a>
      </div>
      <div class="pagination-controls__last-page-wrap">
        <a class="pagination-controls__page pagination-controls__last-page"
        v-if="showLast"
        @click="$emit(events.pageSelection, totalPages)"
        >{{ lastPage }}</a>
      </div>
    </div>
	</div>
</template>

<script>
export default {
	name: 'paginationControls',
  props: {
    totalItems: { type: Number, required: true, default: 0 },
    currentPage: { type: Number, required: true, default: 0 },
    limit: { type: Number, default: 5 },
    radius: { type: Number, default: 3 }
  },
	data: function() {
		return {
      events: {
        pageSelection: 'pageSelection'
      },
      firstPage: "<<",
      lastPage: ">>"
		}
	},
	computed: {
    totalPages() { return Math.ceil(this.totalItems / this.limit) },
    showFirst() { return (this.currentPage - this.radius > 1 ) ? true : false },
    leftPages() {
      var pages = []
      for (var page = this.currentPage - this.radius; page < this.currentPage; page++) {
        if (page <= 0) continue
        pages.push(page);
      }
      return pages
    },
    rightPages() {
      var pages = []
      for (var page = this.currentPage + 1; page <= this.currentPage + this.radius; page++) {
        if (page > this.totalPages) break
        pages.push(page);
      }
      return pages
    },
    showLast() { return (this.currentPage + this.radius < this.totalPages ) ? true : false }
	},
	watch: {	},
	created: function() {	},
	methods: {	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pagination-controls {
  display: grid;
  padding: 2rem;
}
.pagination-controls__wrap {
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  justify-content: center;
  align-items: center;
}
.pagination-controls__pages-wrap {}
.pagination-controls__left-pages-wrap {}
.pagination-controls__current-page-wrap {}
.pagination-controls__right-pages-wrap {}
.pagination-controls__page {
  padding: 1rem;
  margin: 0 .5rem;
  color: var(--brand-color-main);
  text-decoration: underline;
  font-weight: 600;
  transition: all .5s;
}
.pagination-controls__page:hover {
  cursor: pointer;
  padding: 1.5rem;
  color: var(--brand-color-canvas);
  text-decoration: none;
  background-color: var(--brand-color-glyph);
}
.pagination-controls__current-page {
  padding: 1rem 2rem;
  font-size: 3rem;
  font-weight: 600;
  /*border: 1px solid var(--brand-color-glyph);*/
  background-color: var(--brand-color-canvas);
}

</style>
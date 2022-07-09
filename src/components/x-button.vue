<template>
  <button class="x-button" @click="$emit('click', buttonId)">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
  </button>
</template>

<script>
export default {
	name: 'xButton',
  props: [
    'buttonId'
  ]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.x-button {
	position: absolute;
	right: 0rem;
	padding: 0.2rem;
	box-shadow: 0 0 4px black;
	z-index: 99;
	height: auto;
}
</style>
<template>
<section>
  <div class="home component-padding">
    <h1>Welcome Home!</h1>

    <da-chat
      v-bind:parent-auth="auth">
    </da-chat>

    <h2>Current Features -{{ auth }}</h2>
    <ul>
      <li>Register</li>
      <li>Login/Logout</li>
      <li>General Chat</li>
    </ul>

    <h2>Coming Soon</h2>
    <ul>
      <li>User Settings Page</li>
      <li>Friends</li>
      <li>Flashcards</li>
    </ul>
    <a href="#">Link text#</a><br/>
    <a>Link text without href</a><br/>
    <input type="button" value="Button"><br/>
    <input type="checkbox"><br/>
    <input type="color"><br/>
    <input type="date"><br/>
    <input type="datetime-local"><br/>
    <input type="email"><br/>
    <input type="file"><br/>
    <input type="hidden"><br/>
    <input type="image"><br/>
    <input type="month"><br/>
    <input type="number"><br/>
    <input type="password"><br/>
    <input type="radio"><br/>
    <input type="range"><br/>
    <input type="reset"><br/>
    <input type="search"><br/>
    <input type="submit"><br/>
    <input type="tel"><br/>
    <input type="text"><br/>
    <input type="time"><br/>
    <input type="url"><br/>
    <input type="week">
  </div>
</section>
</template>

<script>
import DaChat from '@/components/da-chat.vue'

export default {
    name: 'page-home',
    components: {
        DaChat
    },
	props: {
		parentAuth: Object
	},
	data: function() {
		return {
			// current Auth
			auth: this.parentAuth
		}
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
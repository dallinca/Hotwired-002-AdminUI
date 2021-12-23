<template>
<div class="chat">
    <div class="chat__messages-wrap" v-on:scroll="scrolled" ref="scroller">
        <div class="chat__messages">
            <div class="chat__message" v-for="message in messages" v-bind:key="message"><span class="chat__message__name">{{ message.name }}</span>: <span class="chat__message__message">{{ message.body }}</span></div>
        </div>
    </div>
    <div class="chat__compose">
        <textarea class="chat__compose-text" maxlength="1000" v-model="newMessage" :disabled="!enableNewMessage"></textarea>
        <div class="chat__compose__send" v-on:click="sendNewMessage">
            <span>SEND</span>
        </div>
    </div>
</div>
</template>

<script>
export default {
	name: 'da-chat',
	data: function() {
		return {
			// data
			intervalID: null,
			messages: [],
			newMessage: "",
			enableNewMessage: false,
			scroller: null,
			autoScroll: true,

			// Mobile tapping data
			siteNavTapped: false,
			userNavTapped: false,
			lastTapped: null,
			onlyOneActiveTap: true
		}
	},
	computed: {
		hasToken() {
			return this.$store.state.auth.hasToken;
		}
	},
	watch: {
		hasToken: function(hasToken) {
			this.enableNewMessage = hasToken;
		}
	},
	created: function() {
		this.getMessagesInfo();
		this.intervalID = setInterval(() => this.getMessagesInfo(), 1000);
		this.enableNewMessage = this.hasToken;
	},
	unmounted: function() {
		clearInterval(this.intervalID);
	},
	methods: {
		setMessages: function(messages) {
			this.messages = messages;

			if (this.autoScroll) {
				var height = this.$refs["scroller"].scrollHeight - this.$refs["scroller"].clientHeight;
				this.$refs["scroller"].scrollTo(0, height);
			}

		},
		getMessagesInfo: function(/*target, tapGroup*/) {

			var vueContext = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
					var responseObj = JSON.parse(this.responseText);

					if (false == responseObj.auth) {
						alert("Not authorized");
					}

					if (this.status == 200 && true == responseObj.auth) {
						vueContext.setMessages(responseObj.chat);
					} else {
						alert("Error: " + this.responseText);
					}
				}
			};
			xhttp.open("GET", "/api/v1/site/chat/general", true);
			xhttp.send();
		},
		sendNewMessage: function(/*target, tapGroup*/) {

			var body = 'message=' + this.newMessage;

			// Check if a token exists
			var token = this.$store.getters.authToken;
			if (!token) {
				this.newMessage = '';
				alert("Please Login");
				return;
			}

			// If token exists attempt to validate
			var vueContext = this;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
					var responseObj = JSON.parse(this.responseText);

					if (false == responseObj.auth) {
						alert("Not authorized");
					}

					if (this.status == 200 && true == responseObj.auth) {
						vueContext.getMessagesInfo();
						vueContext.newMessage = '';
					} else {
						alert("Error: " + this.responseText);
					}
				}
			};
			xhttp.open("POST", "/api/v1/site/chat/general", true);
			xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhttp.setRequestHeader('x-access-token', token);
			xhttp.send(body);
		},
		scrolled: function(e) {
			var scroller = e.target;

			// Scrolled to the absolute bottom
			if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight) {
				this.autoScroll = true;
				return;
			}

			// Scrolled away from bottom
			this.autoScroll = false;
		}
	}
}
</script>

<style scoped>
/**
===============================
===== CHAT
===============================
**/
.chat {
    border: 1px solid;
    height: 300px;
    display: grid;
    grid-template-rows: calc(100% - 50px) 50px;
}
.chat__messages-wrap {
    border: 1px solid;
    overflow: auto;
}
.chat__messages {}
.chat__message {}
.chat__message__name {
    font-weight: 900;
}
.chat__message__message {}
.chat__compose {
    display: grid;
    grid-template-columns: calc(100% - 50px) 50px;
}
.chat__compose__send {
    display: grid;
    cursor: pointer;
    border: 1px solid;
    transition: all .5s ease;
}
.chat__compose__send:hover {
    background: #CCC;
}
.chat__compose-text {
    width: 100%;
    height: 100%;
    resize: none;
    box-sizing: border-box;
    border: 1px solid;
}
.chat__compose-text:hover {
    border: 1px solid;
}
</style>
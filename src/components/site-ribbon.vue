<template>
<div class="site-ribbon">
    <section class="site-ribbon__wrap">
        <router-link class="image-wrap logo" to="/">
            <img src="/images/Logo_Hotwired_NoPadding.png">
        </router-link>
        <div id="admin-site-tag"><span>ADMIN</span></div>
        <div></div>
        <nav class="dropdown-menu dropdown-menu--right site-nav"
        v-bind:class="{ tapped: siteNavTapped }"
        v-on:click="toggleTapped($event.currentTarget, 'siteNav')">
            <a class="icon icon--ribbon dropdown-menu__button" href="#"
            v-bind:class="{ tapped: siteNavTapped }">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
            </a>
            <div class="dropdown-menu__items"
            v-bind:class="{ 'dropdown-menu__items--open': siteNavTapped }">
                <router-link v-for="item in siteNavItems"
                v-bind:key="item"
                class="dropdown-menu__item"
                v-bind:to="item.link"
                v-bind:tabIndex="siteNavTapped ? 0 : -1"
                v-on:keydown.tab="tabTest($event, 'siteNav')">{{ item.text }}</router-link>
            </div>
        </nav>

        <nav class="dropdown-menu dropdown-menu--right user-nav"
        v-bind:class="{ tapped: userNavTapped }"
        v-on:click="toggleTapped($event.currentTarget, 'userNav')">
            <a class="icon icon--ribbon dropdown-menu__button" href="#"
            v-bind:class="{ tapped: userNavTapped }">
                <svg v-if="!userLoggedIn" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
                <svg v-if="userLoggedIn" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                </svg>
            </a>
            <div class="dropdown-menu__items"
            v-bind:class="{ 'dropdown-menu__items--open': userNavTapped }">
                <router-link v-for="(item, name) in userNavItems"
                v-bind:key="item"
                class="dropdown-menu__item"
                v-bind:to="item.link"
                v-bind:tabIndex="userNavTapped ? 0 : -1"
                v-on:keydown.tab="tabTest($event, 'userNav')"
                v-on:click="userNavItemsAction(name)">{{ item.text }}</router-link>
            </div>
        </nav>
    
    </section>
</div>
</template>

<script>
import { VALIDATE_AUTH_TOKEN, CLEAR_AUTH_TOKEN } from '@/action-types'

export default {
    name: 'site-ribbon',
    data: function() {
        return {
            siteNavItems: {
                about: { text: "About", link: "/About", tapped: false },
                contact: { text: "Contact Us", link: "/Contact", tapped: false }
            },
            userNavItems: {
                login: { text: "Login", link: "/Login", tapped: false},
                register: { text: "Register", link: "/Register", tapped: false},
                forgotPassword: { text: "Forgot Password", link: "/ForgotPassword", tapped: false }
            },
            userLoggedIn: false,
            
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
            this.tokenStatusChange(hasToken);
        }
    },
    created: function() {
        this.$store.dispatch(VALIDATE_AUTH_TOKEN);
    },
    methods: {
        tokenStatusChange: function(hasToken) {
            if (hasToken) {
                this.userLoggedIn = true;

                // Remove items
                delete this.userNavItems["login"];
                delete this.userNavItems["register"];
                delete this.userNavItems["forgotPassword"];

                // Add items
                this.userNavItems["logout"] = { text: "Logout", link: "#"};
                this.userNavItems["profile"] = { text: "Profile", link: "/Profile"};
                this.userNavItems["resetPassword"] = { text: "Reset Password", link: "/ResetPassword"};
            } else  {
                this.userLoggedIn = false;

                // Remove items
                delete this.userNavItems["logout"];
                delete this.userNavItems["profile"];
                delete this.userNavItems["resetPassword"];

                // Add items
                this.userNavItems["login"] = { text: "Login", link: "/Login"};
                this.userNavItems["register"] = { text: "Register", link: "/Register"};
                this.userNavItems["forgotPassword"] = { text: "Forgot Password", link: "/ForgotPassword"};
            }
        },
        userNavItemsAction: function(key) {
            if ("logout" == key) {
                this.$store.dispatch(CLEAR_AUTH_TOKEN)
            }
            console.log("userNavItemsAction: " + key)
        },
        siteNavItemsAction: function(key) {
            //No actions yet
            console.log("siteNavItemsAction: " + key)
        },
		toggleTapped: function(target, tapGroup) {
			/*if (!("ontouchstart" in document.documentElement)) {
				return;
			}*/

			var currentTapped = tapGroup + "Tapped";

			// If only one active is allowed, untap previous tap
			if (this.onlyOneActiveTap &&
				this.lastTapped &&
				this.lastTapped != currentTapped)
			{
				this[this.lastTapped] = false;
			}

			// Toggle the new tap
			this.lastTapped = currentTapped;
			this[currentTapped] = !this[currentTapped];

		},
        tabTest: function(event, nav) {
            if ((event.shiftKey && event.srcElement.previousElementSibling) || (!event.shiftKey && event.srcElement.nextElementSibling)) {
                return;
            }

            if (nav == 'siteNav') {
                this.siteNavTapped = false;
            } else if (nav == 'userNav') {
                this.userNavTapped = false;
            }
        }
    }
}
</script>

<style>
body {
    padding-top: 56px;
}

.site-ribbon {
    width: 100%;
    position: fixed;
    top: 0;
    height: 56px;
    box-shadow: 0px 0px 5px var(--brand-color-glyph);
    display: grid;
    justify-items: center;
    align-items: center;
}
.site-ribbon__wrap {
    display: grid;
    grid-template-columns: 164px auto auto 56px 56px;
    grid-template-rows: 56px;
    justify-items: center;
    align-items: center;

    background-color: var(--brand-color-canvas);

    z-index: 9999;
}

.site-ribbon__wrap > * {
    height: 100%;
    width: 100%;
}

.site-ribbon__wrap .logo {
    width: 100%;
    height: 100%;
    display: grid;
    align-items: center;
    justify-items: center;
    transition: background .5s;
}
.site-ribbon__wrap .logo:focus, .site-ribbon__wrap .logo:hover {
    background-color: var(--brand-color-secondary-lighter);
    outline: none;
}
.site-ribbon__wrap #admin-site-tag {
    display: grid;
    align-items: end;
    line-height: 12px;
}
.site-ribbon__wrap #admin-site-tag span {
    padding: 12px 0px;
    font-weight: 600;
}
.dropdown-menu {
    cursor: pointer;
}
.dropdown-menu--right .dropdown-menu__items {
    right: 0;
}
.dropdown-menu__button {
    padding: 6px;
}
.dropdown-menu__items {
    width: 100%;
    left: 0;
    height: 0;
    display: grid;
    position: absolute;
    background: var(--brand-color-canvas);
    overflow: hidden;
}
.dropdown-menu__items--open {
    height: initial;
}
.dropdown-menu__item:first-child {
    border-top: 1px solid var(--brand-color-glyph);
}
.dropdown-menu__item {
    padding: 10px;
    border-bottom: 1px solid var(--brand-color-glyph);
    color: var(--icon-color-glyph);
    transition: background .5s;
    min-width: 100px;
}
.dropdown-menu__item:hover, .dropdown-menu__item:focus {
    background: var(--brand-color-secondary-lighter);
}

@media only screen and (min-width: 600px) {
    .dropdown-menu {
        position: relative;
    }
    .dropdown-menu__items {
        width: initial;
        left: initial;
        box-shadow: 0px 1px 5px var(--brand-color-glyph);
    }
}

</style>
<template>
<div class="site-ribbon">
  <div class="section-wrap">
    <section class="site-ribbon__main">
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
  <site-alerts />
</div>
</template>

<script>
import { CLEAR_AUTH_TOKEN } from '@/action-types'
import SiteAlerts from '@/components/site-alerts.vue'

export default {
  name: 'site-ribbon',
  components: {
    SiteAlerts
  },
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
      onlyOneActiveTap: true,

      outsideTap: null
    }
  },
  computed: {
    hasToken() {
      return this.$store.state.auth.hasToken;
    },
    hasNavOpen() {
      return (this.siteNavTapped || this.userNavTapped);
    }
  },
  watch: {
    hasToken: function(hasToken) {
      this.tokenStatusChange(hasToken);
    },
    hasNavOpen: function(hasNavOpen) {
      if (hasNavOpen) {
        document.addEventListener("click", this.documentClickListener);
      } else {
        document.removeEventListener("click", this.documentClickListener);
      }
    }
  },
  methods: {
    documentClickListener: function(event) {
      var target = event.target;
      
      // Traverse to dropdown-menu or doc root
      while (target.classList && !target.classList.contains("dropdown-menu") && target.parentNode) {
        target = target.parentNode;
      }

      // If outside a dropdown-menu close the dropdown
      if (!target.classList || !target.classList.contains("dropdown-menu")) {
        this[this.lastTapped] = false;
      }
    },
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

        this.siteNavItems["adminUsers"] = { text: "Admin Users", link: "/AdminUsers" };
        this.siteNavItems["siteUsers"] = { text: "Site Users", link: "/SiteUsers" };
      } else  {
        this.userLoggedIn = false;

        // Remove items
        delete this.userNavItems["logout"];
        delete this.userNavItems["profile"];
        delete this.userNavItems["resetPassword"];

        delete this.siteNavItems["adminUsers"];
        delete this.siteNavItems["siteUsers"];

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
    },
    /*siteNavItemsAction: function(key) {
      //No actions yet
      if ('example' == key) {
        key = key;
      }
    },*/
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
        this[this.lastTapped] = false; // Tap a different nav = close the previous
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
  /*height: 56px;*/
  box-shadow: 0px 0px 5px var(--brand-color-glyph);
  display: grid;
  justify-items: center;
  align-items: center;
  z-index: 999;
}
.site-ribbon__main {
  display: grid;
  grid-template-columns: 164px auto auto 56px 56px;
  grid-template-rows: 56px;
  justify-items: center;
  align-items: center;

  background-color: var(--brand-color-canvas);

  z-index: 9999;
}

.site-ribbon__main > * {
  height: 100%;
  width: 100%;
}

.site-ribbon__main .logo {
  width: 100%;
  height: 100%;
  display: grid;
  align-items: center;
  justify-items: center;
  transition: background .5s;
}
.site-ribbon__main .logo:focus, .site-ribbon__main .logo:hover {
  background-color: var(--brand-color-secondary-lighter);
  outline: none;
}
.site-ribbon__main #admin-site-tag {
  display: grid;
  align-items: end;
  line-height: 12px;
}
.site-ribbon__main #admin-site-tag span {
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
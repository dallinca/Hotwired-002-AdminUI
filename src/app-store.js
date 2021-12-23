import { createStore } from 'vuex'
import { UPDATE_AUTH_TOKEN, VALIDATE_AUTH_TOKEN, CLEAR_AUTH_TOKEN } from './action-types'


const store = createStore({
    state () {
      return {
        auth: {
            hasToken: false
        }
      }
    },
    mutations: {
    },
    getters: {
        authToken () {
			return document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/, "$1");
        }
    },
    actions: {
        [CLEAR_AUTH_TOKEN] ({ state }) {
            console.log(CLEAR_AUTH_TOKEN);

            state.auth.hasToken = false;
            document.cookie = "jwt=";
        },
        [UPDATE_AUTH_TOKEN] ({ state, dispatch }, payload /* newToken: string */ ) {
            console.log(UPDATE_AUTH_TOKEN);

            if (payload.newToken) {
                state.auth.hasToken = true;
                document.cookie = "jwt=" + payload.newToken;
            } else {
                dispatch(CLEAR_AUTH_TOKEN);
            }
            
        },
        [VALIDATE_AUTH_TOKEN] ({ getters, dispatch }) {
            console.log(VALIDATE_AUTH_TOKEN);

			// Check if a token exists
			var authToken = getters.authToken;
			if (!authToken) {
                dispatch(CLEAR_AUTH_TOKEN);
				return;
			}

			// If token exists attempt to validate
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
					var responseObj = JSON.parse(this.responseText);
					if (!responseObj.auth) dispatch(CLEAR_AUTH_TOKEN)
                    if (this.status == 200 && true == responseObj.auth) dispatch({ 'type': UPDATE_AUTH_TOKEN, 'newToken': authToken })
				}
			};
			xhttp.open("GET", "/api/v1/site/auth/checkToken", true);
			xhttp.setRequestHeader('x-access-token', authToken);
			xhttp.send();
        }
    }
})

export { store }
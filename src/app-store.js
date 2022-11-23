import { createStore } from 'vuex'
import { ALERT, ALERT_SUCCESS, ALERT_WARN, ALERT_ERROR, UPDATE_AUTH_TOKEN, VALIDATE_AUTH_TOKEN, CLEAR_AUTH_TOKEN } from './action-types'


const store = createStore({
    state () {
      return {
        auth: {
            hasToken: false
        },
        alert: {},
        alertID: 1
      }
    },
    mutations: {
        hasToken(state, bool) {
            state.auth.hasToken = bool;
        }
    },
    getters: {
        authToken (state) {
            return state.auth.hasToken ? document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/, "$1") : ""
        }
    },
    actions: {
        [ALERT] ({ state }, payload) {
            payload.id = state.alertID++;
            state.alert = payload;
        },
        [ALERT_SUCCESS] ({ dispatch }, payload) { dispatch(ALERT, {'type':ALERT_SUCCESS, 'message':payload.message}) },
        [ALERT_WARN] ({ dispatch }, payload) { dispatch(ALERT, {'type':ALERT_WARN, 'message':payload.message}) },
        [ALERT_ERROR] ({ dispatch }, payload) { dispatch(ALERT, {'type':ALERT_ERROR, 'message':payload.message}) },
        [CLEAR_AUTH_TOKEN] ({ commit }) {
            commit('hasToken', false)
            document.cookie = "jwt=";
        },
        [UPDATE_AUTH_TOKEN] ({ commit, dispatch }, payload /* newToken: string */ ) {
            if (payload.newToken) {
                commit('hasToken', true)
                document.cookie = "jwt=" + payload.newToken;
            } else {
                dispatch(CLEAR_AUTH_TOKEN);
            }
        },
        [VALIDATE_AUTH_TOKEN] ({ dispatch }) {
			// Check if a token exists
			var authToken = document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/, "$1");
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
			xhttp.open("GET", "/api/v1/admin/user/auth/checkToken", true);
			xhttp.setRequestHeader('x-access-token', authToken);
			xhttp.send();
        }
    }
})

export { store }
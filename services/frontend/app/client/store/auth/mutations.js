export default {
    SET_AUTH_USER: (state, { authUser }) => {
      state.authUser = {
        uid: authUser.uid,
        email: authUser.email,
      }
    },
  }
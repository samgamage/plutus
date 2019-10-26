import * as firebase from "firebase";

export let user = null;

const firebaseConfig = {
  apiKey: "AIzaSyBvCXBxbaU6BQ3y2UzF7p9cVa7k2WHQroo",
  authDomain: "plutus-df831.firebaseapp.com",
  databaseURL: "https://plutus-df831.firebaseio.com",
  storageBucket: "plutus-df831.appspot.com"
};

firebase.initializeApp(firebaseConfig);

// try {
//     await GoogleSignIn.initAsync({ clientId: '<628682985628-06onsm5h1et6ugqgulchgljn3io88j24.apps.googleusercontent.com>' });
// } catch ({ message }) {
//     alert('GoogleSignIn.initAsync(): ' + message);
// }

// await GoogleSignIn.initAsync({ clientId: '<628682985628-06onsm5h1et6ugqgulchgljn3io88j24.apps.googleusercontent.com>' });

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    this.user = user;
    console.log("Signed In: " + JSON.stringify(user));
  } else {
    this.user = null;
    console.log("User signed out");
  }
  let authPromise = new Promise((resolve, reject) => {
    if (user) {
      return Promise.resolve(this.user);
    } else {
      return Promise.reject("No User logged in");
    }
  });
  return authPromise;
});

export const signInAnonymous = async () => {
  try {
    const result = await firebase
      .auth()
      .signInAnonymously()
      .then(credentials => {
        if (credential) {
          console.log("default app user ->", credential.user.toJSON());
        }
      })
      .catch(error => {
        let errorCode = error.code;
        let errorMessage = error.errorMessage;
        console.log(error);
      });
    return result;
  } catch (e) {
    console.log("Error signing in anonymously: " + e);
  }
};

export const signInWithEmail = async (
  email = "bob@gmail.com",
  password = "TheQuickBrownFox123"
) => {
  try {
    const result = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(credentials => {
        if (credentials) {
          this.user = credentials.user;
        }
      })
      .catch(error => {
        let errorCode = error.code;
        let errorMessage = error.errorMessage;
        console.log(error);
      });
  } catch (e) {
    console.log("Error signing in with email and password: " + e);
  }
};

export const createUserWithEmail = async (
  email = "bob@gmail.com",
  password = "TheQuickBrownFox123"
) => {
  try {
    const result = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(credentials => {
        if (credential) {
          console.log("default app user ->", credential.user.toJSON());
        }
      })
      .catch(error => {
        let errorCode = error.code;
        let errorMessage = error.errorMessage;
        console.log(error);
      });
  } catch (e) {
    console.log("Error signing in with email and password: " + e);
  }
};

// export const loginWithGoogle = async () => {
//     try {
//         await GoogleSignIn.initAsync({ clientId: '<628682985628-06onsm5h1et6ugqgulchgljn3io88j24.apps.googleusercontent.com>' });
//     } catch ({ message }) {
//         alert('GoogleSignIn.initAsync(): ' + message);
//     }
//     try {
//         await GoogleSignIn.askForPlayServicesAsync();
//         const { type, user } = await GoogleSignIn.signInAsync();
//         if (type === 'success') {
//             // ...
//         }
//     } catch ({ message }) {
//         alert('login: Error:' + message);
//     }
// }

export const signOut = async () => {
  try {
    firebase.auth().signOut();
  } catch (e) {
    console.log("Error Signing Out: " + e);
  }
};

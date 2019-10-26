import * as firebase from 'firebase';
// import { GoogleSignin } from 'react-native-google-signin';

let user = {}

// const initalizeFirebase = () => {
const firebaseConfig = {
    apiKey: "AIzaSyBvCXBxbaU6BQ3y2UzF7p9cVa7k2WHQroo",
    authDomain: "plutus-df831.firebaseapp.com",
    databaseURL: "https://plutus-df831.firebaseio.com",
    storageBucket: "plutus-df831.appspot.com"
};

firebase.initializeApp(firebaseConfig);
// }

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        this.user = user;
        console.log("Signed In: " + JSON.stringify(user));
    } else {
        this.user = {};
        console.log("User signed out");
    }
    let authPromise = new Promise((resolve, reject) => {
        if (user) {
            return Promise.resolve(this.user);
        }
        else {
            return Promise.reject("No User logged in");
        }
    });
    return authPromise;
});

export const signInAnonymous = async () => {
    try {
        const result = await firebase
            .auth().signInAnonymously()
            .then(credentials => {
                if (credential) {
                    console.log('default app user ->', credential.user.toJSON());
                }
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.errorMessage
                console.log(error);
            });
        return result;
    }
    catch (e) {
        console.log("Error signing in anonymously: " + e);
    }
}

export const signInWithGoogle = async () => {
    try {
        // add any configuration settings here:
        await GoogleSignin.configure();

        const data = await GoogleSignin.signIn();

        // create a new firebase credential with the token
        const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
        // login with credential
        const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);

        console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()));
    } catch (e) {
        console.error(e);
    }
}

export const signOut = async () => {
    try {
        firebase.auth().signOut();
    }
    catch (e) {
        console.log("Error Signing Out: " + e);
    }
}


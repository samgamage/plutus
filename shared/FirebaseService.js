import * as firebase from "firebase";
import { AsyncStorage } from "react-native";

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

firebase.auth().onAuthStateChanged(async user => {
    if (user) {
        await AsyncStorage.setItem("userToken", JSON.stringify(user));
        console.log("Signed In: " + JSON.stringify(user));
    } else {
        await AsyncStorage.setItem("userToken", "");
        console.log("User not signed in");
    }
    // let authPromise = new Promise((resolve, reject) => {
    //   if (user) {
    //     return Promise.resolve(this.user);
    //   } else {
    //     return Promise.reject("No User logged in");
    //   }
    // });
    // return authPromise;
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
                    return true;
                }
            })
            .catch(error => {
                let errorCode = error.code;
                let errorMessage = error.errorMessage;
                console.log(error);
                return false;
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

export const signOut = async () => {
    try {
        firebase.auth().signOut();
    } catch (e) {
        console.log("Error Signing Out: " + e);
    }
};

export const addCategoryType = async (categoryType, totalAmount, currentAmount = null) => {
    console.log("THe User")
    let newCategory = {
        "name": categoryType,
        "currentAmount": currentAmount,
        "totalAmount": totalAmount,
        "timestamp": []
    }
    firebase.database()
        // .ref(`${user.uid}/${categoryType}`)
        .ref(`ZVD4mxndrXWqLOrDqPmCn99jqoK2/${categoryType}`)
        .set({ newCategory })
        .then((response) => {
            console.log("Created new Category: " + response);
        })
        .catch(e => {
            console.log("Error creating new category: " + e);
        });
};

// export const addCategoryItem = async (categoryType, currentAmount) => {
//     firebase.database()
//     .ref()
// }

export const getCurrentDate = () => {
    let date = new Date()
    let fullDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
    return fullDate;
}
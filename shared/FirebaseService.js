import app from "firebase";
import { AsyncStorage } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBAjR-ZH5OO_QsuANNnXw1NvCvvtpwgRjY",
  authDomain: "jade-d10cb.firebaseapp.com",
  databaseURL: "https://jade-d10cb.firebaseio.com",
  projectId: "jade-d10cb",
  storageBucket: "jade-d10cb.appspot.com",
  messagingSenderId: "749378224473",
  appId: "1:749378224473:web:1a26c849ad418bf8ab4c48",
  measurementId: "G-GVYEDQ262M"
};

export default class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.db = app.database();
  }

  signInWithEmail = async (email, password) => {
    try {
      const { user } = await this.auth.signInWithEmailAndPassword(
        email,
        password
      );
      await AsyncStorage.setItem("userToken", JSON.stringify(user.uid));
      return user;
    } catch (e) {
      console.error(e);
      return e;
    }
  };

  signUpWithEmail = async (email, password, username = "") => {
    const userObj = {
      email,
      username,
      balance: 0,
      categories: []
    };
    try {
      const { user } = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await AsyncStorage.setItem("userToken", JSON.stringify(user.uid));
      await this.user(user.uid).set(userObj);
      return user;
    } catch (e) {
      console.error(e);
      return e;
    }
  };

  signOut = async () => {
    await this.auth.signOut();
    await AsyncStorage.setItem("userToken", "");
  };

  resetPassword = email => this.auth.sendPasswordResetEmail(email);

  updatePassword = password => this.auth.currentUser.updatePassword(password);

  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref("users");

  categories = uid => this.db.ref(`users/${uid}/categories`);

  category = (uid, cid) => this.db.ref(`users/${uid}/categories/${cid}`);

  categoryTransactions = (uid, cid) =>
    this.db.ref(`users/${uid}/categories/${cid}/transactions`);

  categoryTransaction = (uid, cid, tid) =>
    this.db.ref(`users/${uid}/categories/${cid}/transactions/${tid}`);

  transactions = uid => this.db.ref(`users/${uid}/transactions`);

  transaction = (uid, tid) => this.db.ref(`users/${uid}/transactions/${tid}`);

  getCurrentUser = async () => {
    const token = await AsyncStorage.getItem("userToken");
    return JSON.parse(token);
  };

  transformObjectToArray = obj => {
    const array = [];
    Object.keys(obj).forEach(key => array.push(obj[key]));
    return array;
  };
}

// firebase.auth().onAuthStateChanged(async user => {
//   if (user) {
//     console.log("Signed In: " + JSON.stringify(user));
//     user = user;
//   } else {
//     console.log("User not signed in");
//     user = {};
//   }
// });s

// export const signInWithEmail = (
//   email = "bob@gmail.com",
//   password = "TheQuickBrownFox123"
// ) => {
//   try {
//     return firebase
//       .auth()
//       .signInWithEmailAndPassword(email, password)
//       .then(async ({ user }) => {
//         if (user) {
//           await AsyncStorage.setItem("userToken", JSON.stringify(user.uid));
//         }
//       })
//       .catch(error => {
//         let errorCode = error.code;
//         let errorMessage = error.errorMessage;
//         console.log(error);
//         return null;
//       });
//   } catch (e) {
//     console.log("Error signing in with email and password: " + e);
//   }
// };

// export const createUserWithEmail = async (email, password) => {
//   try {
//     const result = await firebase
//       .auth()
//       .createUserWithEmailAndPassword(email, password)
//       .then(async ({ user }) => {
//         if (user) {
//           await AsyncStorage.setItem("userToken", JSON.stringify(user.uid));
//         }
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   } catch (e) {
//     console.log("Error signing in with email and password: " + e);
//   }
// };

// export const signOut = async () => {
//   try {
//     await firebase.auth.signOut();
//   } catch (e) {
//     console.log("Error Signing Out: " + e);
//   }
// };

// export const addCategoryType = async (
//   categoryType,
//   totalBudget,
//   currentAmount = 0
// ) => {
//   let newCategory = {
//     name: categoryType,
//     currentAmount: currentAmount,
//     totalBudget: totalBudget,
//     timestamp: []
//   };
//   const userId = JSON.parse(await AsyncStorage.getItem("userToken"));
//   let name = categoryType;
//   let newCategoryPushIndex = Object.keys(getAllCategories()).length - 1;
//   firebase
//     .database()
//     // .ref(`${user.uid}/${categoryType}`)
//     .ref(`${userId}/categories/${newCategoryPushIndex}`)
//     .push(newCategory)
//     .then(response => {
//       console.log("Created new Category: " + response);
//     })
//     .catch(e => {
//       console.log("Error creating new category: " + e);
//     });
// };

// export const addCategoryItem = async (categoryType, currentAmount) => {
//   const userId = JSON.parse(await AsyncStorage.getItem("userToken"));
//   let date = this.getCurrentDate();
//   firebase
//     .database()
//     .ref(`${userId}/${categoryType}/timestamp/`)
//     .push({ date: [] })
//     .then(response => {
//       console.log(`Added item to ${categoryType}`);
//     })
//     .catch(err => {
//       console.log(`Failed to add item to ${categoryType}: ${err}`);
//     });
// };

// export const getAllCategories = async () => {
//   const userId = JSON.parse(await AsyncStorage.getItem("userToken"));
//   let categories = {};
//   let ref = firebase.database().ref(`${userId}/categories`);
//   let categoriesArray = [];
//   await ref.orderByKey().once("value", snapshot => {
//     let numChildren = snapshot.numChildren();
//     for (let i = 0; i < numChildren; i++) {
//       categories[i] = snapshot.child(i);
//     }
//     // console.log(
//     //   "CATEGORIES: " + JSON.stringify(Object.values(categories), null, 4)
//     // );
//     // return Object.values(categories);
//     categoriesArray = Object.values(categories);
//   });
//   return categoriesArray;
// };

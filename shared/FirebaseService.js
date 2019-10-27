import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBvCXBxbaU6BQ3y2UzF7p9cVa7k2WHQroo",
  authDomain: "plutus-df831.firebaseapp.com",
  databaseURL: "https://plutus-df831.firebaseio.com",
  storageBucket: "plutus-df831.appspot.com"
};

export const firebaseInstance = firebase.initializeApp(firebaseConfig);
user = {
  uid: "ZVD4mxndrXWqLOrDqPmCn99jqoK2",
  displayName: null,
  photoURL: null,
  email: "bob@gmail.com",
  emailVerified: false,
  phoneNumber: null,
  isAnonymous: false,
  tenantId: null,
  providerData: [
    {
      uid: "bob@gmail.com",
      displayName: null,
      photoURL: null,
      email: "bob@gmail.com",
      phoneNumber: null,
      providerId: "password"
    }
  ],
  apiKey: "AIzaSyBvCXBxbaU6BQ3y2UzF7p9cVa7k2WHQroo",
  appName: "[DEFAULT]",
  authDomain: "plutus-df831.firebaseapp.com",
  stsTokenManager: {
    apiKey: "AIzaSyBvCXBxbaU6BQ3y2UzF7p9cVa7k2WHQroo",
    refreshToken:
      "AEu4IL1rJQsLZ3fVLCsVze3ZSsQsqG5Ay5Q9TVFXIqq3jKVimv9IxkVaARtxbONwB7XLeRJ_EL58Ym7GqJ6UjC3-SrQrSJStdp8jCZ70qQ-Xs3NzcSlRroUfi5gte0ayO4QrG_pp3ObDUP4yJZYQA9bLtZV_zoZL80LvfhEbqdBMvQ85DE3WW5jyCNGvVx19nUhFRlcn-UoV",
    accessToken:
      "eyJhbGciOiJSUzI1NiIsImtpZCI6ImEwYjQwY2NjYmQ0OWQxNmVkMjg2MGRiNzIyNmQ3NDZiNmZhZmRmYzAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcGx1dHVzLWRmODMxIiwiYXVkIjoicGx1dHVzLWRmODMxIiwiYXV0aF90aW1lIjoxNTcyMTI3MjA0LCJ1c2VyX2lkIjoiWlZENG14bmRyWFdxTE9yRHFQbUNuOTlqcW9LMiIsInN1YiI6IlpWRDRteG5kclhXcUxPckRxUG1Dbjk5anFvSzIiLCJpYXQiOjE1NzIxMjcyMDQsImV4cCI6MTU3MjEzMDgwNCwiZW1haWwiOiJib2JAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImJvYkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.doVRX_gHFidrYK2gFh4Nqh8Ct6syF4Dh45TIRjFK-CMblTzLd426x1GBrxarwAll3FP4tFE7pQ4QHvqtDIFxq6XcFqY7NF8QepxapIdivmY3k_PrqIXWoYlTQMGOCUi5L3mSc5L61wokIzhauT2AbmynZAHh-dAwevRxeKoYNd-6T9E0R8k1ox5x-z5eZ_ZGYydSNNeCqBjh_th60sWPG0QAmF_IY-4VoEObxxt-fPkrDXjie7VU5RLxzuwLdxlL99RHI7TFB3DEaLWszxZoBniAFMmb6IZjObmUJIfLm_mRq7f3aBxafqxMlcfk5b4JXkselpUHN4R7asO3_qCzoQ",
    expirationTime: 1572130802603
  },
  redirectEventId: null,
  lastLoginAt: "1572127204839",
  createdAt: "1572102119291"
};

export const getUser = user => {};

firebase.auth().onAuthStateChanged(async user => {
  if (user) {
    console.log("Signed In: " + JSON.stringify(user));
    user = user;
  } else {
    console.log("User not signed in");
    user = {};
  }
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

export const signInWithEmail = (
  email = "bob@gmail.com",
  password = "TheQuickBrownFox123"
) => {
  try {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        if (user) {
          return user;
        }
      })
      .catch(error => {
        let errorCode = error.code;
        let errorMessage = error.errorMessage;
        console.log(error);
        return null;
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
    await firebase.auth().signOut();
  } catch (e) {
    console.log("Error Signing Out: " + e);
  }
};

export const addCategoryType = async (
  categoryType,
  totalBudget,
  currentAmount = null
) => {
  let currentList = await this.getAllCategories();
  console.log("The List: " + currentList);

  let ref = firebase.database().ref(`${user.uid}/categories`);
  await ref.orderByKey().once("value", snapshot => {
    let numChildren = snapshot.numChildren();
    for (let i = 0; i < numChildren; i++) {
      categories[i] = snapshot.child(i);
    }
    console.log("CATEGORIES: " + JSON.stringify(Object.values(categories)));
  });

  let newCategory = {
    name: categoryType,
    currentAmount: currentAmount,
    totalBudget: totalBudget,
    timestamp: []
  };

  let name = categoryType;
  firebase
    .database()
    // .ref(`${user.uid}/${categoryType}`)
    .ref(`ZVD4mxndrXWqLOrDqPmCn99jqoK2/categories`)
    // .push({ [categoryType]: newCategory })
    .push([newCategory])
    .then(response => {
      console.log("Created new Category: " + response);
    })
    .catch(e => {
      console.log("Error creating new category: " + e);
    });
  console.log();
};

export const addCategoryItem = async (categoryType, currentAmount) => {
  let date = this.getCurrentDate();
  firebase
    .database()
    .ref(`ZVD4mxndrXWqLOrDqPmCn99jqoK2/${categoryType}/timestamp/`)
    .update({ date: [] })
    .then(response => {
      console.log(`Added item to ${categoryType}`);
    })
    .catch(err => {
      console.log(`Failed to add item to ${categoryType}: ${err}`);
    });
};

export const getAllCategories = async () => {
  let categories = {};
  let ref = firebase.database().ref(`${user.uid}/categories`);
  await ref.orderByKey().once("value", snapshot => {
    let numChildren = snapshot.numChildren();
    for (let i = 0; i < numChildren; i++) {
      categories[i] = snapshot.child(i);
    }
    console.log("CATEGORIES: " + JSON.stringify(Object.values(categories)));
    // console.log("SNAPSHOT: " + snapshot.child("");
    // categories =
  });

  return categories;
};

export const getCurrentDate = () => {
  // console.log("THE USER: " + JSON.stringify(user))
  let date = new Date();
  let fullDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
  return fullDate;
};

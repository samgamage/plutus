import React from "react";

const FirebaseContext = React.createContext(null);
export const UserContext = React.createContext(null);

export const withFirebase = Component => props => {
  return (
    <FirebaseContext.Consumer>
      {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  );
};

export const withAuth = Component => props => {
  return (
    <UserContext.Consumer>
      {user => <Component {...props} {...user} />}
    </UserContext.Consumer>
  );
};

export default FirebaseContext;

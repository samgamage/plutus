import { H1 } from "native-base";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ProgressBar, Title } from "react-native-paper";
import { withFirebase } from "../shared/FirebaseContext";

const StatusBar = ({ firebase, uid, totalBudget }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const asyncFunc = async () => {
      firebase.user(uid).on("value", snapshot => {
        const user = snapshot.val();
        setUser(user);
        setLoading(false);
      });
    };
    asyncFunc();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <React.Fragment>
      <H1>Your balance: {user.balance}</H1>
      <Title>Your budget: $0</Title>
      <ProgressBar progress={0} style={{ marginTop: 8 }} color="#00a86b" />
    </React.Fragment>
  );
};

export default withFirebase(StatusBar);

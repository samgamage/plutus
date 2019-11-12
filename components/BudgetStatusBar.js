import { Feather } from "@expo/vector-icons";
import accounting from "accounting";
import { H1 } from "native-base";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ActivityIndicator, ProgressBar, Title } from "react-native-paper";
import styled from "styled-components";
import { withFirebase } from "../shared/FirebaseContext";

const StatusBar = ({ firebase, uid, totalBudget, showModal, hideModal }) => {
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
      <SpaceBetween>
        <H1>Your balance: {accounting.formatMoney(user.balance)}</H1>
        <TouchableOpacity onPress={showModal}>
          <Feather name="edit-2" size={24} style={{ color: "gray" }} />
        </TouchableOpacity>
      </SpaceBetween>
      <Title>Your budget: {accounting.formatMoney(totalBudget)}</Title>
      <ProgressBar
        progress={
          totalBudget / user.balance < 1 ? totalBudget / user.balance : 1
        }
        style={{ marginTop: 8 }}
        color="#00a86b"
      />
    </React.Fragment>
  );
};

const SpaceBetween = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export default withFirebase(StatusBar);

import React from "react";
import { TextInputMask } from "react-native-masked-text";

const MoneyInput = ({ value, onChangeText, ...props }) => (
  <TextInputMask
    {...props}
    type={"money"}
    value={value}
    options={{
      precision: 2,
      separator: ".",
      delimiter: ",",
      unit: "$",
      suffixUnit: ""
    }}
    onChangeText={onChangeText}
    style={{
      padding: 8,
      backgroundColor: "white",
      marginTop: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "gray"
    }}
  />
);

export default MoneyInput;

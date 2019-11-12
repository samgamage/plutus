import accounting from "accounting";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import React from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ActivityIndicator, Card, FAB, Modal, Text } from "react-native-paper";
import styled from "styled-components";
import config from "../config";

const recordingOptions = {
  android: {
    extension: ".m4a",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000
  },
  ios: {
    extension: ".wav",
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false
  }
};

export default class VoiceRecognition extends React.Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.state = {
      isAnalyzing: false,
      isFetching: false,
      isRecording: false,
      command: "",
      visible: false,
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      error: null,
      response: null
    };
  }

  showModal = () => this.setState({ visible: true });

  hideModal = () => this.setState({ visible: false });

  deleteRecordingFile = async () => {
    console.log("Deleting file");
    try {
      const info = await FileSystem.getInfoAsync(this.recording.getURI());
      await FileSystem.deleteAsync(info.uri);
    } catch (error) {
      console.log("There was an error deleting recording file", error);
    }
  };

  analyzeStatement = async statement => {
    try {
      console.log(statement);
      const response = await fetch(config.NLP_FUNCTION_URL, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ text: statement || "" })
      });

      const data = await response.json();

      data.price = parseInt(data.price);

      console.log(data);
      if (
        !data.industry ||
        data.industry === "None" ||
        !data.price ||
        data.price === 0 ||
        data.action !== 1
      ) {
        throw new Error("Insufficient data to map command to action.");
      }

      if (data) {
        switch (data.action) {
          case 1:
            // user wants to add funds
            const res = await this.props.addFundsWithAmountAndCategory(
              data.price,
              data.industry
            );
            console.log(res);
            if (res && res.ok) {
              this.setState({
                isAnalyzing: false,
                response: {
                  ok: true,
                  message: `Added ${accounting.formatMoney(data.price)} to ${
                    data.industry
                  }`
                }
              });
            } else {
              throw new Error("Unable to map command to action.");
            }
        }
      }
    } catch (e) {
      this.setState({ isAnalyzing: false, error: e });
    }
  };

  /**
   * Gets the transcription from google cloud function using NLP
   */
  getTranscription = async () => {
    this.setState({ isFetching: true });
    try {
      const info = await FileSystem.getInfoAsync(this.recording.getURI());
      console.log(`FILE INFO: ${JSON.stringify(info)}`);
      const uri = info.uri;
      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "audio/x-wav",
        name: "speech2text"
      });
      const response = await fetch(config.CLOUD_FUNCTION_URL, {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      this.setState({ command: data.transcript, isAnalyzing: true });
      this.analyzeStatement(data.transcript);
    } catch (error) {
      console.log("There was an error reading file", error);
      this.stopRecording();
      this.resetRecording();
    }
    this.setState({ isFetching: false });
  };

  /**
   * Starts the recording by asking permission and then calling the Audio api from expo
   */
  startRecording = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (status !== "granted") return;

    this.setState({ isRecording: true });
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
      staysActiveInBackground: false
    });
    const recording = new Audio.Recording();

    try {
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
    } catch (error) {
      console.error(error);
      this.stopRecording();
    }

    this.recording = recording;
  };

  stopRecording = async () => {
    this.setState({ isRecording: false });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
  };

  toggleRecording = () => {
    if (this.state.isRecording) {
      this.stopRecording();
      this.hideModal();
      this.handleOnPressOut();
      Animated.timing(this.state.scale, {
        toValue: 1,
        duration: 300,
        easing: Easing.in()
      }).start();
      Animated.spring(this.state.opacity, {
        toValue: 1,
        easing: Easing.in()
      }).start();
    } else {
      this.startRecording();
      this.showModal();
    }
  };

  resetRecording = () => {
    this.deleteRecordingFile();
    this.recording = null;
  };

  handleOnPressIn = () => {
    this.startRecording();
  };

  handleOnPressOut = () => {
    this.stopRecording();
    this.getTranscription();
  };

  handleCommandChange = command => {
    this.setState({ command });
  };

  render() {
    const {
      isRecording,
      command,
      isFetching,
      isAnalyzing,
      error,
      response
    } = this.state;

    if (error) {
      console.log(error);
      return (
        <React.Fragment>
          <Modal
            visible={this.state.error}
            onDismiss={() => this.setState({ error: null })}
            dismissable={true}
            contentContainerStyle={styles.flexContainer}
          >
            <View style={{ marginLeft: 16, marginRight: 16 }}>
              <Card>
                <Card.Title title="Error" />
                <Card.Content>
                  <Text>
                    Something unexpected occurred. Please try voice input again.
                  </Text>
                </Card.Content>
              </Card>
            </View>
          </Modal>
          <VoiceRecognitionGroup style={styles.fab}>
            {isFetching && <ActivityIndicator style={{ marginRight: 8 }} />}
            <FAB
              icon={isRecording ? "stop" : "microphone"}
              onPress={this.toggleRecording}
            />
          </VoiceRecognitionGroup>
        </React.Fragment>
      );
    }

    if (response) {
      return (
        <React.Fragment>
          <Modal
            visible={this.state.response}
            onDismiss={() => this.setState({ response: null })}
            dismissable={true}
            contentContainerStyle={styles.flexContainer}
          >
            <View style={{ marginLeft: 16, marginRight: 16 }}>
              <Card>
                <Card.Title title="Success" />
                <Card.Content>
                  <Text>{response.message}</Text>
                </Card.Content>
              </Card>
            </View>
          </Modal>
          <VoiceRecognitionGroup style={styles.fab}>
            {isFetching && <ActivityIndicator style={{ marginRight: 8 }} />}
            <FAB
              icon={isRecording ? "stop" : "microphone"}
              onPress={this.toggleRecording}
            />
          </VoiceRecognitionGroup>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Modal visible={this.state.visible} dismissable={true} />
        <VoiceRecognitionGroup style={styles.fab}>
          <AnimatedContainer
            style={{
              transform: [{ scale: this.state.scale }],
              opacity: this.state.opacity
            }}
          >
            {isRecording && (
              <FlatList
                keyExtractor={item => item.id + item.message}
                data={this.state.messages}
                renderItem={item => (
                  <View
                    style={{
                      backgroundColor: "white",
                      marginBottom: 16,
                      marginRight: 8,
                      padding: 8,
                      borderRadius: 8
                    }}
                  >
                    <Text>{item.message}</Text>
                  </View>
                )}
              />
            )}
          </AnimatedContainer>
          {(isFetching || isAnalyzing) && (
            <ActivityIndicator style={{ marginRight: 8 }} />
          )}
          <FAB
            icon={isRecording ? "stop" : "microphone"}
            onPress={this.toggleRecording}
          />
        </VoiceRecognitionGroup>
      </React.Fragment>
    );
  }
}

const VoiceRecognitionGroup = styled.View`
  display: flex;
  flex-direction: row;
`;

const Container = styled.View``;

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    backgroundColor: "#fff",
    alignItems: "center"
  },
  button: {
    backgroundColor: "#48C9B0",
    paddingVertical: 20,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 70,
    flex: 1,
    alignItems: "center"
  }
});

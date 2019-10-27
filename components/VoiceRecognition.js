import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import React from "react";
import { Animated, Easing, StyleSheet, Text } from "react-native";
import { FAB, Modal } from "react-native-paper";
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
      isFetching: false,
      isRecording: false,
      command: "",
      visible: false,
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1)
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { command } = this.state;
    if (prevState.command === null && command !== null) {
      // command changed
    }
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
      console.log(data);
      this.setState({ command: data.transcript });
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
      console.log(error);
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
    const { isRecording, command, isFetching } = this.state;
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
              <Text style={{ color: "white", marginRight: 8 }}>
                What can I help you with today?
              </Text>
            )}
          </AnimatedContainer>
          <FAB
            icon={isRecording ? "stop" : "microphone"}
            onPress={this.toggleRecording}
            small
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
    bottom: 86,
    flex: 1,
    alignItems: "center"
  }
});

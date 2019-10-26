import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import config from "./config";

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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.state = {
      isFetching: false,
      isRecording: false,
      command: ""
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { command } = this.state;
    if (prevState.command === null && command !== null) {
      // command changed
    }
  }

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
   * Gets the transcription from fetching
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
   *
   * @memberof App
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

  handlcommandChange = command => {
    this.setState({ command });
  };

  render() {
    const { isRecording, command, isFetching } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {isRecording && (
            <FontAwesome name="microphone" size={32} color="#48C9B0" />
          )}
          {!isRecording && (
            <FontAwesome name="microphone" size={32} color="#48C9B0" />
          )}
          <Text>Voice Command</Text>
          <TouchableOpacity
            style={styles.button}
            onPressIn={this.handleOnPressIn}
            onPressOut={this.handleOnPressOut}
          >
            {isFetching && <ActivityIndicator color="#ffffff" />}
            {!isFetching && <Text>Hold for Voice Command</Text>}
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text>{command}</Text>
        </View>
      </SafeAreaView>
    );
  }
}

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
  }
});

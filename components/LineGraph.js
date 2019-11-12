import * as axis from "d3-axis";
import { scaleLinear, scaleTime } from "d3-scale";
import * as shape from "d3-shape";
import merge from "lodash/merge";
import React from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View
} from "react-native";
import { Card } from "react-native-paper";
import Svg, { Defs, G, LinearGradient, Path, Stop } from "react-native-svg";
import * as path from "svg-path-properties";

const d3 = {
  shape,
  axis
};

const height = 200;
const width = Dimensions.get("window").width - 32;
const verticalPadding = 5;
const cursorRadius = 10;

const data = [
  { x: new Date(2018, 9, 1), y: 0 },
  { x: new Date(2018, 9, 16), y: 0 },
  { x: new Date(2018, 9, 17), y: 200 },
  { x: new Date(2018, 10, 1), y: 200 },
  { x: new Date(2018, 10, 2), y: 300 },
  { x: new Date(2018, 10, 5), y: 300 }
];

const scaleX = scaleTime()
  .domain([new Date(2018, 9, 1), new Date(2018, 10, 5)])
  .range([0, width]);
const scaleY = scaleLinear()
  .domain([0, 300])
  .range([height - verticalPadding, verticalPadding]);
d3.axis.axisLeft(scaleY);
d3.axis.axisBottom(scaleX);

const line = d3.shape
  .line()
  .x(d => scaleX(d.x))
  .y(d => scaleY(d.y))
  .curve(d3.shape.curveBasis)(data);
const properties = path.svgPathProperties(line);
const lineLength = properties.getTotalLength();

export default class LineGraph extends React.Component {
  state = {
    x: new Animated.Value(0)
  };

  moveCursor(value) {
    const { x, y } = properties.getPointAtLength(lineLength - value);
  }

  componentDidMount() {
    this.state.x.addListener(({ value }) => this.moveCursor(value));
    this.moveCursor(0);
  }

  render() {
    const { x } = this.state;
    const translateX = x.interpolate({
      inputRange: [0, lineLength],
      outputRange: [width, 0],
      extrapolate: "clamp"
    });
    return (
      <SafeAreaView style={styles.root}>
        <View style={merge(styles.container, this.props.style)}>
          <Card>
            <Svg {...{ width, height }}>
              <G style={{}}></G>
              <Defs>
                <LinearGradient
                  x1="50%"
                  y1="0%"
                  x2="50%"
                  y2="100%"
                  id="gradient"
                >
                  <Stop stopColor="#CDE3F8" offset="0%" />
                  <Stop stopColor="#eef6fd" offset="80%" />
                  <Stop stopColor="#FEFFFF" offset="100%" />
                </LinearGradient>
              </Defs>
              <Path
                d={line}
                fill="transparent"
                stroke="#367be2"
                strokeWidth={5}
              />
              <Path
                d={`${line} L ${width} ${height} L 0 ${height}`}
                fill="url(#gradient)"
              />
            </Svg>
          </Card>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  container: {
    marginTop: 60,
    height,
    width,
    marginBottom: 60
  }
});

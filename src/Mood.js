/*
 * @Author: Dinesh Maharjan 
 * @Email: httpdeveloper@gmail.com
 * @Github: https://github.com/httpdeveloper
 * @Web: http://dineshmaharjan.com.np
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';

import PropTypes from 'prop-types';
import styles from './MoodStyle';

const MIN_SCALE = 0.9;
const MAX_SCALE = 1.5;

const defaultProps = {
  id: 0,
  icon: {},
  text: '',
  selected: false,
  onMoodLayout: () => {},
  onSelectMood: () => {},
  style: {}
};

class Mood extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      scale: MIN_SCALE,
      marginTop: 0,
      showText: false
    };

    this._animateMood = new Animated.Value(MIN_SCALE);
    this._selectedMood = null;
  }

  componentDidUpdate() {
    this._moodRef.measure((_, __, width, height, pageX, pageY) => {
      const layoutPosition = {
        x: pageX,
        y: pageY,
        width,
        height,
        id: this.props.id
      };

      this.props.onMoodLayout && this.props.onMoodLayout(layoutPosition);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected) {
      if (this._selectedMood === nextProps.id) return;

      const marginTop =
        Platform.OS === 'ios'
          ? nextProps.text ? -45 : -28
          : nextProps.text ? -30 : -12;

      this.animate(MIN_SCALE, MAX_SCALE, marginTop, finished => {
        if (finished) {
          this._animateMood = new Animated.Value(MIN_SCALE);
          this._selectedMood = nextProps.id;
        }
      });
    } else {
      if (this._selectedMood) {
        this.animate(MAX_SCALE, MIN_SCALE, 0, finished => {
          if (finished) {
            this._selectedMood = null;
            this._animateMood = new Animated.Value(MIN_SCALE);
          }
        });
      } else {
        this._animateMood = new Animated.Value(MIN_SCALE);

        this._selectedMood = null;
        this.setState({
          scale: MIN_SCALE,
          showText: false,
          marginTop: 0
        });
      }
    }
  }

  /** 
   *  Scaling starts as soon as mood selects
   * 
   *  @param {number} minScale
   *  @param {number} maxScale
   *  @param {number} marginTop
   *  @param {func} callback
   *  @returns {undefined}
   */

  animate(minScale, maxScale, marginTop, callback) {
    this.setState(
      {
        marginTop,
        showText: marginTop !== 0,
        scale: this._animateMood.interpolate({
          inputRange: [0, 10],
          outputRange: [minScale, maxScale],
          extrapolate: 'clamp'
        })
      },
      () => {
        Animated.spring(this._animateMood, {
          toValue: 10,
          duration: 50,
          speed: 80,
          velocity: 8,
          bounciness: 0
        }).start(({ finished }) => {
          if (!finished) return;
          callback(finished);
        });
      }
    );
  }

  render() {
    const { icon, perspective, style, text } = this.props;

    const transform = Platform.select({
      ios: [{ scale: this.state.scale }],
      android: [
        { scale: this.state.scale },
        { perspective: perspective || 1000 }
      ]
    });

    return (
      <TouchableWithoutFeedback
        onPressIn={() => this.props.onSelectMood(this.props.id)}
        hitSlop={{ top: 10, right: 0, bottom: 10, left: 0 }}
      >
        <View
          renderToHardwareTextureAndroid={true}
          ref={ref => (this._moodRef = ref)}
          style={
            Platform.OS === 'android'
              ? [styles.androidMoodContainer, style]
              : null
          }
        >
          <Animated.View
            style={[
              styles.scaleStyle,
              {
                transform
              },
              { marginTop: this.state.marginTop }
            ]}
          >
            {this.state.showText &&
              text.length > 0 && <Text style={styles.moodText}>{text}</Text>}
            <Image source={icon} style={styles.moodIcon} />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

Mood.propTypes = {
  id: PropTypes.number.isRequired,
  icon: PropTypes.oneOfType([Image.propTypes.source, PropTypes.object]),
  text: PropTypes.string,
  selected: PropTypes.bool,
  onMoodLayout: PropTypes.func,
  onSelectMood: PropTypes.func,
  style: View.propTypes.style
};

Mood.defaultProps = defaultProps;

export default Mood;

/*
 * @Author: Dinesh Maharjan 
 * @Email: httpdeveloper@gmail.com
 * @Github: https://github.com/httpdeveloper
 * @Web: http://dineshmaharjan.com.np
 */

import React, { Component } from 'react';
import {
  View,
  Modal,
  Easing,
  Animated,
  Platform,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';

import PropTypes from 'prop-types';
import Mood from './Mood';
import styles from './MoodPopoverStyle';

const { width } = Dimensions.get('window');
const POPUP_DISPLAY_DISTANCE = 100; // How far to be displayed from press item
const POPUP_WIDTH = width - 20;

const defaultProps = {
  moods: [],
  initialPosition: {},
  selectedMood: () => {},
  onMoodLayout: () => {},
  onBackgroundPress: () => {},
  onSelectMood: () => {}
};

class MoodPopover extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      scale: 1,
      modalVisible: true,
      popupVisible: false,
      selectedSmiley: false,
      animatePopupWidth: 50
    };

    this._animatePopupView = new Animated.Value(0);
    this._animatePopupWidth = new Animated.Value(50);
    this._animatePopupScale = new Animated.Value(1);
    this._selectedMood = null;
  }

  componentDidMount() {
    this._animateSlide();
  }

  /**
   *  Scaling starts as soon as selected mood receives
   * 
   */

  componentWillReceiveProps(nextProps) {
    if (!nextProps.selectedMood) {
      this._selectedMood = null;
    }

    if (this._selectedMood) return;

    if (
      this.props.selectedMood !== nextProps.selectedMood &&
      !this._selectedMood
    ) {
      this._animatePopupScale = new Animated.Value(1);
    }

    this._selectedMood = nextProps.selectedMood;
    const minScale = nextProps.selectedMood ? 1 : 0.95;
    const maxScale = nextProps.selectedMood ? 0.95 : 1;

    this.setState(
      {
        scale: this._animatePopupScale.interpolate({
          inputRange: [0, 10],
          outputRange: [minScale, maxScale],
          extrapolate: 'clamp'
        })
      },
      () => {
        Animated.spring(this._animatePopupScale, {
          toValue: 10,
          duration: 50,
          speed: 50,
          velocity: 8,
          bounciness: 0
        }).start(() => {});
      }
    );
  }

  /**
   *  Starts width animation transition after vertical slide animation finish
   * 
   *  @returns {undefined}
   */

  _animateWidth = () => {
    this.setState(
      {
        animatePopupWidth: this._animatePopupWidth.interpolate({
          inputRange: [2, 500],
          outputRange: [50, POPUP_WIDTH],
          extrapolate: 'clamp'
        })
      },
      () => {
        Animated.timing(this._animatePopupWidth, {
          toValue: 500,
          duration: 160,
          easing: Easing.easeInOutQuad
        }).start(({ finished }) => {
          if (!finished) return;
          this.setState({ popupVisible: true });
        });
      }
    );
  };

  /**
   *  Starts vertical slide animation after popup display
   *
   *  @returns {undefined}
   */

  _animateSlide = () => {
    Animated.timing(this._animatePopupView, {
      toValue: 500,
      duration: 200,
      easing: Easing.easeInOutQuart
    }).start(({ finished }) => {
      if (!finished) return;
      this._animateWidth();
    });
  };

  /**
   *  Setup vertical slide animation with opacity based on direction. 1 for bottom to top and -1 for top to bottom
   * 
   *  @param {number} direction
   *  @returns {object}
   */

  _slideView = direction => {
    return {
      opacity: this._animatePopupView.interpolate({
        inputRange: [0, 500],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      }),
      transform: [
        {
          translateY: this._animatePopupView.interpolate({
            inputRange: [0, 500],
            outputRange: [direction * 50, 0],
            extrapolate: 'clamp'
          })
        },
        { perspective: 1000 }
      ]
    };
  };

  /**
   *  Close request modal for Android
   *
   *  @returns {undefined}
   */

  _closeModal() {
    this.setState({ modalVisible: false });
  }

  /**
   *  Get popup's top position based on initial position
   * 
   *  @param {object} initialPosition
   *  @param {boolean} includeExtraHeight
   *  @return {number}
   */

  getPopoverTop(initialPosition, includeExtraHeight) {
    return initialPosition.y > POPUP_DISPLAY_DISTANCE
      ? initialPosition.y -
          POPUP_DISPLAY_DISTANCE -
          (includeExtraHeight && Platform.OS === 'android' ? 60 : 0)
      : POPUP_DISPLAY_DISTANCE;
  }

  render() {
    const { initialPosition, moods, selectedMood } = this.props;
    if (!moods) return;

    const popoverTopDisplay = initialPosition.y > POPUP_DISPLAY_DISTANCE;
    const direction = popoverTopDisplay ? 1 : -1;

    const moodArr = [];
    const moodWidth = parseInt(POPUP_WIDTH / moods.length);

    moods.forEach((mood, index) => {
      moodArr.push(
        <Mood
          key={index}
          id={mood.id}
          icon={mood.icon}
          text={mood.text}
          selected={selectedMood === mood.id}
          onMoodLayout={layout => this.props.onMoodLayout(layout)}
          onSelectMood={id => this.props.onSelectMood(id)}
          style={{
            width: moodWidth + 0.8,
            left: index * moodWidth,
            top: this.state.popupVisible ? -60 : 0,
            height: this.state.popupVisible ? 165 : 45,
            paddingTop: this.state.popupVisible ? 120 : 0
          }}
        />
      );
    });

    return (
      <Modal
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => this._closeModal()}
      >
        <Animated.View
          style={[
            Platform.OS === 'ios'
              ? styles.container
              : [
                  styles.androidContainer,
                  {
                    height: this.state.popupVisible ? 110 : 45,
                    backgroundColor: this.state.popupVisible
                      ? 'transparent'
                      : popoverTopDisplay ? '#fff' : 'transparent'
                  }
                ],
            {
              top: popoverTopDisplay
                ? this.getPopoverTop(initialPosition, this.state.popupVisible)
                : Platform.OS === 'android' ? 40 : POPUP_DISPLAY_DISTANCE,
              width: this.state.popupVisible
                ? POPUP_WIDTH
                : this.state.animatePopupWidth
            },
            this.state.popupVisible
              ? {
                  transform: [
                    { scale: this.state.scale },
                    { perspective: this.props.perspective || 1000 }
                  ]
                }
              : this._slideView(direction)
          ]}
        >
          {moodArr}
        </Animated.View>

        {Platform.OS === 'android' && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: popoverTopDisplay
                  ? this.getPopoverTop(initialPosition, false)
                  : Platform.OS === 'android'
                    ? 100
                    : POPUP_DISPLAY_DISTANCE + 60,
                width: this.state.popupVisible
                  ? POPUP_WIDTH
                  : this.state.animatePopupWidth
              },
              this.state.popupVisible
                ? {
                    transform: [
                      { scale: this.state.scale },
                      { perspective: this.props.perspective || 1000 }
                    ]
                  }
                : null,
              styles.androidMoodWrapper
            ]}
          />
        )}
        <TouchableWithoutFeedback
          onPressIn={() => this.props.onBackgroundPress()}
        >
          <View style={styles.backgroundView} />
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

MoodPopover.propTypes = {
  moods: PropTypes.array.isRequired,
  initialPosition: PropTypes.object.isRequired,
  selectedMood: PropTypes.oneOfType([null, PropTypes.number]),
  onMoodLayout: PropTypes.func,
  onBackgroundPress: PropTypes.func,
  onSelectMood: PropTypes.func
};

MoodPopover.defaultProps = defaultProps;

export default MoodPopover;

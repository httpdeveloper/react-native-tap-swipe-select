/*
 * @Author: Dinesh Maharjan 
 * @Email: httpdeveloper@gmail.com
 * @Github: https://github.com/httpdeveloper
 * @Web: http://dineshmaharjan.com.np
 */

import React, { Component } from 'react';
import { View, PanResponder, Animated } from 'react-native';
import PropTypes from 'prop-types';

import MoodPopover from './MoodPopover';

const defaultProps = {
  moods: [],
  swipeArea: {},
  initialPosition: {},
  swipeEnabled: false,
  onSwipe: () => {},
  onSwipeRelease: () => {}
};

class Swiper extends Component<{}> {
  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();
    this.state = {
      position,
      selectedMood: null,
      containerWidth: null,
      containerHeight: null
    };

    this._moodLayouts = [];
    this._handleMoving = this._handleMoving.bind(this);
    this._listener = position.addListener(this._handleMoving);
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => this.props.swipeEnabled,
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        !!this.props.swipeEnabled,
      onPanResponderMove: (...args) =>
        Animated.event([
          null,
          {
            dx: this.state.position.x,
            dy: this.state.position.y
          }
        ]).apply(this, args),
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (!this.props.swipeEnabled) return;

        this._handleRelease();
      }
    });
  }

  componentWillUnmount() {
    if (this._listener) this.state.position.removeListener(this._listener);
  }

  /**
   *  Check the swipe area based on moveable point with initial position of touchable area
   *  Return true either moveable points are within boundry points or swipe area is not defined
   *  else false. If swipe area is not defined then whole area is considered as swipeable
   *
   *  @param {object} point
   *  @returns {boolean}
   */

  _checkSwipeArea(point) {
    const { initialPosition, swipeArea } = this.props;

    if (!swipeArea || Object.keys(swipeArea).length === 0) return true;

    const _pointY = point.y + initialPosition.y;

    if (_pointY > swipeArea.y && _pointY <= swipeArea.y + swipeArea.height) {
      return true;
    }

    return false;
  }

  /**
   *  Find the selected mood based on the points during swiping. Store the selected mood on the state if
   *  the moveable points are within swipe area or boundry points otherwise null will be stored
   *
   *  @param {object} point
   *  @returns {undefined}
   */

  _handleMoving(point) {
    if (!this.props.swipeEnabled) return;

    let hasSelected = false;

    this._moodLayouts.forEach(mood => {
      if (
        !hasSelected &&
        mood.x + mood.width >= point.x + this.props.initialPosition.x
      ) {
        if (this._checkSwipeArea(point)) {
          this.setState({ selectedMood: mood.id });
          hasSelected = true;
        } else {
          this.setState({ selectedMood: null });
          hasSelected = false;
        }
      }
    });

    this.props.onSwipe && this.props.onSwipe(true, hasSelected);
  }

  /**
   *   Store the swipeable's container dimension
   *
   *   @param {object} nativeEvent
   *   @returns {undefined}
   */

  _setSwiperContainerLayout(nativeEvent) {
    this.setState({
      containerWidth: nativeEvent.layout.width,
      containerHeight: nativeEvent.layout.height
    });
  }

  /**
   *  Release with the selected mood and reset to null
   *
   *  @returns {undefined}
   */

  _handleRelease() {
    this.props.onSwipe && this.props.onSwipe(false, false);

    this.props.onSwipeRelease &&
      this.props.onSwipeRelease(this.state.selectedMood);

    this.setState({
      selectedMood: null
    });
  }

  /**
   *   Store the mood layouts on array stacks
   *
   *   @param {object} moodLayout
   *   @returns {undefined}
   */

  _updateMoodLayout(moodLayout) {
    const matchedIndex = this._moodLayouts.findIndex(
      mood => mood.id === moodLayout.id
    );

    if (matchedIndex !== -1) {
      this._moodLayouts[matchedIndex] = moodLayout;
    } else {
      this._moodLayouts.push(moodLayout);
    }
  }

  /**
   *  Update selected mood via tab select and close automatically
   *
   *  @param {number|null} selectedMood
   *  @returns {undefined}
   */

  _updateSelectedMood(selectedMood) {
    this.setState({ selectedMood }, () => {
      this._handleRelease();
    });
  }

  /**
   *  Release if background press is triggered
   *
   *  @returns {undefined}
   */

  _onBackgroundPress() {
    this._handleRelease();
  }

  render() {
    const { swipeEnabled, children, moods, initialPosition } = this.props;

    return (
      <View
        onLayout={({ nativeEvent }) =>
          this._setSwiperContainerLayout(nativeEvent)
        }
        style={{ flex: 1 }}
        {...this._panResponder.panHandlers}
      >
        {children}
        {swipeEnabled ? (
          <MoodPopover
            selectedMood={this.state.selectedMood}
            onMoodLayout={moodLayout => this._updateMoodLayout(moodLayout)}
            onBackgroundPress={() => this._onBackgroundPress()}
            onSelectMood={selectedMood =>
              this._updateSelectedMood(selectedMood)
            }
            moods={moods}
            initialPosition={initialPosition}
          />
        ) : null}
      </View>
    );
  }
}

Swiper.propTypes = {
  moods: PropTypes.array.isRequired,
  initialPosition: PropTypes.object.isRequired,
  swipeArea: PropTypes.object,
  swipeEnabled: PropTypes.bool.isRequired,
  onSwipe: PropTypes.func,
  onSwipeRelease: PropTypes.func
};

Swiper.defaultProps = defaultProps;

export default Swiper;

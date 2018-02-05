/*
 * @Author: Dinesh Maharjan 
 * @Email: httpdeveloper@gmail.com
 * @Github: https://github.com/httpdeveloper
 * @Web: http://dineshmaharjan.com.np
 */

import React, { Component } from 'react';
import { Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-tap-swipe-select';
import moods from './moods';
import styles from './FeedStyle';

const feeds = require('./feed');

const SLIDE_VALID_MSG = 'Slide Finger Across';
const SLIDE_INVALID_MSG = 'Relase to Cancel';
const TAP_SELECT_MSG = 'Tap to Select a Reaction';

export default class Feed extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      swipeArea: {},
      isSwiping: false,
      swipeEnabled: false,
      initialPosition: {},
      selectedSwipeItem: null,
      textMsg: SLIDE_VALID_MSG,
      myReactions: []
    };

    this._pressRefs = {};
    this._wrapperRefs = {};
    this._isSwiping = false;
  }

  _keyExtractor = (item, index) => item.id;

  /**
   *  Measures the initial position and swipe area of the list item.
   *  
   *  @param {number} key
   *  @returns {undefined}
   */

  _onLongPress(key) {
    this._pressRefs[key].measure((_, __, width, height, pageX, pageY) => {
      this.setState({
        swipeEnabled: true,
        selectedSwipeItem: key,
        textMsg: SLIDE_VALID_MSG,
        initialPosition: { x: pageX, y: pageY, width, height }
      });
    });

    this._wrapperRefs[key].measure((x, y, width, height, pageX, pageY) => {
      this.setState({
        swipeArea: { x: pageX, y: pageY, width, height }
      });
    });
  }

  _addToMyReaction = moodId => {
    if (moodId) {
      const selectedItemReactionIndex = this.state.myReactions.findIndex(
        myReaction => myReaction.itemId === this.state.selectedSwipeItem
      );

      if (selectedItemReactionIndex !== -1) {
        this.state.myReactions[selectedItemReactionIndex] = Object.assign(
          {},
          this.state.myReactions[selectedItemReactionIndex],
          { moodId }
        );
      } else {
        this.state.myReactions.push({
          itemId: this.state.selectedSwipeItem,
          moodId
        });
      }
    }
  };

  /**
   *  Callback function during swiping
   * 
   *  @param {boolean} isSwiping
   *  @param {boolean} isSwipeableArea
   *  
   *  @return {undefined}
   */

  _onSwipe = (isSwiping, isSwipeableArea) => {
    if (isSwiping) {
      if (this.pressTimeOut) {
        clearTimeout(this.pressTimeOut);
      }
      this._isSwiping = isSwiping;
      if (isSwipeableArea) {
        this.state.textMsg !== SLIDE_VALID_MSG &&
          this.setState({ textMsg: SLIDE_VALID_MSG });
      } else {
        this.state.textMsg !== SLIDE_INVALID_MSG &&
          this.setState({ textMsg: SLIDE_INVALID_MSG });
      }
    }
  };

  /**
   *  Callback function after swiping finish
   * 
   *  @param {number|null} selectedMood
   *  @returns {undefined}
   */

  _onSwipeRelease = selectedMood => {
    this._addToMyReaction(selectedMood);

    this.setState({
      swipeEnabled: false,
      selectedSwipeItem: null
    });
  };

  _onPressOut() {
    this.pressTimeOut = setTimeout(
      () => this.setState({ textMsg: TAP_SELECT_MSG }),
      50
    );
  }

  _getMood = moodId => {
    return moods.find(mood => mood.id === moodId);
  };

  _getItemReacions = (id, reactions) => {
    const reactionArr = [];
    if (reactions.length > 0) {
      reactions.forEach((reaction, i) => {
        const selectedMood = this._getMood(reaction.moodId);
        if (selectedMood) {
          reactionArr.push(
            <Image
              key={`${id}-${reaction.moodId}`}
              source={selectedMood.icon}
              style={styles.selectedItemReaction}
            />
          );
        }
      });
    }

    if (this.state.myReactions.length > 0) {
      const myReaction = this.state.myReactions.find(
        reaction => reaction.itemId === id
      );

      if (myReaction) {
        const selectedMood = this._getMood(myReaction.moodId);
        if (selectedMood) {
          reactionArr.push(
            <Image
              key={`${id}-${myReaction.moodId}`}
              source={selectedMood.icon}
              style={styles.selectedItemReaction}
            />
          );
        }
      }
    }

    return reactionArr;
  };

  _getItemReacionText = id => {
    let text = 'Like';

    if (this.state.myReactions.length > 0) {
      const myReaction = this.state.myReactions.find(
        reaction => reaction.itemId === id
      );

      if (myReaction) {
        const selectedMood = this._getMood(myReaction.moodId);
        if (selectedMood) {
          if (selectedMood.text && selectedMood.text.length > 0) {
            text = selectedMood.text;
          }
        }
      }
    }

    return text;
  };

  _hasItemReaction = id => {
    let hasItemReaction = false;

    if (this.state.myReactions.length > 0) {
      const myReaction = this.state.myReactions.find(
        reaction => reaction.itemId === id
      );

      if (myReaction) {
        hasItemReaction = true;
      }
    }

    return hasItemReaction;
  };

  _renderItem = ({ item }) => (
    <View ref={ref => (this._wrapperRefs[item.id] = ref)} style={styles.row}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.profilePic} />
        <View>
          <Text>{item.company}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
      <Text>{item.title}</Text>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text numberOfLines={2}>{item.desc}</Text>
      <Text style={styles.url}>{item.link}</Text>
      <View style={styles.selectedReactions}>
        {this._getItemReacions(item.id, item.reactions)}

        <Text style={styles.shareLabelWithCounterTxt}>1 share</Text>
        <Text style={styles.commentLabelWithCounterTxt}>2 Comments</Text>
      </View>
      <View style={styles.line} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <TouchableOpacity
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          ref={ref => (this._pressRefs[item.id] = ref)}
          onLongPress={() => this._onLongPress(item.id)}
          onPressOut={() => this._onPressOut()}
        >
          <View>
            <Text
              style={
                this._hasItemReaction(item.id)
                  ? styles.reactionTxtSelected
                  : styles.reactionTxt
              }
            >
              {this._getItemReacionText(item.id)}
            </Text>
          </View>
        </TouchableOpacity>
        <Text>Comment</Text>
        <Text>Share</Text>

        {this.state.swipeEnabled &&
          this.state.selectedSwipeItem === item.id && (
            <View style={styles.likeOverlay}>
              <Text>{this.state.textMsg}</Text>
            </View>
          )}
      </View>
    </View>
  );

  render() {
    return (
      <Swiper
        moods={moods}                                    //  Array of moods
        initialPosition={this.state.initialPosition}     //  Initial position of touchable area
        swipeArea={this.state.swipeArea}                 //  Swipe area of an item
        onSwipe={this._onSwipe.bind(this)}               //  Callback function during swiping
        onSwipeRelease={this._onSwipeRelease.bind(this)} //  Callback function after finish the swiping
        swipeEnabled={this.state.swipeEnabled}           //  Enable on long press event
      >
        <View style={styles.container}>
          <FlatList                                      
            data={feeds}
            renderItem={this._renderItem.bind(this)}
            scrollEnabled={!this.state.swipeEnabled}
            keyExtractor={this._keyExtractor}
            extraData={`${this.state.textMsg}`}
          />
        </View>
      </Swiper>
    );
  }
}

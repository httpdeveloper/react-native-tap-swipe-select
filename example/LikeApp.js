/*
 * @Author: Dinesh Maharjan 
 * @Email: httpdeveloper@gmail.com
 * @Github: https://github.com/httpdeveloper
 * @Web: http://dineshmaharjan.com.np
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import Feed from './Feed';

export default class LikeApp extends Component<{}> {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Feed />
      </View>
    );
  }
}

/*
 * @Author: Dinesh Maharjan 
 * @Email: httpdeveloper@gmail.com
 * @Github: https://github.com/httpdeveloper
 * @Web: http://dineshmaharjan.com.np
 */

import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    left: 10,
    zIndex: 2,
    height: 45,
    borderRadius: 22,
    alignItems: 'center',
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-around'
  },
  androidContainer: {
    left: 10,
    zIndex: 2,
    overflow: 'visible',
    position: 'absolute',
    borderRadius: 25
  },

  backgroundView: {
    width,
    height,
    top: 0,
    left: 0,
    zIndex: 1,
    position: 'absolute',
    backgroundColor: 'transparent'
  },

  androidMoodWrapper: {
    left: 10,
    zIndex: 1,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#fff'
  }
});

export default styles;

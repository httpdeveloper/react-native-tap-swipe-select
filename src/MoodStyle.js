/*
 * @Author: Dinesh Maharjan 
 * @Email: httpdeveloper@gmail.com
 * @Github: https://github.com/httpdeveloper
 * @Web: http://dineshmaharjan.com.np
 */

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  androidMoodContainer: {
    zIndex: 3,
    overflow: 'hidden',
    position: 'absolute',
    alignItems: 'center'
  },

  scaleStyle: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  moodIcon: {
    width: 46,
    height: 46,
    borderRadius: 23
  },
  moodText: {
    fontSize: 8,
    backgroundColor: '#000',
    paddingHorizontal: 2,
    paddingVertical: 1,
    color: '#fff',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#000',
    opacity: 0.9,
    fontWeight: 'bold',
    overflow: 'hidden'
  }
});

export default styles;

/*
 * @Author: Dinesh Maharjan 
 * @Email: httpdeveloper@gmail.com
 * @Github: https://github.com/httpdeveloper
 * @Web: http://dineshmaharjan.com.np
 */

import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: '#ddd'
  },
  row: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  image: {
    height: 150,
    width: undefined,
    marginVertical: 5
  },
  profilePic: {
    width: 30,
    height: 30,
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 15,
    marginBottom: 10,
    borderColor: '#ccc',
    backgroundColor: '#ddd'
  },
  url: {
    fontSize: 12,
    color: '#888'
  },
  time: {
    fontSize: 12,
    color: '#888'
  },
  line: {
    height: 1,
    width: width - 20,
    marginVertical: 10,
    backgroundColor: '#eee'
  },
  likeOverlay: {
    position: 'absolute',
    left: 0,
    top: -10,
    width,
    height: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedReactions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 5
  },
  shareLabelWithCounterTxt: {
    fontSize: 12
  },
  commentLabelWithCounterTxt: {
    fontSize: 12
  },
  selectedItemReaction: {
    width: 20,
    height: 20,
    borderRadius: 10
  },
  reactionTxt: {},
  reactionTxtSelected: {
    fontWeight: 'bold',
    color: '#4054b2'
  }
});

export default styles;

# react-native-tap-swipe-select
React Native Tap Swipe Select Module - Similar to Facebook like app module that support on both platforms IOS and Android

## Usage
```
import Swiper from 'react-native-tap-swipe-select';

<Swiper>
  <YourListComponent />
</Swiper>

```
## Demo 
```
//Edit index.js on the root folder 

import { AppRegistry } from 'react-native';
import LikeAppExample from 'react-native-tap-swipe-select/example';

AppRegistry.registerComponent('YourAppName', () => LikeAppExample);

```
## Screenshot
![alt text](https://media.giphy.com/media/l4pT9X4z65bEn5l4I/giphy.gif)

## Installation
`npm install react-native-tap-swipe-select@https://github.com/httpdeveloper/react-native-tap-swipe-select.git --save
`

## Props 
| Prop | Type | Description | Default |
| --- | --- | --- | --- |
| moods | array | Array of moods (Required) | - |
| initialPosition | object | Initial position of touchable item (Required) | {x, y, width, height} |
| swipeArea | object | Swipeable area. If provided then specific area will be cosidered as swipeable otherwise, It takes whole area (optional) | {x, y, width, height} |
| swipeEnabled | boolean | Enable swipeable area | false |
| onSwipeRelease | function | Callback function after finish the swiping | - |
| onSwipe | function | Callback function during swiping | - |

# License
MIT

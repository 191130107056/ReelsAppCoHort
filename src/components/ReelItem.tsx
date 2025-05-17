import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';

import {ReelItemType} from '../types';
import colors from '../theme/colors';
import {useMute} from '../context/MuteContext';

const {height} = Dimensions.get('window');

interface Props {
  item: ReelItemType;
  isActive: boolean;
}

const ReelItem: React.FC<Props> = ({item, isActive}) => {
  const videoRef = useRef<Video | null>(null);
  const [paused, setPaused] = useState(!isActive);
  const [buffering, setBuffering] = useState(false);
  //   const [muted, setMuted] = useState(true);
  const {muted, toggleMute} = useMute();
  const [liked, setLiked] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(false);

  const heartScale = useRef(new Animated.Value(0)).current;
  const playPauseOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setPaused(!isActive);
  }, [isActive]);

  const handleDoubleTap = () => {
    setLiked(true);
    setShowHeart(true);
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 0,
        delay: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setShowHeart(false));
  };

  const handleBuffer = (meta: any) => {
    setBuffering(meta.isBuffering);
  };

  const handleTap = () => {
    setPaused(prev => !prev);
    setShowPlayPauseIcon(true);
    Animated.timing(playPauseOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Fade out icon after 1.2 seconds
      setTimeout(() => {
        Animated.timing(playPauseOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowPlayPauseIcon(false));
      }, 1200);
    });
  };

  const descriptionText =
    item.description && item.description.length > 0
      ? item.description
      : 'Nisi ullamco non ipsum non exercitation nisi duis. Consequat excepteur adipisicing Lorem dolor veniam aliquip pariatur. Nisi quis fugiat reprehenderit dolor. Anim duis consequat proident ipsum nulla aliquip consectetur labore.';

  return (
    <TouchableWithoutFeedback onPress={handleTap} onLongPress={handleDoubleTap}>
      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={{uri: item.videoUrl}}
          paused={paused}
          repeat
          resizeMode="stretch"
          onBuffer={handleBuffer}
          onError={e => console.error('Video Error:', e)}
          muted={muted}
          style={styles.video}
        />

        {buffering && (
          <ActivityIndicator
            size="large"
            color={colors.white}
            style={styles.bufferIndicator}
          />
        )}

        {showHeart && (
          <Animated.View
            style={[styles.heartContainer, {transform: [{scale: heartScale}]}]}>
            <Icon name="heart" size={100} color="white" />
          </Animated.View>
        )}

        {showPlayPauseIcon && (
          <Animated.View
            style={[styles.playPauseContainer, {opacity: playPauseOpacity}]}>
            <Icon name={paused ? 'play' : 'pause'} size={80} color="white" />
          </Animated.View>
        )}

        <View style={styles.overlay}>
          <View style={styles.userInfo}>
            <Image source={{uri: item.user.avatar}} style={styles.avatar} />
            <Text style={styles.username}>{item.user.name}</Text>
          </View>

          <View style={styles.bottomRight}>
            <TouchableOpacity
              onPress={handleDoubleTap} // trigger like animation on heart press
              activeOpacity={0.7}>
              <Icon
                name="heart"
                size={28}
                color={liked ? colors.red : colors.white}
                style={styles.icon}
              />
            </TouchableOpacity>
            <Text style={styles.iconText}>{item.likes}</Text>

            <Icon
              name="chatbubble"
              size={28}
              color={colors.white}
              style={styles.icon}
            />

            <Text style={styles.iconText}>{item.comments}</Text>
            <TouchableOpacity onPress={toggleMute}>
              <Icon
                name={muted ? 'volume-mute' : 'volume-high'}
                size={28}
                color={colors.white}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.userRow}>
              <Image
                source={{uri: item.user.avatar}}
                style={styles.smallavatar}
              />
              <Text style={styles.username}>@{item.user.name}</Text>
            </View>

            <View style={styles.captionBox}>
              <Text
                style={styles.description}
                numberOfLines={readMore ? 20 : 2}
                ellipsizeMode="tail">
                {descriptionText}
              </Text>

              {descriptionText.length > 100 && (
                <TouchableOpacity onPress={() => setReadMore(!readMore)}>
                  <Text style={styles.readMore}>
                    {readMore ? 'Show Less' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
    position: 'relative',
  },
  video: {
    height: '100%',
    width: '100%',
  },
  bufferIndicator: {
    position: 'absolute',
    top: height / 2 - 20,
    left: '50%',
    marginLeft: -20,
    zIndex: 10,
  },
  playPauseContainer: {
    position: 'absolute',
    top: '45%',
    left: '42%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  overlay: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    bottom: 20,
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: colors.white,
    fontWeight: 'bold',
  },
  bottomRight: {
    position: 'absolute',
    bottom: 50,
    right: 10,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  iconText: {
    color: colors.white,
    marginBottom: 16,
  },
  descriptionBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 50,
  },
  description: {
    color: colors.white,
    fontSize: 14,
  },
  readMore: {
    color: colors.skyblue,
    marginTop: 4,
    fontWeight: 'bold',
  },
  heartContainer: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 50,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  smallavatar: {
    width: 24,
    height: 24,
    borderRadius: 20,
    marginRight: 10,
  },
  captionBox: {
    paddingRight: 10,
  },
});

export default ReelItem;

import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import PagerView from 'react-native-pager-view';

import {fetchReels} from '../services/api';
import {ReelItemType} from '../types';
import ReelItem from '../components/ReelItem';
import colors from '../theme/colors';

const HomeScreen: React.FC = () => {
  const [reels, setReels] = useState<ReelItemType[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchMoreReels = useCallback(async () => {
    if (!hasNext || loading) return;
    setLoading(true);
    try {
      const response = await fetchReels(nextCursor); // fetchReels supports optional cursor
      const {list, pagination} = response;
      if (!Array.isArray(list)) {
        console.warn('Expected list to be array but got:', list);
        setLoading(false);
        return;
      }

      setReels(prev => [...prev, ...list]);
      setNextCursor(pagination.nextCursor);
      setHasNext(pagination.hasNext);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [nextCursor, hasNext, loading]);

  useEffect(() => {
    fetchMoreReels();
  }, []);

  const onPageSelected = (e: any) => {
    const index = e.nativeEvent.position;
    setActiveIndex(index);

    // Fetch more reels when reaching near the end
    if (index >= reels.length - 2 && hasNext) {
      fetchMoreReels();
    }
  };
  return (
    <View style={styles.container}>
      {reels.length === 0 ? (
        <ActivityIndicator size="large" color="#999" />
      ) : (
        <PagerView
          style={styles.pagerView}
          initialPage={0}
          orientation="vertical"
          onPageSelected={onPageSelected}>
          {reels.map((item, index) => (
            <View key={item.id}>
              <ReelItem item={item} isActive={index === activeIndex} />
            </View>
          ))}
        </PagerView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pagerView: {
    flex: 1,
  },
});

export default HomeScreen;

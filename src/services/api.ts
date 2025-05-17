import axios from 'axios';
import {ReelItemType} from '../types';

const BASE_CDN = 'https://cdn.sociocircle.org/';
const API_URL =
  'https://devapi.sociocircle.org/glimps/philosophy/684ee90a-6498-4c58-a425-bdbe93886eb7';

export const fetchReels = async (cursor?: string) => {
  try {
    const url = cursor ? `${API_URL}&cursor=${cursor}` : API_URL;
    const res = await axios.get(url);

    const list = res.data?.data?.list ?? [];
    const pagination = res.data?.data?.pagination ?? {
      nextCursor: null,
      hasNext: false,
    };

    return {
      list: list.map(
        (item: any): ReelItemType => ({
          id: item.id,
          videoUrl: BASE_CDN + item.contentUrl,
          thumbnailUrl: BASE_CDN + item.thumbnail,
          description: item.description,
          likes: item.totalLikes,
          comments: item.totalComments,
          user: {
            name: item.orgName,
            avatar: BASE_CDN + item.orgImage,
          },
        }),
      ),
      pagination,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      list: [],
      pagination: {nextCursor: null, hasNext: false},
    };
  }
};

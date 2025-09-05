import { createClient } from 'microcms-js-sdk';
import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSDate,
  MicroCMSContentId,
} from 'microcms-js-sdk';
import { notFound } from 'next/navigation';

// カテゴリーの型定義
export type Category = {
  name: string;
} & MicroCMSContentId &
  MicroCMSDate;

// ニュースの型定義
export type News = {
  title: string;
  description: string;
  content: string;
  thumbnail?: MicroCMSImage;
  category: Category;
};

// メンバーの型定義
export type Member = {
  name: string;
  position: string;
  profile: string;
  image?: MicroCMSImage;
};

// 事業内容の型定義
export type Business = {
  logo?: MicroCMSImage;
  description: string;
  image?: MicroCMSImage;
  link: string;
};

// メタ情報の型定義
export type Meta = {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: MicroCMSImage;
  canonical?: string;
};

export type Article = News & MicroCMSContentId & MicroCMSDate;

// Initialize Client SDK (env 未設定でもビルドが落ちないよう安全化)
const hasMicrocmsEnv = Boolean(process.env.MICROCMS_SERVICE_DOMAIN && process.env.MICROCMS_API_KEY);

type MicrocmsClient = {
  getList: <T>(args: any) => Promise<{
    contents: T[];
    totalCount: number;
    offset: number;
    limit: number;
  }>;
  getListDetail: <T>(args: any) => Promise<T>;
  getObject: <T>(args: any) => Promise<T | null>;
};

export const client: MicrocmsClient = hasMicrocmsEnv
  ? (createClient({
      serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN as string,
      apiKey: process.env.MICROCMS_API_KEY as string,
    }) as unknown as MicrocmsClient)
  : {
      getList: async () => ({ contents: [], totalCount: 0, offset: 0, limit: 0 }),
      getListDetail: async () => {
        // Next.js の notFound で処理させるため、呼び出し側で catch(notFound) される想定
        throw new Error('microCMS client is not configured');
      },
      getObject: async () => null,
    };

// ニュース一覧を取得
export const getNewsList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Article>({
      endpoint: 'news',
      queries,
    })
    .catch(notFound);
  return listData;
};

// ニュースの詳細を取得
export const getNewsDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client
    .getListDetail<Article>({
      endpoint: 'news',
      contentId,
      queries,
    })
    .catch(notFound);

  return detailData;
};

// カテゴリーの一覧を取得
export const getCategoryList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Category>({
      endpoint: 'categories',
      queries,
    })
    .catch(notFound);

  return listData;
};

// カテゴリーの詳細を取得
export const getCategoryDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client
    .getListDetail<Category>({
      endpoint: 'categories',
      contentId,
      queries,
    })
    .catch(notFound);

  return detailData;
};

// メンバー一覧を取得
export const getMembersList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Member>({
      endpoint: 'members',
      queries,
    })
    .catch(notFound);
  return listData;
};

// 事業内容一覧を取得
export const getBusinessList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Business>({
      endpoint: 'business',
      queries,
    })
    .catch(notFound);
  return listData;
};

// メタ情報を取得
export const getMeta = async (queries?: MicroCMSQueries) => {
  const data = await client
    .getObject<Meta>({
      endpoint: 'meta',
      queries,
    })
    .catch(() => null);

  return data;
};

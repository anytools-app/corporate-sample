import { getNewsList } from '@/app/_libs/microcms';
import { NEWS_LIST_LIMIT } from '@/app/_constants';
import NewsList from '@/app/_components/NewsList';
import Pagination from '@/app/_components/Pagination';

export default async function Page() {
  // microCMS 未設定時のフォールバック
  let data: { contents: any[]; totalCount: number };
  try {
    data = (await getNewsList({
      limit: NEWS_LIST_LIMIT,
    })) as any;
  } catch (_) {
    data = { contents: [], totalCount: 0 };
  }
  return (
    <>
      <NewsList articles={data.contents} />
      <Pagination totalCount={data.totalCount} basePath="/news" />
    </>
  );
}

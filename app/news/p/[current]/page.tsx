import { getNewsList, client } from '@/app/_libs/microcms';
import { NEWS_LIST_LIMIT } from '@/app/_constants';
import Pagination from '@/app/_components/Pagination';
import ArticleList from '@/app/_components/NewsList';

// 静的出力に固定
export const dynamic = 'force-static';
export const dynamicParams = false;

// 静的パスを先に宣言
export async function generateStaticParams() {
  try {
    const data = await client.getList({ endpoint: 'news', queries: { limit: 1 } });
    const totalPages = Math.ceil((data.totalCount || 0) / NEWS_LIST_LIMIT);
    return Array.from({ length: totalPages }, (_, i) => ({ current: String(i + 1) }));
  } catch (e) {
    return [] as { current: string }[];
  }
}

type Props = {
  params: Promise<{
    current: string;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const current = parseInt(params.current as string, 10);
  const data = await getNewsList({
    limit: NEWS_LIST_LIMIT,
    offset: NEWS_LIST_LIMIT * (current - 1),
  });
  return (
    <>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} current={current} basePath="/news" />
    </>
  );
}

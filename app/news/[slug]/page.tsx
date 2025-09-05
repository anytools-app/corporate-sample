import { Metadata } from 'next';
import { getNewsDetail, client } from '@/app/_libs/microcms';
import Article from '@/app/_components/Article';
import styles from './page.module.css';
import ButtonLink from '@/app/_components/ButtonLink';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

// まず静的パスを宣言
export async function generateStaticParams() {
  try {
    const list = await client.getList<{ id: string }>({
      endpoint: 'news',
      queries: { limit: 100, fields: 'id' },
    });
    return list.contents.map((item) => ({ slug: item.id }));
  } catch (e) {
    console.error(e);
    // microCMS 未設定などの場合は空配列を返してビルドを継続
    return [] as { slug: string }[];
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  try {
    const data = await getNewsDetail(params.slug);

    return {
      title: data.title,
      description: data.description,
      openGraph: {
        title: data.title,
        description: data.description,
        images: [data?.thumbnail?.url || ''],
      },
      alternates: {
        canonical: `/news/${params.slug}`,
      },
    };
  } catch (_) {
    return {} as Metadata;
  }
}

export default async function Page(props: Props) {
  const params = await props.params;
  const data = await getNewsDetail(params.slug);
  return (
    <>
      <Article data={data} />
      <div className={styles.footer}>
        <ButtonLink href="/news">ニュース一覧へ</ButtonLink>
      </div>
    </>
  );
}

// generateStaticParams はファイル上部に移動済み

import { Metadata } from 'next';
import RoomClientPage from './RoomClientPage';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Private Room | ${id.slice(0, 8)}`,
    description: 'This is a temporary, secure, and self-destructing conversation.',
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <RoomClientPage roomId={id} />;
}

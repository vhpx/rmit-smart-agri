import Chat from './chat';
import { getChats } from './helper';
import { createClient } from '@/utils/supabase/server';
import { Message } from 'ai';

interface Props {
  searchParams: {
    lang: string;
  };
}

export default async function AIPage({ searchParams }: Props) {
  const { lang: locale } = searchParams;

  const { data: chats, count } = await getChats();
  const messages = await getMessages();

  return (
    <Chat
      chats={chats}
      count={count}
      previousMessages={messages}
      locale={locale}
    />
  );
}

const getMessages = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('ai_chat_messages')
    .select('*, ai_chats!chat_id(*)')
    .order('created_at', { ascending: false })
    .limit(2);

  if (error) {
    console.error(error);
    return [];
  }

  return data.map(({ role, ...rest }) => ({
    ...rest,
    role: role.toLowerCase(),
  })) as Message[];
};

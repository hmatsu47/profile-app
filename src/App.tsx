import { createSignal, createEffect } from 'solid-js';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import Account from './Account';
import { Session } from '@supabase/supabase-js';

export default () => {
  const [session, setSession] = createSignal<Session | null>(null);

  createEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    })
  })

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session() ? <Auth /> : <Account key={session()!.user!.id} session={session()!} />}
    </div>
  );
};

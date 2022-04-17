import { Session } from '@supabase/supabase-js';
import { createSignal, createEffect } from 'solid-js';
import { supabase } from './supabaseClient';
import Avatar from './Avatar'

type Props = {
    key: string,
    session: Session
}

const Account = (props: Props) => {
  const [loading, setLoading] = createSignal<boolean>(true);
  const [username, setUsername] = createSignal<string | null>(null);
  const [website, setWebsite] = createSignal<string | null>(null);
  const [avatar_url, setAvatarUrl] = createSignal<string | null>(null);

  createEffect(() => {
    props.session;
    getProfile();
  })

  const getProfile = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user!.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const updateProfile = async (e: any) => {
    // e.preventDefault();

    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user!.id,
        username: username(),
        website: website(),
        avatar_url: avatar_url(),
        updated_at: new Date(),
      };

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div aria-live="polite">
      {loading() ? (
        'Saving ...'
      ) : (
        <>
          <div className="form-widget">
            {/* Add to the body */}
            <Avatar
              url={avatar_url()}
              size={150}
              onUpload={(url: string) => {
                setAvatarUrl(url);
                updateProfile({ username, website, avatar_url: url });
              }}
            />
            {/* ... */}
          </div>
          <form onSubmit={updateProfile} className="form-widget">
            <div>Email: {props.session.user!.email}</div>
            <div>
              <label htmlFor="username">Name</label>
              <input
                id="username"
                type="text"
                value={username() || ''}
                onChange={(e: any) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="website">Website</label>
              <input
                id="website"
                type="url"
                value={website() || ''}
                onChange={(e: any) => setWebsite(e.target.value)}
              />
            </div>
            <div>
              <button className="button block primary" disabled={loading()}>
                Update profile
            </button>
            </div>
          </form>
        </>
      )}
      <button type="button" className="button block" onClick={() => supabase.auth.signOut()}>
        Sign Out
      </button>
    </div>
  );
}

export default Account;

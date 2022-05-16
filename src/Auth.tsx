import { createSignal } from 'solid-js';
import { supabase } from './supabaseClient';

export default function Auth() {
  const [loading, setLoading] = createSignal<boolean>(false);
  const [email, setEmail] = createSignal<string>('');

  const handleLogin = async (e: Event) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email: email() });
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div class="row flex flex-center">
      <div class="col-6 form-widget" aria-live="polite">
        <h1 class="header">Supabase + SolidJS</h1>
        <p class="description">Sign in via magic link with your email below</p>
        {loading() ? (
          'Sending magic link...'
        ) : (
          <form onSubmit={handleLogin}>
            <label for="email">Email</label>
            <input
              id="email"
              class="inputField"
              type="email"
              placeholder="Your email"
              value={email()}
              onChange={(e) => {
                if (!(e.target instanceof HTMLInputElement)) {
                  return;
                }
                setEmail(e.target.value);
              }}
            />
            <button class="button block" aria-live="polite">
              Send magic link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

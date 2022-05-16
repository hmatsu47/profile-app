import { createSignal, createEffect, For } from 'solid-js';
import { supabase } from './supabaseClient';

export default () => {
  const [loading, setLoading] = createSignal<boolean>(false);
  const [notes, setNotes] = createSignal<string[]>();
  const [note, setNote] = createSignal<string>('');

  createEffect(() => {
    getNotes();
  })

  const getNotes = async () => {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('notes')
        .select(`note`);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setNotes(data.map(obj => obj.note));
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const addNotes = async () => {
    try {
      if (note() === '') {
        return;
      }
      setLoading(true);
      const user = supabase.auth.user();

      const data = {
        note: note(),
        userid: user!.id,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('notes').insert(data, {
        returning: 'minimal', // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }

      setNote('');
      getNotes();
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
        <form onSubmit={addNotes} class="form-widget">
            <div>
              <label for="note">Note</label>
              <input
                id="note"
                type="text"
                value={note()}
                onChange={(e) => {
                  if (!(e.target instanceof HTMLInputElement)) {
                    return;
                  }
                  setNote(e.target.value);
                }}
              />
            </div>
            <div>
              <button class="button block primary" disabled={loading()}>
                Add note
              </button>
            </div>
            <div>
              <For each={notes()} fallback={<div></div>}>
                {(note) => <div class="card">{note}</div>}
              </For>
            </div>
            <div>

            </div>
        </form>
      )}
    </div>
  );
}
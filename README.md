## Supabase の SolidJS Quickstart を TypeScript で試す

- ↓を TypeScript で書いてみるテスト
- https://supabase.com/docs/guides/with-solidjs
- 一部 props 関連の型定義が中途半端（`any`）
- ちなみに[↓環境変数からの読み込み](https://github.com/hmatsu47/profile-app/blob/5d40dea1059a6927083197c5ab38272dd97efb27/src/supabaseClient.tsx#L3)もまだうまく動いていません

```typescript:supabaseClient.tsx（部分）
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
```
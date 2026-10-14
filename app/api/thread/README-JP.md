## 同期処理の負荷テスト（ストレステスト）

### テストの実行
まず、Next.jsをビルドして起動します。

```
npm run build && npm run start

```

もし autocannon がインストールされていない場合は、先に `npm install -g autocannon` を実行してください。

```
// ターミナルで実行
// 例：sign_base メインスレッドで直接トークンを生成
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/sync?type=sign_base"

// sign_thread リクエストごとに新しいスレッドを生成
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/sync?type=sign_thread"

// sign_thread_poll スレッドプールを生成
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/sync?type=sign_thread_poll"

// big_data_sync 大容量データを同期処理で読み込み（200msの待ち時間を想定）
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/sync?type=big_data_sync"

// big_data_thread_poll スレッドプールを使用して大容量データを読み込み（200msの待ち時間を想定）
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/sync?type=big_data_thread_poll"


```

## 非同期処理の負荷テスト（ストレステスト）

同様に、以下を実行します。

```
npm run build && npm run start

```
その後、「Node.js標準の非同期I/O読み込み」と「スレッドプールを使用した読み込み」の2つの大分類に分けてテストを行います。また、それぞれの分類において「固定時間のsleep（疑似タイマー）」と「実際のファイル読み込み操作」の2パターンを検証します。

```

// ターミナルで実行
// テストA：メインスレッドでの非同期I/O
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/async?type=io_main&mode=timer"

// テストB：スレッドプールでの非同期I/O
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/async?type=io_pool&mode=timer"

// テストC：メインスレッドでの非同期ファイル読み込み
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/async?type=io_main&mode=file"

// テストD：スレッドプールでの非同期ファイル読み込み
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/async?type=io_pool&mode=file"

```
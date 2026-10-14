
## 同步读取--压力测试



### 压测执行
首先，将nextjs 构建
```
npm run build && npm run start

```
如果没有安装utocannon，请先执行 npm install -g utocannon
```
// 终端中执行
//例如： sign_base 直接在主线程中创建token
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/sync?type=sign_base"

// sign_thread 每次创建新thread
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/sync?type=sign_thread"

// sign_thread_poll 创建线程池
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/sync?type=sign_thread_poll"

// big_data_sync 同步读取大数据（假设需要200ms的等待时间）
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/sync?type=big_data_sync"

// big_data_thread_poll 使用线程池读取大数据（假设需要等待200ms）
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/sync?type=big_data_thread_poll"


```

## 异步步读取--压力测试

同样，执行
```
npm run build && npm run start

```
而后，分为nodejs本身io读取和使用线程池读取两个大分类， 每个分类又分为模拟固定时长的sleep，和读取文件的操作。 

```
// 终端中执行
// 测试A： 主线程异步IO
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/async?type=io_main&mode=timer"

// 测试B： 线程池异步IO
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/async?type=io_pool&mode=timer"

// 测试C: 主线程异步读取文件
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/async?type=io_main&mode=file"

// 测试D: 线程池异步读取文件
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/async?type=io_pool&mode=file"

```
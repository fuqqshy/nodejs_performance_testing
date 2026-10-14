## Synchronous Performance Testing -- Stress Test

### Execution
First, build and start the Next.js application:

```
npm run build && npm run start

```

If autocannon is not installed, please execute `npm install -g autocannon` first.

```
// Execute in the terminal
// Example: sign_base creates tokens directly in the main thread
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{"email":"test@gmail.com","password":"12345"}" "http://localhost:3000/api/thread/sync?type=sign_base"

// sign_thread creates a new thread for each request
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{"email":"test@gmail.com","password":"12345"}" "http://localhost:3000/api/thread/sync?type=sign_thread"

// sign_thread_poll creates a thread pool
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{"email":"test@gmail.com","password":"12345"}" "http://localhost:3000/api/thread/sync?type=sign_thread_poll"

// big_data_sync synchronously reads big data (assuming a 200ms wait time)
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{"email":"test@gmail.com","password":"12345"}" "http://localhost:3000/api/thread/sync?type=big_data_sync"

// big_data_thread_poll uses a thread pool to read big data (assuming a 200ms wait time)
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{"email":"test@gmail.com","password":"12345"}" "http://localhost:3000/api/thread/sync?type=big_data_thread_poll"


```

## Asynchronous Performance Testing -- Stress Test

Similarly, execute:

```
npm run build && npm run start

```
Then, the tests are divided into two main categories: Node.js native asynchronous I/O read and thread pool read. Each category is further split into simulating a fixed-duration sleep and performing actual file read operations.

```

// Execute in the terminal
// Test A: Main thread asynchronous I/O
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/async?type=io_main&mode=timer"

// Test B: Thread pool asynchronous I/O
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/async?type=io_pool&mode=timer"

// Test C: Main thread asynchronous file read
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/async?type=io_main&mode=file"

// Test D: Thread pool asynchronous file read
autocannon -m POST -c 1000 -d 10 -H "content-type=application/json" -b "{\"email\":\"test@gmail.com\",\"password\":\"12345\"}" "http://localhost:3000/api/thread/async?type=io_pool&mode=file"

```
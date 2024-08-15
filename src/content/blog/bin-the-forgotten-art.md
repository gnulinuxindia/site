---
title: '*.bin - The Forgotten Art of Data Binarization'
description: 'A forgotten method of high speed data transfer'
pubDate: '2024-08-15'
author: 's4m13337'
---

## A serious problem

Everytime I see a new developer using some really fancy modern extension to transfer data between two applications, I have a face palm! Apparently, it is just cool to use those fancy file formats like CSV, TSV, JSON, XML and so on. I absolutely agree that these formats are easy to use because they are much easier to process and are immediately human readable. And that is perfectly fine. What really bothers me is that most junior developers use these formats for many intermediate transactions in the pipeline and this severely hampers performance.

Almost always, there is a situation where 2 application needs to share data. For example, assume application X is designated to preprocess data and structure it. Both applications are on the same machine. Application Y is expected to take in this processed data and do something with it, say, train a machine learning model. In an ideal scenario one would compile X as dynamic library and link it with Y, effectively eliminating the need for data transfers. But in reality, this is not always possible. As a result, I see junior developers resort to the quickest solution of exporting the data from X as, maybe, CSV and then importing it in Y.

This is OK for little data, but becomes problem when transferring large amount of data, say an array having 1 million elements or so. For demonstration, let me use two instanaces of the python interpreter. In instance A, I create a really large array and export it in plaintext, later to be used the instance B:

```
array_size = 10000000
data = np.random.rand(array_size)
np.savetxt('data.txt', data)
```

This export clocks about 12 seconds on my machine; extremely expensive! On the other instance B, I load the data:

```
data = np.loadtxt('data.txt')
```

This takes another 5 seconds on my machine. So in total, about 17 seconds are locked in mere data transfer. This is an awful amount of resources wasted just to get the data in the same state from one program to another program.

## Solution: Binarize!

Just create a binary dump of the data. It virtually takes no time, as all it does is to dump whatever bytes the memory contains in to a file. There is no read/write system calls, so data formatting, no special structuring. And frankly, none of these are required if the data is required in the same state by the next service.

```
with open('data.bin', 'wb') as f:
    f.write(data.tobytes())
```

The above creates a binary dump and runs in about 0.04 seconds. You have the data instantly ready, to be used by the next service. A quick inspection at this binary dump looks something like this:

```
0000000      85ca    561e    9736    3fe0    d9ce    9a42    8fc9    3fde
0000020      5737    8822    f69e    3fe1    5a46    cc37    708d    3fe5
0000040      b5db    2c99    f07d    3fe1    aa46    200f    e563    3fdb
0000060      9cd2    6bf5    284a    3fd5    b31c    d7ac    30e7    3fdb
...
```

Of course it is not human readable, but you don't have to worry about it at this stage as the next service takes the responsibility of making it readable in the end. But wait, how can this data be taken in by the next service? Well, its much simpler than you can imagine. The binary file can be used as memory mapped file, meaning it can be loaded by the application as if it is a part of its memory. There are highly optimized and efficient system calls that are designed to manage memory mapped files and in principle, they use lazy loading, meaning your data is loaded on demand.

```
with open('data.bin', 'r+b') as f:
     mm = mmap.mmap(f.fileno(), 0)
     db = np.frombuffer(mm, dtype=np.float64)

```

Reading is even faster and clocks merely 0.009 seconds. And there it is: data transferred from application A to application B in less than a second.

But, don't be so reliant on this method all the time, there are pitfalls to watchout for:

1. This method deals directly with the bytes and there are high chances of data being corrupted in the file, especially when multiple processes try to access it concurrently. Always ensure there are proper file locking and scheduling mechanisms in place.
2. Since it is raw binary data, it is type unsafe. It is up to the developer to restructre the data, but in my opinion, a good developer should do this as the other alternative would be sit idle and look at the void of boredome for 17 seconds.

## References
- https://en.wikipedia.org/wiki/Mmap
- https://www.man7.org/linux/man-pages/man2/mmap.2.html

---
layout: post
title:  "Guava striped lock"
date:   2016-02-11 13:00:00 +0000
categories: concurrency lock guava
---

자료구조(ex. Array나 HashMap) 전체를 Lock하는 것이 아니라 보다 세밀하게 Lock(fine-grained lock)을 적용하는 케이스

# 알아야 하는 개념은 무엇인가?

- [Read/Write Lock](http://docs.oracle.com/javase/7/docs/api/java/util/concurrent/locks/ReentrantReadWriteLock.html)
- [Semaphore](http://docs.oracle.com/javase/7/docs/api/java/util/concurrent/Semaphore.html)

# 그래서??

목적
> Assuming each one is distinct, we use a “striped” approach where access to each URL is limited to N threads at a time, increasing the throughput and responsiveness of the application. (원문: 참조3)

Guava에서 제공하는 Striped Lock 지원 클래스 사용..

```java
Striped<Semaphore> stripedSemaphores = Striped.lazyWeakSemaphore(10, 1);
```

상세한 설명은 참조 자료 보고 이해하기^^ (생략..)

# 테스트 해보기

간단하게 HashMap에 count를 세는 클래스 만들기

코드는 [여기 참조](https://gist.github.com/chanwookpark/c3cde0e1647dae735b2d)

결과를 보면, Striped 적용 안한 예제에서는 멀티 쓰레드 테스트에서 자기 맘대로 count가 세짐

	19, 3
    17, 2
    18, 1
    15, 1
    16, 0
    13, 3
    14, 0
    11, 1
    12, 1
    3, 3
    2, 1
    10, 0
    1, 4
    0, 1
    7, 3
    6, 0
    5, 3
    4, 2
    9, 1
    8, 0

Striped lock 적용하면 정확하게 count가 들어감!

	19, 4
    17, 4
    18, 4
    15, 4
    16, 4
    13, 4
    14, 4
    11, 4
    12, 4
    3, 4
    2, 4
    1, 4
    10, 4
    0, 4
    7, 4
    6, 4
    5, 4
    4, 4
    9, 4
    8, 4

# 참조

1. http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/util/concurrent/Striped.html
1. https://code.google.com/p/guava-libraries/wiki/StripedExplained
1. http://java.dzone.com/articles/fine-grained-concurrency-guava

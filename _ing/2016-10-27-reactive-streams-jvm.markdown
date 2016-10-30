---
layout: post
title:  "Reactive Streams Specification for the JVM"
date:   2016-10-10 01:00:00 +0000
categories: reactive java Specification
---

# Reactive Streams

The purpose of Reactive Streams is to provide a standard for asynchronous stream processing with non-blocking backpressure.

Reactive Stream의 목적은 non-blocking(?) backpressure를 사용하는 비동기 스트림 처리의 표준을 제공하는 것이다.

The latest release is available on Maven Central as

최신 릴리즈는 다음처럼 메이븐 중앙저장소에서 이용가능하다.

```xml
<dependency>
  <groupId>org.reactivestreams</groupId>
  <artifactId>reactive-streams</artifactId>
  <version>1.0.0</version>
</dependency>
<dependency>
  <groupId>org.reactivestreams</groupId>
  <artifactId>reactive-streams-tck</artifactId>
  <version>1.0.0</version>
  <scope>test</scope>
</dependency>
```


# 용어

non-blocking

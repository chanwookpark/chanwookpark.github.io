---
layout: post
title:  "Reative 학습 자료"
date:   2016-11-21 01:00:00 +0000
categories: reactive spring rx
---

reactive 학습을 하고자 기록을 남기기 시작.

# 공식 링크

- [Reactive Manifesto](http://www.reactivemanifesto.org)
    - Publisher, Subscriber, Subscription, Processor 4개 컴포넌트에 대한 설명 이해 필요
    - 스펙(인터페이스)과 TCK가 있어 이 코드를 보고 이해해도 좋다
    - 스펙은 상세한 케이스 별 처리에 대한 설명이 좋고, 기본적인 설명은 4개 컴포넌트(Publisher, Subscriber, Subscription, Processor)의 JavaDoc이 좋다
- [Reactor](https://projectreactor.io)
    - [Reactor core](https://github.com/reactor/reactor-core/blob/master/README.md)
- [RxJava](https://github.com/ReactiveX/RxJava)
- [Reactive API Specification (reactive-streams-jvm)](https://github.com/reactive-streams/reactive-streams-jvm)
    - 2년전이 마지막 수정(기타 환경 파일 수정 빼고)인 걸로 보아 어느정도 정리된 내용인듯

# 스프링 관련 글

- [Spring 5.0.M1 발표하면서...스프링 블로그 by Rossen](https://spring.io/blog/2016/07/28/reactive-programming-with-spring-5-0-m1)
- Dave syer의 reactive 관련 글
    - [Notes on Reactive Programming Part I: The Reactive Landscape](https://spring.io/blog/2016/06/07/notes-on-reactive-programming-part-i-the-reactive-landscape)
    - [Notes on Reactive Programming Part II: Writing Some Code](https://spring.io/blog/2016/06/13/notes-on-reactive-programming-part-ii-writing-some-code)
    - [Notes on Reactive Programming Part III: A Simple HTTP Server Application](https://spring.io/blog/2016/07/20/notes-on-reactive-programming-part-iii-a-simple-http-server-application)
- [스프링 5.x 레퍼런스 중 Reactive web 챕터](http://docs.spring.io/spring/docs/5.0.0.BUILD-SNAPSHOT/spring-framework-reference/htmlsingle/#web-reactive)
    - 아직은 내용이 많이 없다.. (16.10.23 기준)
- [Reactive Web Applications with Spring 5 by Rossen Stoyanchev (Devoxx 2016)](https://www.youtube.com/watch?v=rdgJ8fOxJhc)
    - 첫 번째 질문에서 ThreadLocal을 사용하는 SecurityContext와 같은 XxxContext를 Reactive로 처리할 때는 어떻게 해야 하냐는 질문이었는데 아직 방법을 찾는 중이라고 답변

# 코드

- [Spring Boot Web Reactive Starter](https://github.com/bclozel/spring-boot-web-reactive)
    - Spring Boot 2.0 작업 코드로
    - Boot 설정과 reactive 관련 dependency를 볼수 있다
    - 실제 동작에 대한 예제는 거의 없다 (16.10.23 기준)
- [Reactor Hands-on lab](https://github.com/reactor/lite-rx-api-hands-on)
    - 현재까지 본 코드중에는 가장 좋은 샘플 코드
    - 테스트케이스를 단계 별로 따라할 수 있고
    - Flux, Mono 중심으로 예제가 되어 있어 기본을 이해하기에 좋다
    - [clone 받아 테스트케이스 작성은 따라해봤으나](https://github.com/chanwookpark/lite-rx-api-hands-on)
    - 이번에는 전체 코드를 따라 작성해보면 좋을 듯
    - [이 코드와 연결된 자료](https://speakerdeck.com/sdeleuze/a-lite-rx-api-for-the-jvm)
- 스프링 코어 테스트 케이스 중 [reactor 지원 컨트롤러 예제](https://github.com/spring-projects/spring-reactive/blob/545325dbf5d04c30aaedf25b4da1f7b97650d33f/src/test/java/org/springframework/web/reactive/method/annotation/RequestMappingIntegrationTests.java#L464)
- [토비의 봄 TV 시험방송 1회](https://www.youtube.com/watch?v=oR1sYfmMQrI)
    - 중간에 Mono를 사용해 컨트롤러를 작성하면서 관련 설명을 진행함
    - 짧지만 유익한 내용 (29분 30초 정도부터)

# 기타 참고 글
- [Zuul 2 : 비동기, 논-블록킹 시스템에 대한 넷플릭스 여정 (번역)](http://chanwookpark.github.io/reactive/netflix/zuul/async/non-blocking/2016/11/21/zuul2-netflixjourney-to-asynchronous-non-blocking-systems/)
    - 넷플릭스에서 Zuul을 Non-Blocking 아키텍처로 변화시켜 나가는 이야기
    - 가볍게 읽어볼만하다 (번역은 힘들었지만..)

# Flux와 Mono

아직 용어에 대한 정확한 이해가 부족해 간단한 문장도 번역이 어색함.. 정확히 이해하고 다시 한 번  살펴보자.

## Flux

![flux-diagram-kr](/images/reactive/flux-diagram-kr.png)

## Mono

![mono-diagram-kr](/images/reactive/mono-diagram-kr.png)

# 궁금증

- 지금 가장 큰 관심은 Spring의 View처리와 JDBC(JPA) 처리를 포함해 reactive 스타일로 개발이 가능한 것인가? (전체가 non-blocking으로..)
- 이렇게 하면 개발 패턴은 기존과 달라지나?? 궁금

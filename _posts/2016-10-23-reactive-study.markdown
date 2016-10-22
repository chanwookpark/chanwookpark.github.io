---
layout: post
title:  "Reative 학습"
date:   2016-10-23 01:00:00 +0000
categories: reactive spring rx
---

reactive 학습을 하고자 기록을 남기기 시작.


# 공식 링크

- [RxJava](https://github.com/ReactiveX/RxJava)
- [Reactive API Specification (reactive-streams-jvm)](https://github.com/reactive-streams/reactive-streams-jvm)
    - 2년전이 마지막 수정(기타 환경 파일 수정 빼고)인 걸로 보아 어느정도 정리된 내용인듯

# 스프링에서 작성한 글

- [Spring 5.0.M1 발표하면서...스프링 블로그 by Rossen](https://spring.io/blog/2016/07/28/reactive-programming-with-spring-5-0-m1)
- Dave syer의 reactive 관련 걸
    - [Notes on Reactive Programming Part I: The Reactive Landscape](https://spring.io/blog/2016/06/07/notes-on-reactive-programming-part-i-the-reactive-landscape)
    - [Notes on Reactive Programming Part II: Writing Some Code](https://spring.io/blog/2016/06/13/notes-on-reactive-programming-part-ii-writing-some-code)
    - [Notes on Reactive Programming Part III: A Simple HTTP Server Application](https://spring.io/blog/2016/07/20/notes-on-reactive-programming-part-iii-a-simple-http-server-application)
- [스프링 5.x 레퍼런스 중 Reactive web 챕터](http://docs.spring.io/spring/docs/5.0.0.BUILD-SNAPSHOT/spring-framework-reference/htmlsingle/#web-reactive)
    - 아직은 내용이 많이 없다..

# 코드

- [Spring Boot Web Reactive Starter](https://github.com/bclozel/spring-boot-web-reactive)
- [Reactor Hands-on lab](https://github.com/reactor/lite-rx-api-hands-on)
    - 현재까지 본 코드중에는 가장 좋은 샘플 코드
    - 테스트케이스를 단계 별로 따라할 수 있고
    - Flux, Mono 중심으로 예제가 되어 있어 기본을 이해하기에 좋다
    - [clone 받아 테스트케이스 작성은 따라해봤으나](https://github.com/chanwookpark/lite-rx-api-hands-on)
    - 이번에는 전체 코드를 따라 작성해보면 좋을 듯  
    - [이 코드와 연결된 자료](https://speakerdeck.com/sdeleuze/a-lite-rx-api-for-the-jvm)
- 스프링 코어 테스트 케이스 중 [reactor 지원 컨트롤러 예제](https://github.com/spring-projects/spring-reactive/blob/545325dbf5d04c30aaedf25b4da1f7b97650d33f/src/test/java/org/springframework/web/reactive/method/annotation/RequestMappingIntegrationTests.java#L464)

# 궁금증

- 지금 가장 큰 관심은 Spring의 View처리와 JDBC(JPA) 처리를 포함해 reactive 스타일로 개발이 가능한 것인가? (전체가 non-blocking으로..)
- 이렇게 하면 개발 패턴은 기존과 달라지나?? 궁금

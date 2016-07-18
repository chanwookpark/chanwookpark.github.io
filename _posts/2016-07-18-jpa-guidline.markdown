---
layout: post
title:  "JPA 가이드라인"
date:   2016-07-18 13:00:00 +0000
categories: jpa
---

JPA로 커머스 개발을 앞두고 혼자 정리해보는 나만의 가이드라인.
일단 JPA로 시작하기는 하지만 어떤 식으로 정리될지는 두고봐야할듯..

# 엔티티 매핑
## 엔티티 ID 매핑

- DB에서 생성하는 값 사용 (Sequence나 Identity)
- 사용자에게 받는 값 사용
- 로직으로 생성하는 값 사용

DB에서 생성하는 값을 사용하고 싶을 때는 @GeneratedValue 를 사용한다.

    @Id
    @GeneratedValue
    private long id;

시퀀스(특히, 오라클)를 사용할 때는 [@SequenceGenerator](http://docs.oracle.com/javaee/6/api/javax/persistence/SequenceGenerator.html) 와 함께 사용. @SequenceGenerator 는 시퀀스에 대한 상세한 속성을 설정한다. 특별히 테스트 목적이 아니면 반드시 선언해서 사용하자.

## Lombok과 함께 사용하기
항상 만들어야 하는 getter/setter와 생성자는 Lombok을 사용하고 코드를 작성하지말자.
기본 포맷은 다음처럼 (필요 시 더 추가..)

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor

Lombok을 사용하려면 다음 의존성을 추가해야 한다. 로컬에서 개발할 때는 인텔리j와 이클립스 플러그인 설치해 사용해야 한다.

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>${version.lombok}</version>
    </dependency>

# JPA와 Spring Boot 함께 사용하기
일단 설정에 spring Boot의 JPA 모듈과 사용하는 DB에 맞는 JDBC를 POM에 추가해야 한다.

<!-- 기타 Spring boot 설정도 필요 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- H2를 사용. 이 정보는 사용하는 DB에 맞춰 변경하자. -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>

데이터소스가 1개라면 EntityManagerFactory 등을 위한 설정은 필요 없다.

//TODO 데이터소스가 여러 개 일 때는?

별도로 리파지토리 관련 설정을 하지 않으면 스프링 부트의 APP 메인 클래스부터 엔티티 검색을 한다.
리파지토리 및 엔티티 검색 관련 설정을 하고 싶다면 아래처럼 하도록하자.

    @Configuration
    @EnableJpaRepositories(basePackages = "applestore",
            includeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com.jpasample..\*JpaRepository"))
    @EntityScan(basePackages = "com.jpasample.domain")
    public class JpaConfig {
    }

그외 JPA 프로퍼티 설정 역시 부트 프로퍼티 파일에 기록하면 된다. 프로퍼티 명은 'spring.jpa.\*' 형식이다.

![스프링 부트에서 정의한 JPA 속성](/jpa-guideline/spirng-jpa-properties.png)

...

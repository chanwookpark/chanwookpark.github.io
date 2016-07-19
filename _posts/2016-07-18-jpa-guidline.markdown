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

## equals()와 hashcode() 구현하기 - 엔티티 동일성 확인
업무 로직에 맞춰서 동일한 정보인지를 판단하는 로직을 보통 서비스 등에 개발을 하게 되는데, 엔티티의 동일성을 확인하는 코드는 이렇게 매번 필요할 때마다 if를 넣지 않고 엔티티 클래스의 equals()와 hashcode()를 구현해 비교하도록 하자.

### 언제 사용하는가?
- 엔티티가 동일한지 직접 비교 하거나 (if)
- Set에 저장할 때 (Set은 중복을 허용하지 않기 때문에)
- 세션의 1차, 2차 캐시에 저장하거나
- 세션의 오퍼레이션을 수행할 때 (예를 들어, detach() 등) -> 요즘 JPA에서의 상황 확인 필요...
- find()한 객체와 Query/Criteria로 로딩한 객체의 동일성 확인할 때

### 어떻게 구현해야 하나?
- 구현하지 않는다 (equals()와 hashcode()를 override하지 않음)
 - 세션에서 동일한 ID를 같는 객체가 이미 로딩된 경우에 이 객체를 그대로 반환하기 때문에 동일한 객체로 인식함
- ID 프로퍼티만 사용해 비교하도록 equals()와 hashcode()를 구현한다 (Member의 id 필드만 사용해 비교)
 - @Id가 선언된 DB 주키와 매핑된 필드만 비교한다
 - 단, 객체가 동일한지 먼저 비교한 후에 ID 비교를 한다
- 비즈니스키에 해당하는 프로퍼티를 사용해 equals()와 hashcode()를 구현한다 (Member의 id와 email 필드를 함께 사용해 비교)
 - 비즈니스키를 사용해 비교하는 e/s 함수를 구현
 - 비교하고 hash를 생성하는 로직은 Apache commons 라이브러리를 사용하자 : [EqualsBuilder](http://commons.apache.org/proper/commons-lang/javadocs/api-2.5/org/apache/commons/lang/builder/EqualsBuilder.html)와 [hashcodeBuilder](http://commons.apache.org/proper/commons-lang/javadocs/api-2.5/org/apache/commons/lang/builder/HashCodeBuilder.html) 구현 참조
 - 위 클래스를 사용하려면 commons-lang을 POM에 추가해야 한다
 - 여기서 말하는 비즈니스키에는 DB 주키(ID)를 포함할 수 도 있고 때에 따라서는 포함하지 않고 정확히 식별이 가능하다면 포함하지 않아도 좋다
 - 왜냐면 DB 주키(ID)가 할당되어 있지 않지만 비즈니스 키는 동일할 수 있기 때문이다. DB와 동기화가 되지 않은 엔티티라 ID가 없지만 다른 필드 값은 동일하게 가지고 있을 수 있기 때문이다. 물론, 비즈니스 키가 최소한 컬럼의 unique로 선언되어 있을 것이니 로직에서 걸러지지 않아도 저장 시에 걸러지는 케이스가 많을 걸로 생각된다..
 - 비즈니스 키 비교시에는 DB 주키(ID)를 포함하지 않는다. ID로 비교가 필요하거나 ID로만 식별이 충분하다면 비즈니스 키 비교(3번)이 아닌 ID 비교 방법(2번)을 사용한다.


### 참조
- https://vladmihalcea.com/2013/10/23/hibernate-facts-equals-and-hashcode/

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

# Spring과 JPA 함께 사용하기
## 기본 환경설정
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

> TODO 데이터소스가 여러 개 일 때는?

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

## Config 클래스 만들기
기본 설정으로 부족할 경우에는 JavaConfig 클래스를 만들어 JPA 관련 설정을 정리하자

자세한 내용은 [스프링 데이터 JPA 가이드](http://docs.spring.io/spring-data/jpa/docs/1.9.4.RELEASE/reference/html/#jpa.java-config) 참조.

# 개발 및 운영관련 고민
## 개발 DB와 운영 DB에서 엔티티 매핑 변경에 따른 스키마 반영은 어떻게 해야할까?
혼자 사용하는 로컬DB라면 JPA의 스키마 업데이트(spring.jpa.hibernate.ddl-auto=update)를 사용하겠지만 여러 개발자가 함께 사용하는 개발DB나 운영DB에서는 그럴수가 없다.

이럴 때는 변경된 매핑 정보에 대한 DDL 스크립트를 별도로 준비하고 우선 개발환경에서 변경된 스키마 정보를 반영 후 역시 함께 변경한 매핑 정보가 반영된 애플리케이션을 다시 배포해 확인한다. 검증이 되면 그 때 운영에 역시 스키마를 변경하고 애플리케이션을 배포하는 순으로 작업한다.

이말은 JPA라고 특별한 방법을 사용하는 것이 아니라 일반적인 RDB 운영 방식을 그대로 사용하는 편이 좋을 수도 있다는 측면으로 생각해볼 수 있다.

물론, 여기서 변경되는 엔티티 매핑에 대한 DDL 스크립트를 구하기 위해 변경한 엔티티를 한 번 실행해서 로그로 떨어지는 DDL 스크립트를 따낼 수도 있다. (그런데 이렇게 한 번 실행하면 이미 DB에는 반영이 되버린건데.. 로컬에 개발DB를 구성해 돌리기는 무리일테니.. 아니다 JPA를 사용하니 어쨌든 핵심 모델에 대한 스키마는 로컬에서도 구성하지 못할 이유가 없다! 데이터가 없다면 모를까..;;;)

프로젝트든 서비스 운영든 DB 스키마를 관리하는 사람(또는 팀)이 있기 마련인데, 최종 DB 변경의 주체는 이 사람(또는 팀)이 될테니 엔티티 매핑을 관리하는 개발자가 변경하고자 하는 정보를 JPA 스키마 생성으로 떨어지는 정보를 코드와 함께 DB 담당자에게 전달하고, 이를 개발, 운영에 순차적으로 반영하는 방법이 좋겠다. 전달한 DDL을 DB 담당자가 현재 스키마에 맞춰 한 번 더 정제를 해주겠지..

환경 별 DB에 반영하는 작업을 사람이 손으로 하냐 어떤 자동화된 프로세스를 따르냐는 별개 문제.

> TODO 위 내용 정리하기

...


# Test

## JPA 테스트 클래스 생성
- 엔티티 및 리파지토리 빈 설정 로딩
- 트랜잭션/캐시 등 테스트 정보를 클리어하는 기능과 TestEntityManager클래스등과 같은 JPA 테스트 편의 기능/설정 지원
- 임베디드DB(H2 등)가 아닌 설치형 DB(오라클,마이SQL등)를 사용 지원
- Spring+DBUnit으로 테스트 데이터 입력 지원

    @RunWith(SpringRunner.class)
    @SpringBootTest(classes = App.class)
    @DataJpaTest
    @AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
    @TestExecutionListeners(mergeMode = TestExecutionListeners.MergeMode.MERGE_WITH_DEFAULTS,
        listeners = {DbUnitTestExecutionListener.class})
    @DatabaseSetup("equals-hashcode-sample-data.xml")
    public class EqualsAndHashcodeTest {
        @Autowired
        TestEntityManager em;

        @Autowired
        XxxJpaRepository r;
    }

## 데이터 셋업
DBUnit을 사용한다. XML로 테스트 데이터를 만들고 이를 테스트 클래스와 동일한 경로로 /test/resources 하위에 두면 됨.
> https://github.com/springtestdbunit/spring-test-dbunit 사용

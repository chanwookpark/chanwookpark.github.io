---
layout: post
title:  "하이버네이트(JPA) 베스트 프랙티스"
date:   2016-09-26 05:00:00 +0000
categories: JPA Hibernate 번역
---

> http://www.thoughts-on-java.org/hibernate-best-practices/ 글을 읽고 생각한 바를 기록해둡니다.

# 1. 상황에 맞춰 projection 하자

Projection 방법으로 엔티티, POJO, Scalar Value(List<Object[]> 타입) 3가지 방법을 소개.

3번째 scalar value을 사용하는 방법은 사용하지 말고, 이럴 때는 POJO 클래스를 생성해서 사용하는 편이 좋겠다.

# 2. 상황에 맞는 쿼리 종류를 선택해 사용하자 (쿼리 작성 방식을 말함)

1. EntityManager.find()
 - 가장 쉬운 방법이자 성능과 보안상 이점이 있다고 설명
 - 성능은 1차, 2차 캐시 때문이고, 보안상 이점은 키 바인딩만 하기 때문에 SQL Injection 공격에 안전하다는 설명
 - 아래 쿼리를 실행하는 방법과 비교를 하려면 '.'으로 조회해 사용하는 객체 그래프 방식(있어 보이는군..)이 설명되야 하는 것 아닌가?
2. JPAQL
 - 별다른 설명 없음
3. Criteria API
 - 사용자 입력에 맞춰 쿼리를 생성하는 복잡한 경우라면 JPAQL보다 Criteria를 사용하는 편이 좋겠다는 설명
4. Native SQL
 - 어쩔수 없이 특정 DB의 기능을 사용해야 할 때

# 3. 파라미터 바인딩을 사용하자

쿼리 스트링을 사용하기보다는 파라미터 바인딩 사용하자는 당연한 말씀.
이유는
- SQL Injection 걱정할 필요 없고
- 타입 바인딩을 알아서 해주고
- 하이버네이트 내부에서 최적화를 해주니 좀더 성능상으로도 좋기 때문이다

# 4. 네임드 쿼리와 파라미터 이름은 상수를 사용하자

예시가 참 좋다.
네임드 쿼리를 선언할 때와 네임트 쿼리를 사용할 때 같은 상수를 사용하도록 하자는 설명은 작은 케이스이지만 꼭 챙기도록 하자.

```java
@NamedQuery(name = Product.QUERY_FIND_BY_PRODUCT_NAME, ...)
public class Product {
    public static final String QUERY_FIND_BY_PRODUCT_NAME = "Product.findByProductName";
}

Query q = em.createNamedQuery(Product.QUERY_FIND_BY_PRODUCT_NAME);

```

# 5. Criteria API를 사용할 때는 JPA Metamodel을 사용하자

솔직히 개인적으로는 이런 메타 모델을 사용하는 것에 대해 좋은지 나쁜지 잘 판단이 안 된다.
실제로 사용한다면 당연히 QueryDSL을 사용할텐데, 아무래도 개발툴(빌드도구)에 의해서 한 번 통과해야만 제대로 사용할 수 있기 때문에 개발 과정 중 꼬이는 현상이 발생할 수 있다.

솔직히 환경에 익숙해지면 이런 문제가 얼마나 발생할까 싶기도 하고, 사용할 때의 효과에 비하면 이게 얼마나 큰 담점일까 하는 생각도 든다.
"툴에 의해 생성된 코드"로 개발하는 환경에 대해 예전부터 부정적인 느낌을 계속 쌓아 왔기 때문에 그럴지도 모른다.

# 6. surrogate key를 사용해 하이버네이트가 새로운 값을 만들도록 하자

자연키를 조합해 복잡하게 사용하지 않아도 되는 장점으로 든다.
2차 캐시에 들어갈 때나 엔티티를 주고 받아 개발하는 패턴 등을 보더라도 대리키(surrogate key)를 사용하는 편이 "단순함" 측면에서는 좋겠다.

반대로 자연키를 사용해서 엔티티 조회를 하는 경우가 많은 경우를 생각해보면,
개발 API야 자연키를 주키로 선언하지 않았다 하더라도 인덱스로 잡아주고(@Column(unique=true)) findByXxx 류의 함수로 선언해 사용하면 문제가 되지 않으리라 생각한다.
이런 경우에는 주키 조회와 자연키 조회가 캐시된 동일 인스턴스로 처리되지 않기 때문에 DB 조회가 두 번 일어나게 된다.

```java
@Test
public void 자연키로조회해보기() throws Exception {
    long number = 1001;
    String memberId =  "tor";

    final Member loaded1 = mr.findOne(number);
    assertThat(memberId).isEqualTo(loaded1.getMemberId());

    final Member loaded2 = mr.findByMemberId(memberId);
    assertThat(number).isEqualTo(loaded2.getMemberNumber());
}
```

간단히 생각하고 적기 시작했는데, Spring DATA JPA의 쿼리 메서드(findByXxx)를 선언해 사용하면 JPA 1차, 2차 캐시 처리를 안 해준다는 사실을 이번에 알게 되면서 고민이 되기 시작했다.

예를 들면, 아래 처럼 쿼리를 날리면 3번의 DB SELECT가 실행된다.

```java
@Test
public void 자연키로조회해보기() throws Exception {
    long number = 1001;
    String memberId =  "tor";

    final Member loaded1 = mr.findOne(number);
    assertThat(memberId).isEqualTo(loaded1.getMemberId());

    final Member loaded2 = mr.findByMemberId(memberId);
    assertThat(number).isEqualTo(loaded2.getMemberNumber());

    final Member loaded3 = mr.findByMemberId(memberId);
    assertThat(number).isEqualTo(loaded3.getMemberNumber());
}
```

[구글링을 해보니 스프링 개발자인 Oliver 아저씨의 대답](http://stackoverflow.com/questions/26242492/how-to-cache-results-of-a-spring-data-jpa-query-method-without-using-query-cache)에 따르면 이럴 때는 스프링 캐시 매카니즘을 사용해야 한다고 한다.
흠.. 물론, 쿼리 캐시도 별도 캐시 엔트리에서 조회하는 거지만 어쨌든 쿼리 캐시든 스프링 캐시든 사실상 단순 키 조회 시에도 JPA 캐싱 매카니즘 처리가 안되니 이건 좀 불합리하다.

6번 서두에는 당연히 대리키를 사용하는 걸로 쉽게 동의를 했는데, 한 번 더 생각해볼만 한 포인드인듯하다.
자연키를 당연히 사용해야 한다라는 하이버네이트 관련 글도 꽤 많이 봤는데, 그렇게 하기에는 매핑이 너무 복잡하고 불편하다 생각한다.

# 7. natural identifier를 지정하자

@Column 없이 @NatualId 를 매핑해보니 인덱스와 유니크 컬럼으로 등록된다.
그런데 [링크된 글](http://www.thoughts-on-java.org/naturalid-good-way-persist-natural-ids-hibernate/)로 따라가 한참을 읽어보니 @NatualId 로 매핑한 키로 엔티티 조회를 하려면 상당히 복잡한 과정을 거쳐야 한다.
그러고 보니 @NatualId 는 하이버네이트 매핑(org.hibernate.annotations.NaturalId)이다.
심지어 자연키와 주키 매핑을 위해 쿼리를 한 번 더 날리기도 한다.

물론, @NatualId 를 사용하면 6번 말미에서 언급한 캐시 문제(+락)가 해결이 된다.
그런데 이렇게 사용할 바에야 매핑의 불편함을 감수하면서 자연키를 직접 주키로 매핑해 사용하고 말겠다..

@NatualId 를 매핑하면 쿼리 메서드 조회 시에도 이들만 매핑해서 캐싱 처리를 해주면 좋겠다는 생각이 든다. (그래도 주키를 알아내야 하니 JPA/하이버네이트 내부에서 SELECT를 한 번 할 수 밖에 없는가..흠..)

# 8. 데이터베이스 스크립트를 생성하는 SQL 스크립트를 사용하자

드디어 시작하는 이번 프로젝트에서는 flyway를 사용해볼 생각이다.
JPA를 사용하면서 변경되는 스키마 관리에 [flyway를 사용해 프로세스](http://chanwookpark.github.io/dbmigration/flyway/2016/08/23/flyway/)를 잡아두는 건 참으로 요긴해보인다.

이럴 때 이번 장에서 소개하는 엔티티 매핑을 사용해 전체 스크립트를 뽑아낼 수 있다.
[Hibernate Tools](https://github.com/chanwookpark/commerce-app/blob/master/build.xml) 를 사용하는 방법도 있는데, 이 글에서는 JPA 2.1의 기능을 소개하고 있다.

이 방법대로 한 번 테스트 해봐야겠다.

# 9. 개발 기간에는 모든 쿼리를 남기고 분석하자

나는 지금까지도 (물론, 개발에서..) show_sql=true로 두고 사용을 했는데, 이글에서 설명하는 방법을 따르는 편이 더 좋을 듯 하다.
당장 내일 출근해서 이제 시작하는 프로젝트 세팅을 변경해야 할듯.

```properties
# spring boot application.properties 설정
# JPA/Hibernate
logging.level.org.hibernate=info
# SQL statements and parameters
logging.level.org.hibernate.SQL=debug
logging.level.org.hibernate.type.descriptor.sql=trace
```

[링크된 글](http://www.thoughts-on-java.org/hibernate-logging-guide/)을 한 번 보는 것도 좋을 듯 하다.

# 10. FetchType.EAGER를 사용하지 말자

당연한 소리. 연관 매핑 시에 FetchType.EAGER를 사용하지 말자.

# 11. 초기화가 필요한 lazy 연관은 쿼리에서 초기화를 하자

10번과는 반대로 초기화 에러(LazyInitializationException)가 발생할 수 있는 경우거나 [n+1 select 이슈](http://www.thoughts-on-java.org/free-mini-course-find-fix-n1-select-issues-hibernate/)가 발생할 수 있다면 'JOIN FETCH'를 사용해 쿼리 시에 초기화를 하자.

그런데 이건 JPAQL를 사용해 조회 시 말고도 빈번하게 일어나는 문제니 이런 케이스에 대한 정리는 따로 한 번 해보는 편이 더 좋겠다.
(옛날 정리 자료는 다 날라가서 슬프다 ㅠㅠ)

# 12. 관계가 복잡할 때는 remove cascade는 피하자

내 생각에는 cascade 자체가 다 조심스럽다. remove 뿐만 아니라..
cascade 설정은 어차피 엔티티 집합을 잘 만들어 하나의 주기로 엔티티가 관리되게 해야 하는데, 그런 측면에서는 꼭 remove만 빼야 되냐 싶기도 하다.

사실 일반적으로 remove가 대규모로 일어나는 경우를 가정하고 얘기하는 건 잘 안맞는 것 같고,
엔티티 간의 연관 관계가 복잡한 경우에 remove까지 casecade 설정이 되어 있는 경우를 어떻게 잘 처리할 수 있는가에 대한 공부를 더 해볼 필요가 있겠다.

# 13. 가능하다면 @Immutable 를 사용하자

DB View를 매핑하는 경우라면 유용해보인다.

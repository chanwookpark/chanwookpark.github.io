---
layout: post
title:  "스프링 필드인젝션+JPA인터페이스 유닛테스트 해보기"
date:   2017-09-01 01:00:00 +0000
categories: Spring JPA UnitTest
---

* TOC
{:toc}

오늘 낮에 기존 코드에 로직을 수정하다가 날짜 확인 로직을 넣어야 해서 가볍게 테스트 코드를 작성해봤다.

```java
@Test
public void test() throws Exception {
    String name = "chanwook";

    SampleService service = new SampleService();
    Sample s = service.findOneWithLogic(name);

    assert s != null;
    assert name.equals(s.getName());
}
```

서비스 안에서 어떤 로직을 통과하고 엔티티 리턴하는지 확인하면 되는 간단한 테스트였는데..
아니 서비스에 리파지토리가 필드 인잭션이 되어 있는 것이다.

```java
@Service
public class SampleService {

    @Autowired
    SampleRepository repository;

}
```

흠..이렇게 되어 있으니 저 리파지토리를 간단하게 new 해서 만들어 넣어 테스트 해보고 싶어도 해볼 수가 없었다 ㅠㅠ.

> 일단 여기서 필드 인잭션이 좋은 방법이냐 아니냐는 얘기하지 않으려고 합니다... 이미 사용하고 있기에...

지금 테스트를 돌리면 리파지토리 객체가 없으므로 NPE가 발생한다..

# 첫 번째 방법. 현실과 타협

그렇다. 테스트를 해야 하고, 리파지토리 객체를 저 멤버에 할당하고 싶으니 이걸 다시 세터 메서드를 만들어 길을 만들어준다.

```java
@Service
public class SampleService {

    SampleRepository repository;

    @Autowired
    public void setRepository(SampleRepository repository) {
        this.repository = repository;
    }
}
```     

그래 이럴수도 있다. 그런데 SampleService에는 리파지토리 말고 5개 정도의 멤버가 필드 인잭션으로 만들어져 있다.
그런데 테스트 하고 싶다고 이 멤버만 DI 방식을 바꿀수도 없다..
그렇다고 모두 세터 인잭션으로 바꾸자고 할 수도 없고 말이다..

좀 더 머리를 굴려서 여기까지 생각을 해보기도 했다...

```java
@Service
public class SampleService {

    @Autowired
    SampleRepository repository;

    public void setRepository(SampleRepository repository) {
        this.repository = repository;
    }
}
```

무엇이 차이일까? ㅎㅎ

다른 멤버들과 마찬가지로 필드 인잭션은 하고 추가로 세터 메서드를 만들었다.
@Autowired 는 메서드가 아니라 필드에 여전히 있고..

이게 무슨 짓이냐 하는 생각이 들지만..
실제 클래스 코드의 길이는 위 예제보다 길고 세터 메서드를 클래스 가장 아래쪽에 살포시 만들어 두면 문제 없이 테스트도 할 수 있고 왠지 모를 안정감이 들어 괜찮아 보이기까지도 했다. (!!)

# 두 번째 방법. 스프링에서 하라고 하는 방법

이런 경우에 스프링에서 이렇게 하라는 내용이 레퍼런스에 나오지는 않는다.
커뮤니티에도 대부분 방법을 설명하려고 하기보다 ["그래서 필드 인젝션이 안 좋은 방법이다.."라고 얘기](http://olivergierke.de/2013/11/why-field-injection-is-evil/)를 많이 하는 듯 하다. (요것도 옛날 얘기..)

그렇다고 스프링에서 방법을 제공하지 않는 건 아니다.

[ReflectionTestUtils](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/test/util/ReflectionTestUtils.html)라는 테스트 편의 클래스를 제공한다.
이걸 사용하면 쉽게 필드에 원하는 인스턴스를 넣을 수가 있다.

```java
@Test
public void test() throws Exception {
    String name = "chanwook";
    SampleService service = new SampleService();
    SampleRepository repository = new SampleRepository();
    ReflectionTestUtils.setField(service, "repository", repository);

    Sample s = service.findOneWithLogic(name);

    assert s != null;
    assert name.equals(s.getName());
}
```

내가 원하는 만큼 간단한 방법이라 요걸 사용하기로 하고..
마무리 하려고 했는데 리파지토리가 인터페이스라 new로 인스턴스 생성을 할수가 없다..!

# 세 번째. Spring Data Repository 목킹

JPA를 사용할 때 요즘 대부분 많이 사용하는 Spring Data는 인터페이스만 만들어서 사용하도록 제공해준다.
그러다 보니 테스트에서도 new로 리파지토리를 간단히 만들어서 테스트할 수가 없다.

물론, 하자면 열 몇개 되는 메서드를 빈깡통으로라도 구현하고 그 중 내가 사용할 메서드만 테스트 로직을 넣으면 만들 수가 있다.
요건 [스프링 친구들도 이렇게 하지 말라고](https://stackoverflow.com/questions/23435937/how-to-test-spring-data-repositories) 하는 것 같다. (이 링크에 나오는 Oliver 아저씨가 위에 세터 인젝션이 구리다고 말한 그 아저씨다. 어쩌다 보니 같은 분의 글을 링크따게 됐다!)

단위 테스트는 하지 말라고는 하는데..

나는 간단한 날짜 로직 테스트 하고 싶은 거라서 스프링 띄워서 블라블라 올라가는 걸 보고 싶지는 않기에 간단하게 Mockito로 목킹해서 마무리 해볼려고 한다.

```java
@Test
public void test() throws Exception {
    String name = "chanwook";

    SampleRepository repository = mock(SampleRepository.class);
    when(repository.findByName(name)).thenReturn(new Sample(name));

    SampleService service = new SampleService();
    ReflectionTestUtils.setField(service, "repository", repository);

    Sample s = service.findOneWithLogic(name);

    assert s != null;
    assert name.equals(s.getName());
}
```

오늘의 테스트 코드 완성.

간단하지만 동작하는 코드는 [깃헙 프로젝트](https://github.com/chanwookpark/spirng-field-injection-jpa-interface-unit-test)를 확인해볼 수 있습니다^^.

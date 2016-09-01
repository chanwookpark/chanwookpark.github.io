---
layout: post
title:  "API 게이트웨이 (크리스 리차드슨)"
date:   2016-07-18 13:00:00 +0000
categories: microservice apigateway 번역 Chris
---

> This a translation of an article [API Gateway](http://microservices.io/patterns/apigateway.html) originally written and copyrighted by [Chris Richardson](http://twitter.com/crichardson).      
이글은 [Chris Richardson](http://twitter.com/crichardson)가 작성하였으며, 저작권을 가지고 있는 [API Gateway](http://microservices.io/patterns/apigateway.html) 글의 번역본입니다.

# 배경 (맥락)
[마이크로서비스 패턴](http://wiki-camp.appspot.com/%5B번역%5D_마이크로서비스_아키텍처_%28Microservices_Architecture%29#top)을 사용해 상품 상세 페이지를 구현하는 온라인 상점을 구축한다고 생각해보자. 상품 상세 사용자 인터페이스의 여러 버전으로 구현해야 한다.

* 데스크탑과 모바일 브라우저에서 동작하는 HTML5/자바스크립트 기반 UI - HTML은 서버 측 웹 애플리케이션에서 생성된다  
* 네이티브 안드로이드와 아이폰 클라이언트 - 클라이언트가 REST API를 통해서 서버와 통신한다

추가적으로 온라인 상점은 제 3자 애플리케이션이 사용하는 REST API로 상품 상세 정보를 노출해야만 한다.

상품 상세 페이지는 상품에 대한 많은 정보를 보여준다. 예를 들어, [POJO in Action](http://www.amazon.com/POJOs-Action-Developing-Applications-Lightweight/dp/1932394583)의 Amazon.com 상세 페이지는 다음 정보를 보여준다.

* 제목, 저자, 가격 등과 같은 책에 대한 기본 정보
* 책 구매 이력
* 구매 가능여부 (Availability)
* 구매 옵션
* 이 책과 함께 자주 구매한 다른 아이템
* 이 책을 구매한 고객이 산 다른 아이템
* 고객 리뷰
* 판매자 랭킹
* 등등등

마이크로서비스 패턴을 사용한 온라인 상점이기 때문에 상품 상세 데이터는 여러 개의 서비스로 퍼져있다. 예를 들어 보자.

* 상품 정보 서비스 - 제목, 저자, 가격 등과 같은 책에 대한 기본 정보
* 가격 서비스 - 상품 가격
* 주문 서비스 - 상품 구매 이력
* 재고 서비스 - 상품 구매 가능여부 (Availability)
* 리뷰 서비스 - 고객 리뷰 ...

결론적으로 상품 상세를 보여주는 코드는 이러한 서비스 모두에서 정보를 가지고 와야 한다.

# 문제

마이크로서비스 기반 애플리케이션의 클라이언트가 각각의 서비스에 어떻게 접근해야 하는가?

# 영향도  

* 마이크로서비스에서 제공하는 API의 단위(granularity)는 클라이언트에 요구하는 것과는 다른 경우가 자주 있다. 보통 마이크로서비스는 작은 단위로 API(fine-grained APIs)를 제공하는데, 이는 클라이언트가 여러 서비스와 통신해야 한다는 뜻이다.  예를 들어, 위에서 설명한것처럼 상품의 상세 정보를 필요로 하는 클라이언트는 아주 많은 서비스를 통해서 데이터를 가지고 와야 한다.
* 다른 클라이언트는 각각 다른 데이터를 필요로 한다. 예를 들어, 제품 상세 페이지의 데스크탑 브라우저 버전은 보통 모바일 버전보다 더 자세한 정보를 보여줄 수 있다.  
* 네트워크 성능은 각각의 클라이언트 유형에 따라 다르다. 예를 들어, 보통 모바일 네트워크는 모바일 네트워크가 아닐 때보다 훨씬 느리며, 훨씬 더 높은 지연시간(latency)을 보인다. 물론, WAN은 LAN보다 매우 느리다. 이는 서버 측 웹 애플리케이션이 사용하는 LAN보다 네이티브 모바일 클라이언트가 사용하는 네트워크가 매우 다른 성능 특성을 갖고 있음을 의미한다.(역주: 모바일일 때 당연히 더 느리다는 얘기겠죠..) 모바일 클라이언트에서는 백엔드 서비스로 요청을 많이 보낼 수 없는 반면에 서버 측 웹 애플리케이션은 사용자 경험에 영향을 주지 않고 백엔드 서비스로 많은 요청을 보낼 수 있다.
* 서비스를 분할한 것은 시간이 흐르며 변할 수 있으며 클라이언트에게서 숨겨야 한다.

# 해결방법

모든 클라이언트의 단일 진입점으로 API 게이트웨이(API Gateway)를 구현한다. API 게이트웨이는 둘 중 하나의 방법으로 요청을 처리한다. 일부 요청은 단순하게 적절한 서비스를 찾아 프록시나 라우터 역할을 한다. 다른 경우에는 여러 서비스로 흩어져서 요청을 처리한다.

![그림](http://microservices.io/i/apigateway.jpg)

많은 경우에 사용할 수 있게 만든 스타일의 API 보다 API 게이트웨이는 각 클라이언트에 맞춰 다양한 API를 노출할 수 있다. 예를 들어, [Netflix API](http://techblog.netflix.com/2012/07/embracing-differences-inside-netflix.html) 게이트웨이는 클라이언트의 요건에 가장 잘 맞는 API와 함께 각 클라이언트가 제공하는 클라리언트에 특화된 어뎁터 코드를 실행한다.

API 게이트웨이는 보안을 위해 구현할 경우도 있다. 예를 들어, 요청을 수행하기 위해 권한이 있는 클라이언트인지 확인할 수 있다.

# 예시  

[Netflix API 게이트웨이](http://techblog.netflix.com/2013/01/optimizing-netflix-api.html)

#  적용 결과

API 게이트웨이를 사용하면 다음과 같은 혜택을 볼 수 있다.

* 애플리케이션이 마이크로서비스로 어떻게 분할되어 있는지를 클라이언트로부터 격리할 수 있다.
* 각 클라이언트에 최적화된 API를 제공할 수 있다.
* 여러 서비스를 호출하는 로직을 클라이언트에서 API 게이트웨이로 옮겨 클라이언트를 간소화할 수 있다.
* 요청/라운드트립(round-trip)의 수를 줄일 수 있다. 예를 들어, API 게이트웨이는 클라이언트가 한 번의 라운드트립으로 여러 서비스에서 데이터를 받아올 수 있다. 더 적은 요청은 부하를 줄이고 사용자 경험을 높힐 수 있다는 의미다. API 게이트웨이는 모바일 애플리케이션에서는 필수다.

API 게이트웨이 패턴은 몇 가지 단점이 있다.

* 복잡도 증가 - API 게이트웨이는 개발해야만하고, 디플로이해야만하고, 관리해야만 하는 영역이 잇따라 넓어져 간다.
* API 게이트웨이로 인해 네트워크 홉(network hop)이 추가되면서 응답 시간 증가 - 그렇지만 대부분의 애플리케이션에서 추가 라운드트립의 비용은 사소한 문제다.

이슈:

* API 게이트웨이를 어떻게 구현할 것인가? 높은 수준의 부하를 처리하는 확장성을 확보해야 한다면 이벤트 주도/리엑티브 접근법이 최고다. JVM 상에서는 Netty, Spring Reactor등과 같은 NIO 기반 라이브러리면 딱 맞다. NodeJS는 또 다른 옵션이다.

# 예제

[Netflix API 게이트웨이](http://techblog.netflix.com/2012/07/embracing-differences-inside-netflix.html)

# 관련 패턴

* [마이크로서비스 패턴](http://wiki-camp.appspot.com/%5B번역%5D_마이크로서비스_아키텍처_%28Microservices_Architecture%29#top)이 이 패턴의 필요성을 만들었다.
* API 게이트웨이는 유효한 서비스 인스턴스로 요청을 보내기 위해 [클라이언트 측 디스커버리 패턴](http://microservices.io/patterns/client-side-discovery.html)이나 [서버 측 디스커버리 패턴](http://microservices.io/patterns/server-side-discovery.html)을 사용해야 한다.

#  알려진 사례

* [Netflix API 게이트웨이](http://techblog.netflix.com/2012/07/embracing-differences-inside-netflix.html)

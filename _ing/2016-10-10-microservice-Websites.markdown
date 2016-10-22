---
layout: post
title:  "마이크로서비스 웹사이트 (gustafnk)"
date:   2016-10-10 01:00:00 +0000
categories: microservice website 번역
---

How can we develop websites where the different parts of the pages are developed by different teams? If you work in a large enough organization which has its content and services on the web, this is probably a question you have asked yourself several times.

페이지의 여러 부분을 다른 팀들이 개발하는 어떻게 웹 사이트를 개발할 수 있을까? 만약 웹에서 컨텐츠와 서비스를 갖고 있을 만큼 충분히 큰 조직에서 일한다면, 이것은 여러차레 스스로 묻게되는 질문이다.

There are no lack of technologies to choose from when building websites today. Three broad strategies can be identified: client-side rendering, server-side rendering, or both (isomorphic web applications).

오늘날 웹 사이트를 구축하는 면에서 기술은 선택하는데 부족함은 없다. 세 가지의 폭넓은 전략이 검증되어 있다. 클라이언트에서 렌더링하기, 서버에서 렌더링하기, 둘다하기(isomorphic 웹 애플리케이션)다.

To co-exist on the same page, the code for the different parts need to be integrated in some way. Apart from where we do rendering (client/server/isomorphic), we also need to decide when to integrate (static/dynamic) and what to integrate (data/code/content).

같은 페이지에 동시에 존재하기 위해서는 다른 영역의 코드는 어떠한 방향으로 통합되야 할 필요가 있다. 어디서 렌더링하는지를 제외하고(클라이언트,서버,양쪽모두) 언제 통합하고(정적/동적) 무엇을 통합할지(데이터,코드,컨텐츠) 결정해야 한다.

When we build pages with parts from different teams, we’re building a network of pages and parts. The properties of a network as a whole depends largely on the way we integrate the parts, which in turn depends on how we build the parts. But the way we build the parts depends in turn on the way we integrate the parts, which depends on what properties we want the network as a whole to have. How do we resolve this deadlock?

다른 팀에서 만든 부품으로 페이지를 구성할 때는 페이지와 부품의 관계를 구성한다. 부품을 통합하는 중에 전체로서 강력한 의존성이 네트워크의 속성(프로퍼티스)은 결과적으로 부품을 어떻게 구성하는 지에 달려있다. 그러나 부품을 구성하는 방법은 부품을 통합하는 와중에 결국에 좌우된다. 소유하는 전체로서의 네트워크를 원하는 속성이 무엇인지에 따라 좌우된다.

A rhetorical question: what do you think is most important, the network as a whole (the parts and their integrations) or the sum of all parts (without the integrations)? We think we shouldn’t fall into the trap of letting the parts dictate how we integrate the whole. Instead, the whole should set the constraints on how we can build the parts.

수사적인 질문(rhetorical question?) : 가장 중요하다고 생각하는 건 무엇인가? 전체로서의 네트워크(부품과 부품의 통합)인가 모든 부품의 집합(통합 없이)인가? 전체를 통합하는 방법에 부품이 영향을 줘버리는 덫에 걸리지 않아야 한다고 생각한다. 대신 전체가 부품을 구성하는 방법에 제약을 주어야 한다.

So, what are good ways of building a network of microservice websites and components?

그래서 마이크로서비스 웹사이트의 네트웍과 컴포넌트츠를 구성하는 좋은 방법은 무엇일까?

The meaning behind the word “good” depends on the current and future needs of the organisation responsible for the software and the users of the software. No architecture is good in-itself, it all depends on the context and the needs.

"좋다"라는 단어의 숨은 의미는 소프트웨어를 책임지는 조직과 소프트웨어 사용자의 현재와 미래의 필요성에 달려있다. 본질적으로 좋은 아키텍처란 없다. 모든 것이 상황과 필요성에 따라 다른 것이다.

With this article we want to show that server-side rendered websites integrated on content (using transclusion) allow for high long-term evolvability compared to client-side rendering integrated with shared code. In other words, if you want a system with high long-term evolvability, you should not develop websites using only client-side JavaScript and integrate them using a shared components approach.

이번 글에서는 공용 코드를 통합하는 클라이언트에서 렌더링과 비교해서 장기적인 높은 evolvability를 보여주는 컨텐츠를 통합(transclusion를 사용)하는 서버에서 렌더링하는 웹사이트를 보여줄 것이다. 반면에 장기적인 evolvability의 시스템을 원한다면 클라이언트 측의 자바스크립트만 사용해서 웹 사이트를 개발하면 안되고 공용 컴포넌트를 사용해 통합하는 접근 방법을 사용해야 한다.

We also want to show that Client Side Includes is a good first choice for transclusion technology, since they are lightweight and allow for a faster initial release than Edge Side Includes (ESI). They also allow for keeping the option open for using ESI later, when beneficial. We describe and compare two related Client Side Include libraries: hinclude and h-include. We also give a suggestion for an approach to work with both global and service local JavaScript and CSS.

또한 클라이언트 측에서 Include는 transclusion 기술의 좋은 첫 번째 선택으로 보여줄 생각이다. Edge Side Include(ESI)보다 가볍고 더 빠르게 초기 릴리즈가 가능하기 때문이다. 또한 차후 ESI가 도움이 된다면 ESI를 사용할 수 있는 옵션을 유지 해준다. 두 개의 Client Side Include 라이브러리를 설명하고 비교하겠다. hinclude와 h-include이다. 또한 글로벌과 서비스 로칼 자바스크립트와 CSS 둘다 함께 사용하는 접근 방법을 제안해보겠다.

Throughout this article, we use an retail site as an example. In the end of this article, we give a brief description of an example architecture for this retail site.

이번 글에서는 소매 사이트를 예제로 사용한다. 이번 글이 끝나면 소매 사이트에 대한 간략한 설명과 예제 아키텍처를 제공한다.

The article begins with a short introdution to microservices. Before moving on to a comparision of integration techniques, we describe a strategy of how the effort of web design can be scaled effectively with pattern labs.

마이크로서비스에 대한 간단한 소개와 함께 글을 시작하겠다. 통합 기술을 비교로 넘어가기 전에 웹 디자인의 노력으로 패턴 랩을 사용해서 효과적으로웹 스케일을 확보할 수 있는 방법에 대한 전략을 설명하겠다.

# Why Microservices?
왜 마이크로서비스인가?

A good place to start to learn about microservices is Martin Fowler and James Lewis’ article. For me, the key benefits are:

마이크로서비스에 대해 배움을 시작히기 위한 좋은 지점은 마틴 파울러(Martin Fowler)와 제임스 류이스(James Lewis)의 [글](http://martinfowler.com/articles/microservices.html)이다. 나에게는 핵심 장점이 다음이었다.

- Less organisational/architectural friction by following Conway’s Law
- Separate deploys for separate services
- Allows for a heterogenous system, which in turn leads to long-term evolvability

- [콘웨이 규칙](https://en.wikipedia.org/wiki/Conway%27s_law)에 따라 조직과 아키텍처 마찰이 적음
- 분리된 서비스에 대한 배포 분리
- 이기종 시스템(heterogenous system)이 가능해 결과적으로 장기적인 evolvability를 이끌어 냄

The approach of Self-Contained Systems (SCS) is a specialisation of microservices: a SCS is a “team sized” autonomous web application.

[Self-Contained Systems](http://scs-architecture.org)(Self-Contained Systems)의 접근방법은 마이크로서비스의 전공이다. SCS은 "팀 크기(단위?)"의 자율적인 웹 애플리케이션이다.

# Example: Retail site
예제 : 소매 사이트

We use a retail site as an example in this article. The retail site has two teams – Products and Orders – where the Products team is responsible for showing the products to the users and the Orders team is responsible for the shopping cart and the checkout flow. The number of items in the shopping cart should be visible on each product page and it should be possible to add products to the shopping cart with a single click.

이번 글에서는 예제로 소매 사이트를 사용한다. 소매 사이트는 상품과 주문 두 개의 팀이 있다. 상품팀은 사용자에게 상품을 보여주는 책임이 있고, 주문 팀은 장바구니와 결제 흐름에 대한 책임이 있다. 장바구니에는 여러 개 아이템이 있고 각 상품 페이지에서 볼수 있고, 한 번 클릭으로 장바구니에 상품을 추가할 수 있어야 한다.

Further, when a product is added to the shopping cart, the entire page shouldn’t be reloaded (only a partial reload of the shopping cart should be necessary). And the teams want to avoid unnecessary knowledge of each other’s domain, i.e. the Product team should not need to know that the shopping cart should be updated when adding a product to the shopping cart (only the Orders team should know this).

더 나아가 상품을 장바구니에 추가할 때 전체 페이지를 다시 불러오면 안된다(장바구니의 일부만 다시 불러올 필요가 있게 해야한다). 그리고 팀은 다른 팀의 도메인에 대한 불필요한 지식을 피하기를 원한다. 예를 들어, 상품 팀은 장바구니에 상품을 추가했을 때 장바구니가 갱신되야 하는 지를 알 필요가 없다(주문 팀만 이러한 지식을 알면 된다).

The future plan is to create a Recommendations teams for product recommendations and a Social team for customer ratings and reviews. As with the shopping cart, these teams will expose pages from their own services, as well as components that are visible on each product page.

앞으로 계획은 상품 추천을 위해 추천 팀을 만들고, 고객 등급과 리뷰를 위한 소셜 팀을 만들 것이다. 장바구니 처럼 이들 팀은 자신 서비스에 대한 페이지를 노출할 수 있을 뿐만 아니라 각 상품 페이지에서 볼 수 있는 컴포넌트를 노출할 수도 있다.

In this article, we will think of our services as Self-Contained Systems, since each system will mostly correspond to a team.

이번 글에서는 Self-Contained 시스템으로서 서비스에 대해 생각해볼 것이다. 각 시스템은 대부분 한 팀에 대응할 것이기 때문...

# 주요 용어
transclusion ->
evolvability ->
server-side rendering -> 서버에서 그리는
client-side rendering - > 클라이언트에서 그리는
Client Side Include
->
Edge Side Includes (ESI)
 -> https://en.wikipedia.org/wiki/Edge_Side_Includes

# 교정
초반 organisation -> organization

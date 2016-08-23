---
layout: post
title:  "OAuth 2 개발자 가이드"
date:   2016-01-26 13:00:00 +0000
categories: Spring OAuth
---

> 이 글은 Spring 공식 사이트에서 제공하는 [OAuth2 Developers Guide](http://projects.spring.io/spring-security-oauth/docs/oauth2.html)를 번역한 글입니다. 이 글과 함께 제공하는 [샘플코드](https://github.com/spring-projects/spring-security-oauth/tree/master/samples/oauth2/tonr)를 보시면 좀더 많은 도움이 받을 수 있습니다.      
이번 글에는 유사한 뜻으로 해석되는 용어가 상당히 많아 번역할 때도 힘들었지만 읽는 분들도 햇갈릴 수 있을 것 같습니다. [번역할 때 선택한 용어](https://github.com/chanwookpark/me/blob/master/translation/translation-map-kr%2Ben.md)는 별도로 정리해두었으니 용어가 맞는지 확인하고 싶을 때는 참고해보세요.     
오탈자 및 논의와 의견은 언제든지 환영입니다. 감사합니다.

# 소개

이 가이드는 [OAuth 2.0](https://tools.ietf.org/html/draft-ietf-oauth-v2-31)을 지원하는 사용자 가이드다. OAuth 1.0과는 완전히 다르기 때문에 1.0을 사용할 때는 [링크된 다른 사용자 가이드](http://projects.spring.io/spring-security-oauth/docs/oauth1.html)를 참조하자.

이번 사용자 가이드는 두 부분으로 나뉜다. 첫 번째는 OAuth 2.0 프로바이더(Provider)를 다루며, 두 번째는 OAuth 2.0 클라이언트(Client)를 다룬다. 프로바이더와 클라이언트를 둘 다 포함하는 최고의 샘플 코드 소스는 [통합 테스트](https://github.com/spring-projects/spring-security-oauth/tree/master/tests)와 [샘플 애플리케이션](https://github.com/spring-projects/spring-security-oauth/tree/master/samples/oauth2)를 참고하자.

# OAuth 2.0 프로바이더

OAuth 2.0 프로바이더 메커니즘은 OAuth 2.0의 보호 리소스(protected resources)를 노출하는 책임을 진다. 프로바이더의 구성은 보호 리소스에 독립적이거나 사용자를 대신해 보호 리소스에 접근할 수 있는 OAuth 2.0 클라이언트를 설정하는 것을 포함한다. 프로바이더는 보호 리소스에 접근할 때 사용하는 OAuth 2.0 토근을 관리하고 증명하는 일을 한다. 해당하는 경우 프로바이더는 클라이언트가 보호 리소스의 접근의 허가를 받을 수 있는지 확인하는 인터페이스를 사용자에게 반드시 제공해야 한다 (예를 들면, 승인 페이지).

# OAuth 2.0 프로바이더 구현

OAuth 2.0에서 프로바이더의 역할은 인가 서비스(Authorization Service)와 리소스 서비스(Resource Service)를 실질적으로 분리하는 것이다. 그리고 때로는 같은 애플리케이션에 이 두 서비스가 있더라도, Spring Security OAuth를 사용해 이들을 두 애플리케이션으로 분리하는 방법도 있고, 또한 인가 서비스를 공유해 여러 리소스 서비스에서 사용할 수도 있다. 토큰에 대한 요청은 Spring MVC 컨트롤러 엔드포인트로 처리하며 보호 리소스에 대한 접근은 표준 Spring Security 요청 필터로 처리한다. 다음 엔드포인트는 OAuth 2.0 인가 서버를 구현하기 위해 Spring Security 필터 체인이 필수로 요구하는 것이다.

- AuthorizationEndpoint는 인가에 대한 요청을 서비스할 때 사용한다. 기본 URL은 /oauth/authorize다.
- TokenEndpoint는 액세스 토큰(Access Token)을 받기 위한 요청을 서비스할 때 사용한다. 기본 URL은 /oauth/token이다.

다음 필터는 OAuth 2.0 리소스 서버 구현에서 필수로 요구받는 필터다.

- OAuth2AuthenticationProcessingFilter는 인증된 액세스 토큰을 받는 요청에서 인증을 불러올 때 사용한다.

모든 OAuth 2.0 프로바이더 기능에 대한 구성은 특별한 Spring OAuth @Configuration 어뎁터를 사용해 간소화했다. OAuth 구성을 위한 XML 네임스페이스 또한 제공하며, 스키마는 [http://www.springframework.org/schema/security/spring-security-oauth2.xsd](http://www.springframework.org/schema/security/spring-security-oauth2.xsd)이다. 네임스페이스는 [http://www.springframework.org/schema/security/oauth2](http://www.springframework.org/schema/security/oauth2)이다.

# 인가 서버 구성

인가 서버를 구성할 때는 클라이언트가 최종 사용자에게 액세스 토큰을 입수하기 위해 사용하는 허가 유형(grant type)을 고려해야 한다 (예를 들면, authorization code, user credentials, refresh token). 서버 구성은 client details service과 token service 구현체를 제공하고, 전체 메커니즘의 일부를 활성화하거나 비활성하는데 사용한다. 그렇지만 각 클라이언트는 특정한 인가 메커니즘과 접근 허가를 이용할 수 있는 승인(permission)을 받아야만 정확하게 구성할 수가 있음을 기억하자. 즉, 프로바이더가 "client credentials" 허가 유형을 지원하기로 구성되어 있다고 해서 특정 클라이언트가 이 허가 유형을 사용할 인가를 받았다는 의미는 아니다.

@EnableAuthorizationServer 애노테이션은 AuthorizationServerConfigurer(비어 있는 메서드가 있는 편리한 어뎁터 구현체)를 구현하는 모든 @Bean을 포함하는 OAuth 2.0 인가 서버 메커니즘을 구성하는데 사용한다. 다음 기능은 스프링에서 생성하는 각각의 구성 클래스로 위임하며 AuthorizationServerConfigurer를 구성하는 일부가 된다.

- ClientDetailsServiceConfigurer: client detail service를 정의하는 구성 클래스. Client detail을 초기화하거나 기존 저장소를 참조하게 할 수도 있다.
- AuthorizationServerSecurityConfigurer: 토큰 엔드포인트에 대한 보안 제약을 정의
- AuthorizationServerEndpointsConfigurer: 인가와 토큰 엔드포인트, 토큰 서비스를 정의

프로바이더 설정에서 중요한 건 인가 코드를 OAuth 클라이언트(authorization code에서)로 제공하는 방법이다. 최종 사용자가 직접 인가 페이지에서 증명서(credentials)를 입력하면 그 값을 프로바이더의 인가 서버에서 증명서와 함께 OAuth 클라이언트로 리다이렉션(redirection)해 돌아가게 된다. 이런 과정을 통해 OAuth 클라이언트가 인가 코드를 받게 된다. 이러한 예는 OAuth 2 명세에 잘 정리되어있다.

XML에서는 OAuth 2.0 인가 서버를 구성하는 비슷한 방법으로 <authorization-server/> 요소를 사용한다.

## Client Details 구성하기

ClientDetailsServiceConfigurer(AuthorizationServerConfigurer의 콜백으로 제공)(역주: ClientDetailsServiceConfigurer는 AuthorizationServerConfigurer의 configure(..) 함수의 인자로 제공)는 Client Details 서비스의 인-메모리, 또는 JDBC 구현체를 정의하는데 사용할 수 있다. 클라이언트의 중요한 속성은 다음과 같다.

- clientId: (필수) 클라이언트 id.
- secret: (신뢰하는 클라이언트(trusted clients)일 때는 필수) 클라이언트 시크릿, 만약 있다면.
- scope: 클라이언트를 제한하는 범위. 범위를 지정하지 않거나 빈 값이라면 (기본으로) 이 클라이언트는 범위를 제한받지 않음.
- authorizedGrantTypes: 사용하고자 하는 클라이언트가 인가받은 허가 유형. 기본값은 빈값이다.
- authorities: 클라이언트가 허가 받은 인가 (보통 Spring Security 인가).

Client details은 원천 저장소에 직접 접근하거나 (예를 들어, JdbcClientDetailsService의 경우에 데이터베이스 테이블) ClientDetailsManager 인터페이스를 통해서(ClientDetailsService의 구현체를 모두 구현하거나) 실행중인 애플리케이션에서 갱신될 수 있다.

NOTE: JDBC 서비스를 위한 스키마는 라이브러리에 포함되어 있지 않지만 (실전에서 사용할 때는 수많은 변화가 있기 때문이다), 깃헙에 있는 테스트코드가 시작하기 위한 좋은 예제가 된다.

## 토큰 관리하기

AuthorizationServerTokenServices 인터페이스는 OAuth 2.0 토큰을 관리할 때 필요로한 동작을 정의한다. 다음을 기억하도록 하자.

- 액세스 토큰이 생성될 때 인증 정보를 반드시 저장해야 한다. 차후에 액세스 토큰을 받는 리소스 참조할 수 있어야 하기 때문이다.
- 액세스 토큰은 토큰 생성의 인가를 받을 때 사용했던 인증 정보를 불러오기 위해 사용된다.

AuthorizationServerTokenServices 구현체를 생성할 때 DefaultTokenServices 사용을 고려해보자. DefaultTokenServices에는 액세스 토큰의 형식과 저장소를 변경해 교체하면서 사용할 수 있는 많은 전략(strategies)이 있다. 기본적으로 DefaultTokenServices는 랜덤 값으로 토큰을 생성하며, 토큰의 영속화를 TokenStore에 위임하는 걸 제외하고는 모든 걸 제어한다. 기본 저장소는 [인-메모리 구현체](http://docs.spring.io/spring-security/oauth/apidocs/org/springframework/security/oauth2/provider/token/store/InMemoryTokenStore.html)지만 다른 구현체를 이용할 수 있다. 여기서는 구현체 각각에 대해 약간의 해석과 함께 설명하겠다.

- InMemoryTokenStore는 단일 서버에 최적화되어 있다 (예를 들어, 트래픽이 적고, 실패할 경우에 백업 서버로 핫스왑(hot swap)하지 않아도 되는 경우). 아무런 의존성 없이 서버를 쉽게 시작하도록 해주기 때문에 많은 프로젝트를 여기서 시작하면 좋기 때문에 아마도 개발 모드에서는 이 방법으로 운용할 것이다.

- JdbcTokenStore는 관계형 데이터베이스에 토큰 데이터를 저장하는 InMemoryTokenStore의 [JDBC 버전](http://projects.spring.io/spring-security-oauth/docs/JdbcTokenStore)(역주:링크가 404이다)이다. 서버 간에 데이터베이스를 공유할수 있다면 JDBC 버전을 사용하자. 아니면 서버는 하나지만 동일한 서버를 여러 개의 인스턴스로 스케일업(scaled up)하거나 인가 서버와 리소스 서버가 복수 컴포넌트인 경우일 때도 JDBC 버전을 사용하자. JdbcTokenStore를 사용하려면 클래스패스에 "spring-jdbc"가 필요하다.

- 저장소의 [JSON 웹 토큰(JSON Web Token, JWT) 버전](http://projects.spring.io/spring-security-oauth/docs/%60JwtTokenStore%60)은 토큰 자체에 허가 데이터 전부를 암호화한다 (그래서 토큰을 다시 돌려보내거나 저장하지 않아도 되는 점이 가장 큰 장점이다). 한 가지 단점은 액세스 토큰을 쉽게 파기할 수 없다는 점인데, 그래서 보통 짧은 만료기한으로 허가를 하며, 토큰을 갱신하면서 파기 해버린다. 또 다른 단점은 토큰에 사용자 자격증명 정보를 많이 저장하면 토큰이 상당히 커질 수 있다는 점이다. 실제로 JwtTokenStore는 말그대로의 "저장소"는 아니다. 데이터를 영속화 하지 않기 때문이다. 하지만 JwtTokenStore는 DefaultTokenServices에서 토큰 값과 인증 정보 사이의 변환을 하는 역할은 동일하게 수행한다.

NOTE: JDBC  서비스의 스키마는 라이브러리에 패키징되어 있지 않다 (실전에서 사용할 때는 수많은 변화가 있기 때문이다). 그렇지만 예제에 나오는 [깃헙의 테스트코드](https://github.com/spring-projects/spring-security-oauth/blob/master/spring-security-oauth2/src/test/resources/schema.sql)에서 시작할 수는 있다. 토큰을 생성할 때 클라이언트 앱이 동일한 행(row)을 완료하는 사이에 발생하는 충돌을 예방하기 위한 @EnableTransactionManagement을 선언했는지 확인하자. 또한 샘플 스키마는 명확하게 PRIMARY KEY 선언했음을 기억하자. 이 선언은 동시성 처리 환경에서 역시 필요하다.

## JWT 토큰

JWT 토큰을 사용하기 위해서는 인가 서버에서 JwtTokenStore이 필요하다. 토큰을 복호화 해야하고 리소스 서버 역시 JwtAccessTokenConverter에 대한 의존성이 필요하기 때문에 동일한 구현체가 인가 서버와 리소스 서버에서 모두 필요로 하다. 기본적으로 토큰이 서명되면, 리소스 서버 역시 이 서명을 검증할 수 있어야만 한다. 그렇기 때문에
인가 서버에서는 동일한 대칭 (서명하기 위한) 키(symmetric key)를 필요로 한다 (공유 시크릿이나 대칭키). 또는 인가 서버에서 개인키와 맞춰보기 위한 공개키(검증키)가 필요로하다 (공개-개인 또는 비대칭키). (가능하다면) 공개키는 /oauth/token_key 엔드포인트로 인가 서버에서 노출한다. 이 엔드포인트는 기본적으로 "denyAll()" 접근 규칙으로 보안처리를 한다. AuthorizationServerSecurityConfigurer에 표준 SpEL 표현식으로 주입을 통해서 이 엔드포인트를 열 수 있다 (예를 들면, 공개키이기 때문에 "permitAll()"로도 대게는 충분하다).

JwtTokenStore를 사용하려면 클래스패스에 "spring-security-jwt"가 필요로 하다 (Spring OAuth의 동일한 깃헙 리파지토리에서 찾을 수 있지만 릴리스 주기가 다르다).

## 허가 유형 (Grant Types)

AuthorizationEndpoint에서 제공하는 허가 유형은 AuthorizationServerEndpointsConfigurer을 통해서 구성할 수 있다. 기본적으로 password를 제외하고는 모든 허가 유형을 제공한다 (허가 유형을 전환하는 상세한 방법은 아래를 살펴보자). 다음 프로퍼티가 허가 유형에 영향을 준다.

- authenticationManager: password 허가로 전환하기 위해서는 AuthenticationManager를 주입해야 한다
- userDetailsService: UserDetailsService를 주입하거나 어떤 방법으로든 글로벌하게 구성할 수 있다면 (예를 들어,  GlobalAuthenticationManagerConfigurer), refresh token 허가는 계정이 여전히 활성화되어 있는지 보장하기 위해 user details에서 검증을 포함하게 된다.
- authorizationCodeServices: auth code 허가를 위해 인가 코드 서비스(AuthorizationCodeServices의 인스턴스)를 정의한다.
- implicitGrantService: implicit 허가 동안에 상태를 관리한다.
- tokenGranter: TokenGranter (허가 제어 전체를 포함하며 위의 다른 속성은 무시한다)

XML에서 허가 유형은 authorization-server의 하위 요소로 포함된다.

## 엔드포인트 URL 설정하기

AuthorizationServerEndpointsConfigurer에서는 pathMapping()를 제공한다. 이 메서드는 두 개의 인자를 받는다:

- 엔드포인트의 기본 URL 경로 (기본 구현체는 프레임워크 제공)
- 필수 커스텀 경로 ("/"로 시작)

프레임워크가 제공하는 URL 경로는 /oauth/authorize (인가 엔드포인트), /oauth/token (토큰 엔드포인트), /oauth/confirm_access (사용자가 허가의 승인을 확인하는 POST 요청), /oauth/error (인가 서버에서 에러를 보여줄 때 사용), /oauth/check_token (액세스 토큰을 복호화 하기 위해 리소스 서버에서 사용), /oauth/token_key (JWT 토큰을 사용하는 경우 토큰 검증을 위한 공개키를 노출)가 있다.

WARNING: 인가 엔드포인트 /oauth/authorize (또는 대채된 매핑 경로)는 인증된 사용자만 접근할 수 있도록 Spring Security를 사용해 보호해야 한다. 예를 들어, 표준 Spring Security의 WebSecurityConfigurer를 사용하면 다음과 같다.

```Java
@Override
protected void configure(HttpSecurity http) throws Exception {
  http
    .authorizeRequests().antMatchers("/login").permitAll().and()
      // default protection for all resources (including /oauth/authorize)
    .authorizeRequests().anyRequest().hasRole("USER")
      // ... more configuration, e.g. for form login
    }
```

NOTE: 인가 서버가 리소스 서버와 동일하다면 API 리소스를 더 낮은 우선순위로 제어하는 보안 필터 체인이 있어야 한다. 액세스 토큰으로 보호받는 요청은 메인이 되는 사용자-응대 필터 체인과 경로가 겹치지 않도록 해야 한다. 그러므로 위에 나오는 WebSecurityConfigurer에서 API 리소스가 아닌 경로만을 선택해 요청을 매핑하고 있는지를 확인 해야한다.

토큰 엔드포인트는 클라이언트 시크릿에 대한 HTTP Basic 인증을 사용해 지원하는 Spring OAuth의 @Configuration를 통해서 기본적으로 보호 받는다. XML에서는 지원하지 않는다 (그렇기 때문에 명시적으로 보호해야 한다).

XML에서는 <authorization-server/> 요소에 유사한 방법으로 기본 엔드포인트 URL을 변경할 때 사용할 수 있는 속성이 있다. /check_token 엔드포인트는 명시적으로 활성화 해야 한다 (check-token-enabled 속성을 사용).

# UI 커스터마이징하기

대다수의 인가 서버 엔드포인트는 주로 기계가 사용하지만 UI를 필요로 하는 리소스가 일부 있을 수 있다. 이러한 리소스로는 GET으로 받는 /oauth/confirm_access와 HTML 응답을 보내는 /oauth/error가 있다. 실제로 대부분의 인가 서버의 인스턴스에서는 스타일과 컨텐츠를 제어하고자 직접 구현하기를 원하기 때문에 프레임워크에서는 화이트레이블 구현체(white label, 역주: [위키피디아](https://en.wikipedia.org/wiki/White-label_product) 내용 참조)를 사용할 수 있게 제공한다.

이렇게 동작하게 하려면 해당 엔드포인트(역주:/oauth/confirm_access와 /oauth/error)로 @RequestMapping을 사용하는 Spring MVC 컨트롤러를 제공하고, 디스패처에서 프레임워크 기본 매핑이 더 낮은 우선 순위를 갖도록만 하면 된다. /oauth/confirm_access 엔드포인트에서는 사용자 승인을 구할 때 필요로 하는 데이터를 모두 가지고 다니는 세션에 묶여 있는 AuthorizationRequest를 받게 될 것이다 (기본 구현체는 WhitelabelApprovalEndpoint로 이 클래스를 복사 해서 시작 지점으로 삼을 수 있다). 요청에서 모든 데이터를 확보할 수 있지만, 그렇더라도 필요로한 데이터만 보여줄 수 있다. 그렇게 되면 사용자가 해야하는 일은 허가를 승인하거나 거부하는 정보와 함께 /oauth/authorize로 POST 요청을 돌려보내는 것으로 끝나게 된다.

요청 파라미터는 AuthorizationEndpoint에서 UserApprovalHandler로 직접 전달해서 원하는 대로 데이터를 더 많이, 또는 더 적게 해석할 수 있다. (역주: AuthorizationEndpoint의 멤버 변수로 UserApprovalHandler이 선언됨) 기본 UserApprovalHandler는 AuthorizationServerEndpointsConfigurer에 ApprovalStore를 제공하는지(제공하는 경우에는 ApprovalStoreUserApprovalHandler) 안하는지(안하는 경우에는 TokenStoreUserApprovalHandler)에 따라 달라진다. 표준 승인 핸들러는 다음을 받는다.

- TokenStoreUserApprovalHandler: user_oauth_approval이 "true"냐 "false"냐에 따라 간단히 예/아니오 결정을 한다.
- ApprovalStoreUserApprovalHandler: scope.* 파라미터 키의 집합으로 "\*"은 현재 요청 받은 범위와 동일한 값이다. 파라미터의 기본은 (허가가 승인된 경우) "true"나 "approved"가 될 수 있고 아니면 사용자는 범위가 거절 당했다고 생각할 수 있다. 적어도 하나의 범위가 승인되야만 허가가 성공했다고 볼 수 있다.

NOTE: 서버에서 렌더링할 때 폼(FORM)에 CSRF 보호값을 포함하는 것을 잊지말자. 기본적으로 Spring Security는 "\_csrf"란 이름으로 요청 파라미터를 받기로 되어 있다 (그리고 request attribute로 이 값을 제공한다). 더 자세한 정보는 Spring security 사용자 가이드를 보고, 가이드에 따라 화이트레벨 구현체를 살펴보자.

## SSL 강화하기

일반 HTTP는 테스트하기에는 충분하지만 운영에서는 인가 서버를 반드시 SSL 위에서 사용해야 한다. 보안 컨테이너 내에서나 프록시 뒤에서만 앱을 실행하고 정확하게 프록시와 컨테이너를 만들어 둔 경우에만 제대로 동작할 수 있다 (OAuth2를 위한 건 아니다). 또한 Spring Security의 requiresChannel() 제약을 사용해 엔드포인트를 보호할 수도 있다. /authorize 엔드포인트는 일반적인 애플리케이션 보안의 수준으로 동작하도록만 하면 된다. /token 엔드포인트는 AuthorizationServerEndpointsConfigurer에 sslOnly() 메서드를 사용해 설정할 수 있도록 구분자를 제공한다. 두 경우(역주: /authorize와 /token 엔드포인트를 말함) 모두 보안 채널 설정은 선택이지만 안전하지 않은 채널로 들어 온 요청을 발견했을 경우 안전한 채널이라 생각하는 쪽 리다레익트 하게 될 수도 있다.

# 에러 제어 커스터마이징

인가 서버에서 에러 제어는 표준 Spring MVC 기능인 @ExceptionHandler를 엔드포인트 메서드에서 직접 사용한다. 또한 렌더링하는 방법이 아니라 응답 컨텐츠를 변경하는 방법이 최선인 경우에는 사용자가 직접 WebResponseExceptionTranslator 엔드포인트를 제공하는 방법이 있다. 예외를 렌더링하는 역할은 토큰 엔드포인트의 경우에는 HttpMesssageConverters로, 인가 엔드포인트의 경우에는 OAuth 에러 뷰(/oauth/error)로 위임한다. 화이트 레벨 에러 엔드포인트는 HTML 응답을 제공하지만, 사용자가 커스텀 구현체를 제공해야 할 필요가 있을 수도 있다 (예를 들어, @RequestMapping("/oauth/error")와 함께 @Controller 추가만 해서).

# 사용자 역할과 범위 매핑

토큰의 범위를 제한하는 경우 클라이언트에 할당하는 범위를 제한하는 방법 뿐만 아니라 사용자 권한에 따라 제한하는 방법이 때로는 유용하다. AuthorizationEndpoint에서 DefaultOAuth2RequestFactory를 사용하면 사용자의 역할에 일치하는 범위만 허용하도록 제약하기 위해 checkUserScopes=true 구분자를 설정할 수 있다. 또한, OAuth2RequestFactory를 TokenEndpoint에 주입할 수 있지만 TokenEndpointAuthenticationFilter가 있을 때만 동작한다 (예를 들어, password 허가와 함께). 이 필터는 HTTP BasicAuthenticationFilter 바로 뒤에 추가하면 된다. 물론, 범위와 역할을 매핑하는 규칙을 구현하고 OAuth2RequestFactory에 직접 설정할 수도 있다. AuthorizationServerEndpointsConfigurer는 커스텀 OAuth2RequestFactory를 주입할 수 있게 해주므로 @EnableAuthorizationServer를 사용하면 팩토리를 설정하는 기능을 사용할 수 있다.

# 리소스 서버 구성

리소스 서버는 OAuth2 토큰을 통해서 보호받는 리소스를 제공한다 (리소스 서버는 인가 서버와 동일할 수도 있고 분리된 애플리케이션일 수도 있다). Spring OAuth는 보호 기능을 구현한 Spring Security 인증 필터를 제공한다. 클래스의 @Configuration를 @EnableResourceServer로 교체해도 되고, (필요하다면) ResourceServerConfigurer를 사용해 구성할 수 있다. 다음 기능을 구성할 수 있다.

- tokenServices: 토큰 서비스를 정의한 빈 (ResourceServerTokenServices의 인스턴스)
- resourceId: 리소스 id (선택이지만 존재한다면 인증서버에 의해서 검증받게 되니 추천)
- 리소스 서버의 다른 확장 지점 (예를 들자면, 들어온 요청에서 토큰을 추출하는 tokenExtractor)
- 보호 받는 리소스의 요청 매처 (기본은 all)
- 보호 받는 리소스의 접근 규칙 (일반 "authenticated"가 기본)
- Spring Security에서 HttpSecurity 구성 클래스로 부터 허용되는 보호 리소스의 다른 커스터마이징

@EnableResourceServer 애노테이션은 자동으로 Spring Security 필터 체인에 OAuth2AuthenticationProcessingFilter 타입의 필터를 추가한다.

XML에서는 <resource-server/> 요소를 사용하며, id 속성을 지정한다. 여기에는 서블릿 필터의 빈 id를 적어주면 되는데, 이는 표준 Spring Security 체인에 수동으로 추가해야 하기 때문이다.

ResourceServerTokenServices는 인가 서버와의 계약(contract)에 따라 움직인다. 리소스 서버와 인가 서버가 같은 애플리케이션이고 DefaultTokenServices를 사용한다면 여기에 대해서 너무 어렵게 생각하지 않아도 된다. 자동으로 일관성을 유지해주도록 필요한 모든 인터페이스가 구현되어있기 때문이다. 만약 리소스 서버가 독립된 애플리케이션이라면 인가 서버의 능력과 토큰을 정확하게 복호화 하는 방법을 알고 있는 ResourceServerTokenServices을 제공해야 한다.

인가 서버와 마찬가지로 대부분 DefaultTokenServices를 사용하며, 주로 직접 결정하는 건  TokenStore(백엔드 스토리지나 로컬 암호화)이다. 대안으로는 RemoteTokenServices가 있다. RemoteTokenServices는 Spring OAuth 기능(OAuth 명세에는 없다)으로 리소스 서버가 인증 서버에서 제공하는 HTTP 리소스를 통해서 토큰을 복화하해 해준다 (/oauth/check_token). RemoteTokenServices는 리소스 서버의 트래픽이 크지 않거나 (모든 요청은 인가 서버에서 검증해야 하므로) 결과를 캐시할 여유가 있는 경우에 편리하다. /oauth/check_token 엔드포인트를 사용하려면 AuthorizationServerSecurityConfigurer에서 접근 규칙을 변경해서 노출해야 한다 (기본은 "denyAll()"). 예를 들면,

```Java
@Override
public void configure(AuthorizationServerSecurityConfigurer oauthServer) throws Exception {
  oauthServer.tokenKeyAccess("isAnonymous() || hasAuthority('ROLE_TRUSTED_CLIENT')")
    .checkTokenAccess("hasAuthority('ROLE_TRUSTED_CLIENT')");
}
```

이 예에서는 /oauth/check_token 엔드포인트와 /oauth/token_key 엔드포인트를 둘 다 설정했다 (이렇게 해야 신뢰하는 리소스가 JWT 검증을 거친 공개키를 얻을 수 있다). 이 두 엔드포인트는 클라이언트 증명서를 사용하는 HTTP Basic 인증을 통해 보호를 받는다.

## OAuth-Aware 표현식 핸들러 설정하기

Spring Security의 [표현식 기반 접근 제어](http://docs.spring.io/spring-security/site/docs/3.2.5.RELEASE/reference/htmlsingle/#el-access)를 사용하고 싶을 수도 있다. 표현식 핸들러는 기본적으로 @EnableResourceServer에 설정한다. 표현식은 #oauth2.clientHasRole, #oauth2.clientHasAnyRole, 그리고 #oauth2.denyClient를 포함한다. 이들은 OAuth 클라이언트의 역할에 따른 접근을 제공할 때 사용한다 (더 종합적인 목록은 OAuth2SecurityExpressionMethods를 보자). XML에서는 일반적인 Security(역주: Spring Security를 말해요..)의 <http/>를 구성하면서 표현식-핸들러 요소를 사용하는 OAuth를 지원하는 표현식 핸들러를 등록할 수 있다.

# OAuth 2.0 클라이언트

OAuth 2.0 클라이언트 메커니즘은 다른 서버에 있는 OAuth 2.0 보호 리소스에 대한 접근을 책임진다. 구성은 사용자가 접근할 가능성이 있는 보호 리소스를 정하는 것을 포함한다. 또한 클라이언트는 인증 코드와 사용자의 액세스 토큰을 저장하는 메커니즘을 제공해야 할 수도 있다.

## 보호 리소스 구성

보호 리소스(또는 "원격 리소스")는 OAuth2ProtectedResourceDetails 타입의 빈 정의(역주: Spring의 BeanDefinition을 의미하는 건가 싶지만 쉽게 풀어서 적음)를 사용해 정의한다. 보호 리소스는 다음 속성을 갖는다.

- id: 리소스의 id. id는 리소스 검색 시 클라이언트에서만 사용한다. OAuth 프로토콜에서는 절대로 사용하지 않는다. 또한 빈의 id로서 사용한다.
- clientId: OAuth 클라이언트 id. 이 id는 OAuth 프로바이더가 클라이언트를 확인할 때 사용한다.
- clientSecret: 리소스와 연계된 시크릿. 기본은 시크릿이 없고 비어있다.
- accessTokenUri: 액세스 토큰을 제공하는 OAuth 엔드포인트 프로바이더의 URI
- scope: 리소스에 접근하는 범위를 지정한 문자열을 콤마로 구분하는 목록. 기본은 아무런 범위도 지정하지 않는다.
- clientAuthenticationScheme: 액세스 토큰 엔드포인트를 인증하기 위해 클라이언트에서 사용하는 스키마. 제안하는 값은 "http_basic"과 "form"이다. 기본은 "http_basic"이다. OAuth 2 명세의 2.1 절을 살펴보자.

허가 유형 마다 OAuth2ProtectedResourceDetails의 다른 상세(concrete) 구현체를 갖는다 (예를 들어, "cient_credentials" 허가 유형은 ClientCredentialsResource). 사용자의 인가를 필요로 하는 허가 타입은 다음 속성을 갖는다:

- userAuthorizationUri: 사용자가 리소스에 접근하는 걸 인가해야 할 필요가 있는 모든 경우에 사용자를 리다이렉트 하는 URI다. 이 URI는 항상 필수는 아니며 OAuth 2 프로파일을 지원하는지 여부에 따라 다르다는 걸 기억하자. XML에서는 <resource/> 요소이며, OAuth2ProtectedResourceDetails 타입의 빈을 생성하는데 사용한다. 이 빈에는 위에 나온 프로퍼티와 모두 매칭하는 속성이 있다.

## 클라이언트 구성

OAuth 2.0 클라이언트의 구성은 @EnableOAuth2Client를 사용해 단순화했다. 단 두 가지만 있다.

- 현재 요청과 컨텍스트를 저장하는 필터 빈(ID는 oauth2ClientContextFilter)을 생성한다. 요청 처리 동안에 인증을 필요로 하는 경우 OAuth 인증 URI로 오고 가는 리다이렉트를 관리한다.
- request 범위로 AccessTokenRequest 타입 빈을 생성한다. 이 빈은 개별 사용자와 관련된 상태를 유지해주기 위해 authorization code(또는 implicit) 허가 클라이언트에서 사용할 수 있다. (역주: 원문에는 문장 마지막에 '..from colliding'이라는 표현이 나온다. 의미상으로는 사용자간의 상태 충돌을 막고자 request 범위로 AccessTokenRequest 빈을 생성한다는 뜻이다 (뒤에도 비슷한 표현이 나옴). 하지만 원문 두 단어를 이렇게 풀어 쓰자니 맞지 않아 보여 번역 문장에서는 제외했다.)

필터는 애플리케이션을 통해 와이어링 해야 한다 (예를 들어, 서블릿 initalizer나 같은 이름을 사용하는 DelegatingFilterProxy에서 web.xml 설정을 사용할 수 있다). (역주: 직접 서블릿 initializer나 web.xml에 등록하라는 설명..)

AccessTokenRequest는 아래처럼 OAuth2RestTemplate에서 사용할 수 있다. (역주: 그런데 아래 코드에는 AccessTokenRequest가 직접 나오지 않는다는 반전이다. 실제로는 아래 코드에 나오는 OAuth2ClientContext가 생성자로 AccessTokenRequest을 받게 되니 참고바란다.)

```Java
@Autowired
private OAuth2ClientContext oauth2Context;

@Bean
public OAuth2RestTemplate sparklrRestTemplate() {
    return new OAuth2RestTemplate(sparklr(), oauth2Context);
}
```

OAuth2ClientContext는 각 사용자 별로 개별적인 상태를 유지하기 위해 세션 범위(역주: 여기서 범위 scope은 위에서 설명한 OAuth의 범위가 아니라 우리가 일반적으로 말하는 변수(데이터)의 범위를 말한다)에 둔다. 서버에서 동일한 데이터 구조를 직접 관리할 필요가 없이 들어온 요청과 사용자를 매핑하고, 각 사용자 별로 분리된 OAuth2ClientContext 인스턴스를 연결지으면 된다.

XML에서는 id 속성이 달린 <client/> 요소를 쓴다. 여기서 id는 @Configuration 경우와 마찬가지로 매핑해야 하는 DelegatingFilterProxy 서블릿 필터와 맞춘 빈 id다.

## 보호 리소스 접근하기

일단 리소스에 대한 구성을 모두 제공했다면, 이제 리소스에 접근할 수 있다. 리소스에 접근할 때 추천 방법은 [Spring 3에서 소개된 RestTemplate](http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html)을 사용하는 것이다. Spring Security에서 OAuth는 [RestTemplate을 확장](http://projects.spring.io/spring-security-oauth2/src/main/java/org/springframework/security/oauth2/client/OAuth2RestTemplate.java)해 제공한다. OAuth2ProtectedResourceDetails의 인스턴스를 제공하기만 하면 된다. 사용자-토큰(authorization code 허가)과 함께 사용하려면 @EnableOAuth2Client 설정 사용을 고려해야 한다 (또는 동일하게 XML에서는 <oauth:rest-template/>). 이 설정은 다른 사용자 간의 요청이 런타임에 충돌하지 않도록 request와 session 범위의 컨텍스트 객체를 만들어준다.

일반적인 규칙에 따르자면 웹 애플리케이션은 password 허가를 사용하지 않아야 한다. 그렇기 때문에 AuthorizationCodeResourceDetails를 지원할 수 있다면 ResourceOwnerPasswordResourceDetails 사용을 피하도록 하자. 어쩔수 없이 자바 클라이언트에서 동작하는 password 허가가 필요한 경우에는 OAuth2RestTemplate 구성은 동일한 방식으로 사용하고 ResourceOwnerPasswordResourceDetails(모든 액세스 토큰 사이에 공유하는 방식)이 아니라 AccessTokenRequest(Map을 상속하고 주기가 짧음)을 증명서로 추가하면 된다.

## 클라이언트에서 토큰 영속화 하기

클라이언트는 토큰 영속화를 필요로 하지 않지만 클라이언트 앱을 재시작할때마다 매번 새로운 토큰 허가를 승인받지 않도록 만들어 사용자를 편하게 해줄 수도 있다. ClientTokenServices 인터페이스는 특정 사용자의 OAuth 2.0 토큰을 영속화할 때 필요한 동작을 정의한다. JDBC 구현체를 제공하지만 영속화 데이터베이스에 액세스 토큰과 연관된 인증 인스턴스를 저장하는 서비스를 직접 구현하는 걸 선호한다면 그렇게 할 수도 있다. 이 기능을 사용하려면 OAuth2RestTemplate에 특별히 TokenProvider를 설정해줘야 한다. 예를 들면 아래와 같다.

```Java
@Bean
@Scope(value = "session", proxyMode = ScopedProxyMode.INTERFACES)
public OAuth2RestOperations restTemplate() {
    OAuth2RestTemplate template = new OAuth2RestTemplate(resource(), new DefaultOAuth2ClientContext(accessTokenRequest));
    AccessTokenProviderChain provider = new AccessTokenProviderChain(Arrays.asList(new AuthorizationCodeAccessTokenProvider()));
    provider.setClientTokenServices(clientTokenServices());
    return template;
}
```

# 외부 OAuth2 프로바이더의 클라이언트 커스터마이징

외부 OAuth2 프로바이더 (예를 들면, [페이스북](https://developers.facebook.com/docs/facebook-login)) 중 일부는 명세를 정확하게 구현하지를 않았거나 Spring Security OAuth 명세의 옛날 버전에만 붙일 수가 있다. 클라이언트 애플리케이션에서 이러한 프로바이더를 사용하려면 클라이언트 측 기반기능의 다양한 부분을 조정해야할지도 모른다.

페이스북을 사용하는 예제로 tonr2 애플리케이션에 페이스북 기능을 연결해놨다 (테스트를 하려면 유효한 클라이언트 id와 시크릿을 추가해 구성을 변경해야한다. 페이스북 웹 사이트에서 쉽게 생성할 수 있다).

또한 페이스북 토큰 응답은 토큰의 만료 시간에서 JSON 엔트리를 준수하지 않고 있다 (expires_in 대신에 expires를 사용). 그렇기 때문에 애플리케이션에서 만료 시간을 사용하고 싶을 경우에는 커스터마이징한 OAuth2SerializationService를 사용해서 직접 복호화해야 한다.

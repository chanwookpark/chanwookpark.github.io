---
layout: post
title:  "HTTP 쿠키 (Wikipedia 번역)"
date:   2016-02-17 13:00:00 +0000
categories: cookie web 번역
---

* TOC
{:toc}

> 이 글은 [영문 위키피디아의 HTTP 쿠키](http://en.wikipedia.org/wiki/HTTP_cookie) 페이지 중 일부를 발췌해 번역한 페이지입니다.        
공유 및 전파는 얼마든지 환영하며 그 외 내용은 [위키피디아 저작권](http://ko.wikipedia.org/wiki/위키백과:저작권)을 참고해주세요^^.
오역 및 조언은 얼마든지 환영합니다~

# 용어

## 세션 쿠키 (Session cookie)

세션 쿠키, 또는 인-메모리 쿠키나 Transient 쿠키(역주:적당한 이름이 생각나지 않아서 원어를 그대로 사용함)로 알려진 이 쿠키는 사용자가 웹 사이트를 이동하는 동안에만 임시로 메모리에 존재한다. [14](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-mscookie-14) 보통 웹 브라우저는 사용자가 브라우저를 닫으면 세션 쿠키를 삭제한다. [15](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-15) [16](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-16) 브라우저가 세션 쿠키를 처리하는 방법을 알고 있기 때문에 다른 쿠키와 다르게 세션 쿠키는 유효 기간을 할당하지 않는다.

## 영속성 쿠키 (Persistent Cookie)

영속성 쿠키는 세션 쿠키처럼 웹 브라우저를 닫을 때 만료시키지 않고 지정된 날짜나 지정된 시간이 지난 후에 만료시킨다. 이는 쿠키의 전체 수명(만드는 사람이 원하는 만큼 길게하거나 짧게할 수 있음) 동안에 사용자가 해당 쿠키를 소유하는 웹 사이트를 방문하든 사용자가 웹 사이트에서 다른 웹사이트가 소유하는 자원(광고처럼)을 보던 관계 없이 매번 서버로 쿠키 정보를 전송한다는 걸 의미한다.

이러한 이유로 영속성 쿠키는 때로는 **트래킹 쿠키** 와 관련이 있다. 오랜 기간 동안의 사용자의 웹 브라우저 사용 습관에 대한 정보를 기록해 광고회사에서 사용할 수 있기 때문이다. 그렇지만  사용자가 브라우저를 열 때마다  로그인 인증정보를 입력하지 않기 위해 사용자의 이메일 계정을 기록해 관리하는 "정당한" 방법으로도 사용할 수 있다.

## 보안 쿠키 (Secure cookie)

보안 쿠키는 암호화된 연결(즉, HTTPS)을 통해서만 전송할 수 있다. 이는 도청을 통한 쿠키 절도에 덜 노출하게 해준다.

## HttpOnly 쿠키

HttpOnly 쿠키는 [HTTP](http://en.wikipedia.org/wiki/HTTP)(또는 [HTTPS](http://en.wikipedia.org/wiki/HTTP_Secure))를 통해 전송할 때만 사용할 수 있다. [자바스크립트](http://en.wikipedia.org/wiki/JavaScript)와 같은 HTTP가 아닌 API를통해서는 접근이 불가능하다. 이 제약은 크로스 사이트 스크립트(XSS, cross-site scripting)를 통한 세션 쿠키 절도의 위협을 완전히 제거하지는 못하지만 줄여준다. [17](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-httponlyprotection-17) HttpOnly 쿠키는 대부분의 현대 브라우저에서 제공한다. [18](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-httponlybrowsers-18) [19](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-httponlyrfc-19)

## 제3자 쿠키 (Third-party cookie)

일반적으로 쿠키의 도메인 이름은 웹 브라우저의 주소창에 나오는 도메인 이름과 일치한다. 이런 쿠키를 **1차 쿠키(first-party cookie)** (역주:제3자 쿠키와 어휘를 맞추려 했는데 마땅한 말이 생각나지 않아서 1차로 번역)라 부른다. 그렇지만 **제3자 쿠키** 는 주소창에 나오는 도메인 이름과는 다른 도메인에 속한다. 보통 이러한 종류의 쿠키는 배너 광고처럼 웹 페이지가 외부 웹 사이트에서 컨텐츠를 포함할 때 발생한다. 이 쿠키는 사용자의 브라우저 사용 이력을 추적할 수 있는 가능성을 주고, 각 사용자와 관련된 광고를 제공하는 노력의 일환으로 광고주가 자주 사용하기도 한다.

예를 들어, 사용자가 www.example.org를 방문했다고 가정해보자. 이 웹 사이트에는 ad.foxytracking.com의 광고가 들어가 있으며, 다운로드 시에 광고 도메인(ad.foxytracking.com)이 소유하는 쿠키가 설정된다. 이렇게 되면 사용자는 또 다른 웹 사이트인 www.foo.com을 방문 할 때도 ad.foxytracking.com/의 광고가 들어가 있고, 이 도메인(ad.foxytracking.com)이 소유한 쿠키 역시 여전히 설정 되어 있다. 결국 광고를 불러 올때나 웹 사이트를 방문할 때 양쪽 모두 쿠키를 광고주에게 전달하며, 광고주가 이 광고주에서 나온 광고가 걸린 모든 웹 사이트를 통해서 사용자의 브라우저 사용 이력을 개발하는 데 이 쿠키를 사용할 수 있다.

2014년부터 일부 웹 사이트는 100개의 제 3자 도메인을 읽기 가능한 쿠키로 설정해주고 있다. [20](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-20) 평균적으로 하나의 웹 사이트는 10개의 쿠키를 설정하며 (1차와 3자) 쿠키의 최대 숫자는 800개에 다다른다. [21](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-21)

대부분 현대 웹 브라우저는 제 3자 쿠키를 막을 수 있는 개인정보 설정을 제공한다.

## 슈퍼쿠키

"슈퍼쿠키"는 [최상위 도메인](http://en.wikipedia.org/wiki/Top-level_domain)(.com과 같은)이나 [Public Suffix]((http://en.wikipedia.org/wiki/Public_Suffix_List) co.uk와 같은)을 기원으로 하는 쿠키다. 이에 비해서 보통 쿠키는 example.com과 같은 특정 도메인 이름을 기원으로 한다.

슈퍼쿠키는 잠재적인 보안 문제가 있기 때문에 대부분 웹 브라우저에서 슈퍼쿠키를 막는다. 클라이언트 컴퓨터가 막지 않았다면 공격자는 슈퍼쿠키를 설정할 수 있고, 악의적인 웹 사이트를 관리하는 공격자가 슈퍼쿠키를 설정해 악의적인 웹 사이트로 동일한 최상위 도메인이나 Public Suffix를 공유해  다른 사이트로의 정상적인 사용자 요청을 방해하거나 가장할 가능성이 있다. 예를 들어, example.com에서 만들어진 쿠키가 아니더라도 .com를 기원으로 하는 슈퍼쿠키는 example.com으로 보내는 요청을 만들어 악의적인 영향을 줄 수 있다.

[Public Suffix List](https://publicsuffix.org/learn/)는 슈퍼쿠키 노출 위험을 완화시키는 도움을 준다. Public Suffix List는 도메인 이름 접미사의 정확한 최신 목록을 제공하는 것을 목표로 벤더에 종속되지 않게 제공할 계획이다. 오래된 버전의 브라우저는 최신 목록을 알지 못하기에 특정 도메인의 슈퍼쿠키에 취약할 수 있다.

### 슈퍼쿠키 (다른 쓰임새)

"슈퍼쿠키" 용어는 HTTP 쿠키에 의존하지 않는 트래킹 기술로 사용되기도 한다. 이러한 두 번째 "슈퍼쿠키" 동작 원리는 2011년 8월 마이크로소프트 웹 사이트에서 발견됐으며, MUID(Machine Unique IDentifier) 쿠키와 [ETag](http://en.wikipedia.org/wiki/HTTP_ETag) 쿠키를 재생산해 쿠키를 동기화했다. [22](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-22) 언론에서 이를 조명하자 마이크로소프트가 이 코드를 비활성화 했다. [23](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-23) (역주: 이건 아직 정확히 어떤 뜻인지 모르겠다. 관련 글을 보고 좀더 공부가 필요하다.)

## 좀비 쿠키

> 주요 글타레: [좀비 쿠키](http://en.wikipedia.org/wiki/Zombie_cookie)와 [에버쿠키](http://en.wikipedia.org/wiki/Evercookie)

좀비 쿠키는 삭제 후에도 자동으로 재생성되는 쿠키다. 이런 일은 클라이언트 측 스크립트의 도움이 있기에 가능하다.  이 스크립트는 [플래시 로컬 저장소](http://en.wikipedia.org/wiki/Adobe_Flash_Player#Privacy), HTML5 저장소, 그리고 다른 클라이언트 측 저장소 위치와 같은 여러 곳에 쿠키의 내용을 저장함으로써 시작한다. 스크립트가 쿠키가 없음을 알아차리면 각 위치에 저장되어 있는 데이터를 사용해 쿠키를 재생성한다.

# 구조 (Structure)

쿠키는 다음 컴포넌트로 구성된다. [24](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-Peng.2C_Weihong_2000-24) [25](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-Stenberg.2C_Daniel_2009-25)

1. 이름
1. 값
1. 0 또는 그 이상의 속성

# 구현

쿠키는 대게 웹서버에서 선택해 브라우저를 통해 클라이언트 컴퓨터에 저장되는 데이터의 임의의 조각(arbitrary piece, 역주: 역시 적절한 해석이 아닌 것 같아 마음에 들지 않음..)이다. 브라우저는 모든 요청마다 쿠키를 서버로 보내 [HTTP](http://en.wikipedia.org/wiki/HTTP) 트랜잭션이 무상태인 것과는 달리 [상태](http://en.wikipedia.org/wiki/State_)(computer_science)를 지원한다. 쿠키 없다면 [웹 페이지](http://en.wikipedia.org/wiki/Web_page)나 웹 페이지의 컴포넌트를 각각 받아오는 건 독립된 이벤트가 되버려셔 웹 사이트에서 사용자가 만들어 내는 모든 페이지 뷰가 서로 아무런 관계가 없어질 것이다. 비록 쿠키가 대부분 웹 서버에서 설정하지만 [자바스크립트](http://en.wikipedia.org/wiki/JavaScript)와 같은 스크립트 언어를 사용해서 클라이언트에서도 설정할 수 있다. (쿠키의 HttpOnly 구분값(flag)을 제공해 설정하지 못하게 제공할 수 있음)

쿠키 명세 [19](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-httponlyrfc-19) [26](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-26) [27](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-27)는 브라우저가 쿠키를 지원하기 위해 다음 요건을 지킬 것을 요구한다.

 - 적어도 4,096 [바이트](http://en.wikipedia.org/wiki/Byte) 크기의 쿠키를 지원 해야함
 - [도메인](http://en.wikipedia.org/wiki/Internet_domain) 당(다른 말로 하면 웹 사이트 당) 적어도 50개 쿠키를 저장할 수 있어야 함
 - 적어도 총합 3,000개 쿠키를 저장할 수 있어야 함

## 쿠키 설정하기

쿠키는 HTTP 응답으로 보내지는 [HTTP](http://en.wikipedia.org/wiki/HTTP) Set-Cookie [헤더](http://en.wikipedia.org/wiki/HTTP_header)를 사용해 설정한다. 이 헤더는 브라우저가 쿠키를 저장하고 차후 서버로 요청을 보낼 때 쿠키를 다시 보내줄 것을 지시한다. (물론, 브라우저가 쿠키를 지원하지 않거나 쿠키를 비활성화하면 이 헤더를 무시할 수 있다.)

예를 들어, 브라우저가 www.example.org 웹사이트의 홈페이지에 다음과 같은 첫 번째 요청을 보냈다고 해보자.

```
GET /index.html HTTP/1.1
Host: www.example.org
...
```

서버는 다음 두 개의 Set-Cookie 헤더를 응답으로 보낸다.

```
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: theme=light
Set-Cookie: sessionToken=abc123; Expires=Wed, 09 Jun 2021 10:18:14 GMT
...
```

서버의 HTTP 응답은 웹 사이트의 홈페이지 컨텐츠를 포함하며, 또한 브라우저에게 두 개의 쿠키를 설정해 알려준다. 첫 번째 "theme" 쿠키는 Expires나 Max-Age 속성을 가지고 있지 않기 때문에 "세션" 쿠키로 취급된다. 세션 쿠키는 일반적으로 브라우저를 닫을 때 브라우저가 삭제한다. 두 번째 "sessionToken"은 "Expires" 속성을 포함하며 브라우저에게 지정된 날짜와 시간에 쿠키를 지워야 한다고 알려준다.

이어서 브라우저가 웹 사이트에 spec.html을 방문하는 요청을 보낸다. 이 요청은 서버가 브라우저에게 설정하라고 알려준 두 개의 쿠키를 포함하는 Cookie 헤더를 포함한다.

```
GET /spec.html HTTP/1.1
Host: www.example.org
Cookie: theme=light; sessionToken=abc123
...
```

이렇게 해서 서버는 이번 요청이 이전 요청과 관련이 있다는 것을 알게 된다. 서버는 요청받은 페이지를 보내 답을 주면서 Set-Cookie 헤더를 사용해 다른 쿠키를 추가할 수 있다.

서버가 페이지 요청의 응답으로 Set-Cookie 헤더를 포함해 쿠키 값을 수정할 수 있다. 이렇게 되면 브라우저는 이전 값을 새로운 값으로 교체한다.

쿠키의 값은 ,와 ; 그리고 [공백](http://en.wikipedia.org/wiki/Whitespace_character)을 제외한 출력 가능한 모든 ASCII 문자(!에서 ~까지, 유니코드 \u0021에서 \u007E까지)로 구성할 수 있다. 쿠키의 이름은 앞선 문자를 역시 제외하는 것에 더해서 =까지 제외한다. 이름과 값 사이의 구분자로 사용하기 때문이다. 쿠키 표준인 [RFC 2965](http://tools.ietf.org/html/rfc2965)는 좀더 많은 제약이 있지만 브라우저가 구현하지는 않는다.

"쿠키 부스러기(cookie crumb)"라는 용어는 때로는 쿠키의 이름-값 쌍을 가리키 데 사용한다. [28](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-CrumbExample-28)

쿠키는 브라우저 상에서 실행되는 [자바스크립트](http://en.wikipedia.org/wiki/JavaScript)와 같은 스크립트 언어로 설정할 수 있다. 자바스크립트에서 document.cookie 객체는 이러한 목적으로 사용한다. 예를 들어, document.cookie = "temperature=20"은 "temperature" 이름과 "20" 값으로 쿠키를 만들 어야 한다는 걸 알려준다.

## 쿠키 속성

이름과 값에 더해서 쿠키는 여러 개의 속성이 있다. 브라우저는 쿠키 속성을 다시 서버로 보내지 않는다. 오로지 쿠키의 이름과 값만을 보낸다. 쿠키 속성은 쿠키를 삭제고 쿠키를 막을 때나 쿠키를 다시 서버로 보낼 것인지를 결정하기 위해 브라우저에서 사용한다.

## Domain과 Path

Domain과 Path 속성은 쿠키의 범위를 정의한다. 이 속성은 어떤 웹 사이트가 근본적으로 쿠키를 소유하는지를 브라우저에게 알려준다. 명백한 보안 이유로 이 쿠키는 현재 자원의 최상위 도메인과 그 하위 도메인으로만 설정할 수 있으며, 다른 도메인이나 그 하위 도메인으로는 설정할 수 없다. 예를 들어, 웹 사이트 example.org는 foo.com 도메인으로 쿠키를 설정할 수 없다. example.org 웹 사이트에게 foo.com의 쿠키를 제어하도록 허용하면 안되기 때문이다.

만약 쿠키의 도메인과 경로를 서버에서 설정하지 않았다면 요청온 자원의 도메인과 경로를 기본값으로 한다. [30](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-30) 그렇지만 도메인을 주지 않아 foo.com으로 설정된 쿠키와 foo.com 도메인으로 설정한 쿠키는 다르다. 전자의 경우 쿠키는 foo.com 요청인 경우에만 보낼 수 있지만 후자의 경우에는 모든 하위 도메인에서도 포함 된다. (예를 들어, docs.foo.com) [31](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-31) [32](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-32)

아래는 사용자가 로그인 한 후에 웹 사이트에서 보내는 몇 개의 Set-Cookie HTTP 응답 헤더 예제다. HTTP 요청은 docs.foo.com 하위 도메인으로 웹 페이지 요청을 보냈다.

```
Set-Cookie: LSID=DQAAAK…Eaem_vYg; Path=/accounts; Expires=Wed, 13 Jan 2021 22:23:01 GMT; Secure; HttpOnly
Set-Cookie: HSID=AYQEVn….DKrdst; Domain=.foo.com; Path=/; Expires=Wed, 13 Jan 2021 22:23:01 GMT; HttpOnly
Set-Cookie: SSID=Ap4P….GTEq; Domain=foo.com; Path=/; Expires=Wed, 13 Jan 2021 22:23:01 GMT; Secure; HttpOnly
...
```

첫 번째 쿠키인 LSID는 Domain 속성은 없고, Path 속성은 /accounts으로 되어 있어 docs.foo.com/accounts (요청 도메인에서 얻어낸 도메인)으로 포함 된 페이지 요청에서만 브라우저가 쿠키를 사용할 수 있음을 말해준다. 다른 두 쿠키인 HSID와 SSID는 브라우저가 요청하는 .foo.com의 모든 하위 도메인의 모든 경로(예를 들어, www.foo.com/bar)에서 사용할 수 있다.  접두어로 나오는 점(dot)은 최근 표준에서는 선택이지만 구현 기반이 되는 [RFC 2109](http://tools.ietf.org/html/rfc2109)의 호환성을 위해 추가하는 것이 좋다. [33](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-33)

## Expires와 Max-Age

Expires 속성은 브라우저가 쿠키를 지워야 하는 날짜와 시간을 지정한다. 날짜/시간은 Wdy, DD Mon YYYY HH:MM:SS GMT 형태로 지정한다. [34](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-34)

그렇지 않으면 Max-Age 속성으로 브라우저가 쿠키를 받은 시간 대비 앞으로 얼마의 시간 뒤에 쿠키를 만료 시킬지 설정하는데 사용할 수도 있다. 아래는 사용자가 로그인 한 후에 웹 사이트가 받은 세 개의 Set-Cookie 헤더 예제이다.

```
Set-Cookie: lu=Rg3vHJZnehYLjVg7qi3bZjzg; Expires=Tue, 15-Jan-2013 21:47:38 GMT; Path=/; Domain=.example.com; HttpOnly
Set-Cookie: made_write_conn=1295214458; Path=/; Domain=.example.com
Set-Cookie: reg_fb_gate=deleted; Expires=Thu, 01-Jan-1970 00:00:01 GMT; Path=/; Domain=.example.com; HttpOnly
```

첫 번째 쿠키인 lu는 2013년 1월 15일로 만료일이 지정되어 있다. 이 시간이 될 때까지 클라이언트 브라우저는 이 쿠키를 사용한다. 두 번째 쿠키인 made_write_conn은 만료 일자를 지정하지 않았기 때문에 세션 쿠키다. 사용자가 브라우저를 닫으면 삭제된다. 세 번째 쿠키인 reg_fb_gate 쿠키는 값이 "deleted"로 변경됐고 만료 시간이 과거로 설정됐다. 브라우저는 이 쿠키를 받는 즉시 삭제한다. 쿠키는 Set-Cookie 필드의 도메인과 경로 속성이 쿠키를 만들었을 때에 사용한 값과 일치할 때만 삭제한다.

## Secure와 HttpOnly

Secure와 HttpOnly 속성은 값과는 아무런 관련이 없다. 그것보다는 이 속성 이름이 있을 때에는 두 쿠키의 행동을 활성화 한다는 걸 가리킬 뿐이다.

Secure 속성은 암호화된 전송으로 쿠키 통신을 제약한다는 의미며, 브라우저는 [보안/암호화](http://en.wikipedia.org/wiki/Https)된 연결을 통해서만 쿠키를 사용할 수 있다는 뜻이다. 그렇지만 웹 서버가 보안 연결이 아닐 때 secure 속성으로 쿠키를 설정하면 [중간자 공격](http://en.wikipedia.org/wiki/Man-in-the-middle_attack)(man-in-the-middle attacks, MITM) 방법으로 사용자에게 전달되는 시점에 쿠키를 여전히 가로챌 수 있다. 그러므로 가장 안전한 방법은 Secure 속성을 사용하는 쿠키를 보안 연결을 통해서만 설정하도록 해야 한다.

HttpOnly 속성은 브라우저가 HTTP(그리고 HTTPS) 요청이 아닌 채널을 통해서는 쿠키를 노출할 수 없도록 해준다. 이 속성을 사용하는 쿠키는 [자바스크립트](http://en.wikipedia.org/wiki/JavaScript)를 통해 호출하는 것(document.cookie를 사용해서)과 같은 HTTP 메서드가 아닌 방법으로는 접근할 수가 없다. 그러므로 [cross-site scripting](http://en.wikipedia.org/wiki/Cross-site_scripting)으로 쉽게 쿠키를 훔쳐가지 못한다. [35](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-Symantec-2007-2nd-exec-35) 페이스북과 구글은 무엇보다도 HttpOnly 속성을 광범위하게 사용한다.

# 브라우저 설정

대부분 현대 브라우저는 쿠키를 지원하고 사용자가 끌수 있다. 다음은 공통적인 옵션이다. [36](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-36)

- 쿠키를 받거나 완전하게 막기 위해 쿠키를 완전하게 활성화하거나 비활성
- 쿠키 관리도구를 사용해 쿠키를 보거나 선택해서 삭제
- 쿠키를 포함해 완전하게 개인 정보를 삭제

기본적으로 Internet Explorer는 [P3P](http://en.wikipedia.org/wiki/P3P) "CP"(Compact Policy) 필드를 동반하면 제3자 쿠키를 허용한다. [38](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-microsoft2007-38) [39](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-39) [40](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-40) [41](http://en.wikipedia.org/wiki/HTTP_cookie#cite_note-41)

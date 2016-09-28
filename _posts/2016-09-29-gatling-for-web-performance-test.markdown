---
layout: post
title:  "개틀링(Gatling)으로 성능 테스트하기"
date:   2016-09-29 20:00:00 +0000
categories: Gatling PerformanceTest Tool
---

프로젝트에서 성능 테스트를 해야 하는데,
고민하던 중에 페이스북을 통해서 [Gatling](http://gatling.io/)을 소개 받았습니다.
초면(?)이지만 이름부터가 너무 마음에 드네요.. 개틀링(Gatling)이라니.. 작명 센스가 놀랍습니다^^.


# 1. 설치하기

설치는 간단합니다. 홈페이지에서 압축파일을 받아서 원하는 경로에 풀면 그걸로 끝.

필요한 모든 라이브러리가 들어 있어서 JDK만 설치되어 있다면 별도로 경로를 잡아주거나 사전에 설치되어 있어야 하는 프로그램도 없습니다.

저는 2.1.7 버전을 사용했습니다. (글을 다시 정리하는 16년 9월 29일 자로는 [2.2.2 정식 버전](http://gatling.io/#/resources/download)까지 나왔네요..)

여기서 주의할 점으로 **반드시 정식 릴리즈 버전을 사용** 하기를 추천드립니다.

(저도 모르게..) 스냅샵 버전을 사용하다보니 이런저런 에러로 중간중간 스크립트 실행할 때 에러가 나더라고요..

특히, 저는 중국어 간체 환경에서 사용했는데 인코딩 문제 등 먼가 조치하고 싶지 않은 에러가 많이 발생했습니다.. 개틀링 포럼에도 질문을 올려보니 정식버전으로 다시 해보라는 짧은 조언을...;;

# 2. 폴더구조

폴더 구조는 이렇게 되어 있습니다.

![개틀링 폴더 구조](/images/gatling/gatling-folder.png)

각 폴더 별로 보면,

- /bin 에는 스크립트를 생성(녹화)하는 recorder.sh와 스크립트를 실행하는 gatling.sh 파일이 있고 (두 개 실행 파일이 전부입니다),
- /conf에는 설정 파일이,
- /lib에는 라이브러리가,
- /results에는 스크립트를 실행한 결과 페이지(HTML)가,
- 마지막으로 /user-files에는 녹화한 스크립트 파일(scala)과 데이터 파일이 들어 있습니다.
 - 테스트 데이터 파일은 data 폴더에,
 - 스크립트 파일은 simulations 폴더에 있고,
 - 각각이 클래스 패스가 잡혀 있으니 두 폴더 하위에 필요에 맞춰 파일을 넣어 사용하면 됩니다.

# 3. 녹화하기 (Recording)

개틀링은 화면을 녹화해 테스트 스크립트를 생성해주는 기능을 제공합니다. (굿!)

개틀링 프록시 서버를 통해 웹 브라우저의 화면 이벤트를 기록하는 방식입니다.
녹화 서버(프록시 서버)는 다음 명령어로 간단히 실행할 수 있습니다.

```
${GATLING_HOME}/bin/recorder.sh
```

그럼 아래와 같은 APP이 실행됩니다.

![개틀링 녹화 앱 실행](/images/gatling/gatling-recording-app.png)

APP 화면에 나오는 각각의 옵션에 대해서는 레퍼런스를 참고해주세요.

화면에서 package에 입력한 값은 녹화 후 생성되는 스크립트 파일(Scala)에서 폴더 구분자로 사용하기 때문에 꼭 값을 넣어주시는 편이 좋습니다. 실행할 때도 분류가 되어 편리합니다.

Static 파일(이미지, JS, CSS 등)에 대한 HTTP 요청은 녹화 대상에서 제외하기 위해서 오른쪽 하단에 *'No static resources'* 를 선택하면 자동으로 제외 표현식이 추가 됩니다.

브라우저에서 클릭 이벤트를 프록시 서버를 거치도록 하기 위해서 SwitchyOmega라는 확장 프로그램을 사용했습니다. 크롬 플러그인이라 설치도 간단하고, 설정 변경도 쉬워서 매우 편리합니다. 다만, 테스트가 끝나고 나면 다시 'Direct'로 돌려야 하는데, 그걸 깜빡하고 해맬때가 있는 것만 주의를 하면 되겠습니다^^.

![SwitchyOmega 크롬 클러그인](/images/gatling/gatling-omega.png)

SwitchyOmega을 설치한 후 설정 화면에서 신규 프로파일을 생성하고 IP(localhost)와 PORT(8000)를 개틀링 서버 정보에 맞춰 입력합니다.

![SwitchyOmega 설정](/images/gatling/gatling-omega-conf.png)

이제 개틀링 녹화 서버에서 'Start!' 버튼을 클릭해 녹화를 시작하고, 브라우저에서 화면을 클릭, 클릭하면서 돌아다니면 Request와 Response가 기록되 걸 볼수가 있습니다~

# 3. 스크립트 작성하기 (생성된 스크립트 수정하기)

녹화를 마치고 저장을 하면 스크립트가 '{GATLING_HOME}/user-files/simulations/'에 생성됩니다.

스크립트 파일은 스칼라로 작성되어 있습니다.
요게 참 마음에 드는 점인데요, 스칼라로 작성되어 있어 편집하기가 매우 유용합니다. (물론, 스칼라를 잘 모르는 건 함정..)

스크립트 파일은 기본적으로 다음 틀로 만들어집니다. ([레퍼런스 참조](http://gatling.io/docs/2.1.7/quickstart.html#gatling-scenario-explained))

1. HTTP 헤더 설정 + @ (사용자 정의)
1. 시나리오 생성: 각 HTTP 요청/응답이 어떤 URL, 무슨 파라미터를 가지고 실행되어 어떤 결과가 오기를 기대하는지
1. 사용자 생성 방식 및 실행 방식과 주기, 완료조건 등 지정

[레퍼런스](http://gatling.io/docs/2.1.7/)에 시나리오 별 스크립트 작성 방법이 잘 설명이 되어 있습니다.

구글링해도 딱히 도움이 될만한 문서가 나오는 경우가 많지 않기 때문에(이건 단점..), 스크립트 작성할 때는 레퍼런스를 통해서 정보를 얻고 직접 돌려보면서 답을 찾아가는 편이 최선인듯 합니다.

다행히 [사용자 그룹](https://groups.google.com/forum/#!forum/gatling)에서 답변이 그나마 빨리 달리기 때문에 궁금한 문제는 직접 그룹스에 질문하는 것이 최고일듯 합니다.

# 4. 사용자 생성하기

개틀링에서는 쉽고 다양한 방법으로 테스트 사용자를 생성할 수 있는데, 저는 CSV 파일을 사용했습니다.

일반적인 HTML Form 로그인 화면으로 스크립트 파일을 만들면 아래처럼 작성이 됩니다.

```scala
class RecordedSimulation extends Simulation {
    ...
    val scn = scenario("RecordedSimulation")
        .exec(http("request_1")
        .post("/login.form")
        .headers(headers_1)
        .formParam("id", "user1")
        .formParam("pw", "1234")
    ...
}
```

이 스크립트에서는 id, pw 파라미터를 'user1'과 '1234' 로 넘기고 있습니다.

만약 아래처럼 CSV 파일이 있다면,

```csv
ID,PW,...
user1,1234,...
user2,1234,...
user3,1234,...
...
```

이에 맞춰서 사용자를 생성 및 입력하기 위해서 아래처럼 스크립트 파일을 수정할 수가 있습니다.

```scala
class RecordedSimulation extends Simulation {
    ...
    val userFile = csv("user-data.csv").queue
    val scn = scenario("RecordedSimulation")
        .feed(userFile)
        .exec(http("request_1")
        .post("/login.form")
        .headers(headers_1)
        .formParam("id", "${ID}")
        .formParam("pw", "${PW}")
    ...
}
```

먼저 CSV 파일을 읽어들여 변수(userFile)로 선언하고,
이걸 테스트 시나리오에 입력(feed())하고 나면,
${KEY}로 사용할 수가 있습니다.

물론, ID, PW 외에도 컬럼을 추가해서 함께 사용할 수 있습니다.

개틀링에서는 기본적으로 jsessionid를 자동으로 처리해주기 때문에, 이렇게 사용자 데이터를 매핑하는 것만으로도 기본적인 사용자 테스트 데이터를 쉽게 할수가 있습니다.
물론, 추가적으로 쿠키나 세션 처리 로직을 함께 작성할 수가 있습니다.

# 5. 시뮬레이션을 위한 다양한 사용자 주입 방법

사용자 데이터를 준비했으면 이제 사용자 데이터로 테스트를 실행할 차례입니다.
역시나 사용자를 주입하는 방법도 다양하게 제공합니다.

```scala
setUp(
    scn.inject(
    nothingFor(4 seconds), // 1
    atOnceUsers(10), // 2
    rampUsers(10) over(5 seconds), // 3
    constantUsersPerSec(20) during(15 seconds), // 4
    constantUsersPerSec(20) during(15 seconds) randomized, // 5
    rampUsersPerSec(10) to 20 during(10 minutes), // 6
    rampUsersPerSec(10) to 20 during(10 minutes) randomized, // 7
    splitUsers(1000) into(rampUsers(10) over(10 seconds)) separatedBy(10 seconds), // 8
    splitUsers(1000) into(rampUsers(10) over(10 seconds)) separatedBy atOnceUsers(30), // 9
    heavisideUsers(1000) over(20 seconds) // 10
).protocols(httpConf)
)
```

위 코드에 대한 전체 설명은 [레퍼런스](http://gatling.io/docs/2.1.7/general/simulation_setup.html#injection) 를 확인하시고, 간단히 설명하자면 아래와 같습니다.

1. 한 번에 사용자를 주입할 때는 atOnceUsers() (2번)
1. 선형적(linear)으로 사용자를주입할 때는 rampUsers() ( 3번)
1. 고정된 비율(constant rate)로 사용자를주입할 때는 constantUsersPerSec() (4, 5번)
1. 단계를 나눠서 주입할 때는 8 ~ 10번

자세한 설명은 반드시 레퍼런스를 읽고 여러 시도를 해보시기바랍니다. 더 정확한 동작 방식에 대해서는 저도 좀더 이해와 공부가 필요합니다;;

추가로 특정 임계치까지 올라간 다음 정해진 부하로 정해진 시간 동안 실행하고자 할 때는 [throttlling()](http://gatling.io/docs/2.1.7/general/simulation_setup.html#throttling)을 사용할 수 있습니다. 이것 또한 매우 유용한 옵션입니다. 예를 들면, 테스트가 시작해서 언제까지는 어느 정도의 부하를 주고, 이 부하를 처리한 후에는 (상시 운영 상황을 가정해) 일정 시간의 요청을 계속 처리할 수 있는지를 보는 것이지요.

# 6. 멀티 시나리오

멀티 시나리오는 스크립트 파일을 각각 만들어서 합치는 방식으로 작업을 해줘야 합니다. 멀티 시나리오를 바로 녹화하는 방법은 아직 잘 모르겠지만(아마 없는듯 합니다), 각각의 시나리오를 변수로 선언하고 setUp() 함수만 합치면 되기 때문에 크게 어려운 일은 아닙니다.

```scala
val scn1 = scenario("scenario1")...
val scn2 =scenario("scenario2")...

setUp(
    scn1.users(10).ramp(10).protocolConfig(httpConf),
    scn2.users(5).ramp(20).protocolConfig(httpConf)
)
```

이상하게 2.1.7(최신버전) 레퍼런스에서는 정확하게 멀티 시나리오를 설명하는 챕터가 없고, 구글링해보면 [1.x 문서](http://gatling.io/docs/1.5.6/user_documentation/tutorial/advanced_usage.html#multi-scenarios-simulations)가 마지막입니다. (왜 그럴까요..이유가 있을텐데...)

# 8. 공통 HTTP 헤더 처리

녹화한 스크립트 파일을 보면 HTTP Request 별로 header가 변수로 선언되어 있습니다. (중복된 헤더는 하나의 변수로 처리)

이 때 모든 헤더에 공통적으로 값을 추가하고 싶을 때는 모든 header 변수를 수정하지 말고 첫 번째 변수인 httpProtocol에 headers()를 사용하는 방법을 사용하면 됩니다.

```scala
...
    val httpProtocol = http
        .baseURL("http://test.com")
        .headers(Map(
        "Accept-Language" -&amp;amp;amp;amp;gt; "ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4",
        "User-Agent" -&amp;amp;amp;amp;gt; "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36"
    )).disableAutoReferer
...
```

# 8. 테스트 실행하기

테스트 실행 방법 역시 간단합니다.

```
${GATLING_HOME}/bin/gatling.sh
```

개틀링이 실행되면 ${GATLING_HOME}/user-files/simulations 하위에 있는 스크립트 파일 중 컴파일이 성공한 스크립트만 목록에 등장합니다.

![개틀링 콘솔 1](/images/gatling/gatling-console-1.png)

목록이 등장하면 커서가 깜박깜박 거리는데, 여기서 실행하고자 하는 테스트 시나리오 번호를 입력하고 엔터 입력하면 옵션 입력 단계로 넘어갑니다.
만약, 스칼라 컴파일이 실패한 시나리오가 있다면 콘솔에 에러 로그가 나오며 목록에서 제외되게 됩니다. 원하는 시나리오가 안 나온다면 확인해보세요.

![개틀링 콘솔 2](/images/gatling/gatling-console-2.png)

위 스크린샷처럼 옵션을 입력하고 다시 엔터를 눌러주면 됩니다.
모든 요청이 처리되면 응답시간과 실행 결과가 요약되어 나오고 완료.

![개틀링 콘솔 3](/images/gatling/gatling-console-3.png)

# 9. 에러 디버깅 하기

기본적으로는 테스트를 실행하면서 요청이 실패해도 상세한 로그를 남기지 않습니다. 4xx나 5xx, 또는 Request Timeout 같은 에러는 에러로그 한줄만 나옵니다.

이때 에러 정보를 자세히 보고 싶을 때는 로그 파일을 수정하면 됩니다. {GATLING_HOME}/conf/ogback.xml 파일을 수정하면 되는데, 상세한 설명은 파일 주석으로 대신합니다. (애초에 파일에 작성되어 있는 주석입니다..)

![로그 설정](/images/gatling/gatling-log-conf.png)

물론, 실제 테스트를 할 때는 로그 옵션을 다시 끄고 해야 합니다.

# 10. 리포팅 보기

콘솔에도 간략히 설명이 잘 나오지만 별도로 리포팅 파일도 참 잘만들어줍니다. 응답 결과(특히, 에러)가 더 상세히 나왔으면 좋겠다는 아쉬운 점이 있지만 차트 또한 훌륭하게 잘 나오는 편입니다.

경로는 테스트를 다 돌리면 마지막에 콘솔에 출력됩니다.

# 11. 마무리하기

여기까지 개틀링을 처음 적용하면서 경험을 정리해봤습니다.

다음에는 실제로 부하 테스트를 하면서 경험한 보다 자세한 얘기를 풀어내보도록 하겠습니다~

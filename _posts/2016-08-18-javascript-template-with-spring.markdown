---
layout: post
title:  "스프링에서 자바스크립트 템플릿 사용하기 (Isomorphic Template, 작성중)"
date:   2016-07-18 13:00:00 +0000
categories: web template isomorphic
---

오랜만에 글을 작성해봅니다.

예저에도 관련 글을 여기저기에 몇 번 적어본 적이 있는데, 솔직히 저는 2012년부터 스크립트 템플릿(narshorn전?+dust.js를 사용했죠)을 사용했었습니다.
그 당시는 관련 자료도 거의 없었고 처음이라 시행착오도 많이 하는 바람에 저와 함께 개발하는 동료들이 상당히 힘들었습니다.

요즘에 그 당시를 회상하며 이런저런 생각을 해봅니다;;

# 왜 자바스크립트 템플릿을 사용하려고 하는가?

근래들어 많이 회자되는 'Isomorphic Template'의 장점을 얘기할 때 하나의 템플릿 파일을 클라이언트와 서버에서 모두 사용할 수 있기 때문이라 설명합니다.
그런데 솔직히 서비스 중에 하나의 템플릿을 클라이언트나 서버에서 동시에 사용하는 경우는 생각보다 많이 경험해보지는 못했습니다.

그것보다는 클라이언트 개발자와 서버 개발자가 하나의 소스를 사용해 작업하는 걸 오히려 더 큰 장점으로 저는 생각합니다.

JSP를 사용해 서버 코드와 섞어 버리고 나서 프론트 개발자(HTML이,CSS나 자바스크립트를 사용해 개발하는 사람을 모두 포함)와 협업의 문제를 해결해줄 수 있는 좋은 방법인 것이죠.

그렇다고 자바로 개발하는데 서비스 전체를 완전히 독립된 SAP-REST API 구조로 개발하기는 상당히 부담스럽다고 생각합니다.

이럴 때 가장 적절한 방법이 화면 코드를 서버 코드와 완전히 분리해 별도로 구성하고, 하나의 화면 소스코드를 서버와 화면 개발자가 함께 개발해 나가는 것이죠.

특히나 서비스를 오픈하고 나서 운영으로 넘어가 지속적으로 개선하는 활동을 하기 위해서는 서버의 특정 기술(예를 들면, JSP) 환경으로 개발 프로세스가 불편해 지는 문제를 해결하는 건 중요한 일이라 생각합니다.

자바스크립트 템플릿을 서버에서 함께 사용하는 건 이러한 문제를 개선하는 데 많은 도움을 주게 됩니다.

# 소스 구성은 어떻게 하는 것이 좋을까?

개인적인 생각으로는 서버와 화면 코드는 각각의 프로젝트로 분리하고, 로컬 환경에서 양쪽을 쉽게 실행해 상호 확인할 수 있는 환경을 만들어 주는 방법이 가장 좋다고 생각합니다.

    - server-project
    - front-project

이렇게 구성하고 서버(자바) 관련 코드는 서버 프로젝트에 템플릿(HTML) 포함해 CSS, JS 등과 같은 화면 코드는 프론트 프로젝트에 두는 거죠.

그리고 각 프로젝트를 쉽고 빠르게 실행해서 확인할 수 있어야 합니다.

서버야 자바를 사용하는 상황이니까 스프링 부트를 사용해 로컬에서도 쉽게 실행할 수 있도록 하면 되고, 프론트는 node.js에 각자 선호하는 기술셑을 구성하면 된다고 생각합니다.

사실 프론트에 대해서는 저도 이런저런 고민과 실험을 하고 있습니다. 저도 전문 분야는 아니라..;

프론트는 로컬에서는 node.js를 사용해 서버를 실행하고 테스트를 하더라도, 실 서비스에서는 여전히 node.js를 함께 사용할 수도 있고, 아니면 CDN(또는 웹서버)을 통해서 정적 파일로 서비스 할 수도 있겠죠.

지금부터는 Mustache를 사용해 자바 서버에서 화면 렌더링을 처리하는 간단한 예제를 살펴볼까 합니다.

# 어떻게 동작하나?

# Mustache 사용 예제

우선 pom.xml에 mustache 웹jar를 추가한다.

    <dependency>
        <groupId>org.webjars.npm</groupId>
        <artifactId>mustache</artifactId>
        <version>2.2.1</version>
    </dependency>

그리고 아래처럼 스프링 설정을 추가한다. 아래처럼 설정하면 템플릿 파일은 'src/resources/template/' 폴더에 두면 되고, 파일 확장자는 .html로 하자.

    @Configuration
    @EnableWebMvc
    public class ViewConfig extends WebMvcConfigurerAdapter {

        @Override
        public void configureViewResolvers(ViewResolverRegistry registry) {
            registry.scriptTemplate().prefix("public/template/").suffix(".html");
        }

        @Bean
        public ScriptTemplateConfigurer mustacheTemplate() {
            final ScriptTemplateConfigurer configurer = new ScriptTemplateConfigurer();
            configurer.setEngineName("nashorn");
            configurer.setScripts("public/template/mustache-render.js", "public/template/polyfill.js", "/META-INF/resources/webjars/mustache/2.2.1/mustache.min.js");
            configurer.setRenderObject("Mustache");
            configurer.setRenderFunction("render");
            return configurer;
        }
    }

이제는 렌더링을 위한 자바스크립트 파일을 만들어준다. 스프링 설정에 적은대로 mustache-render.js란 이름으로 파일을 만들어 'src/resources/public/template'에 두도록 한다.

    function render(template, model, url) {
        var json = convertToJsonObject(model);

        console.log("Template: " + template + "\nJSON: " + json);

        return Mustache.render(template, json);
    }

    function convertToJsonObject(model) {
        var o = {};
        for (var k in model) {
            if (model[k] instanceof Java.type("java.lang.Iterable")) {
                o[k] = Java.from(model[k]);
            } else {
                o[k] = model[k];
            }
        }
        return o;
    }

이제는 컨트롤러에서 파일명(또는 경로/파일명)으로 뷰이름만 지정해주면 연결 끝이다. 데이터 전달을 위해서는 ModelMap을 사용하면 된다.

    @Controller
    public class WebController {

        @RequestMapping("/main")
        public String loginPage(ModelMap model) {

            model.put("data", new Dto(...));
            return "main";
        }
    }

위 코드처럼 요청 URL과 템플릿 파일 이름이 동일한 경우 경로를 굳이 반환하지 않고 void 타입으로 메서드를 정의해도 된다. (스프링의 일반적인 뷰 매핑 규칙을 동일하게 따름)

## 공통변수 처리

스프링의 ModelMap에 담은 객체를 JSON으로 변환하기 때문에 템플릿에서 사용하고 싶은 공통 변수는 미리 ModelMap에 넣어 전달하는 편이 좋습니다.
아무래도 가장 손 쉽게 사용하는 방법은 스프링의 HandlerInterceptor를 사용하는 방법이겠죠.

    public class CommonModelAttributesHandlerInterceptor extends HandlerInterceptorAdapter {

        private Environment env;

        public CommonModelAttributesHandlerInterceptor(Environment env) {
            this.env = env;
        }

        @Override
        public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView mav) throws Exception {
            if (mav != null) {
                final String staticHost = env.getProperty("static.host");
                mav.addObject("staticHost", staticHost);
            }
        }
    }

화면을 처리하는 ScriptTemplateView로 들어가기 직전인 HandlerInterceptor.postHandle(..)을 사용하시면 됩니다.

## 프론트 코드 참조

템플릿 파일을 URL로 가져와 사용하기 때문에 개발이나 운영 환경에 올리고 나서도 접근하는 호스트만 변경하면 됩니다.
이렇게 해서 프론트 소스를 서비스에 올리는 방식이 서버에는 영향을 주지 않도록 하는 방법이 좋다고 생각합니다.

    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8"/>
        <title>React Sample</title>
        <link rel="stylesheet" href="{{staticHost}}/css/sample.css"/>
        <script src="https://unpkg.com/react@15.3.0/dist/react.js"></script>
        <script src="https://unpkg.com/react-dom@15.3.0/dist/react-dom.js"></script>
        <script src="https://unpkg.com/babel-core@5.8.38/browser.min.js"></script>
        <script src="https://unpkg.com/jquery@3.1.0/dist/jquery.min.js"></script>
        <script src="https://unpkg.com/remarkable@1.6.2/dist/remarkable.min.js"></script>
    </head>
    <body>
    <h1>React Test!</h1>
    <div id="content"></div>
    <script type="text/babel" src="{{staticHost}}/script/sample.js"></script>
    <script type="text/babel">
        // Rendering component...
    </script>
    </body>
    </html>

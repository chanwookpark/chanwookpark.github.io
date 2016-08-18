---
layout: post
title:  "스프링에서 자바스크립트 템플릿 사용하기(Isomorphic Template)"
date:   2016-07-18 13:00:00 +0000
categories: web template isomorphic
---

스프링 뷰로 자바스크립트 템플릿을 사용하기 위한 방법과 설정 등을 정리하는 페이지.

# Mustache

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

        @Autowired
        Environment env;

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

        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
            registry.addResourceHandler("/resources/**").addResourceLocations("/resources/");
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

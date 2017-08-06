---
layout: post
title:  "Spring 사용 기록"
date:   2017-06-15 01:00:00 +0000
categories: Java Spring
---

프로젝트가 끝나고 한 가한 시기에 근래 프로젝트에서 사용한 스프링 관련 기록을 두서 없이 남겨봅니다.

# 1. Parent도 있는데 Spring boot 플러그인은 정확히 언제 세팅해야 하나?

(초장기?)Spring Boot 가이드를 보면 메이븐 설정 시에 <parent>와 <plugin>을 설정해주도록 되어 있습니다.
그런데 parent만 지정해도 잘 동작하는데 그럼 <plugin>은 언제 설정해줘야 하는 건가요? 라는 궁금증이 있었습니다.

```xml
<project ...>
    <groupId>spring-land</groupId>
    <artifactId>springland</artifactId>
    <version>1.0-SNAPSHOT</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.5.4.RELEASE</version>
    </parent>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```

\\<plugin\\>은 boot로 만든 애플리케이션을 jar 형태로 실행하고자 할 때 사용합니다. \\<plugin\\>을 설정하고 mvn package를 실행하면 의존성이 걸린 jar를 모두 포함하는 용량이 꽤 큰 jar가 하나 만들어 집니다. 이 jar는 의존성을 모두 포함하고 있기 때문에 java -jar 로 바로 실행이 가능합니다!

반대로 이렇게 독립적으로 실행하지 않는 상황(ex. 설치형 Tomcat에 배포해 사용한다거나 등등등)이라면 굳이 설정할 필요가 없겠죠.

보다 상세한 내용은 [레퍼런스에 잘 나와 있으니 참고](http://docs.spring.io/spring-boot/docs/1.5.4.RELEASE/reference/htmlsingle/#getting-started-first-application-executable-jar)해주세요.

# 2. Spring Boot 메인 클래스 만들기

Boot 애플리케이션에서는 진입 지점으로 메인 클래스를 만들어야 한다.
jar로 패키징할 때는 아래처럼,

```java
@EnableAutoConfiguration
public class App {
    public static void main(String[] args) throws Exception {
        SpringApplication.run(Example.class, args);
    }

}
```

war로 패키징할 때는 아래처럼.

```java
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan
public class App extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return super.configure(builder);
    }

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(App.class);
        application.run(args);
    }
}
```

TODO 애노테이션 추가

# 기본 설정 중 삭제가 필요한 설정

Spring Boot가 기본적으로 생성해주는 설정과 라이브러리 중 사용하지 않을 때는 제거하면 좋을 대상이 있습니다.

[spring-starter-web만 설정했을 때 기본 lib](/images/spring-note/spring-boot-base-lib-dep.png)

기본 설정일 때는 그닥 삭제할게 없다

# 로그 설정 관련

기본적으로 로그도 application.properties에 설정 합니다.

```properties
logging.level.springland=DEBUG
```

properties 파일을 배포 환경 별로 설정할 수 있기 때문에 이렇게 설정해도 되지만 아무래도 자세한 Logger와 Appender 등을 설정하기 위해서 로그 설정 파일을 별도로 분리하는 것이 좋을 때도 있습니다.

[스프링 부트 레퍼런스](https://docs.spring.io/spring-boot/docs/current/reference/html/howto-logging.html)에 보면 '스프링 부트는 Commons Logging API'를 제외하고는 로깅을 위한 아무런 의존성을 가지고 있지 않고, 선택해서 사용하라고 합니다.

(저도 그렇고) 일반적으로 많이 사용하는 Logback을 위해서는 'spring-boot-starter-logging' 참조를 설정할 수도 있지만, 'spring-boot-starter-web'을 설정하면 'spring-boot-starter-logging'이 알아서 참조되기 때문에 별도로 설정할 필요는 없습니다. (오히려 log4j를 직접 사용하고 싶을 때는 설정이 필요)

logback 설정은 클래스패스에 'logback.xml'을 두면 됩니다.

```xml
<configuration>
    <include resource="org/springframework/boot/logging/logback/base.xml"/>
    <logger name="org.springframework.web" level="DEBUG"/>
</configuration>
```

보통은 환경 별로 로그 레벨을 조정하기 때문에 이 파일에 직접 설정하기 보다는 프로파일에 맞춰 로딩되도록 설정해주면 더 편리합니다.

```xml
<configuration>
    <include resource="org/springframework/boot/logging/logback/base.xml"/>
    <include resource="logback-${spring.profiles.active}.xml"/>
</configuration>
```

TODO 파일 이름으로 구분해서 로딩 되지 않는지 확인

IntelliJ에서 스프링 플러그인을 사용하면 이쁘게 색깔 로깅이 남는데 메이븐 플러그인으로 실행하면 안 남는 현상을 겪으시는 분들은 application.properties 'spring.output.ansi.enabled'을 추가해주시면 됩니다.

```properties
spring.output.ansi.enabled=detect
```

이클립스에서 위 옵션을 추가하면 로깅이 깨지는 현상이 발견되기도 하는데 이때 [ANSI 플러그인](https://marketplace.eclipse.org/content/ansi-escape-console)을 설치해주시면 해결됩니다.

# 데이터소스 설정

로컬에서 임베디드 데이터소스를 간단하게 사용할 경우에는 H2, HSQL, Derby 중 사용하고 싶은 임베디드 데이터소스를 의존성만 추가해주면 됩니다.

```xml
<dependencies>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

주의!
H2 데이터소스를 추가하더라도 JPA처럼 데이터소스 초기화 하는 DataAccess 라이브러리가 없다면 데이터소스로 등록을 하지 않더라구요..
TODO 자세한 이유는 확인 필요

MySQL이나 Oracle 등을 사용하려면 DB에 맞는 JDBC 라이브러리를 추가하고, application.properties에 쉽게 접속 정보를 설정해주면 됩니다.

```properties
spring.datasource.url=jdbc:mysql://localhost/test
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
spring.datasource.username=dbuser
spring.datasource.password=dbpass
```

한 개 데이터소스를 사용하기도 하지만 보통 여러 개의 데이터소스를 사용하게 됩니다.
스프링 부트 초창기에는 여러 개 데이터소스를 선언하는 방법이 불편해(=직접 빈으로 등록) 공통 기능을 따로 만들어 사용하곤 했는데 지금 레퍼런스를 보니 유사한 기능이 추가되어 있더군요.. 데이터소스 이름에 구분자를 추가해 등록과 관리가 가능합니다.

레퍼런스 참조

그런데 실제 사용 시에는 어차피 설정 클래스를 분리해서 가는 편할 때가 많습니다.
JPA 등 설정을 함께 해야 하기 때문인데요,

가장 적절한 예제는 스프링 공식 예제인듯
https://github.com/spring-projects/spring-data-examples/tree/master/jpa/multiple-datasources

```java
@Bean
public DataSource jndiDataSource() {
    JndiDataSourceLookup dataSourceLookup = new JndiDataSourceLookup();
    DataSource dataSource = dataSourceLookup.getDataSource("jndiName");
    return dataSource;
}
```
datasourcebuilder는 아래 타입에 대해서만 지원합니다.

org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder#DATA_SOURCE_TYPE_NAMES

"org.apache.tomcat.jdbc.pool.DataSource",
			"com.zaxxer.hikari.HikariDataSource",
			"org.apache.commons.dbcp.BasicDataSource", // deprecated
			"org.apache.commons.dbcp2.BasicDataSource" };

# 여러 개 DataSource 사용할 때 트랜잭션 처리

..

# application.properties에 해야하는 주요 속성 설정

| 속성        | 설명           | 예시  |
| ------------- |:-------------:| -----:|
| server.port      | 임베디드 톰캣 포트 | 9090 |

# 로그 설정

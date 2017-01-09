---
layout: post
title:  "Spring Boot 프로그램을 EC2에 쉽게 배포하기"
date:   2017-01-01 01:00:00 +0000
categories: AWS SpringBoot Deploy
---

# 상황

아마존 SDK를 공부하려다 보니 로컬에서 개발한 프로그램을 EC2에 쉽게 배포하고 싶었고,
스프링 부트+클라우드를 함께 사용하다보니 자연스레 스프링 부트 프로그램을 EC2에 쉽게 배포하는 방법을 찾게 됐습니다.

CI에 들어가지 않고도 로컬에서 개발하다가 바로 배포해서 테스트 해보고 싶었고, 가능하면 Docker 같은 다른 기술을 사용하고 싶지 않았습니다.

'[spring boot ec2 deploy](https://www.google.com/search?client=safari&rls=en&q=spring+boot+ec2+deploy&ie=UTF-8&oe=UTF-8)' 이 정도 키워드로 구글링 해보면 가장 많이 나오는 방법이 Elastic Beantalk를 사용하는 방법입니다. 사용해보면 웹 콘솔에서 간단히 배포할 수가 있는데, 자칫하면 과금이 발생할 수 있다는 문제가 있습니다. 과금이 발생하지 않게 할 수 있는 방법이 있는지 모르겠으나 Beantalk가 만들어주는 EC2 구성이 프리티어에 해당하지 않는 서비스를 사용해 과금으로 고생한 적이 한 번 있어 이 방법은 제외했습니다. (2년 전인가 처음 AWS를 공부하면서 암것도 모르고 했다가 몇 백 달라 요금이 과금되서 고생했던 경험이 있습니다.. 다행히 감면 받았지만..)

# 해결방안

로컬에서 S3로 JAR를 패키징해 올리고, 이걸 바로 EC2에서 다운로드 받아 실행하는 방법을 찾았습니다.
S3로 JAR를 패키징해 업로드하는 플러그인이 [스프링 공식 저장소에 딱 올라와 있어서 이걸](https://github.com/spring-projects/aws-maven) 사용했고, S3에서 EC2로 다운로드 받는 건 [WGET이나 S3 CLI를 사용](http://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/AmazonS3.html)할 수 있어 연동이 크게 어렵지 않았습니다.

프로그램 실행은 스프링 부트의 임베디드 톰캣으로 쉽게 실행하면 ok.
배포하는 JAR에 필요한 라이브러리를 모두 포함해서 사용해야 하므로 용량이 큰 문제가 있으나 혼자 테스트하는 정도로 사용한다면 크게 문제가 없어 보였내요.. (개선은..나중에..)

간단히, 정리해보면 아래 순서로 사용할 수가 있습니다.

> 로컬에서 개발 -> Spring Deploy 플러그인을 사용해 패키징한 JAR를 S3에 배포 -> S3에 배포된 JAR를 EC2로 다운로드 -> jar 커맨드로 재실행

그럼 이 순서대로 간단히 설정과 동작 방법을 알아보겠습니다.

# 1. 스프링 부트 설정하기

우선 프로젝트 POM에 스프링 부트에서 제공하는 메이븐 플러그인을 설정합니다.

```xml
<build>
   <plugins>
       <plugin>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-maven-plugin</artifactId>
       </plugin>
   </plugins>
</build>
```

자세한 설명은 [스프링IO 글](https://spring.io/blog/2014/03/07/deploying-spring-boot-applications) 참조해주세요.

# 2. S3에 배포하기 위한 배포 플러그인 설정하기

JAR를 S3에 직접 배포하기 위해서 스프링에서 제공하는 [AWS Maven Wagon](https://github.com/spring-projects/aws-maven)을 사용했습니다.

공식 저장소에서 제공하는 프로젝트입니다. 저도 이번에 알았어요..^^

우선 프로젝트 POM 파일에 extension 플러그인을 설정합니다.

```xml
<project>
  ...
  <build>
    ...
    <extensions>
      ...
      <extension>
        <groupId>org.springframework.build</groupId>
        <artifactId>aws-maven</artifactId>
        <version>5.0.0.RELEASE</version>
      </extension>
      ...
    </extensions>
    ...
  </build>
  ...
</project>
```

다음으로는 배포 위치를 지정해 줘야 하는데, 설정하기에 앞서 배포할 S3 버킷을 미리 만들어 둬야 합니다.
그리고 버킷 안에 릴리즈(release)와 스냅샷(snapshot) 디렉토리를 만들어 둡니다.

![s3 디렉토리](/images/spring-boot-aws-deploy/s3-bucket-directory.png)

그 다음으로 POM에 배포 위치를 설정합니다.

```xml
<project>
  ...
  <distributionManagement>
    <repository>
      <id>aws-release</id>
      <name>AWS Release Repository</name>
      <url>s3://<BUCKET>/release</url>
    </repository>
    <snapshotRepository>
      <id>aws-snapshot</id>
      <name>AWS Snapshot Repository</name>
      <url>s3://<BUCKET>/snapshot</url>
    </snapshotRepository>
  </distributionManagement>
  ...
</project>
```

혼자 테스트 용으로 만들어 스냅샷만 있어도 되지만 하는 김에 둘 다 만들어 줬습니다..

이어서 배포할 때 사용할 AWS 계정 정보를 설정합니다.
AWS의 IAM에서 계정을 만들고 발급한 ACCESS_ID와 SECRET_KEY를 사용합니다.
두 개의 키를 maven의 .setting.xml 파일에 설정합니다.

당연히 두 키가 노출되면 위험할테니 .setting.xml은 공개된 코드 저장소에 올리지 않아야 되겠죠.

```xml
<settings>
  ...
  <servers>
    ...
    <server>
      <id>aws-release</id>
      <username>{여기에 ACCESS_ID}</username>
      <password>{여기에 SECRET_KEY}</password>
    </server>
    <server>
      <id>aws-snapshot</id>
      <username>{여기에 ACCESS_ID}</username>
      <password>{여기에 SECRET_KEY}</password>
    </server>
    ...
  </servers>
  ...
</settings>
```

.setting.xml이 아니라 시스템 프로퍼티로 설정하는 방법도 있다고 하내요..

# 3. S3 보안정책 설정하기

이번에는 S3에 보안 정책 설정을 해야 합니다. 여기서 삽질을 많이 했습니다 @@.
우선 AWS를 아직은 공부하는 수준이라 보안정책 설정하는 것 자체가 처음이어서 어려웠내요.

가장 확실한 방법은 [aws-maven 설명](https://github.com/spring-projects/aws-maven#making-artifacts-public)을 보고 [AWS Policy Generator](http://awspolicygen.s3.amazonaws.com/policygen.html)를 사용해서 정책을 생성하는 방법입니다.

![AWS Policy Generator](/images/spring-boot-aws-deploy/aws-policy-generator.png)

AWS Policy Generator에서 principal 항목은 단순 input이라 스프링 가이드처럼 키-밸류 매핑으로 넣기가 어려워서 생성한 후에 매핑 정보를 다시 입력해줬습니다.

제가 만든 app2release 버킷에 최종 설정은 아래와 같습니다.

```json
{
	"Version": "2012-10-17",
	"Id": "Policy1483415298284",
	"Statement": [
		{
			"Sid": "Stmt1483415271378",
			"Effect": "Allow",
			"Principal": {
				"AWS": "*"
			},
			"Action": "s3:ListBucket",
			"Resource": "arn:aws:s3:::app2release"
		},
		{
			"Sid": "Stmt1483415295885",
			"Effect": "Allow",
			"Principal": {
				"AWS": "*"
			},
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::app2release/*"
		}
	]
}
```

# 4. S3에 배포하기

이제 배포를 해보겠습니다. 메이븐 커맨드인 'clean install deploy'를 하면 배포가 진행됩니다.
역시나 배포하면서도 이런저런 에러 메세지로 삽질을 하게 됩니다 @@.

삽질 1. 스프링 배포 플러그인이 서울과 프랑크푸르트 리전은 지원하지 않습니다. [두 리전이 암호화 처리 방식을 지원하지 않아서](http://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region) 그렇다고 합니다. 자세한 내용은 [깃헙 이슈](https://github.com/spring-projects/aws-maven/issues/48)에 올라가 있는 내용을 확인해주세요.

삽질 2. 배포 과정 중에 '_403 : AWS Error Code: AccessDenied, AWS Error Message: Access Denied_'를 보게 된다면 (1) 우선 ACCESS_ID/SECRET_KEY를 잘 설정했는지 확인해보시고, 그래도 똑같은 에러가 난다면 **(2)IAM에서 해당 계정이 S3 접근 권한이 있는지 확인** 해주시기 바랍니다. 두 번째 때문에 한 참을 뒤졌습니다..;

자, 이런저런 삽질을 거쳐서 배포를 성공했다면 S3에 가서 배포된 패키지를 확인할 수 있습니다.

![s3 배포 성공](/images/spring-boot-aws-deploy/s3-release.png)

# 5. EC2에서 실행하기

이제 EC2에서 톰캣을 실행해 확인해보도록 하겠습니다.
EC2 인스턴스를 (무료로..) 만들고, 콘솔에 접속합니다.

먼저 [메이븐을 설치](https://gist.github.com/sebsto/19b99f1fa1f32cae5d00 )합니다.

그리고 나서 [JDK를 8로 업그레이드](http://serverfault.com/questions/664643/how-can-i-upgrade-to-java-1-8-on-an-amazon-linux-server).

이제 S3에서 배포해둔 JAR를 다운로드 받습니다. 앞서 설명한 것처럼 [WGET으로 간단하게 받거나 AWS에서 제공하는 S3 CLI](http://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/AmazonS3.html)를 사용해도 됩니다.
저는 간단하게 WGET으로 받았습니다.

```console
wget https://s3-ap-northeast-1.amazonaws.com/app2release/snapshot/com/github/chanwookpark/aws-sandbox/0.0.1-SNAPSHOT/aws-sandbox-0.0.1-20170104.102302-1.jar
```

자, 이제 다운받은 디렉토리에서 아래 커맨드를 실행해 톰캣을 실행합니다.

```console
java -jar aws-sandbox-0.0.1-20170104.102302-1.jar -DaccessKey=... -DsecretKey=...
```

스프링 부트와 함께 스프링 클라우드를 함께 사용하고 있어서 ACCESS_ID와 SECRET_KEY를 전달하고 있습니다.

참고로 spring-cloud-aws를 EC2에 배포해 실행해보면 아래처럼 에러가 발생할 수 있습니다.

```console
...
exception; nested exception is com.amazonaws.AmazonServiceException: User: arn:aws:iam::077826988712:user/spring-aws is not authorized to perform: cloudformation:DescribeStackResources (Service: AmazonCloudFormation; Status Code: 403; Error Code: AccessDenied; Request ID: d60dfe3d-d3f8-11e6-b692-814b033851bc)
	at org.springframework.beans.factory.support.SimpleInstantiationStrategy.instantiate(SimpleInstantiationStrategy.java:189) ~[spring-beans-4.3.5.RELEASE.jar!/:4.3.5.RELEASE]
	at org.springframework.beans.factory.support.ConstructorResolver.instantiateUsingFactoryMethod(ConstructorResolver.java:588) ~[spring-beans-4.3.5.RELEASE.jar!/:4.3.5.RELEASE]
	... 110 common frames omitted
Caused by: com.amazonaws.AmazonServiceException: User: arn:aws:iam::077826988712:user/spring-aws is not authorized to perform: cloudformation:DescribeStackResources (Service: AmazonCloudFormation; Status Code: 403; Error Code: AccessDenied; Request ID: d60dfe3d-d3f8-11e6-b692-814b033851bc)
	at com.amazonaws.http.AmazonHttpClient.handleErrorResponse(AmazonHttpClient.java:1378) ~[aws-java-sdk-core-1.11.18.jar!/:na]
	at com.amazonaws.http.AmazonHttpClient.executeOneRequest(AmazonHttpClient.java:924) ~[aws-java-sdk-core-1.11.18.jar!/:na]
	at com.amazonaws.http.AmazonHttpClient.executeHelper(AmazonHttpClient.java:702) ~[aws-java-sdk-core-1.11.18.jar!/:na]
...
```

이럴 때는 cloudformation을 꺼줘야 합니다. 아직은 사용할 필요가 없어서 끄면 그만이라서 끄고 패스.

```properties
cloud.aws.stack.auto=false
```

마지막으로 EC2 콘솔에서 실행한 부트 프로그램의 포트를 열고 브라우저에서 헬로우월드 메시지를 확인하면 끝!

![the end](/images/spring-boot-aws-deploy/ok.png)

# 마무리하며

JAR가 배포되면 변경을 감지해 톰캣을 내렸다 올리는 정도의 스크립트를 작성하면 일단 공부를 위한 준비가 된 것 같습니다.
역시나 이번에도 느꼈지만 내가 필요한 무얼하기 위해 고민하고 실천해야 배우는 것도 많고 만족감도 높내요^^

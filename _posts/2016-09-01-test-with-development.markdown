---
layout: post
title:  "테스트 작성 경험 기록"
date:   2016-09-01 13:00:00 +0000
categories: test
---

1. 테스트 케이스 내에서는 루틴한 null처리나 타입 체킹을 해야할까?

아래 코드처럼,

```java
final Object dto = modelMap.get("categoryShop");
assertThat(dto).isNotNull();
final CategoryShopDto categoryShopDto = (CategoryShopDto) dto;
assertThat(categoryShopDto.getCategoryId()).isEqualTo(categoryId);
```

여기서 null체크 또는 타입 일치 여부 체크를 하지 말자는 뜻. 틀리면 에러가 발생하겠지..

```java
final CategoryShopDto dto = (CategoryShopDto) modelMap.get("categoryShop");
assertThat(dto.getCategoryId()).isEqualTo(categoryId);
assertThat(dto.getDisplayName()).isEqualTo(displayName);
assertThat(dto.getCategoryLevel()).isEqualTo(categoryLevel);
```

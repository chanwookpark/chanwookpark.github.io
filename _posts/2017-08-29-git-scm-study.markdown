---
layout: post
title:  "깃 공부(중)"
date:   2017-08-29 01:00:00 +0000
categories: Git
---

# 기록기록

깃은 커밋 시에 수정된 파일만 저장. 
로컬 저장소를 사용한다 
파일의 체크섬을 구하고 체크섬으로 관리 (40자 길이의 16진수 문자열)

깃 파일 상태 

1. Committed : 로컬DB에 커밋된 상태 
2. Modified : 수정했으나 커밋안된 상태 
3. Staged : 곧 커밋할 것이라고 표시한 상태 (?) 

깃 프로젝트의 상태

1. 디렉토리 : 프로젝트의 메타데이터와 객체DB 저장하는 공간 (.git 디렉토리) 
2. 워킹트리 : 특정 시점의 소스를 체크아웃 받은 버전 
3. Staging Area : 깃 디렉토리에 있는 단순한 파일인데, 곧 커밋할 정보를 관리 

수정한 파일을 다시 Staged 상태로 변경할 때도 git add를 사용한다 

한 파일이 동시에 Staged이면서 Modified일 수 있다.
git add로 수정사항을 체크하고 나서 다시 수정했다면 S이면서 M일 수 있다. -> IDE를 사용하니까 잘 모르는 점 
하지만 커밋할 때 -a를 넣으면 수정한 tracked 파일을 포함해서 커밋할 수 있음 

파일 삭제 시에는 git rm으로 삭제하면 깃 기록과 실제 파일이 모두 삭제됨.
파일을 직접 삭제하면 파일은 삭제되지만 깃에서는 Unstaged 상태가 됨.
그리고 rm을 날리면 그때 “delete 된 것으로 Staged 상태”가 된다

# 커맨드

git add 
git status
git status -s 
git diff 							Unstaged 상태 비교 (add 전) 
git diff --staged 또는 git diff —cached 	staged 상태와 비교 
git commit
git commit -m 
git rm 
git rm --cached Xxx				xxx 파일을 깃 관리 대상으로 하면 안 되는데 실수로 넣었을 때 사용 (패턴도 사용 가능) 
git mv Xxx Yyy						실제 파일도 이름이 같이 변경됨 

git log 
git log -p -2						각 커밋의 diff 결과를 같이 보여줌. 2, 3 주면 최근 2개, 3개를 보여줌. 
git log --stat						각 파일의 통계 정보를 보여줌 
git log --pretty=oneline				oneline, short, full, fuller에서 선택 
git log --pretty=format:"%h - %an, %ar : %s"
git log --pretty=format:"%h %s" --graph 
git log --since=2.weeks				다양한 날짜 조건 가능 
git log --author chanwook
git log --grep xxx					커밋 메시지에서 xxx가 포함된 커밋 조회 
git log --Sxxx						xxx가 포함된 커밋 조회 

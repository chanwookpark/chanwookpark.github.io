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

깃에서 되돌린 것은 다시 복구할 수 없으므로 주의!

저장소를 Clone 하면 자동으로 리모트 저장소를 'origin'이라는 이름으로 추가한다.

태그에는 Lightweight 태그와 Annotated 태그가 있다. 임시로 태그를 달아야 하는 게 아니라면 Annotated 태그로 달자.

브런치에서 작업 중에 staged 상태(그러니까 add되고 커밋됨)가 아니라면 브런치를 변경해서 워킹 디렉토리에 파일이 남아 있다!! 브런치를 변경해도 파일이 보인다는 뜻!!

fast-forward merge : 브런치 머즈 시에 포인터를 단순히 최신 커밋으로 이동

Rebase를 하든지, Merge를 하든지 최종 결과물은 같고 커밋 히스토리만 다르다는 것이 중요.

Rebase -> 브랜치의 변경사항을 순서대로 다른 브랜치에 적용하면서 합치고

Merge 의 -> 두 브랜치의 최종결과만을 가지고 합친다.

주의사항. 이미 공개 저장소에 Push 한 커밋을 Rebase 하지 마라!

생각해보면 rebase 해버리면 브런치의 커밋을 다시 마스터에 새로운 커밋으로 보낸다는 건데, 만약 브런치의 커밋을 브런치로 푸시했었고 이걸 어떤 동료가 받았었고, 이걸 동료가 고쳤는데, 그걸 모르고 마스터에 rebase 한 코드를 pull 받아버렸다면 엉망이 되버릴테니까..!!

깃 서버는 'Local, HTTP, SSH, Git' 4개 프로토콜을 사용할 수가 있다.
HTTP 프로토콜은 1.6.6을 기준으로 그전은 멍청한 HTTP, 이후는 스마트 HTTP라고 부른다.

# Github 사용

콘솔에서 push 푸시 사용 전 SSH 세팅 필요 - [Set up GitHub push with SSH keys](https://gist.github.com/developius/c81f021eb5c5916013dc)

# 커맨드

```
git add
git status
git status -s
git diff 							Unstaged 상태 비교 (add 전)
git diff --staged 또는 git diff —cached 	staged 상태와 비교
git commit
git commit -m
git rm
git rm --cached Xxx				xxx 파일을 깃 관리 대상으로 하면 안 되는데 실수로 넣었을 때 사용. --cached란 Staged 상태인 파일을 삭제한다는 의미. 이렇게 하면 파일은 남아 있고 커밋에서만 빠진다!
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
git log --abbrev-commit --pretty=oneline
git reflog                  자동으로 브랜치와 HEAD가 지난 몇 달 동안에 가리켰었던 커밋을 모두 기록
git log master..experiment  master에는 없고 experiment에만 있는 커밋

git commit --amend          이전 커밋 덮어쓰기 (메시지만 일수도 있고 파일까지 일 수도 있고..)
git reset HEAD Xxxx         깃 상태를 Unstaged로 변경 (파일 내용을 리셋하지 않는다)
git reset --soft HEAD^      최신 커밋을 다시 Staged로 변경
git checkout -- Xxx         파일 변경 내용을 처음 체크아웃 받았을 때의 버전으로 돌린다 (정확히 얘기하며 최근 수정된 커밋 이전?)

git remote -v               깃 리모트 저장소 이름과 단축URL 확인
git remote add {name} {repository url}
git fetch {remote name}     로컬에는 없는 파일을 가져오지만 자동으로 Merge 하지는 않음 (git pull과 다른 점..)
git push {remote name} {branch name}
git remote show {remote name}

git show --pretty="" --name-only 커밋ID    커밋ID의 파일 리스트 보여줌

git tag -a {태그이름} -m "{태그설명}"   Annotated 태그 생성
git tag -a {태그이름} {커밋체크섬}       예전 커밋으로 태그따기 가능
git push origin {태그이름}            태그를 원격 저장소로 푸시하기
git push origin --tags              여러 개 동시에 태그 푸시하고 싶을 때 사용
git checkout -b {브런치이름} {태그이름}  태그는 checkout할 수 없고 브런치를 새로 생성해서 받아야 함

git log --oneline --decorate        현재 브런치가 어떤 커밋을 가리키고 있는지 확인
git branch {브런치이름}                브런치 생성
git checkout {브런치이름}              브런치로 이동
git branch -v                       최신 커밋이랑 보여주기
git branch --merged
git branch --no-merged

git rebase --onto master server client  'client 브런치''의 변경 사항을 master와 server에서 변경 사항을 빼고 뽑아줌 -> master에 client의 변경 사항만 커밋하고 시플 때! -> 그 이후 master로 가서 git merge client 날려줌
```

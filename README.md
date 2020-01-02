# koolside

<p align="center">
  <a href="https://greasyfork.org/ko/scripts/394469-koolside" target="_blank"><img src="docs/logo.png" alt="KOOLSIDE"></a>
  <a href="https://github.com/toriato/koolside/blob/master/LICENSE" target="_blank"><img alt="GitHub" src="https://img.shields.io/github/license/toriato/koolside?label=%EB%9D%BC%EC%9D%B4%EC%84%A0%EC%8A%A4&style=flat-square"></a>
  <a href="https://github.com/toriato/koolside/actions" target="_blank"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/toriato/koolside/Release?label=%EB%B9%8C%EB%93%9C&style=flat-square"></a>
  <a href="https://github.com/toriato/koolside/releases" target="_blank"><img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/toriato/koolside?label=%EB%A6%B4%EB%A6%AC%EC%A6%88&style=flat-square"></a>
<p>

## 주의
미완성 유저스크립트입니다. 크롬과 파이어폭스에서 Violentmonkey 을 사용해 테스트를 진행했기 때문에 다른 환경에선 오류가 발생할 수 있습니다. 브라우저 관계없이 사용 중 오류가 발생한다면 [이슈 탭](https://github.com/toriato/koolside/issues)에 사용하는 브라우저와 유저스크립트 확장 기능 등 기술 관련 정보를 채워 올려주세요.

## 기능
- [ ] ~~유동 아이피 정보 (통신사, 프록시 등)~~
- [x] 실시간 새로고침
  - [x] 제목 또는 내용 정규표현식 일치 시 [푸시 알림](https://pushjs.org/) 보내기
- [x] 게시글 내용 미리보기
- [x] 요소 숨기기 (로고, 광고 등)
- [x] 사용자 글꼴 및 글자 크기
- [x] 사용자 CSS, [LESS](http://lesscss.org/)
- [ ] ~~사용자 자바스크립트~~
- [x] 설정 내보내기 & 불러오기

## 설치

### 확장 기능
- [Firefox](https://addons.mozilla.org/ko/firefox/addon/violentmonkey)
- [Chrome, Opera](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag)

### 유저스크립트 추가
https://greasyfork.org/ko/scripts/394469-koolside

## 개발
```
$ git clone https://github.com/toriato/koolside.git
$ cd koolside
$ npm install
$ npm run watch
```

## 자주 묻는 질문

### 오른쪽 버튼을 눌렀을 때 기존 메뉴가 안나와요
두 번 클릭하면 기존 메뉴 나옵니다.
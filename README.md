# Edwin 시장 예측 브리프

거시경제, 금리, 원자재, 주식시장을 다루는 정적 리서치 대시보드입니다.

## 구성

- `index.html` — 대시보드 화면
- `styles.css` — 디자인 토큰과 반응형 UI
- `app.js` — 브리프 렌더링과 아카이브 라우팅
- `data/reports.json` — 브리프 원본 데이터
- `data/economic-calendar.json` — 한국·미국 경제지표 발표 일정과 이전치·예상치·실제치
- `.github/workflows/pages.yml` — GitHub Pages 배포
- `.github/workflows/telegram.yml` — 브리프 갱신 후 Telegram 발송

## 브리프 발행

`data/reports.json`에 브리프 객체를 추가하고 `latest`를 해당 날짜로 변경합니다. 최신 화면과 아카이브는 자동으로 갱신됩니다.

아카이브 링크는 `?date=YYYY-MM-DD` 형식을 사용하므로 날짜별 HTML 파일을 만들 필요가 없습니다.

각 브리프에는 `checkedAt`과 `freshnessNote`를 기록합니다. 화면의 주요 지표는 실시간 시세가 아니라 `checkedAt` 시점에 확인한 참고값이며, 최신 가격과 차이가 날 수 있습니다.

## 경제지표 일정 운영

`data/economic-calendar.json`은 한국은행·국가데이터처·미국 노동통계국(BLS)·미국 경제분석국(BEA)의 공식 발표 일정을 기준으로 관리합니다.

- `previous` — 공식 이전 발표값을 확인한 뒤 입력
- `forecast` — 신뢰할 수 있는 시장 컨센서스 공급원에서 확보한 경우에만 입력하며, 연결 전에는 `null` 유지
- `actual` — 공식 발표가 나온 뒤에만 입력
- `status` — 발표 전 `scheduled`, 발표값 반영 후 `released`
- `checkedAt` — 일정 데이터를 마지막으로 확인한 시각

현재는 수동 검수 방식입니다. 상시 실행 서버 없이도 GitHub Actions의 예약 실행으로 공식 일정과 실제치를 확인해 JSON을 갱신하고 Pages를 재배포할 수 있습니다. 다만 발표 직후 수분 내 반영, 유료 컨센서스 API 키 보호, 재시도·변경 이력 관리가 필요해지면 서버리스 작업과 저장소를 추가하는 방식이 적합합니다.

## GitHub Pages 배포

사이트는 `main` 브랜치 변경 시 GitHub Actions를 통해 아래 주소로 배포됩니다.

- `https://edwin-space.github.io/news/`

저장소는 공개 상태이며 **Settings → Pages → Source**는 **GitHub Actions**로 설정되어 있습니다. 문서 기준 상대경로를 사용하므로 스타일, 스크립트, 브리프 데이터, 아카이브 링크가 프로젝트 경로 `/news/`에서 정상 작동합니다.

Telegram 링크에는 아래 GitHub Actions 저장소 변수를 사용합니다.

- `REPORT_SITE_URL=https://edwin-space.github.io/news/`

## Telegram

BotFather에서 Telegram 봇을 만든 뒤 아래 값을 GitHub Actions 저장소 Secret으로 등록합니다.

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Telegram 워크플로는 `main`의 `data/reports.json`이 변경될 때 실행되며 GitHub Actions에서 수동으로 실행할 수도 있습니다.

봇 토큰이나 채팅 ID를 저장소에 직접 커밋하지 마세요.

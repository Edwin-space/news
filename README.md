# Edwin 시장 예측 브리프

거시경제, 금리, 원자재, 주식시장을 다루는 정적 리서치 대시보드입니다.

## 구성

- `index.html` — 대시보드 화면
- `styles.css` — 디자인 토큰과 반응형 UI
- `app.js` — 브리프 렌더링과 아카이브 라우팅
- `data/reports.json` — 브리프 원본 데이터
- `.github/workflows/pages.yml` — GitHub Pages 배포
- `.github/workflows/telegram.yml` — 브리프 갱신 후 Telegram 발송

## 브리프 발행

`data/reports.json`에 브리프 객체를 추가하고 `latest`를 해당 날짜로 변경합니다. 최신 화면과 아카이브는 자동으로 갱신됩니다.

아카이브 링크는 `?date=YYYY-MM-DD` 형식을 사용하므로 날짜별 HTML 파일을 만들 필요가 없습니다.

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

const $ = (selector) => document.querySelector(selector);

function renderMetric(metric) {
  return `<article class="metric">
    <div class="metric-label">${metric.label}</div>
    <div class="metric-value">${metric.value}</div>
    <div class="metric-meta ${metric.tone || 'flat'}">${metric.meta}</div>
  </article>`;
}

function renderScenario(item) {
  return `<article class="scenario-card">
    <h3>${item.asset}</h3>
    <dl>
      <dt>기본</dt><dd>${item.base}</dd>
      <dt>상승</dt><dd class="up">${item.bull}</dd>
      <dt>하락</dt><dd class="down">${item.bear}</dd>
    </dl>
  </article>`;
}

function renderArchive(report) {
  return `<a class="archive-item" href="?date=${report.date}#latest">
    <time>${report.date}</time>
    <strong>${report.title}</strong>
    <span>브리프 보기 →</span>
  </a>`;
}

function renderReport(report, reports) {
  document.title = `${report.date} · Edwin 시장 예측 브리프`;
  $('#report-date').textContent = report.label;
  $('#report-title').textContent = report.title;
  $('#report-summary').textContent = report.summary;
  $('#hero-note').textContent = report.note;
  $('#metrics').innerHTML = report.metrics.map(renderMetric).join('');
  $('#macro-copy').innerHTML = report.macro.map(text => `<p>${text}</p>`).join('');
  $('#priority-list').innerHTML = report.priority.map(text => `<li>${text}</li>`).join('');
  $('#scenario-grid').innerHTML = report.scenarios.map(renderScenario).join('');
  $('#equity-copy').innerHTML = report.equity.map(text => `<p>${text}</p>`).join('');
  $('#archive-list').innerHTML = reports.map(renderArchive).join('');
}

async function init() {
  try {
    const response = await fetch('./data/reports.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const requestedDate = new URLSearchParams(location.search).get('date');
    const report = data.reports.find(item => item.date === requestedDate)
      || data.reports.find(item => item.date === data.latest)
      || data.reports[0];

    if (!report) throw new Error('등록된 브리프가 없습니다.');
    renderReport(report, data.reports);
  } catch (error) {
    $('#report-date').textContent = '브리프를 표시할 수 없습니다.';
    $('#report-title').textContent = '시장 예측 브리프를 불러오지 못했습니다.';
    $('#report-summary').textContent = '리포트 데이터와 배포 설정을 확인해 주세요.';
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', init);

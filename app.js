const $ = (selector) => document.querySelector(selector);

let economicEvents = [];

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

function renderEconomicEvent(event) {
  const statusLabel = event.status === 'released' ? '발표 완료' : '발표 예정';
  const hasActual = event.actual !== null && event.actual !== undefined;
  const actual = hasActual ? event.actual : '발표 대기';
  const forecast = event.forecast ?? '미입력';
  const previous = event.previous ?? '확인 필요';

  return `<article class="economic-event">
    <div class="event-topline">
      <span class="country-badge ${event.country.toLowerCase()}">${event.countryLabel}</span>
      <span class="impact-badge ${event.impact}">${event.impactLabel}</span>
      <span class="status-badge ${event.status}">${statusLabel}</span>
    </div>
    <time datetime="${event.releaseAt}">${event.dateLabel} · ${event.timeLabel}</time>
    <h3>${event.indicator}</h3>
    <p class="event-period">기준 기간 · ${event.period}</p>
    <p class="event-detail">${event.detail}</p>
    <dl class="event-values">
      <div><dt>이전치</dt><dd>${previous}</dd></div>
      <div><dt>시장 예상</dt><dd>${forecast}</dd></div>
      <div><dt>실제치</dt><dd class="${hasActual ? 'actual-released' : ''}">${actual}</dd></div>
    </dl>
    <a class="source-link" href="${event.sourceUrl}" target="_blank" rel="noopener noreferrer">${event.source} 일정 확인 →</a>
  </article>`;
}

function renderEconomicCalendar(country = 'all') {
  const filtered = country === 'all'
    ? economicEvents
    : economicEvents.filter(event => event.country === country);

  $('#economic-calendar-list').innerHTML = filtered.length
    ? filtered.map(renderEconomicEvent).join('')
    : '<p class="calendar-empty">표시할 경제지표 일정이 없습니다.</p>';
}

function setupCalendarFilters() {
  document.querySelectorAll('.calendar-filter').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.calendar-filter').forEach(item => item.classList.remove('is-active'));
      button.classList.add('is-active');
      renderEconomicCalendar(button.dataset.country);
    });
  });
}

function renderReport(report, reports) {
  document.title = `${report.date} · Edwin 시장 예측 브리프`;
  $('#report-date').textContent = report.label;
  $('#data-checked-at').textContent = report.checkedAt;
  $('#data-freshness-note').textContent = report.freshnessNote;
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
    const [response, calendarResponse] = await Promise.all([
      fetch('./data/reports.json', { cache: 'no-store' }),
      fetch('./data/economic-calendar.json', { cache: 'no-store' }).catch(() => null)
    ]);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const requestedDate = new URLSearchParams(location.search).get('date');
    const report = data.reports.find(item => item.date === requestedDate)
      || data.reports.find(item => item.date === data.latest)
      || data.reports[0];

    if (!report) throw new Error('등록된 브리프가 없습니다.');
    renderReport(report, data.reports);

    if (calendarResponse?.ok) {
      const calendarData = await calendarResponse.json();
      economicEvents = calendarData.events;
      $('#calendar-checked-at').textContent = calendarData.checkedAt;
      renderEconomicCalendar();
      setupCalendarFilters();
    } else {
      $('#economic-calendar-list').innerHTML = '<p class="calendar-empty">경제지표 일정을 불러오지 못했습니다.</p>';
    }
  } catch (error) {
    $('#report-date').textContent = '브리프를 표시할 수 없습니다.';
    $('#report-title').textContent = '시장 예측 브리프를 불러오지 못했습니다.';
    $('#report-summary').textContent = '리포트 데이터와 배포 설정을 확인해 주세요.';
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', init);

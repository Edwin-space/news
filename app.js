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

function renderRate(item) {
  return `<div class="rate-item">
    <span>${item.label}</span>
    <strong>${item.value}</strong>
    <small>${item.note}</small>
  </div>`;
}

function renderDetailSection(section) {
  const levels = section.levels
    ? `<dl class="detail-levels">
        <div><dt>기본 구간</dt><dd>${section.levels.base}</dd></div>
        <div><dt>상승 확인</dt><dd class="up">${section.levels.bull}</dd></div>
        <div><dt>하락 확인</dt><dd class="down">${section.levels.bear}</dd></div>
      </dl>`
    : '';

  return `<article class="detail-section">
    <div class="detail-section-header">
      <div><span>${section.eyebrow}</span><h3>${section.title}</h3></div>
      <strong>${section.snapshot}</strong>
    </div>
    <div class="prose">${section.paragraphs.map(text => `<p>${text}</p>`).join('')}</div>
    ${levels}
  </article>`;
}

function renderEventFocus(focus) {
  if (!focus) {
    $('#event-focus').hidden = true;
    return;
  }

  $('#event-focus').hidden = false;
  $('#event-focus-content').innerHTML = `<article class="focus-card">
    <div class="focus-summary">
      <div><span>발표 시각</span><strong>${focus.time}</strong></div>
      <div><span>시장 예상</span><strong>${focus.forecast}</strong></div>
      <div><span>이전치</span><strong>${focus.previous}</strong></div>
    </div>
    <h3>${focus.title}</h3>
    <p class="focus-intro">${focus.intro}</p>
    <div class="focus-body">
      <div>
        <h4>함께 확인할 세부 항목</h4>
        <ul>${focus.watchPoints.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>
      <div>
        <h4>발표 결과별 시장 경로</h4>
        <dl class="focus-scenarios">
          ${focus.scenarios.map(item => `<div><dt>${item.label}</dt><dd>${item.path}</dd></div>`).join('')}
        </dl>
      </div>
    </div>
    <a class="source-link" href="${focus.sourceUrl}" target="_blank" rel="noopener noreferrer">${focus.source} 공식 일정 확인 →</a>
  </article>`;
}

function renderMarketClose(item) {
  return `<div class="market-close-item">
    <span>${item.label}</span>
    <strong>${item.value}</strong>
    <small class="${item.tone || 'flat'}">${item.change}</small>
  </div>`;
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

  const watchPoints = event.watchPoints?.length
    ? `<div class="event-watch"><strong>세부 확인</strong><ul>${event.watchPoints.map(item => `<li>${item}</li>`).join('')}</ul></div>`
    : '';
  const marketImpact = event.marketImpact
    ? `<p class="event-impact"><strong>시장 영향</strong>${event.marketImpact}</p>`
    : '';

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
    ${watchPoints}
    ${marketImpact}
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
  $('#data-source-window').textContent = report.sourceWindow || '';
  $('#report-title').textContent = report.title;
  $('#report-summary').textContent = report.summary;
  $('#hero-note').textContent = report.note;
  $('#metrics').innerHTML = report.metrics.map(renderMetric).join('');
  $('#macro-copy').innerHTML = report.macro.map(text => `<p>${text}</p>`).join('');
  $('#rate-grid').innerHTML = (report.rates || []).map(renderRate).join('');
  $('#priority-list').innerHTML = report.priority.map(text => `<li>${text}</li>`).join('');
  const detailSections = report.detailSections || [];
  $('#detailed-analysis').hidden = !detailSections.length;
  $('#detail-section-list').innerHTML = detailSections.map(renderDetailSection).join('');
  renderEventFocus(report.eventFocus);
  $('#scenario-grid').innerHTML = report.scenarios.map(renderScenario).join('');
  $('#market-close-grid').innerHTML = (report.marketClose || []).map(renderMarketClose).join('');
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

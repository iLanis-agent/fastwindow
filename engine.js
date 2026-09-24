// FastWindow engine - intermittent fasting math (no DOM)
(function (root) {
  'use strict';

  var HOUR = 3600000;

  var PROTOCOLS = [
    { id: '14:10', fastHours: 14, label: '14:10 - gentle' },
    { id: '16:8',  fastHours: 16, label: '16:8 - classic' },
    { id: '18:6',  fastHours: 18, label: '18:6 - steady' },
    { id: '20:4',  fastHours: 20, label: '20:4 - warrior' },
    { id: '23:1',  fastHours: 23, label: 'OMAD - one meal a day' }
  ];

  function protocolById(id) {
    for (var i = 0; i < PROTOCOLS.length; i++) if (PROTOCOLS[i].id === id) return PROTOCOLS[i];
    return null;
  }

  // A fast: {id, startedAt ISO, fastHours, endedAt ISO|null, completed: bool}
  function fastEnd(startedAt, fastHours) {
    return new Date(new Date(startedAt).getTime() + fastHours * HOUR);
  }

  // Live status for an open fast. state: 'fasting' | 'eating' (target reached)
  function status(fast, now) {
    var end = fastEnd(fast.startedAt, fast.fastHours);
    var elapsedMs = now.getTime() - new Date(fast.startedAt).getTime();
    var targetMs = fast.fastHours * HOUR;
    var pct = Math.min(100, Math.round(elapsedMs / targetMs * 100));
    var leftMin = Math.round((end.getTime() - now.getTime()) / 60000);
    return {
      state: leftMin > 0 ? 'fasting' : 'eating',
      pct: pct,
      minutesLeft: Math.max(0, leftMin),
      overtimeMin: Math.max(0, -leftMin),
      endsAt: end,
      elapsedHours: Math.round(elapsedMs / HOUR * 10) / 10
    };
  }

  function fmtDuration(min) {
    var sign = min < 0 ? '-' : '';
    var a = Math.abs(Math.round(min));
    var h = Math.floor(a / 60), m = a % 60;
    return sign + (h > 0 ? h + 'h ' : '') + m + 'm';
  }

  // History stats over completed fasts.
  function history(fasts) {
    var done = fasts.filter(function (f) { return f.completed; });
    var totalH = 0, longestH = 0;
    done.forEach(function (f) {
      var h = (new Date(f.endedAt).getTime() - new Date(f.startedAt).getTime()) / HOUR;
      totalH += h;
      if (h > longestH) longestH = h;
    });
    return {
      completed: done.length,
      totalHours: Math.round(totalH * 10) / 10,
      avgHours: done.length ? Math.round(totalH / done.length * 10) / 10 : 0,
      longestHours: Math.round(longestH * 10) / 10
    };
  }

  // Streak: consecutive calendar days (ending today/yesterday) with at least one completed fast.
  function streak(fasts, today) {
    var days = {};
    fasts.forEach(function (f) {
      if (f.completed) days[new Date(f.endedAt).toDateString()] = true;
    });
    var s = 0;
    for (var d = 0; d < 400; d++) {
      var day = new Date(today.getTime());
      day.setDate(day.getDate() - d);
      if (days[day.toDateString()]) s++;
      else if (d === 0) continue; // today may still be in progress
      else break;
    }
    return s;
  }

  var api = { PROTOCOLS: PROTOCOLS, protocolById: protocolById, fastEnd: fastEnd,
    status: status, fmtDuration: fmtDuration, history: history, streak: streak };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FastEngine = api;
})(typeof self !== 'undefined' ? self : this);

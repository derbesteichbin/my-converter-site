// One log line per finished CloudConvert job, so real processing cost can be
// compared with what the user was charged. Search the server logs for
// "[cc-cost]"; each line is JSON:
//
//   { tool, jobId, ccJobId, seconds, creditsCharged, ccCredits,
//     tasks: [{ name, operation, credits, secs }] }
//
// ccCredits is what CloudConvert itself billed for the job (the sum of its
// tasks' `credits`); `secs` is each task's wall-clock processing time.
// Logging must never break a conversion, so every failure here is swallowed.

function logCloudConvertCost(finishedJob, meta = {}) {
  try {
    const tasks = (finishedJob?.tasks || []).map((t) => ({
      name: t.name,
      operation: t.operation,
      credits: t.credits ?? null,
      secs: t.started_at && t.ended_at
        ? Math.round((new Date(t.ended_at) - new Date(t.started_at)) / 100) / 10
        : null,
    }));
    const ccCredits = tasks.reduce((sum, t) => sum + (Number(t.credits) || 0), 0);
    console.log('[cc-cost] ' + JSON.stringify({ ...meta, ccJobId: finishedJob?.id || null, ccCredits, tasks }));
  } catch { /* never let logging fail a job */ }
}

module.exports = { logCloudConvertCost };

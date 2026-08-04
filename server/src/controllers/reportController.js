const reportService = require('../services/reportService');

function validRange(query) {
  const date = /^\d{4}-\d{2}-\d{2}$/;
  return (!query.startDate && !query.endDate) || (date.test(query.startDate) && date.test(query.endDate) && query.startDate <= query.endDate);
}
async function dashboard(request, response, next) { try { response.json(await reportService.getDashboardReport(request.user)); } catch (error) { next(error); } }
async function analytics(request, response, next) { try { if (!validRange(request.query)) return response.status(400).json({ message: 'Provide a valid custom date range.' }); response.json(await reportService.getAnalytics(request.user, request.query)); } catch (error) { next(error); } }
module.exports = { dashboard, analytics };

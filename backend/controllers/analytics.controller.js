const Analytics = require("../models/analytics.model");

exports.monthlyRevenueReport = async (req, res, next) => {
  // Check whether user has sufficient rights
  if (req.role != "teacher") return res.status(401).end();

  // Generate report
  try {
    const [report] = await Analytics.generateMonthlyRevenueReport();
    return res.status(200).json(report);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

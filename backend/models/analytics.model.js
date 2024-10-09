const db = require("../util/db");

module.exports = class Analytics {
  static generateMonthlyRevenueReport() {
    return db.execute(
      `
      SELECT 
      DATE_FORMAT(start, '%m.%Y') AS month_year,
      SUM(price) AS total_revenue
      FROM 
          classes
      WHERE 
          isCancelled = false 
          AND isPaid = true
      GROUP BY 
          month_year
      ORDER BY 
          STR_TO_DATE(CONCAT('01.', DATE_FORMAT(start, '%m.%Y')), '%d.%m.%Y');
      `
    );
  }
};

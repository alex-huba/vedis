const db = require("../util/db");

module.exports = class Analytics {
  static generateMonthlyRevenueReport() {
    return db.execute(
      `
        SELECT 
          DATE_FORMAT(STR_TO_DATE(start, '%Y-%m-%dT%H:%i:%s'), '%m.%Y') AS month_year,
          SUM(price) AS total_revenue
        FROM 
            classes
        WHERE 
            cancelled = false AND isPaid = true
        GROUP BY 
            month_year
        ORDER BY 
            STR_TO_DATE(CONCAT('01.', DATE_FORMAT(STR_TO_DATE(start, '%Y-%m-%dT%H:%i:%s'), '%m.%Y')), '%d.%m.%Y');
      `
    );
  }
};

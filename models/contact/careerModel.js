const db = require('../../config/db');

const Career = {
  submitApplication: (applicationData, callback) => {
    const { name, email, phone, position, startDate, resumeLink } = applicationData;

    // Query to check if the email already exists
    const checkEmailQuery = "SELECT * FROM oneclick_careers WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, emailResults) => {
      if (err) {
        return callback(err);
      }

      if (emailResults.length > 0) {
        const lastApplication = emailResults[0];
        const previousStartDate = new Date(lastApplication.startDate);
        const currentDate = new Date();
        const timeDifference = currentDate - previousStartDate;
        const threeMonthsInMilliseconds = 3 * 30 * 24 * 60 * 60 * 1000; // Approx 3 months

        if (timeDifference < threeMonthsInMilliseconds) {
          const nextEligibleDate = new Date(
            previousStartDate.getTime() + threeMonthsInMilliseconds
          );
return callback(null, { error: true, message: `You can re-apply after ${nextEligibleDate.toLocaleDateString()}` });
        }
      }

      // Insert the new application
      const insertQuery = "INSERT INTO oneclick_careers (name, email, phone, position, startDate, resumeLink) VALUES (?, ?, ?, ?, ?, ?)";
      const values = [name, email, phone, position, startDate, resumeLink];

      db.query(insertQuery, values, callback);
    });
  },

  fetchApplications: (callback) => {
    const query = "SELECT * FROM oneclick_careers ORDER BY id DESC";
    db.query(query, callback);
  },

  deleteApplication: (id, callback) => {
    const query = "DELETE FROM oneclick_careers WHERE id = ?";
    db.query(query, [id], callback);
  }
};

module.exports = Career;

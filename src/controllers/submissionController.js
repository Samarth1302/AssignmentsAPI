const pool = require("../module/pool");

async function submitAssignment(req, res) {
  try {
    const { assignment_id, content } = req.body;

    const student_id = req.user.userId;

    const assignmentCheckQuery = "SELECT * FROM assignments WHERE id = $1";
    const assignmentCheckValues = [assignment_id];
    const assignmentCheckResult = await pool.query(
      assignmentCheckQuery,
      assignmentCheckValues
    );

    if (assignmentCheckResult.rows.length === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const submissionQuery =
      "INSERT INTO submissions (assignment_id, student_id, submission_text) VALUES ($1, $2, $3) RETURNING *";
    const submissionValues = [assignment_id, student_id, content];
    const submissionResult = await pool.query(
      submissionQuery,
      submissionValues
    );

    const newSubmission = submissionResult.rows[0];
    res.status(201).json(newSubmission);
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getAllSubmissions(req, res) {
  try {
    const { userId, role } = req.user;

    if (role === "teacher") {
      const assignmentQuery =
        "SELECT id FROM assignments WHERE teacher_id = $1";
      const assignmentValues = [userId];
      const assignmentResult = await pool.query(
        assignmentQuery,
        assignmentValues
      );

      if (assignmentResult.rows.length === 0) {
        return res.status(201).json("No assignments posted");
      }
      const assignmentIds = assignmentResult.rows.map((row) => row.id);

      const query =
        "SELECT * FROM submissions WHERE assignment_id = ANY($1::int[])";
      const values = [assignmentIds];
      const result = await pool.query(query, values);
      const submissions = result.rows;
      res.json(submissions);
    } else {
      const query = "SELECT * FROM submissions WHERE student_id = $1";
      const values = [userId];
      const result = await pool.query(query, values);

      const submissions = result.rows;
      res.json(submissions);
    }
  } catch (error) {
    console.error("Error retrieving submissions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function gradeSubmission(req, res) {
  try {
    const { submission_id } = req.params;
    const { score } = req.body;
    const { userId, role } = req.user;

    if (role !== "teacher") {
      return res.status(403).json({ error: "Permission denied" });
    }

    const submissionQuery =
      "SELECT * FROM submissions s JOIN assignments a ON s.assignment_id = a.id WHERE s.id = $1 AND a.teacher_id = $2";

    const submissionValues = [submission_id, userId];
    const submissionResult = await pool.query(
      submissionQuery,
      submissionValues
    );

    if (submissionResult.rows.length === 0) {
      return res.status(403).json({ error: "No submissions yet" });
    }

    const query = "UPDATE submissions SET score = $1 WHERE id = $2 RETURNING *";
    const values = [score, submission_id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Submission not found" });
    }
    const gradedSubmission = result.rows[0];
    res.json(gradedSubmission);
  } catch (error) {
    console.error("Error grading submission:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  submitAssignment,
  getAllSubmissions,
  gradeSubmission,
};

const pool = require("../module/pool");
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

async function createAssignment(req, res) {
  try {
    const { title, description, due_date } = req.body;

    const { userId, role } = req.user;

    if (role !== "teacher") {
      return res.status(403).json({ error: "Permission denied" });
    }

    const query =
      "INSERT INTO assignments (title, description, due_date, teacher_id) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [title, description, due_date, userId];

    const result = await pool.query(query, values);
    const newAssignment = result.rows[0];

    // const emailSubject = "New Assignment Created";
    // const emailMessage = `A new assignment "${title}" has been created. Please check your assignments.`;

    // const student_query = "SELECT email FROM users WHERE role = 'student'";
    // const student_result = await pool.query(student_query);
    // const studentEmails = student_result.rows;

    // for (const studentEmail of studentEmails) {
    //   const mailOptions = {
    //     from: process.env.EMAIL_USER,
    //     to: studentEmail,
    //     subject: emailSubject,
    //     text: emailMessage,
    //   };

    //   transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //       console.error("Error sending email:", error);
    //     } else {
    //       console.log("Email sent:", info.response);
    //     }
    //   });
    // }

    res.status(201).json(newAssignment);
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getAllAssignments(req, res) {
  try {
    let query = "SELECT * FROM assignments WHERE 1=1";
    const { title, teacher_id, due_date } = req.query;
    if (title) {
      query += ` AND title = '${title}'`;
    }
    if (teacher_id) {
      query += ` AND teacher_id = ${teacher_id}`;
    }
    if (due_date) {
      query += ` AND due_date = '${due_date}'`;
    }

    const result = await pool.query(query);
    const assignments = result.rows;

    res.json(assignments);
  } catch (error) {
    console.error("Error retrieving assignments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateAssignment(req, res) {
  try {
    const { id } = req.params;
    const { title, description, due_date } = req.body;
    const { userId, role } = req.user;

    if (role !== "teacher") {
      return res.status(403).json({ error: "Permission denied" });
    }

    const assignmentQuery =
      "SELECT * FROM assignments WHERE id = $1 AND teacher_id = $2";
    const assignmentValues = [id, userId];
    const assignmentResult = await pool.query(
      assignmentQuery,
      assignmentValues
    );
    if (assignmentResult.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Assignment not found or permission denied" });
    }

    const query =
      "UPDATE assignments SET title = $1, description = $2, due_date = $3 WHERE id = $4 RETURNING *";
    const values = [title, description, due_date, id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Assignment not found" });
    } else {
      const updatedAssignment = result.rows[0];
      res.json(updatedAssignment);
    }
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteAssignment(req, res) {
  try {
    const { id } = req.params;

    const { userId, role } = req.user;

    if (role !== "teacher") {
      return res.status(403).json({ error: "Permission denied" });
    }

    const assignmentQuery =
      "SELECT * FROM assignments WHERE id = $1 AND teacher_id = $2";
    const assignmentValues = [id, userId];

    const assignmentResult = await pool.query(
      assignmentQuery,
      assignmentValues
    );

    if (assignmentResult.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Assignment not found or permission denied" });
    }

    const query = "DELETE FROM assignments WHERE id = $1";
    const values = [id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Assignment not found" });
    } else {
      res.status(204).json({ message: "Assignment deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createAssignment,
  getAllAssignments,
  updateAssignment,
  deleteAssignment,
};

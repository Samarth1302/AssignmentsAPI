const jwt = require("jsonwebtoken");
const pool = require("../module/pool");
const bcrypt = require("bcrypt");
require("dotenv").config();

async function register(req, res) {
  const { email, username, password, role } = req.body;

  if (!username || !password || !role || !email) {
    return res.status(400).json({ error: "Fields cannot be empty" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user_query = "SELECT * FROM users WHERE username = $1";
    const user_values = [username];
    const user_result = await pool.query(user_query, user_values);
    if (user_result.rows.length != 0) {
      return res
        .status(401)
        .json({ error: "Username already exists. Try something else" });
    }

    const query =
      "INSERT INTO users (email,username, password,role) VALUES ($1, $2, $3, $4) RETURNING id";
    const values = [email, username, hashedPassword, role];

    const result = await pool.query(query, values);

    if (result.rows.length === 1) {
      const userId = result.rows[0].id;
      res.status(201).json({ message: "Registration successful", userId });
    } else {
      res.status(500).json({ error: "Failed to register user" });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function authToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(400).json({ error: "Invalid token" });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const query = "SELECT * FROM users WHERE username = $1";
    const values = [username];

    const result = await pool.query(query, values);

    if (result.rows.length === 1) {
      const user = result.rows[0];
      const passwordMatched = await bcrypt.compare(password, user.password);

      if (passwordMatched) {
        const token = jwt.sign(
          {
            email: user.email,
            username: user.username,
            userId: user.id,
            role: user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "3h" }
        );
        res.json({ token });
      } else {
        res.status(401).json({ error: "Password doesn't match" });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  register,
  login,
  authToken,
};

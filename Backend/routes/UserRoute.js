const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust the path if necessary
const userRouter = require("express").Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Replace with your actual secret key
const Task = require("../models/Task");
const BlacklistedToken = require("../models/BlacklistedToken");
const authenticateToken = require("../middleware/authtoken");

// get all developer
userRouter.get("/developers", authenticateToken, async (req, res) => {
  try {
    const developers = await User.find({ role: "developer" });
    res.status(200).json(developers);
  } catch (error) {
    console.error("Error fetching developers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// countDeveloper
userRouter.get("/count", authenticateToken, async (req, res) => {
  try {
    const developerCount = await User.countDocuments({ role: "developer" });
    res.status(200).json({ count: developerCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Backend route to verify current password
userRouter.post("/verifyPassword", authenticateToken, async (req, res) => {
  try {
    const { currentPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);

    if (match) {
      res.status(200).json({ success: true });
    } else {
      res
        .status(401)
        .json({ success: false, error: "Incorrect current password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error verifying password" });
  }
});

// Backend route to change password
userRouter.put("/changePassword", authenticateToken, async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error updating password" });
  }
});

// get all users
userRouter.get("/", authenticateToken, async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to delete a user
userRouter.delete("/:id", authenticateToken, async (req, res) => {
  const userId = req.params.id;
  try {
    // Find the user by ID and delete them
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update tasks to remove the user from the assignedTo field
    await Task.updateMany(
      { assignedTo: userId },
      { $pull: { assignedTo: userId } }
    );

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// find usery id
userRouter.get("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user" });
  }
});

// Login Route
userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("Login attempt:", { username, password }); // Debugging

    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found"); // Debugging

      return res.status(400).send({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.send({ token, role: user.role });
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
});

// logout
userRouter.post("/logout", authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).send({ error: "No token provided" });
    }

    // Decode the token to get the expiration time
    const decoded = jwt.decode(token);

    // Add the token to the blacklist with its expiration time
    const blacklistedToken = new BlacklistedToken({
      token: token,
      expiresAt: new Date(decoded.exp * 1000), // Convert to milliseconds
    });

    await blacklistedToken.save();

    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Register Route (Optional)
userRouter.post("/register", async (req, res) => {
  const { username, fname, lname, role, password } = req.body;

  try {
    // Generate the next sequence for user id

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      fname,
      lname,
      role,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res
      .status(201)
      .json({ message: "Developer created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = userRouter;

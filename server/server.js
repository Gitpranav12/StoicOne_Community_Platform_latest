// updated 17-09
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");
const LoginRoute = require("./routes/login");
const tagsRoutes = require("./routes/tags");
const questionRoutes = require("./routes/questionRoutes"); // Added missing route from second code
const userProfile = require("./routes/userProfile.js");
const departments = require("./routes/departments.js");
const collectives = require("./routes/collectives.js");
const usersRoutes = require("./routes/users");
const adminsRoutes = require("./routes/admin");
const notifications = require("./routes/notificationsAchievements.js")
const notificationsQuestions = require("./routes/notificationsQuestions.js");
const searchRouter = require('./routes/search.js');
const eventsContest = require('./routes/eventsContest.js');
const compilerRoutes = require('./routes/compiler.js');

const app = express();
const db = require("./db");


app.use(
    cookieSession({
        name: "session",
        keys: ["cyberwolve"],
        maxAge: 24 * 60 * 60 * 100,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        // origin: "http://localhost:3000",
         origin: ["http://localhost:3000", "http://localhost:3001"], // 👈 both allowed
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);

app.use(express.json());

// Test DB connection
db.query("SELECT 1")
    .then(() => console.log("MySQL connection works!"))
    .catch((err) => console.error("DB connection error:", err));

// Routes
app.use(express.json());
app.use("/api/tags", tagsRoutes);
app.use("/auth", authRoute);
app.use('/api/search', searchRouter);
app.use("/api/questions", questionRoutes);
app.use("/api", LoginRoute);
app.use("/api/user", userProfile);
app.use("/api/departments", departments);
app.use("/api/collectives", collectives);
app.use("/api/users", usersRoutes);
app.use("/api/admin", adminsRoutes);
app.use("/api/notifications", notifications);
app.use("/api/notificationsQuestions", notificationsQuestions);
app.use("/icons", express.static("public/icons"));


app.use("/api/contests", eventsContest);
// coding routes
app.use("/api/compiler", compilerRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
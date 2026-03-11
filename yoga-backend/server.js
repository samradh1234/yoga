const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Setup Uploads Directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// Database initialization
let db;

async function initDb() {
  try {
    db = await open({
      filename: './yoga_db.sqlite',
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_active_at DATETIME,
        username TEXT,
        status TEXT,
        avatar_url TEXT
      )
    `);

    // Insert Default Admin User
    const adminEmail = 'admin@kptyoga.com';
    const existingAdmin = await db.get('SELECT * FROM users WHERE email = ?', [adminEmail]);

    if (!existingAdmin) {
      const saltRounds = 10;
      const defaultPassword = 'admin'; // VERY INSECURE: Change immediately in production!
      const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

      await db.run(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Admin User', adminEmail, hashedPassword, 'admin']
      );
      console.log('Default admin user created.');
    }

    await db.exec(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        user_name TEXT,
        category TEXT,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS notices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS branches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      )
    `);

    // Insert Default Branches
    const defaultBranches = [
      'Computer Science',
      'Mechanical and engineering',
      'Automobile',
      'Electrical and electronics'
    ];

    for (const branch of defaultBranches) {
      const existingBranch = await db.get('SELECT * FROM branches WHERE name = ?', [branch]);
      if (!existingBranch) {
        await db.run('INSERT INTO branches (name) VALUES (?)', [branch]);
      }
    }

    console.log("SQLite Database initialized and tables verified.");
  } catch (err) {
    console.error("Error initializing database tables:", err);
  }
}
initDb();

// Basic Route for Health Check
app.get('/', async (req, res) => {
  try {
    // Check if database is connected
    const rows = await db.all('SELECT 1 + 1 AS solution');
    res.json({
      message: 'Welcome to the Yoga Backend API!',
      database_status: 'Connected successfully to SQLite database.'
    });
  } catch (error) {
    console.error("Database connection error: ", error);
    res.status(500).json({
      message: 'Welcome to the Yoga Backend API!',
      database_status: 'Failed to connect to the SQLite database.',
      error: error.message
    });
  }
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Registration Route
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, branch_id, reg_number, phone } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    let columns = ['name', 'email', 'password_hash'];
    let values = [name, email, passwordHash];
    let placeholders = ['?', '?', '?'];

    if (branch_id) { columns.push('branch_id'); values.push(branch_id); placeholders.push('?'); }
    if (reg_number) { columns.push('reg_number'); values.push(reg_number); placeholders.push('?'); }
    if (phone) { columns.push('phone'); values.push(phone); placeholders.push('?'); }

    const query = `INSERT INTO users (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;

    // Insert new user
    const result = await db.run(query, values);

    // Fetch newly created user (excluding password)
    const newUser = await db.get('SELECT id, name, email, role, branch_id, reg_number, phone, created_at FROM users WHERE id = ?', [result.lastID]);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Student Registration Route (with image upload)
app.post('/api/register-student', upload.single('image'), async (req, res) => {
  try {
    const { name, email, password, branch_id, phone, reg_number } = req.body;

    // Validate input
    if (!name || !email || !password || !branch_id || !phone || !reg_number) {
      return res.status(400).json({ error: 'Please provide name, email, password, branch, phone number, and register number' });
    }

    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    let avatarUrl = null;
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    }

    let columns = ['name', 'email', 'password_hash', 'branch_id', 'phone', 'reg_number'];
    let values = [name, email, passwordHash, branch_id, phone, reg_number];
    let placeholders = ['?', '?', '?', '?', '?', '?'];

    if (avatarUrl) {
      columns.push('avatar_url');
      values.push(avatarUrl);
      placeholders.push('?');
    }

    const query = `INSERT INTO users (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;

    // Insert new user
    const result = await db.run(query, values);

    // Fetch newly created user
    const newUser = await db.get(
      'SELECT id, name, email, role, branch_id, reg_number, phone, avatar_url, created_at FROM users WHERE id = ?',
      [result.lastID]
    );

    res.status(201).json({ message: 'Student registered successfully', user: newUser });
  } catch (error) {
    console.error("Student Registration error:", error);
    res.status(500).json({ error: 'Failed to register student' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Add logging to debug
    console.log("Login attempt - Email:", email);

    if (!email || !password) {
      console.log("Login failed - Missing email or password");
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    let user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    console.log("Found User ID:", user?.id);

    // Auto-Register user if they don't exist
    if (!user) {
      console.log("Login: User not found, auto-registering new user.");
      const defaultName = email.split('@')[0] || 'User';
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      const insertResult = await db.run(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [defaultName, email, passwordHash, 'user']
      );
      
      user = await db.get('SELECT * FROM users WHERE id = ?', [insertResult.lastID]);
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (match) {
      // Update last_active_at (optional)
      await db.run('UPDATE users SET last_active_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

      // Create JWT payload
      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };

      // Generate token
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

      console.log("Login successful - Sending token");
      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      console.log("Login failed - Password mismatch");
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Social Login Route (Google/Facebook)
app.post('/api/social-login', async (req, res) => {
  try {
    const { email, name, avatar_url, provider } = req.body;

    console.log(`Social login attempt - Provider: ${provider}, Email: ${email}`);

    if (!email) {
      return res.status(400).json({ error: 'Email is required for social login' });
    }

    let user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      // Create user with a random safe password
      const dummyPassword = Math.random().toString(36).slice(-10);
      const passwordHash = await bcrypt.hash(dummyPassword, 10);

      const result = await db.run(
        'INSERT INTO users (name, email, password_hash, avatar_url) VALUES (?, ?, ?, ?)',
        [name || 'User', email, passwordHash, avatar_url || null]
      );
      user = await db.get('SELECT * FROM users WHERE id = ?', [result.lastID]);
    } else {
      // Opt: update avatar if different
      if (avatar_url && user.avatar_url !== avatar_url) {
        await db.run('UPDATE users SET avatar_url = ? WHERE id = ?', [avatar_url, user.id]);
        user.avatar_url = avatar_url;
      }
      await db.run('UPDATE users SET last_active_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    console.log("Social Login successful - Sending token");
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url }
    });
  } catch (error) {
    console.error("Social Login Error:", error);
    res.status(500).json({ error: 'Internal server error during social login' });
  }
});

// Admin Routes
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    // For now, return placeholder stats until DB schema is fully populated
    res.json({
      totalUsers: 142,
      totalClasses: 18,
      activeMemberships: 89,
      revenueThisMonth: 5400
    });
  } catch (error) {
    console.error("Error fetching admin stats: ", error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

app.get('/api/admin/members', authenticateToken, async (req, res) => {
  try {
    const users = await db.all(`
      SELECT u.id, u.name, u.email, u.avatar_url, u.reg_number, u.phone, u.branch_id, b.name as branch_name 
      FROM users u
      LEFT JOIN branches b ON u.branch_id = b.id
      ORDER BY u.id DESC
    `);
    res.json(users);
  } catch (error) {
    console.error("Error fetching members: ", error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Admin Route to directly add a new user
app.post('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    // Basic authorization check
    if ((req.user.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Only admins can add users' });
    }

    const { name, email, password, branch_id, reg_number, phone } = req.body;

    // Check if user exists
    const existingUsers = await db.all('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    let columns = ['name', 'email', 'password_hash'];
    let values = [name, email, passwordHash];
    let placeholders = ['?', '?', '?'];

    if (branch_id) { columns.push('branch_id'); values.push(branch_id); placeholders.push('?'); }
    if (reg_number) { columns.push('reg_number'); values.push(reg_number); placeholders.push('?'); }
    if (phone) { columns.push('phone'); values.push(phone); placeholders.push('?'); }

    const query = `INSERT INTO users (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;

    const result = await db.run(query, values);

    // Fetch newly created user to return back
    const newUser = await db.get('SELECT id, name, email, avatar_url, branch_id, reg_number, phone FROM users WHERE id = ?', [result.lastID]);

    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error("Admin add user error:", error);
    // If the dynamic column insert fails (e.g. username doesn't exist on older db), catch and return generic error
    res.status(500).json({ error: 'Failed to add user', details: error.message });
  }
});

// Admin Route to edit a user
app.put('/api/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    if ((req.user.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Only admins can edit users' });
    }

    const { id } = req.params;
    const { name, email, branch_id, reg_number, phone } = req.body;

    // Check if user exists
    const userToEdit = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!userToEdit) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prepare dynamic update
    let updateFields = [];
    let values = [];

    if (name) { updateFields.push('name = ?'); values.push(name); }
    if (email) { updateFields.push('email = ?'); values.push(email); }
    if (branch_id !== undefined) { updateFields.push('branch_id = ?'); values.push(branch_id); }
    if (reg_number !== undefined) { updateFields.push('reg_number = ?'); values.push(reg_number); }
    if (phone !== undefined) { updateFields.push('phone = ?'); values.push(phone); }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    values.push(id); // for the WHERE clause

    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.run(query, values);

    // Fetch updated user
    const updatedUser = await db.get('SELECT id, name, email, avatar_url, branch_id, reg_number, phone FROM users WHERE id = ?', [id]);

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error("Admin edit user error:", error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

// Admin Route to delete a user
app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    if ((req.user.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete users' });
    }

    const { id } = req.params;

    // Ensure they aren't deleting themselves (optional safety, but good practice)
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const result = await db.run('DELETE FROM users WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error("Admin delete user error:", error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

// Admin Image Gallery Routes
app.post('/api/admin/images', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if ((req.user.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Only admins can upload images' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Return the URL path for the uploaded image
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ message: 'Image uploaded successfully', url: imageUrl, filename: req.file.filename });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

app.get('/api/admin/images', authenticateToken, (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const images = files.map(file => ({
      filename: file,
      url: `/uploads/${file}`,
      uploadedAt: fs.statSync(path.join(uploadsDir, file)).mtime
    })).sort((a, b) => b.uploadedAt - a.uploadedAt); // Newest first

    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: 'Failed to retrieve images' });
  }
});

app.delete('/api/admin/images/:filename', authenticateToken, (req, res) => {
  try {
    if ((req.user.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete images' });
    }

    const { filename } = req.params;
    const filepath = path.join(uploadsDir, filename);

    // Ensure it's inside the uploads dir and exists
    if (fs.existsSync(filepath) && filepath.startsWith(uploadsDir)) {
      fs.unlinkSync(filepath);
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Global in-memory simple persistence for demonstration of backend theme saving
let currentThemePreference = 'light';

// Public Gallery Route (No authentication required)
app.get('/api/gallery', async (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const images = files.map(file => ({
      filename: file,
      url: `/uploads/${file}`,
      uploadedAt: fs.statSync(path.join(uploadsDir, file)).mtime
    })).sort((a, b) => b.uploadedAt - a.uploadedAt); // Newest first

    res.json(images);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    res.status(500).json({ error: 'Failed to retrieve gallery images' });
  }
});

// Theme Preferences Routes
app.get('/api/theme', (req, res) => {
  res.json({ theme: currentThemePreference });
});

app.post('/api/theme', (req, res) => {
  const { theme } = req.body;
  if (theme === 'light' || theme === 'dark') {
    currentThemePreference = theme;
    res.json({ success: true, theme: currentThemePreference });
  } else {
    res.status(400).json({ error: 'Invalid theme' });
  }
});

// Community Feedback Routes
app.get('/api/feedbacks', async (req, res) => {
  try {
    const feedbacks = await db.all(`
      SELECT * 
      FROM feedbacks 
      ORDER BY created_at DESC
    `);
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

app.post('/api/feedbacks', authenticateToken, async (req, res) => {
  console.log("=== Feedback POST Request Received ===");
  console.log("Body:", req.body);
  console.log("User:", req.user);

  try {
    const { category, message } = req.body;
    const userId = req.user.userId;
    const userName = req.user.name;

    if (!message) {
      console.log("Error: Message is required");
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await db.run(
      'INSERT INTO feedbacks (user_id, user_name, category, message) VALUES (?, ?, ?, ?)',
      [userId, userName, category || 'general', message]
    );

    const newFeedback = await db.get('SELECT * FROM feedbacks WHERE id = ?', [result.lastID]);
    console.log("Successfully inserted feedback:", newFeedback);
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ error: 'Failed to save feedback', details: error.message });
  }
});

app.put('/api/feedbacks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, message } = req.body;
    const userId = req.user.userId;

    // Check if feedback exists and belongs to the user
    const feedback = await db.get('SELECT * FROM feedbacks WHERE id = ?', [id]);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    if (feedback.user_id !== userId && (req.user.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'You can only edit your own feedback' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    await db.run(
      'UPDATE feedbacks SET category = ?, message = ? WHERE id = ?',
      [category || feedback.category, message, id]
    );

    const updatedFeedback = await db.get('SELECT * FROM feedbacks WHERE id = ?', [id]);
    res.json(updatedFeedback);
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ error: 'Failed to update feedback', details: error.message });
  }
});

app.delete('/api/feedbacks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if feedback exists and belongs to the user
    const feedback = await db.get('SELECT * FROM feedbacks WHERE id = ?', [id]);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    if (feedback.user_id !== userId && (req.user.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'You can only delete your own feedback' });
    }

    await db.run('DELETE FROM feedbacks WHERE id = ?', [id]);
    res.json({ message: 'Feedback deleted successfully', id });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ error: 'Failed to delete feedback', details: error.message });
  }
});

// Notice Board Routes
app.get('/api/notices', async (req, res) => {
  try {
    const notices = await db.all(`
      SELECT * FROM notices 
      WHERE is_active = 1 
      ORDER BY created_at DESC
    `);
    res.json(notices);
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

app.post('/api/admin/notices', authenticateToken, async (req, res) => {
  try {
    if ((req.user.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Only admins can post notices' });
    }

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const result = await db.run(
      'INSERT INTO notices (title, content) VALUES (?, ?)',
      [title, content]
    );

    const newNotice = await db.get('SELECT * FROM notices WHERE id = ?', [result.lastID]);
    res.status(201).json(newNotice);
  } catch (error) {
    console.error("Error creating notice:", error);
    res.status(500).json({ error: 'Failed to create notice' });
  }
});

app.delete('/api/admin/notices/:id', authenticateToken, async (req, res) => {
  try {
    if ((req.user.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete notices' });
    }

    const { id } = req.params;
    const result = await db.run('DELETE FROM notices WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    res.json({ message: 'Notice deleted successfully', id });
  } catch (error) {
    console.error("Error deleting notice:", error);
    res.status(500).json({ error: 'Failed to delete notice' });
  }
});

// Branches Routes
app.get('/api/branches', async (req, res) => {
  try {
    const branches = await db.all('SELECT * FROM branches ORDER BY name ASC');
    res.json(branches);
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

app.post('/api/admin/branches', authenticateToken, async (req, res) => {
  try {
    if ((req.user.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Only admins can add branches' });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Branch name is required' });
    }

    const existingBranch = await db.get('SELECT * FROM branches WHERE name = ?', [name]);
    if (existingBranch) {
      return res.status(400).json({ error: 'Branch already exists' });
    }

    const result = await db.run('INSERT INTO branches (name) VALUES (?)', [name]);
    const newBranch = await db.get('SELECT * FROM branches WHERE id = ?', [result.lastID]);
    res.status(201).json(newBranch);
  } catch (error) {
    console.error("Error adding branch:", error);
    res.status(500).json({ error: 'Failed to add branch' });
  }
});

app.delete('/api/admin/branches/:id', authenticateToken, async (req, res) => {
  try {
    if ((req.user.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete branches' });
    }

    const { id } = req.params;
    const result = await db.run('DELETE FROM branches WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.json({ message: 'Branch deleted successfully', id });
  } catch (error) {
    console.error("Error deleting branch:", error);
    res.status(500).json({ error: 'Failed to delete branch' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

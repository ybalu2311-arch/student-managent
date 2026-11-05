import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data', 'students.json');

app.use(cors());
app.use(express.json());

async function readStudents() {
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

async function saveStudents(students) {
  await fs.writeFile(DATA_FILE, `${JSON.stringify(students, null, 2)}\n`, 'utf8');
}

function validateStudent(body) {
  const required = ['name', 'email', 'department', 'year', 'phone'];
  for (const field of required) {
    if (!String(body[field] ?? '').trim()) return `${field} is required.`;
  }
  if (!/^\S+@\S+\.\S+$/.test(body.email)) return 'Enter a valid email address.';
  const gpa = Number(body.gpa);
  if (!Number.isFinite(gpa) || gpa < 0 || gpa > 10) return 'GPA must be between 0 and 10.';
  if (!['Active', 'Inactive'].includes(body.status || 'Active')) return 'Status must be Active or Inactive.';
  return null;
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', message: 'Student API is running' }));

app.get('/api/students', async (_req, res, next) => {
  try {
    const students = await readStudents();
    res.json(students);
  } catch (error) {
    next(error);
  }
});

app.post('/api/students', async (req, res, next) => {
  try {
    const validationError = validateStudent(req.body);
    if (validationError) return res.status(400).json({ message: validationError });

    const students = await readStudents();
    const student = {
      id: `STU-${randomUUID().slice(0, 8).toUpperCase()}`,
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      department: req.body.department,
      year: req.body.year,
      phone: req.body.phone.trim(),
      gpa: Number(req.body.gpa),
      status: req.body.status || 'Active'
    };
    students.push(student);
    await saveStudents(students);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
});

app.put('/api/students/:id', async (req, res, next) => {
  try {
    const validationError = validateStudent(req.body);
    if (validationError) return res.status(400).json({ message: validationError });

    const students = await readStudents();
    const index = students.findIndex((student) => student.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Student not found.' });

    students[index] = {
      ...students[index],
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      department: req.body.department,
      year: req.body.year,
      phone: req.body.phone.trim(),
      gpa: Number(req.body.gpa),
      status: req.body.status || 'Active'
    };
    await saveStudents(students);
    res.json(students[index]);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/students/:id', async (req, res, next) => {
  try {
    const students = await readStudents();
    const filtered = students.filter((student) => student.id !== req.params.id);
    if (filtered.length === students.length) return res.status(404).json({ message: 'Student not found.' });
    await saveStudents(filtered);
    res.json({ message: 'Student deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`Student Management API running at http://localhost:${PORT}`);
});

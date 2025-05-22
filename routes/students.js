const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { ensureAuthenticated } = require('../config/auth');

// Get all students -> PRIVATE
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const students = await Student.find({}).exec();
    req.flash('success_msg', "You're already logged in!");
    res.render('students/index', { students });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).send('Server Error');
  }
});

// Get single student by id -> PRIVATE
router.get('/show/:id', ensureAuthenticated, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).exec();
    if (!student) {
      req.flash('error_msg', 'Student not found');
      return res.redirect('/students');
    }
    res.render('students/show', { student });
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).send('Server Error');
  }
});

// Create a student form -> PRIVATE
router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('students/create');
});

// Save student
router.post('/save', async (req, res) => {
  try {
    const existingStudent = await Student.findOne({ name: req.body.name }).exec();
    if (existingStudent) {
      req.flash('error_msg', 'Name already exists');
      return res.status(400).redirect('/students/create');
    }

    const newStudent = new Student({
      name: req.body.name,
      address: req.body.address,
      batch: req.body.batch,
      roll_number: req.body.roll_number,
      cgpa: req.body.cgpa,
      phone_number: req.body.phone_number,
      dob: req.body.dob,
      blood_group: req.body.blood_group
    });

    const savedStudent = await newStudent.save();
    req.flash('success_msg', 'Student added!');
    res.redirect('/students/show/' + savedStudent._id);
  } catch (err) {
    console.error('Error saving student:', err);
    res.status(500).send('Server Error');
  }
});

// Edit student form -> PRIVATE
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).exec();
    if (!student) {
      req.flash('error_msg', 'Student not found');
      return res.redirect('/students');
    }
    res.render('students/edit', { student });
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).send('Server Error');
  }
});

// Update a student
router.post('/update/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          address: req.body.address,
          batch: req.body.batch,
          roll_number: req.body.roll_number,
          cgpa: req.body.cgpa,
          phone_number: req.body.phone_number,
          dob: req.body.dob,
          blood_group: req.body.blood_group
        }
      },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedStudent) {
      req.flash('error_msg', 'Student not found');
      return res.redirect('/students');
    }

    req.flash('success_msg', 'Student details updated!');
    res.redirect('/students/show/' + updatedStudent._id);
  } catch (err) {
    console.error('Error updating student:', err);
    // On error, try to render edit with the submitted data
    res.render('students/edit', { student: req.body, error_msg: 'Error updating student' });
  }
});

// Delete student
router.post('/delete/:id', async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id).exec();
    if (!deleted) {
      req.flash('error_msg', 'Student not found');
      return res.redirect('/students');
    }

    req.flash('success_msg', 'Student deleted!');
    res.redirect('/students');
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

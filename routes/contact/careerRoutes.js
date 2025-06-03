const express = require('express');
const router = express.Router();
const careerController = require('../../controllers/contact/careerController');
const multer = require('multer');
const path = require("path");
const fs = require("fs");

// Set up multer for resume uploads
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/resumes";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save resumes
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

// Create a multer instance for resume upload
const resumeUpload = multer({
  storage: resumeStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only .pdf, .doc, and .docx files are allowed."));
    }
  },
});

// Route to submit a career application
router.post('/submit-careers-form', resumeUpload.single("resume"), careerController.submitApplication);

// Route to fetch applications
router.get('/api/careers', careerController.fetchApplications);

// Route to delete an application
router.delete('/api/deletecareers/:id', careerController.deleteApplication);

module.exports = router;

const Resume = require('../models/Resume');
const { extractTextFromPDF } = require('../utils/pdfParser');

exports.uploadResume = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a PDF file',
      });
    }

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(req.file.buffer);

    // Check if email already exists and update, or create new
    let resume = await Resume.findOne({ email });

    if (resume) {
      resume.fileName = req.file.originalname;
      resume.filePath = 'memory-storage'; // No local file path in production
      resume.extractedText = extractedText;
      resume.lastUpdated = Date.now();
      await resume.save();
    } else {
      resume = await Resume.create({
        email,
        fileName: req.file.originalname,
        filePath: 'memory-storage',
        extractedText,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        email: resume.email,
        fileName: resume.fileName,
        uploadedAt: resume.uploadedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getResume = async (req, res, next) => {
  try {
    const { email } = req.params;

    const resume = await Resume.findOne({ email });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

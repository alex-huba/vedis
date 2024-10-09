require("dotenv").config();
const path = require("path");
const fs = require("fs");
const fsPromise = require("fs").promises;
const User = require("../models/user.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.uploadFile = async (req, res, next) => {
  if (!req.file) return res.status(400).send("Файл не вдалося завантажити");
  res.status(204).end();
};

exports.countFilesPerStudent = async (req, res, next) => {
  if (req.role !== "teacher") return res.status(401).end();

  try {
    // Get the list of all valid students
    const [students] = await User.findAllStudents();

    // Define the uploads directory
    const uploadsDir = path.join(__dirname, "../uploads");

    // Read the contents of the uploads directory
    let directories;
    try {
      directories = await fsPromise.readdir(uploadsDir);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Failed to read uploads directory" });
    }

    // Filter out "avatars" directory
    const studentDirs = directories.filter((dir) => dir !== "avatars");

    // Process each student directory and count files asynchronously
    const resultPromises = studentDirs.map(async (studentId) => {
      const studentDirPath = path.join(uploadsDir, studentId);

      let files;
      try {
        files = await fsPromise.readdir(studentDirPath);
      } catch (err) {
        throw new Error(`Failed to read directory for student ${studentId}`);
      }

      // Find the student's name from the list of students
      const studentName =
        students.find((s) => s.id == studentId)?.name || "Unknown";

      return {
        studentId,
        studentName,
        amount_of_files: files.length,
      };
    });

    // Wait for all directories to be processed
    const result = await Promise.all(resultPromises);

    // Return the result
    res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getAllFilenames = async (req, res, next) => {
  if (req.role != "teacher" && req.userId != req.params.studentId)
    return res.status(401).end();

  const studentDir = path.join(__dirname, "../uploads", req.params.studentId);

  // Check if the directory exists
  fs.access(studentDir, fs.constants.F_OK, (err) => {
    if (err) return res.status(404).end();

    // Read the files in the student's directory
    fs.readdir(studentDir, (err, files) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to read student directory" });
      }

      processedFiles = files.map((f) => ({
        fileName: f,
        link: `http://localhost:3001/api/library/${req.params.studentId}/${f}`,
      }));

      res.json(processedFiles);
    });
  });
};

exports.getFile = async (req, res, next) => {
  if (!req.query.token) return res.status(401).end();

  // Verify token
  let decodedToken;
  try {
    decodedToken = jwt.verify(req.query.token, process.env.JWT_SECRET);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 401;
    next(err);
  }

  if (
    !decodedToken ||
    (decodedToken.role !== "teacher" &&
      decodedToken.id !== req.params.studentId)
  ) {
    return res.status(401).end();
  }

  const filePath = path.join(
    __dirname,
    "../uploads",
    req.params.studentId,
    req.params.fileName
  );

  res.sendFile(filePath, (err) => {
    if (err) {
      return res.status(404).json({ error: "File not found" });
    }
  });
};

exports.deleteFile = async (req, res, next) => {
  if (req.role != "teacher") return res.status(401).end();

  try {
    // Extract studentId and fileName from req.params
    const { studentId, fileName } = req.params;

    // Define the path to the uploads directory
    const uploadsDir = path.join(__dirname, "../uploads");

    // Construct the full path to the student's folder
    const studentFolder = path.join(uploadsDir, studentId);

    // Check if the folder for the student exists
    if (!fs.existsSync(studentFolder)) {
      return res.status(404).json({ message: "Student folder not found" });
    }

    // Construct the full path to the file
    const filePath = path.join(studentFolder, fileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to delete file" });
      }

      // Return 204 No Content if successful
      return res.status(204).end();
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const express = require('express');
const router = express.Router();
const path = require('path');
global.__basedir = path.resolve(__dirname);
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return res.status(400).json({ error: "File types allowed are .jpeg, .png, .jpg" });
        }
    }
});

router.post("/uploadFile", upload.single('file'), function (req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file provided" });
        }

        // Process the uploaded file and send a response
        res.json({ fileName: req.file.filename });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "File upload failed" });
    }
});


const downloadFile = (req, res) => {
    const fileName = req.params.filename;
    const path = __basedir + "/uploads/";

    res.download(path + fileName, (error) => {
        if (error) {
            res.status(500).send({ message: "File cannot be downloaded " + error })
        }
    })
}
router.get("/files/:filename", downloadFile);

module.exports = router;
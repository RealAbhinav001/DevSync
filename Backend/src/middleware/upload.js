const multer = require("multer")

const allowedMimeType = [
    // images
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    // documents
    "application/pdf",
    "application/msword",                                                            // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",       // .docx
    "application/vnd.ms-excel",                                                      // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",             // .xlsx
    "application/vnd.ms-powerpoint",                                                 // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",     // .pptx
    "text/plain"                                                                     // .txt
]

const fileFilter = (req,file,cb)=>{
    if(allowedMimeType.includes(file.mimetype)){
        cb(null,true)
    }
    else{
        cb(new Error("Invalid file type. Only images and documents are allowed."), false)
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/chats")
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})




const upload = multer({ storage,limits:{fileSize:10*1024*1024},fileFilter:fileFilter })

module.exports = upload

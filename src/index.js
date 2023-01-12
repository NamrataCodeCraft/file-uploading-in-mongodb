const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const ImageModel = require('./imageModel')
const app = express()
const port = process.env.port || 4000
app.use(express.json())


mongoose.connect('mongodb://localhost:27017/upload-file').then(()=>{
    console.log('connection is successfull with mongodb')
}).catch((err)=>{
    console.log( err,"NO CONNECTION")
})

// Storage

const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req,file, cb)=>{
        cb(null, file.originalname);
    },

})

const upload = multer({
    storage: Storage
}).single('testImage')



app.post('/upload', (req,res)=>{
    upload(req,res,(err)=>{
        if(err) {
            console.log(err)
        }
        else{
            const newImage = new ImageModel({
                name: req.body.name,
                image:{
                    data: req.file.filename,
                    contentType: 'image/png'
                }
            })
            newImage.save()
            .then(()=> res.send('successfully uploaded')).catch((err)=>{
                console.log(err)
            })

        }
    })
})



app.listen(port, function(){
    console.log(`express app is running on ${port}`)
    
})


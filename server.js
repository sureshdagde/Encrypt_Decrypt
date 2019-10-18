

var fs = require('fs');
request = require("request");
app = require("express")()
Cryptr = require("cryptr")

let filedata = {};

let fileName= __dirname+"/file.json";
let data = require(__dirname+"/file.json")

//ENCODE
app.use("/file/en/:keyA/:keyB" ,(req,res ,next)=>{
    data.Request.keyA=req.params.keyA;
    data.Request.keyB=req.params.keyB;

    fs.writeFile(fileName, JSON.stringify(data,null,2), function (err) {
        if (err) return console.log(err);
    });

    let keyA = new Cryptr(data.Request.keyA)
    let encrypted_Header_data = keyA.encrypt(JSON.stringify(data.Header));
    let encrypted_Object_data = keyA.encrypt(JSON.stringify(data.Object));
    
    let keyB = new Cryptr(data.Request.keyB)
    let encrypted_Body_data = keyB.encrypt(JSON.stringify(data.Body));

    filedata.Header_data=encrypted_Header_data;
    filedata.Object_data=encrypted_Object_data;
    filedata.Body_data=encrypted_Body_data;
    filedata.Request_data = data.Request;

    res.send(filedata)
    next();
})

//DECODE 

app.use("/file/dc/:keyA/:keyB",(req,res,next)=>{
   if(!filedata[0]){console.log("Data is not Encrypted")
    res.send("Data is not Encrypted , please encrypt first")
    }
    else if(req.params.keyA==data.Request.keyA && req.params.keyB==data.Request.keyB){
        var decryptdata={}
        let keyA = new Cryptr(req.params.keyA)
        let keyB = new Cryptr(req.params.keyB)
        let  decrypted_Header_data =  keyA.decrypt(filedata.Header_data)
        let decrypted_Object_data =  keyA.decrypt(filedata.Object_data)
        let decrypted_Body_data = keyB.decrypt(filedata.Body_data)

        decryptdata.decrypted_Header_data=decrypted_Header_data;
        decryptdata.decrypted_Object_data=decrypted_Object_data;
        decryptdata.decrypted_Body_data=decrypted_Body_data;
        decryptdata.Request_data=data.Request;
       // console.log(decryptdata)
        res.send(decryptdata)
    }else{
        res.send("Key's are Invalid")
    }
   
})





//ENCODE GET REQUEST
app.get("/file/en/:keyA/:keyB",(req,res)=>{

})
//DECODE GET REQUEST
app.get("/file/dc/:keyA/:keyB",(req,res)=>{

})
app.listen(3000,()=>{console.log("server is running")})

/*// remove this comment
// TO CHECK BY COMMAND LINE REMOVE THE COMMENT 
//BY BROWSER TO ENCODE TYPE :->  http://localhost:3000/file/en/keyA/keyB
//BY BROWSER TO DECODE TYPE :->  http://localhost:3000/file/dc/keyA/keyB

// encode request
request.get({'url':"http://localhost:3000/file/en/:xyaaaaaz/:pqr",json: true},(error,response,body)=>{
    if(error){
        console.log(error)
    }else{
        
      console.log(body)
    }
})

// decode request
request.get({'url':"http://localhost:3000/file/dc/:xyaaaaaz/:pqr",json: true},(error,response,body)=>{
    if(error){
        console.log(error)
    }else{
        
      console.log(body)
    }
})

*/

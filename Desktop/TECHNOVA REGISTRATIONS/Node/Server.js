const express = require("express")
const app = express()

const mysql = require('mysql')
const bodyparser=require('body-parser')

const cors = require('cors')
const port = process.env.PORT||3003;
app.use(cors());


app.listen(port,()=>{
    console.log('server running on port',port);
})

app.use(bodyparser.json()); 

const con = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"registrations"

})


con.getConnection((err)=>{
    if(err) throw err
    else{
        console.log("connection is established")
        con.query("select * from students",(err,result)=>{
            if(err) throw err
            else{
                console.log(result);
                
            }
        })
    }
})


app.get('/',(req,res)=>{
    con.query("select * from students",(err,result)=>{

        if(err) throw err
        else{
           res.send(result)
            
        }
    })
})

app.post('/',(req,res)=>{
    const id = req.body.id;
    const name=req.body.name;
    const phone=req.body.phone;
    const q = 'select * from students where id like ? or name like ? or phone = ?';
    con.query(q,[id,name,phone],(err,result)=>{
        if (err) throw err;
        else{
            console.log(result.length);
            if(result.length>0){
                
                if(result.length>0) {
                    res.send(["valid",result]);
                }
                 
            }
            else{
                res.send("no")
            }
        }
    })
})

app.post('/update', (req, res) => {
    const updatedData = req.body;

    
    const id = updatedData.id;
    delete updatedData.id; 
    
    con.query('UPDATE students SET ? WHERE id = ?', [updatedData, id], (err, result) => {
        if (err) {
            console.error("Error updating data:", err);
            res.status(500).send("Error updating data");
        } else {
            console.log("Update successful");
            res.status(200).send("Update successful");
        }
    });
});



// app.get('/insert',(req,res)=>{
//     con.query("insert into students values(1204,'akshaya','2345678','akki@gmail.com','amritha','4','medha', 'tanuku','2024-03-10','2024-03-12')",(err)=>{
//         if(err) throw err
//         else{
//            res.send("Successful")
            
//         }
//     })

// })

import React, { useState } from 'react';
import axios from 'axios';
const Updateform = (props) => {
    const[id,setId]=useState('')
    const[name,setName]=useState('')
    const[valid,setValid]=useState(false)
    const [formData, setFormData] = useState(props.data.map(() => ''));

    const handleId=(e)=>{
        setId(e.target.value)
    }
    const handleName=(e)=>{

    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        // axios.post('http://localhost:3003',{id}).then((result)=>{
            
        //     if(result.data[0] === 'valid'){
        //         setValid(true)
        //         console.log('valid')
        //         console.log(result)
        //         setName(result.data.name)
                
        //     }
        //     else{
        //         console.log('not valid')
        //     }
            
        // })
        // .catch((error) => {
        //     console.error("Error:", error); 
        // });
    }
    const handleInputChange = (index, value) => {
        const newData = [...formData];
        newData[index] = value;
        setFormData(newData);
      };
    
    return (
        <div>
           {props.data.map((item, index) => (
          <div key={index}>
            <label>
              {item}:
              <input
                type="text"
                value={formData[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </label>
          </div>
        ))}
            
        </div>
    );
};

export default Updateform;
import React, { useState } from 'react';
import axios from 'axios';
//import './Reg.css';

const Regi = () => {
    const [selected, setSelected] = useState('');
    const [data, setData] = useState([]);
    const [valid, setValid] = useState(null);

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editUserData, setEditUserData] = useState({});
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3003', { id, name, phone }).then((result) => {
            if (result.data[0] === 'valid') {
                setValid(true);
                setData(result.data[1]);
            } else {
                setValid(false);
            }
        }).catch((error) => {
            console.error("Error:", error);
        });
    };

    const handleOptionChange = (e) => {
        setSelected(e.target.value);
    };


    const handleEdit = (userData) => {
        setEditMode(true);
        setEditUserData(userData);
    };
    const handleUpdate = () => {
        // Implement update functionality here
        // Send updated data to the server
        console.log("Update button clicked");
        axios.post('http://localhost:3003/update', editUserData)
            .then(response => {
                console.log("Update successful");
                setEditMode(false); // Toggle edit mode off after successful update
            })
            .catch(error => {
                console.error("Error updating data:", error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'id') setId(value);
        else if (name === 'name') setName(value);
        else if (name === 'phone') setPhone(value);
    };
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setEditUserData(prevData => ({
    //         ...prevData,
    //         [name]: value
    //     }));
    // };

    return (
        <div>
            <h1 style={{ color: 'red' }}>TECHNOVA HACKATHON REGISTRATIONS</h1>
            <form action="" onSubmit={handleSubmit}>
                <label>
                    <input type='radio' name='option' value='id' checked={selected === 'id'} onChange={handleOptionChange} />ID
                </label>
                <label>
                    <input type='radio' name='option' value='name' checked={selected === 'name'} onChange={handleOptionChange} />Name
                </label>
                <label>
                    <input type='radio' name='option' value='phone' checked={selected === 'phone'} onChange={handleOptionChange} />Phone
                </label><br></br>
                <input
                    type="text"
                    name={selected}
                    value={selected === 'id' ? id : selected === 'name' ? name : selected === 'phone' ? phone : ''}
                    onChange={handleInputChange}></input>

                <button type='submit'>Display</button>
            </form>

            {valid === true && (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Identity Number</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>email</th>
                                <th>College Name</th>
                                <th>Allocated Hostel Name</th>
                                <th>Room number</th>
                                <th>Place</th>
                                <th>Arrival Date</th>
                                <th>Departure Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.email}</td>
                                    <td>{item.collegename}</td>
                                    <td>{item.hostelname}</td>
                                    <td>{item.roomno}</td>
                                    <td>{item.place}</td>
                                    <td>{item.arrivaldate}</td>
                                    <td>{item.departuredate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {editMode ? (
                        <div>
                            <h2>Edit User Data</h2>
                            <label>
                                Identity Number:
                                <input type="text" value={editUserData.id} disabled />
                            </label>
                            <label>
                                Name:
                                <input type="text" name="name" value={editUserData.name} onChange={handleEditInputChange} />
                            </label>
                            <label>
                                Phone:
                                <input type="text" name="phone" value={editUserData.phone} onChange={handleEditInputChange} />
                            </label>
                            <label>
                                Email:
                                <input type="email" name="email" value={editUserData.email} onChange={handleEditInputChange} />
                            </label>
                            <label>
                                College Name:
                                <input type="text" name="collegename" value={editUserData.collegename} onChange={handleEditInputChange} />
                            </label>
                            <label>
                                Hostel Name:
                                <input type="text" name="hostelname" value={editUserData.hostelname} onChange={handleEditInputChange} />
                            </label>
                            <label>
                                Room Number:
                                <input type="text" name="roomno" value={editUserData.roomno} onChange={handleEditInputChange} />
                            </label>
                            <label>
                                Place:
                                <input type="text" name="place" value={editUserData.place} onChange={handleEditInputChange} />
                            </label>
                            <label>
                                Arrival Date:
                                <input type="date" name="arrivaldate" value={editUserData.arrivaldate} onChange={handleEditInputChange} />
                            </label>
                            <label>
                                Departure Date:
                                <input type="date" name="departuredate" value={editUserData.departuredate} onChange={handleEditInputChange} />
                            </label>
                            <br />
                            <button onClick={handleUpdate}>Update</button>
                        </div>
                    ) : (
                        <button onClick={() => handleEdit(data[0])}>Edit</button>
                    )}

                </>


            )}
            {valid === false && <p>Not a valid user</p>}
        </div>
    );
};

export default Regi;

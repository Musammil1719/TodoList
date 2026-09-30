import {useEffect, useState} from 'react';
export default function Tod0(){

    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [todos,setTodos]=useState([]);
    const apiUrl="http://localhost:8000";
    const [error,setError]=useState("");
    const [message,setMessage]=useState("");
    const [editId,setEditId]=useState(-1);

    //edit

    const [editTitle,setEditTitle]=useState("");
    const [editDescription,setEditDescription]=useState("");

    const handleSubmit=()=>{
        setError("");
        if(title.trim() !== '' && description.trim() !== '') {
            fetch(apiUrl+"/todos",{
                method:"POST",
                headers:{
                    'content-type':"application/json"
                },
                body:JSON.stringify({title,description})
            }).then((res)=>{
                if(res.ok){
                    setTodos([...todos,{title,description}]);
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully")
                    setTimeout(()=>{
                        setMessage("")
                    },3000)
                }
                else{
                    setError("unable to create Todo-item")
                }
            }).catch((err)=>{
                setError("Unable To create Todo-item")
            })
        } 

    }

    useEffect(()=>{
        getItems()
    },[])

    const getItems=()=>{
        fetch(apiUrl+"/todos")
        .then((res)=>res.json())
        .then((res)=>setTodos(res))
    }

    const handleUpdate=()=>{
        setError("");
        if(editTitle.trim() !== '' && editDescription.trim() !== '') {
            fetch(apiUrl+"/todos/"+editId,{
                method:"PUT",
                headers:{
                    'content-type':"application/json"
                },
                body:JSON.stringify({title:editTitle,description:editDescription})
            }).then((res)=>{
                if(res.ok){
                    const updatedTodos=todos.map((item)=>{
                        if(item._id === editId){
                            item.title=editTitle;
                            item.description=editDescription;

                        }
                        return item;
                    })
                    setTodos(updatedTodos);
                    setTitle("");
                    setDescription("");
                    setMessage("Item Updated successfully")
                    setTimeout(()=>{
                        setMessage("")
                    },3000)
                    setEditId(-1)
                }
                
                else{
                    setError("unable to create Todo-item")
                }
            }).catch((err)=>{
                setError("Unable To create Todo-item")
            })
        } 


    }

    const handleEdit=(item)=>{
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description)
    }
    const handleEditCancel=()=>{
        setEditId(-1)
    }
    const handleDelete=(id)=>{
        if(window.confirm('Are you sure want to delete')){
            fetch(apiUrl+'/todos/'+id,{
                method:"DELETE"
            })
            .then(()=>{
               const updatedTodos= todos.filter((item)=>item._id!==id)
               setTodos(updatedTodos)
            })

        }

    }
    return (
    <>
        <div className="row p-3 bg-success text-white mt-3">
            <h1 className='text-center '>ToDo Project </h1>
        </div>
        <div className="row">
            <h2>Add Item</h2>
            {message && <p className="text-success">{message}</p>}
        </div>
        <div className="form-group d-flex gap-2">
            <input className="form-control" onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder="title"/>
            <input className="form-control"onChange={(e)=>setDescription(e.target.value)} value={description} type="text" placeholder="description"/>
            <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
        </div>
        {error && <p className="text-danger">{error}</p>}

        <div className="row mt-3">
            <h3>Task</h3>
            <ul className="list-group">
                {
                    todos.map((item)=> <li  className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                    <div className='d-flex flex-column'>
                        {
                            editId ===-1 || editId !== item._id? <>
                            <span className='fw-bold'>{item.title}</span>
                            <span className=''>{item.description}</span>

                            </>:<>
                            <div className="form-group d-flex gap-2">
                                <input className="form-control" onChange={(e)=>setEditTitle(e.target.value)} value={editTitle} type="text" placeholder="title"/>
                                <input className="form-control"onChange={(e)=>setEditDescription(e.target.value)} value={editDescription} type="text" placeholder="description"/>
                            </div>
                            </>
                        }
                        
                    </div>
                    
                    <div className="d-flex gap-2">
                        { editId ===-1 || editId !== item._id? <button className="btn btn-warning" onClick={()=>handleEdit(item)}>Edit</button>:<button className="btn btn-warning" onClick={handleUpdate}>Update</button>}
                        
                        {editId ===-1 ? <button className='btn btn-danger' onClick={()=>handleDelete(item._id)}>Delete</button>:
                        
                        <button className='btn btn-danger' onClick={handleEditCancel}>Cancel</button>}
                    </div>
                </li>)
                }
                
            </ul>
        </div>

           

        
        
    </>
    )
    
}
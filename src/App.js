import {useState, useEffect} from 'react';

import axios from 'axios';

import './App.css';


function App() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);

  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');



  //TO ADD NEW TODO ITEM TO DATABASE:

  const addItem = async (e) => {
    e.preventDefault();

    try{
      const res = await axios.post('http://localhost:8001/api/item', {item: itemText})
      setListItems(prev => [...prev, res.data]);
      
      setItemText('');
    }
    catch(err){
      console.log(err);
    }
  }


//TO CREATE FUNCTION TO FETCH ALL TODO ITEMS FROM DATABASE:

  useEffect(()=>{
    const getItemsList = async () => {

      try{
        const res = await axios.get('http://localhost:8001/api/items')
        setListItems(res.data);

        console.log('render')
      }
      catch(err){
        console.log(err);
      }
    }
    getItemsList()
  },[]);



  // TO DELETE ITEMS WHEN CLICKING ON DELETE:

  const deleteItem = async (id) => {

    try{
      const res = await axios.delete(`http://localhost:8001/api/item/${id}`)
      const newListItems = listItems.filter(item=> item._id !== id);

      setListItems(newListItems);
    }
    catch(err){
      console.log(err);
    }
  }


//TO UPDATE THE ITEMS:

  const updateItem = async (e) => {
    e.preventDefault()

    try{
      const res = await axios.put(`http://localhost:8001/api/item/${isUpdating}`, 
      {item: updateItemText})

      console.log(res.data)

      const updatedItemIndex = listItems.findIndex(item => item._id === isUpdating);
      const updatedItem = listItems[updatedItemIndex].item = updateItemText;

      setUpdateItemText('');
      setIsUpdating('');
    }
    catch(err){
      console.log(err);
    }
  }



  //BEFORE UPDATING THE ITEMS WE NEED TO SHOW SOME ITEMS:

  const renderUpdateForm = () => (

    <form className="update-form" onSubmit={(e)=>{updateItem(e)}} >

      <input className="update-new-input" type="text" placeholder="New Item" onChange={e=>{setUpdateItemText(e.target.value)}} value={updateItemText} />

      <button className="update-new-btn" type="submit">UPDATE</button>
    </form>
  )

  return (
    <div className="App">

      <h1>TODO LIST</h1>

      <form className="form" onSubmit={e => addItem(e)}>
        <input type="text" placeholder='Add Todo Item' onChange={e => {setItemText(e.target.value)} } value={itemText} />
        <button type="submit">ADD</button>
      </form>

      <div className="todo-listItems">
        {
          listItems.map(item => (
          <div className="todo-item">
            {
              isUpdating === item._id
              ? renderUpdateForm()
              : <>
                  <p className="item-content">{item.item}</p>

                  <button className="update-item" onClick={()=>{setIsUpdating(item._id)}}>UPDATE</button>
                  <button className="delete-item" onClick={()=>{deleteItem(item._id)}}>DELETE</button>
                </>
            }
          </div>
          ))
        }
        

      </div>
    </div>
  );
}

export default App;

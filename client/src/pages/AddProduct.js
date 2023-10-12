import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const [prodName, setProdName] = useState("");
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [company, setCompany] = useState("")
    const [error, setError] = useState(false)
    const navigate = useNavigate()

    const handleAddProduct = async () => {

        if (!prodName || !price || !category || !company) {
            setError(true)
            return false
        }


        // console.log(prodName, price, category, company)
        const userId = JSON.parse(localStorage.getItem("user"))._id;
        // console.log(userId)
        let result = await fetch("/api/product/addProduct", {
            method: 'POST',
            body: JSON.stringify({ name:prodName, price, category, company, userId }),
            headers: {
                'Content-Type': 'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        result = await result.json();
        // console.log(result)
        alert("Product Added Successfully..!")
        navigate('/')
    }

    return (
        <div className='add-product'>
            <h1>Add Product</h1>
            <input type="text" placeholder='Enter product name' className='input-box' onChange={(e) => setProdName(e.target.value)} value={prodName} />
            {error && !prodName && <span className='validation-error'>Enter valid name</span>}
            <input type="text" placeholder='Enter product price' className='input-box' onChange={(e) => setPrice(e.target.value)} value={price} />
            {error && !price && <span className='validation-error'>Enter valid price</span>}
            <input type="text" placeholder='Enter product category' className='input-box' onChange={(e) => setCategory(e.target.value)} value={category} />
            {error && !category && <span className='validation-error'>Enter valid category</span>}
            <input type="text" placeholder='Enter product company' className='input-box' onChange={(e) => setCompany(e.target.value)} value={company} />
            {error && !company && <span className='validation-error'>Enter valid company</span>}
            <button type='button' className='app-button' onClick={handleAddProduct}>Add Product</button>
        </div>
    )
}

export default AddProduct;
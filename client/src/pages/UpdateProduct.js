import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProduct = () => {
    const [prodName, setProdName] = useState("");
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [company, setCompany] = useState("")
    const params = useParams()
    const navigate = useNavigate()
    
    useEffect(()=> {
        getProductDetails();
    }, [])

    const getProductDetails = async ()=> {
        // console.log(params)
        let result = await fetch(`/api/product/details/${params.id}`,{
            headers:{
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        // console.log(result)
        setProdName(result.name);
        setPrice(result.price);
        setCategory(result.category);
        setCompany(result.company);
    }

    const handleUpdateProduct = async () => {
        // console.log(prodName, price, category, company)
        let result = await fetch(`/api/product/update/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: prodName,
                price, 
                category, 
                company
            }),
            headers: {
                'Content-Type':'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        result = await result.json()
        // console.log(result)
        if(result) {
            alert('Product Updated Successfully..!');
            navigate('/')
        }
    }

    return (
        <div className='add-product'>
            <h1>Update Product</h1>
            <input type="text" placeholder='Enter product name' className='input-box' onChange={(e) => setProdName(e.target.value)} value={prodName} />
            <input type="text" placeholder='Enter product price' className='input-box' onChange={(e) => setPrice(e.target.value)} value={price} />
            <input type="text" placeholder='Enter product category' className='input-box' onChange={(e) => setCategory(e.target.value)} value={category} />
            <input type="text" placeholder='Enter product company' className='input-box' onChange={(e) => setCompany(e.target.value)} value={company} />
            <button type='button' className='app-button' onClick={handleUpdateProduct}>Update Product</button>
        </div>
    )
}

export default UpdateProduct;
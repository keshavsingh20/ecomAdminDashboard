import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([])
    // const navigate = useNavigate()

    useEffect(() => {
        getProducts();
    }, [])

    const getProducts = async () => {
        let result = await fetch("/api/product/products", {
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json()
        setProducts(result)
    }
    // console.log(products)

    const deleteProduct = async (id) => {
        let result = await fetch(`/api/product/delete/${id}`, {
            method: 'DELETE',
            headers:{
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        result = await result.json()
        if (result) {
            alert('Product Deleted Successfully')
            getProducts()
        }
    }

    const handleSearch = async (event) => {
        // console.log(event.target.value)
        let key = event.target.value;
        if (key) {
            let result = await fetch(`/api/product/search/${key}`, {
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            result = await result.json();
            if (result) {
                setProducts(result)
            }
        }
        else {
            getProducts()
        }
    }

    return (
        <div className='product-list'>
            <h1>Product List</h1>
            <input className='search' type="text" placeholder='Search products here..!'
                onChange={handleSearch}
            />

            <div className="product-list-tbl">
            <table className='product-table' border="1" width="100%">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Company</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.length > 0 ?
                            products.map((item, index) =>
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>₹ {item.price}</td>
                                    <td>{item.category}</td>
                                    <td>{item.company}</td>
                                    <td>
                                        <button onClick={() => deleteProduct(item._id)} className='prodListBtn' >Delete</button>
                                        <Link to={`/update/${item._id}`} className='prodListBtn' style={{ paddingTop: '1px', paddingBottom: '1px' }}>Update</Link>
                                    </td>
                                </tr>
                            )
                            :
                            <tr>
                                <td colSpan={6}><h2>No Products Found..!</h2></td>
                            </tr>
                    }
                </tbody>
            </table>
            </div>
        </div>
    )
}

export default ProductList;
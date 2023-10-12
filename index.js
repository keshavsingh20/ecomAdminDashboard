const express = require('express');
const cors = require('cors');
// require('./db/config')
const User = require('./Model/User')
const Product = require('./Model/Product')
const Jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const connect = require('./db/config')
const bcrypt = require('bcrypt')

const jwtKey = process.env.JWT_SECRET_KEY;

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(express.static('./client/build'))

app.post('/api/user/register', async (req, resp) => {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const user = new User(req.body);
    let result = await user.save();
    result = result.toObject(); // will convert the result into an object
    delete result.password; // will remove password so we can't see the user password in the responses
    if (result) {
        Jwt.sign({result},jwtKey,{expiresIn:'2h'}, (err, token)=>{
            if(err) {
                resp.send({result: 'Something Went Wrong, Please Try Again After Sometime.'})
            }
            resp.send({result, auth:token});
        })
    }
})

app.post('/api/user/login', async (req, resp) => {
    // console.log(req.body)
    if (req.body.email && req.body.password) {
        // const salt = await bcrypt.genSalt(10);
        // req.body.password = await bcrypt.hash(req.body.password, salt);
        // const user = await User.findOne(req.body).select("-password");
        // if (user) {
        //     Jwt.sign({user},jwtKey,{expiresIn:'2h'}, (err, token)=>{
        //         if(err) {
        //             resp.send({result: 'Something Went Wrong, Please Try Again After Sometime.'})
        //         }
        //         resp.send({user, auth:token});
        //     })
        // }
        // else {
        //     resp.send({ result: 'No user found' })
        // }

        try {
            // Find the user by email
            let user = await User.findOne({ email: req.body.email });

            if (user) {
                // Compare the hashed password from the request with the hashed password in the database
                const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
                
                if (isPasswordValid) {
                    // Passwords match, generate a JWT
                    const token = Jwt.sign({ user }, jwtKey, { expiresIn: '2h' });
                    user = user.toObject()
                    delete user.password;
                    resp.send({ user, auth: token });
                } else {
                    resp.send({ result: 'Invalid password' });
                }
            } else {
                resp.send({ result: 'No user found' });
            }
        } catch (err) {
            console.log(err)
            resp.status(500).send({ result: 'Server error' });
        }
    }
    else {
        resp.send({ result: 'No user found' })
    }
})

app.get('/api/user/profile/:id', verifyToken, async(req, resp)=> {
    let user = await User.find({_id: req.params.id}).select("-password");
    resp.send(user)
})

app.put('/api/user/profile/edit/:id', verifyToken, async (req, resp)=> {
    let user = await User.updateOne(
        {_id : req.params.id}, 
        {
            $set: req.body
        }
    )
    resp.send(user)
})

app.put('/api/user/profile/change/password/:id', async (req, resp)=> {
    // const salt = await bcrypt.genSalt(10);
    // req.body.currentPassword = await bcrypt.hash(req.body.currentPassword, salt);
    // req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);
    // let data = await User.updateOne(
    //     {_id: req.params.id, password: req.body.currentPassword},
    //     {
    //         $set: {
    //             password: req.body.newPassword
    //         }
    //     }
    // )
    // resp.send(data)

    if (req.body.currentPassword && req.body.newPassword) {
        try {
            // Find the user by ID
            const user = await User.findById(req.params.id);

            if (user) {
                // Compare the current password with the one stored in the database
                const isPasswordValid = await bcrypt.compare(req.body.currentPassword, user.password);

                if (isPasswordValid) {
                    // If the current password is valid, update the password with the new one
                    const newPasswordHash = await bcrypt.hash(req.body.newPassword, 10);

                    let data = await User.updateOne(
                        { _id: req.params.id },
                        { $set: { password: newPasswordHash } }
                    );

                    resp.send(data);
                } else {
                    resp.send({ result: 'Current password is incorrect' });
                }
            } else {
                resp.send({ result: 'No user found' });
            }
        } catch (err) {
            resp.status(500).send({ result: 'Server error' });
        }
    } else {
        resp.send({ result: 'Invalid request' });
    }
})

app.post('/api/product/addProduct', verifyToken, async (req, resp) => {
    // console.log(req.body)
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result)
})

app.get('/api/product/products', verifyToken, async (req, resp) => {
    let products = await Product.find();
    if (products.length > 0) {
        resp.send(products)
    }
    else {
        resp.send({ result: "No products found...!" })
    }
})

app.delete('/api/product/delete/:id', verifyToken, async (req, resp) => {
    const result = await Product.deleteOne({ _id: req.params.id })
    resp.send(result)
})

app.get('/api/product/details/:id', verifyToken, async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        resp.send(result);
    }
    else {
        resp.send({ result: 'No record find' })
    }
})

app.put('/api/product/update/:id', verifyToken, async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
    })
    resp.send(result)
})

app.get('/api/product/search/:key', verifyToken, async (req, resp)=> {
    let result = await Product.find({
        "$or":[
            {name: {$regex:req.params.key}},
            {company: {$regex:req.params.key}},
            {category: {$regex:req.params.key}},
        ]
    })

    resp.send(result)
})


function verifyToken(req, resp, next) {
    let token = req.headers['authorization'];
    if(token) {
        token = token.split(' ')[1];
        Jwt.verify(token, jwtKey, (err, success)=> {
            if(err) {
                resp.status(401).send({result: "Please provide valid token."})
            }
            else {
               next()
            }
        })
    }
    else {
        resp.status(403).send({result: "Please add token with headers."})
    }
}

// app.listen(5000, (err) => {
//     if (err)
//         console.log("Some Error Occured While Setup The Server : " + err)
//     else
//         console.log("Server is listening to port 5000")
// });


connect().then(()=>{
    try{
        app.listen(5000, () => {
            console.log(`Server connected to the Port 5000`)
        });
    }
    catch(err) {
        console.log("Some error occured while connecting to the server.")
        // console.log("error :",err);
    }
}).catch((error) => {
    // console.log(error)
    console.log("Invalid DataBase Connection...!");
  });
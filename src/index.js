
import express from 'express'
import cors from 'cors'
import categoriesRouter from './router/categoriesRouter.js';
import productRouter from './router/productRouter.js';
import userRouter from './router/userRouter.js';
import cartRouter from './router/cartRouter.js';

const app=express();
// dinh vi lai duong dan load tai nguyen

app.use(express.static("."))

// kết nói CSDL
// mở chặn cors



app.use(cors({origin:"*"}))


app.use(express.json());



app.use(categoriesRouter)
app.use(productRouter)
app.use(userRouter)
app.use(cartRouter)


app.listen(8080);


import express from 'express'
import connectDb from '../model/db.js';
import { addCategories, getCategories,deleteCategories, putCategories } from '../controller/categoriesController.js';
import { middleToken } from '../config/jwt.js';
const categoriesRouter=express.Router();

categoriesRouter.get('/categories',getCategories);
categoriesRouter.post('/post-categories',addCategories);
categoriesRouter.delete("/delete-categories/:categoriesId",deleteCategories)
categoriesRouter.put("/put-categories/:categoriesId",putCategories)

  export default categoriesRouter
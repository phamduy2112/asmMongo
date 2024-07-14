
import express from 'express'
import connectDb from '../model/db.js';

// const { ObjectId } = require('mongodb');\
import { addProduct, deleteProduct, getProductAll, getProductDiscount, getProductDiscountById, getProductHot, listProductLook, productDetail, searchProduct } from '../controller/productController.js';
import { middleToken } from '../config/jwt.js';
import { responseSend } from '../config/response.js';
const productRouter=express.Router();

//Lấy tất cả sản phẩm dạng json
productRouter.get('/products', getProductAll);
productRouter.get('/products-hot', getProductHot);
productRouter.get('/products-discount', getProductDiscount);
productRouter.get('/product-discount-by-id/:idProduct/:num', getProductDiscountById);
//Lấy danh sách sản phẩm theo idcate
productRouter.get('/productbycate/:idcate', async(req, res, next)=> {
  const categoryId=req.params.idcate
  const db=await connectDb();
  const productCollection=db.collection('sanPham');
  const products=await productCollection.find({categoryId}).toArray();
  if(products){
    responseSend(res, products, "Thành công !", 200);

  }else{
    res.status(404).json({message : "Không tìm thấy"})
  }
}
);
// tìm kiếm
productRouter.get('/search/:keyword', searchProduct);
productRouter.post("/post-product",addProduct)
productRouter.delete("/delete-product/:productId",deleteProduct)
//sản phẩm chi tiết
productRouter.get('/product-detail/:productId',productDetail)

// tìm kiếm sản phẩm list room
productRouter.get('/product-list/:idLoai/:discount', listProductLook)

export default productRouter;

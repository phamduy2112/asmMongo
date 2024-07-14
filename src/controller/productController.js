import express from 'express'
import { ObjectId } from 'mongodb';
import connectDb from '../model/db.js';
import { deleteFile, upload } from '../config/upload.js';
import path from 'path';
import { responseSend } from '../config/response.js';


const getProductAll=async(req,res)=>{
    try{
        const db=await connectDb();
        const productCollection=db.collection('sanPham');
        const products=await productCollection.find().toArray();
        if(products){
          responseSend(res, products, "Thành công !", 200);
        }else{
          res.status(404).json({message : "Không tìm thấy"})
        }
    }catch(e){
        res.status(400).json({message:'Lỗi server'})
    }
}
// san pham hot
const getProductHot=async(req,res)=>{
  try{
    const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
    const productCollection = db.collection('sanPham'); // Lấy collection 'products'
    const hotProduct = await productCollection.aggregate([
      // Tính tổng lượng mua
     { $sort: { hot: -1 } }, // Sắp xếp theo tổng lượng mua giảm dần
     { $limit: 5 } // Lấy ra 6 sản phẩm đầu tiên sau khi đã sắp xếp
 ]).toArray();
   if(hotProduct){
    responseSend(res, hotProduct, "Thành công !", 200);
  }else{
     res.status(404).json({message : "Không tìm thấy"})
   }
   
  }catch(e){
    
  }
}
const getProductDiscount=async(req,res)=>{
  try{
    const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
    const productCollection = db.collection('sanPham'); // Lấy collection 'products'
    const discountProduct = await productCollection.aggregate([
      // Tính tổng lượng mua
     { $sort: { discount: -1 } }, // Sắp xếp theo tổng lượng mua giảm dần
     { $limit: 5 } // Lấy ra 6 sản phẩm đầu tiên sau khi đã sắp xếp
 ]).toArray();
   if(discountProduct){
    responseSend(res, discountProduct, "Thành công !", 200);
  }else{
     res.status(404).json({message : "Không tìm thấy"})
   }
   
  }catch(e){
    
  }
}
const getProductDiscountById=async(req,res)=>{
  try{
    const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
    const productCollection = db.collection('sanPham'); // Lấy collection 'products'
    const idProduct = req.params.idProduct; // Lấy productId từ URL
    const num = req.params.num; // Lấy productId từ URL
    console.log(num);
    let discountProduct
    if(num==0){
       discountProduct = await productCollection.aggregate([
        { $match: { categoryId: idProduct, discount: { $eq: 0 } } }, // Filter products with discount greater than 0
       { $sort: { discount: -1 } }, // Sắp xếp theo tổng lượng mua giảm dần
   ]).toArray();
    }else{
       discountProduct = await productCollection.aggregate([
      { $match: { categoryId: idProduct, discount: { $gt: 0 } } }, // Filter products with discount greater than 0
     { $sort: { discount: -1 } }, // Sắp xếp theo tổng lượng mua giảm dần
 ]).toArray();
    }
    
   if(discountProduct){
    responseSend(res, discountProduct, "Thành công !", 200);
  }else{
     res.status(404).json({message : "Không tìm thấy"})
   }
   
  }catch(e){
    console.log(e);
  }
}
// sản phẩm chi tiết
const productDetail=async (req, res) => {
    try {
      const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
      const productCollection = db.collection('sanPham'); // Lấy collection 'products'
  
      const productId = req.params.productId; // Lấy productId từ URL
  
      // Tìm kiếm sản phẩm theo productId
      const objectId = new ObjectId(productId); // Chuyển đổi productId sang ObjectId
  
      // Tìm kiếm sản phẩm theo _id (là ObjectId)
      const product = await productCollection.findOne({ _id: objectId });
  
      if (!product) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      }
  
      responseSend(res, product, "Thành công !", 200);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy thông tin sản phẩm' });
    }
  };

  // tìm kiếm sản phẩm 
  const searchProduct=async(req, res, next)=> {
    try{
      const db = await connectDb(); // Kết nối tới cơ sở dữ liệu, đây có thể là MongoDB hoặc một loại cơ sở dữ liệu khác
      const productCollection = db.collection('sanPham'); // Lấy collection 'products' từ cơ sở dữ liệu đã kết nối
    
      // Tìm kiếm các sản phẩm có tên chứa keyword truyền vào (không phân biệt chữ hoa, chữ thường)
      const products = await productCollection.find({ name: new RegExp(req.params.keyword, 'i') }).toArray();
    
      if (products) {
        responseSend(res, products, "Thành công !", 200);
      } else {
        res.status(404).json({ message: "Không tìm thấy" }); // Nếu không tìm thấy sản phẩm nào, trả về mã lỗi 404 và thông báo "Không tìm thấy"
      }
    }catch(e){
      console.log(e);
    }
   
  }
// add sản phẩm
const addProduct=async(req,res)=>{
    try{
        const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
    const productCollection = db.collection('sanPham'); // Lấy collection 'products'
    upload.single('image')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: 'Lỗi khi upload file hình ảnh' });
        }

const {name,price,categoryId,discount}=req.body;
const image = req.file ? `${req.file.filename}` : '';
        const result=await productCollection.insertOne({
            name,price,categoryId,image,
            hot:0,
            discount,
            quantity:100,
        }) 
        console.log(image);
        if(result){
            res.status(200).json({ message: 'Thành công' });

        } else {
          res.status(500).json({ message: 'Lỗi khi thêm sản phẩm' });
        }

    })

        

    }catch(e){
        console.log(e);
        res.status(400).json({message:"Lỗi server"})
    }
}
// chỉnh sửa sản phẩm
const putProduct=async(req,res)=>{
    try{
        const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
    const productCollection = db.collection('products'); // Lấy collection 'products'

    const {name,price,categoryId,discount}=req.body;
    const productId = req.params.productId; 
        const objectId = new ObjectId(productId); // Chuyển đổi productId sang ObjectId
      
        const result=await productCollection.updateOne({ _id: objectId },
            {
              $set: {
                name,price,categoryId,
      
            discount,
         
              },
            })
        if(result){
            res.status(201).json({message:"Thêm thành công sản phẩm"});
        } else {
          res.status(500).json({ message: 'Lỗi khi thêm sản phẩm' });
        }

    }catch(e){
        res.status(400).json({message:"Lỗi server"})
    }
}
// xóa sản phẩm
const deleteProduct=async(req,res)=>{
    try{
        const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
    const productCollection = db.collection('sanPham'); // Lấy collection 'products'

    const productId = req.params.productId; // Lấy productId từ URL
        console.log(productId);
    // Tìm kiếm sản phẩm theo productId
    
    const objectId = new ObjectId(productId); // Chuyển đổi productId sang ObjectId
    const product = await productCollection.findOne({ _id:objectId });

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
    }

    // Xóa file từ thư mục lưu trữ
    const filePath = path.join( 'public', 'img', product.image); // Đường dẫn đầy đủ của file cần xóa
    deleteFile(filePath);
    const result=await productCollection.deleteOne({ _id: objectId })
    
        if(result){
            res.status(201).json({message:"Xóa thành công sản phẩm"});
        } else {
          res.status(500).json({ message: 'Lỗi khi xóa sản phẩm' });
        }

    }catch(e){
        console.log(e);
        res.status(400).json({message:"Lỗi server"})
    }
}
const listProductLook=async(req,res)=>{
  try{
    const { idLoai, discount } = req.params;

    // let minPrice = parseInt(req.query.minPrice) || 0;
    // let maxPrice = parseInt(req.query.maxPrice) || 100000000;
    const db=await connectDb();
    const productCollection=db.collection('sanPham');
    let filter = { 
      categoryId: idLoai,
      // price: { $gte: minPrice, $lte: maxPrice }
    };
   
    if(discount=='1'){
      filter.discount = { $gt: 0 }; // Lớn hơn 0
    }else if(discount=='2'){
      filter.discount = { $eq: 0 }; // nhỏ hơn 0

    }
    const products = await productCollection.find(filter).toArray();
    if(products){
      res.status(200).json(products);
    }else{
      res.status(404).json({message : "Không tìm thấy"})
    }

  }catch(e){
    console.log(e);
  
  }
 
}

// 
export {
    productDetail,addProduct,deleteProduct,getProductAll,listProductLook
,getProductHot,getProductDiscount,searchProduct,getProductDiscountById
  }
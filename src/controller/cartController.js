import express from "express";
import connectDb from "../model/db.js";
import { ObjectId } from "mongodb";
import { responseSend } from "../config/response.js";

const donHang=async (req,res)=>{
    try {
        const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
        const categoriesCollection = db.collection("donHang"); // Lấy collection 'products'
        const {tenKhachHang,soLuong,id_khachHang}=req.body;

 
        let newDonHang={
            tenKhachHang,
            id_khachHang,
            soLuong,
            trangThai:"Đang chuẩn bị",
            ngayThang:new Date(),
        }
        const result = await categoriesCollection.insertOne(newDonHang);
        if (result) {
            responseSend(res, result, "Thành công !", 200);
        } else {
          res.status(500).json({ message: "Lỗi khi thêm sản phẩm" });
        }
      } catch (e) {
        res.status(400).json({ message: "Lỗi server" });
      }
}
const donHangChiTiet=async (req,res)=>{
    try {
        const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
        const categoriesCollection = db.collection("donHangChiTiet"); // Lấy collection 'products'
        
       
     
        const {listCart,id_donHang,id_khachHang}=req.body;
        const result = await categoriesCollection.insertMany(listCart.map(item => ({
            id_donHang,
            id_khachHang,
            id_sanPham: item._id,
            soLuong: item.soLuong,
            price:item.price,
            discount:item.discount,
            name:item.name
            // Thêm các trường dữ liệu khác cần thiết
          })));
      
          if (result) {
            res.status(201).json({ message: "Thêm thành công sản phẩm" });
          } else {
            res.status(500).json({ message: "Lỗi khi thêm sản phẩm" });
          }
      
      } catch (e) {
        res.status(400).json({ message: "Lỗi server" });
      }
}
const getDonHang=async(req,res)=>{
try{
  const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
  const categoriesCollection = db.collection("donHang"); // Lấy collection 'products'
  const idUser=req.params.idUser;
  const userCollection = db.collection("user"); 
  const objectId = new ObjectId(idUser); // Chuyển đổi productId sang ObjectId

  const result = await categoriesCollection.find({ id_khachHang: idUser }).sort({ ngayTao: -1 }).toArray()
  if (result) {
            responseSend(res,result, "Thành công !", 200);
        } else {
          res.status(500).json({ message: "Lỗi khi thêm sản phẩm" });
        }
}catch(e){
  console.log(e);
}
}
const getDonHangChiTiet=async(req,res)=>{

  try{
    const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
    const categoriesCollection = db.collection("donHangChiTiet"); // Lấy collection 'products'
    const idDonHang=req.params.idDonHang;
  
    const result = await categoriesCollection.find({ id_donHang: idDonHang }).toArray()
    if (result) {
              responseSend(res,result, "Thành công !", 200);
          } else {
            res.status(500).json({ message: "Lỗi khi thêm sản phẩm" });
          }
  }catch(e){
    console.log(e);
  }
}
export {donHang,donHangChiTiet,getDonHang,getDonHangChiTiet}
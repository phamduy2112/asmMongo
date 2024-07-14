import express from "express";
import connectDb from "../model/db.js";
import { ObjectId } from "mongodb";
import { responseSend } from "../config/response.js";

const getCategories = async (req, res, next) => {
  try {
    const db = await connectDb();
    const categoriesCollection = db.collection("loai");
    const categories = await categoriesCollection.find().toArray();
    if (categories) {
      responseSend(res, categories, "Thành công !", 200);
    } else {
      responseSend(res, "", "Thất bại !", 404);
    }
  } catch (e) {
    console.log(e);
    res.status(201).json({ message: "Lỗi server" });
  }
};
const addCategories = async (req, res) => {
  try {
    const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
    const categoriesCollection = db.collection("loai"); // Lấy collection 'products'

    const { tenLoai } = req.body;
    console.log(tenLoai);
    const result = await categoriesCollection.insertOne({
      tenLoai,
    });
    if (result) {
      res.status(201).json({ message: "Thêm thành công sản phẩm" });
    } else {
      res.status(500).json({ message: "Lỗi khi thêm sản phẩm" });
    }
  } catch (e) {
    res.status(400).json({ message: "Lỗi server" });
  }
};
const deleteCategories = async (req, res, next) => {
  try {
    const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
    const categoriesCollection = db.collection("loai"); // Lấy collection 'products'

    const categoriesId = req.params.categoriesId; // Lấy categoriesId từ URL

    // Tìm kiếm sản phẩm theo categoriesId
    const objectId = new ObjectId(categoriesId); // Chuyển đổi categoriesId sang ObjectId
    const result = await categoriesCollection.deleteOne({ _id: objectId });
    if (result) {
      res.status(201).json({ message: "Xóa thành công sản phẩm" });
    } else {
      res.status(500).json({ message: "Lỗi khi xóa sản phẩm" });
    }
  } catch (e) {
    res.status(400).json({ message: "Lỗi server" });
  }
};
const putCategories = async (req, res) => {
  try {
    const { tenLoai } = req.body;
   
    const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
    const categoriesCollection = db.collection("loai"); // Lấy collection 'products'

    const categoriesId = req.params.categoriesId; // Lấy categoriesId từ URL
    const objectId = new ObjectId(categoriesId); // Chuyển đổi categoriesId sang ObjectId

    const result = await categoriesCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          tenLoai: tenLoai,
        },
      }
    );
    if (result) {
      responseSend(res, result, "Thành công !", 200);
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Lỗi server" });
  }
};
export { getCategories, addCategories, deleteCategories, putCategories };

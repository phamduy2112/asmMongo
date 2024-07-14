import express from 'express'
import { donHang,donHangChiTiet, getDonHang, getDonHangChiTiet } from '../controller/cartController.js';

const cartRouter=express.Router();
cartRouter.post("/don-hang",donHang)
cartRouter.post("/don-hang-chi-tiet",donHangChiTiet)
cartRouter.get("/get-don-hang/:idUser",getDonHang)
cartRouter.get("/get-don-hang-chi-tiet/:idDonHang",getDonHangChiTiet)

export default cartRouter
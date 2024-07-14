import bcrypt from "bcrypt";
import connectDb from "../model/db.js";
import { responseSend } from "../config/response.js";
import { checkToken, createToken, createTokenRef, decodeToken } from "../config/jwt.js";
import { ObjectId } from 'mongodb';

const signin = async (req, res) => {
    const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
    const userCollection = db.collection('user'); // Lấy collection 'products'
  let { email, password, name,password2 } = req.body;

if(password===password2){
    let newUser = {
    email,
    password:bcrypt.hashSync(password,10),
    name,
    sdt: "",
    diaChi: "",
    token: "",
    refreshToken: "",
    dataTime: "",
    vaiTro: "user",
  };
  const result=await userCollection.insertOne(newUser)

if(result){
  responseSend(res,result,"Thành công !",200)
} else {
  responseSend(res,'',"Thêm người dùng thất bại",400)
}
}else{
  responseSend(res,'',"Mật khẩu không trùng khớp",400)
}
};
const login=async(req,res)=>{
  try{
    let {email,password}=req.body;
   
    const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
    const userCollection = db.collection('user'); // Lấy collection 'products'
    let checkUser=await userCollection.findOne({email});
    if(checkUser){
      if(bcrypt.compareSync(password,checkUser.password)){
        let token=createToken({id:checkUser._id,vaiTro:checkUser.vaiTro})
        let tokenRef=createTokenRef({id:checkUser._id,vaiTro:checkUser.vaiTro});
        checkUser.refreshToken=tokenRef;
        const objectId = new ObjectId(checkUser._id);

        // Sau đó, sử dụng objectId trong các phương thức của MongoDB như updateOne
        await userCollection.updateOne(
          { _id: objectId },
          { $set: { 
            refreshToken: tokenRef ,
            // token
          } }
          
        );
        responseSend(res,[checkUser,{token:token}],"Token thành công",200)
        console.log(checkUser);
      }else{
        responseSend(res,"","sai mật khẩu",403)

      }
    }
  }catch(error){
    console.error('Lỗi khi thực hiện truy vấn đến MongoDB:', error);
    responseSend(res, "", "Server bị lỗi", 500);

  }
}
// resetToken 
const resetToken = async (req, res) => {
  try {
    const db = await connectDb(); // Kết nối tới cơ sở dữ liệu
    const userCollection = db.collection('user'); // Lấy collection 'user'

    // Lấy token từ header của request
    const token = req.headers.token;
    if (!token) {
      return responseSend(res, "", "Token is missing!", 400);
    }

    // Kiểm tra tính hợp lệ của token
    let errorToken = checkToken(token);
    if (errorToken && errorToken.name !== "TokenExpiredError") {
      return responseSend(res, "", "Invalid token!", 401);
    }

    // Giải mã token để lấy thông tin user
    let { data } = decodeToken(token);
    const objectId = new ObjectId(data.id); // Tạo ObjectId từ id của user

    // Truy vấn cơ sở dữ liệu để lấy thông tin user
    let getUser = await userCollection.findOne({
      _id: objectId
    });

    // Nếu không tìm thấy user
    if (!getUser) {
      return responseSend(res, "", "User not found!", 404);
    }

    // Tạo token mới với thông tin user lấy được
    let tokenNew = createToken({
      id: getUser._id,
      vaiTro: getUser.vaiTro
    });

    // Cập nhật token mới vào cơ sở dữ liệu cho user
    await userCollection.updateOne(
      { _id: objectId },
      { $set: { refreshToken: tokenNew } }
    );

    // Gửi phản hồi thành công với token mới và thông báo
    return responseSend(res, tokenNew, "Reset token successfully!", 200);

  } catch (e) {
    console.error('Error in resetToken:', e);
    return responseSend(res, "", "Server error!", 500);
  }
};
// lấy user ra id
const getUserId=async(req,res)=>{
  try{
    const db = await connectDb(); 
    const userCollection = db.collection('user'); 

    const userId = req.params.userId; 

    // Tìm kiếm sản phẩm theo productId
    const objectId = new ObjectId(userId);

    const userID =await userCollection.findOne({ _id: objectId });

    if(userID){
      responseSend(res,userID,"Thành công !",200);

    }else{
      responseSend(res,"","thất bại !",200);

    }
  }catch(e){
  }
}
// Đổi mật khẩu
const resetPassword=async(req,res)=>{
  try{
    let { confirmPassword,newPassword } = req.body;
    const db = await connectDb(); 
      const userCollection = db.collection('user'); 
  
      const userId = req.params.userId; 
  
   
      const objectId = new ObjectId(userId);
      const checkUser =await userCollection.findOne({ _id: objectId });
     console.log(checkUser);
      if(bcrypt.compareSync(confirmPassword,checkUser.password)){
        const resetPassword=await userCollection.updateOne(
          { _id: objectId },
          { $set: { 
  
            password:bcrypt.hashSync(newPassword,10),
          } }
          
        );
        responseSend(res,resetPassword,"Thành công !",200);
  
      }else{
        responseSend(res,"","thất bại !",401);

      }
  }catch(e){
    responseSend(res,"","Server Thất bại !",500);

    console.log(e);
  }
 
  
}
// chỉnh sửa tk
const resetUser=async(req,res)=>{
  const {email,name,sdt,diaChi}=req.body;
  const db = await connectDb(); 
      const userCollection = db.collection('user'); 
  
      const userId = req.params.userId; 
      const objectId = new ObjectId(userId);

      const checkUser =await userCollection.findOne({ _id: objectId });
  
      if(checkUser){
        const putUser=await userCollection.updateOne(
          { _id: objectId },
          { $set: { 
            email,
            name,
            sdt,
            diaChi
           
          } }
          
        );
        if(putUser){
           responseSend(res,putUser,"Thành công !",200);
        }
       
  
      }else{
        responseSend(res,"","thất bại !",200);
  
      }
}
// const uploadUser=async(req,res)=>{

// }
export {signin,login,resetToken,getUserId,resetPassword,resetUser}
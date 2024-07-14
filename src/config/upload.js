import multer from 'multer';
import { diskStorage } from 'multer'

export const upload=multer({
    storage:diskStorage({
        destination:process.cwd() + "/public/img",
        filename:(res,file,callback)=>{
            // đổi tên file
            let date=new Date();

            callback(null,date.getTime()+"_"+file.originalname); // 179898989_dog.jpg
        }
    })
})
import fs from 'fs';
import path from 'path';

// Hàm xóa file từ thư mục lưu trữ
export const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Lỗi khi xóa file:', err);
    } else {
      console.log('Đã xóa file thành công:', filePath);
    }
  });
};


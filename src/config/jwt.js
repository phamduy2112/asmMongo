import jwt from 'jsonwebtoken'
export const createToken=(data)=>{

    return jwt.sign({data},"BI_MAT",{expiresIn:'1m'})
}
export const createTokenRef=(data)=>{

    return jwt.sign({data},"BI_MAT_REF",{expiresIn:'30d'})
}
export const checkToken=(token)=> jwt.verify(token,"BI_MAT",(error)=>   error)
export const checkTokenRef=(token)=> jwt.verify(token,"BI_MAT_REF",(error)=>   error)
  

// decode token
export const decodeToken=(token)=>{
    return jwt.decode(token)
}
export const middleToken=(req,res,next)=>{
    let {token}=req.headers;
    let error=checkToken(token)
    if(error) res.status(401).send(error.name)
    else next();
    
}

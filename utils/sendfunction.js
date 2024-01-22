 export const success= (statusCode,result)=>{
    return {
        status:"ok",
        statusCode,
        result:result
    }
}
export const error= (statusCode,result)=>{
    return{
        status:"error",
        statusCode,
        result
    }
}
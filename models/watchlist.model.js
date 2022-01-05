import db from '../utils/db.js'
export default {
    add(entity){
       return db('favoriteproducts').insert(entity);
    }  ,
     async findByUid(uid){
        const list = await db("favoriteproducts").where("bidID", uid);
        if (list.length === 0) return null;
        return list[0];
    },
    async findByUidProID(uid, prodid){
        const list = await db("favoriteproducts").where("bidID", uid).andWhere('prodID', prodid);
        if (list.length === 0) return null;
        return list[0];
    },
    remove(uid, prodid){
        return db('favoriteproducts').where("bidID", uid).andWhere('prodID', prodid).del();
    },
   
}
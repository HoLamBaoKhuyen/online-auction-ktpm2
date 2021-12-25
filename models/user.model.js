
import db from '../utils/db.js'
export default {
    findAll(){
       // return list;
      
      return db.select().table('users');
    },
    
    async findByID(id){   
       const list =  await db('users').where('uID',id);
       if (list.length===0)
        return null;
       return list[0];
     },
    add(entity){
        return db('users').insert(entity);
    },
    del(id){
        return db('users').where('uID',id).del();
    },
    patch(entity){
        const id = entity.CatID;
        delete entity.id;
        return db('users').where('uID',id).update(entity);
    }
}
import db from "../utils/db.js"
export default {
    findAllLevel1(){
        return db('categories');
    },
    
    findAllLevel2(){
        return db('producttype');
    }
}
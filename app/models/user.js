const Model = require('./lib/model')

module.exports = class User extends Model {
  static get tableName() {
      return 'users';
  }
  
  
  
  
}
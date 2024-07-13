// activeUsers.js
class ActiveUsers {
    constructor() {
      if (!ActiveUsers.instance) {
        this.activeUsers = new Map();
        ActiveUsers.instance = this;
      }
      return ActiveUsers.instance;
    }
  
    getActiveUsers() {
      return this.activeUsers;
    }
  
    setActiveUser(userId, socketId) {
      this.activeUsers.set(userId, socketId);
    }
  
    removeActiveUser(userId) {
      this.activeUsers.delete(userId);
    }
  
    getUserSocketId(userId) {
      return this.activeUsers.get(userId);
    }
  }
  
  const instance = new ActiveUsers();
  Object.freeze(instance);
  
  export default instance;
  
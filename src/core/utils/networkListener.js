// NetworkListener.js
export default class NetworkListener {
    constructor() {
      this.callbacks = [];
      this.online = navigator.onLine;
  
      this.handleNetworkChange = this.handleNetworkChange.bind(this);
      window.addEventListener("online", this.handleNetworkChange);
      window.addEventListener("offline", this.handleNetworkChange);
    }
  
    handleNetworkChange() {
      this.online = navigator.onLine;
      this.callbacks.forEach(callback => callback(this.online));
    }
  
    subscribe(callback) {
      this.callbacks.push(callback);
    }
  
    unsubscribe(callback) {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }
  }
  
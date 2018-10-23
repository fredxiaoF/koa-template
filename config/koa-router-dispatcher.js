module.exports = class RouterDispatcher {
  
  constructor(anchor_or_opts) {
    let type_name = typeof anchor_or_opts;
    this.opts = {};
    
    if (type_name === 'string') {
      require('class-autoloader');
      let [controller_name, action_name] = anchor_or_opts.split('#');
      this.opts.controller = controller_name;
      this.opts.action = action_name;
    } else if (type_name === 'function') {
      this.middleware = anchor_or_opts;
    } else if (type_name === 'object') {
      this.opts = opts;
    } else {
      throw new TypeError("anchor_or_opts is not a string or function or object");
    }
  }
  
  
  static dispatch(route_opts) {
    
    dispatcher = new RouterDispatcher(route_opts);
    
    return async (ctx) => {
      if (dispatcher.middleware) {
        return await dispatcher.middleware(ctx);
      }
    
      let request_opts = {};
      Object.assign(request_opts, ctx.params);
      Object.assign(request_opts, dispatcher.opts);
    
      let controller = dispatcher.load_controller(request_opts);
      let processor = new controller(ctx);
      processor.ctx = ctx;
    
      let proxy = new Proxy(processor, {
        get: (tar, attr) => { return ctx[attr] ? ctx[attr] : tar[attr]; }
      });
    
      let action = proxy[request_opts.action];
    
      if (action) {
        await action.apply(proxy);
      } else {
        ctx.throw(500, `Action: ${request_opts.action} is missing in Controller: ${controller.name}`)
      }
    }
    
  }
  
  
  load_controller(request_opts) {
    if (typeof request_opts.controller === 'function') {
      return request_opts.controller;
    } else {
      return eval(request_opts.controller);
    }    
  }
  
  
  
  
}
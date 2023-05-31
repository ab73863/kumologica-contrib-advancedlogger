module.exports = function (App) {
  const { KLNode } = require('@kumologica/devkit');
  class AdvancedLoggerError extends Error {
    constructor(error) {
      super(error);
      this.name = 'Advanced Logger Failed';
      this.message = error.message;
      this.statusCode = '500';
      this.originalError = error;
    }
  }
  class AdvancedLogger extends KLNode {
    constructor(props) {
      super(App, props);
      this.name = props.name;
      this.message = props.message;
      this.data = props.data;
      this.environment = props.environment;
      this.servicename = props.servicename;
      this.level = props.level;
      this.meta = props.meta;
      this.ctxnid = props.ctxnid;
      this.types = props.types;
    }
    async handle(msg) {
      const Message = App.util.evaluateDynamicField(this.message, msg, this);
      const Data = App.util.evaluateDynamicField(this.data,msg,this);
      const Environment = App.util.evaluateDynamicField(this.environment,msg,this);
      const Servicename = App.util.evaluateDynamicField(this.servicename, msg, this);
      const Meta = App.util.evaluateDynamicField(this.meta, msg, this);
      const Ctxnid = App.util.evaluateDynamicField(this.ctxnid, msg, this);
      const Types = this.types;

      try {
        let logMessage = {}; 

        logMessage = {"type" : Types, "txnid": Ctxnid, "message": Message, "data" : Data, "environment": Environment, "servicename": Servicename, "meta": Meta}

        switch (this.level) {
          case 'INFO':
            this.log(logMessage);
            break;
          case 'WARN':
            this.warn(logMessage);
            break;
          case 'TRACE':
            this.trace(logMessage);
            break;
          case 'DEBUG':
            this.debug(logMessage);
            break;
          case 'ERROR':
            this.error(logMessage);
            break;
        }
        this.send(msg);
      } catch (error) {
        this.sendError(new AdvancedLoggerError(error), msg);
      }
    }
  }
  App.nodes.registerType('AdvancedLogger', AdvancedLogger);
};

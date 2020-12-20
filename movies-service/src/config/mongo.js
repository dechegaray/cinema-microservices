const MongoClient = require("mongodb");

const connect = (options, mediator) => {
  mediator.once("boot.ready", () => {
    MongoClient.connect(
      `mongodb://${options.server}/${options.db}`,
      (err, db) => {
        if (err) {
          mediator.emit("db.error", err);
        }

        db.admin().authenticate(options.user, options.pass, (err, result) => {
          if (err) {
            mediator.emit("db.error", err);
          }
          mediator.emit("db.ready", db);
        });
      }
    );
  });
};

module.exports = Object.assign({}, { connect });

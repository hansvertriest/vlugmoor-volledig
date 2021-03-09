"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerProtocol = exports.Environment = void 0;
var Environment;
(function (Environment) {
    Environment["development"] = "development";
    Environment["local"] = "local";
    Environment["production"] = "production";
    Environment["staging"] = "staging";
    Environment["test"] = "test";
})(Environment = exports.Environment || (exports.Environment = {}));
var ServerProtocol;
(function (ServerProtocol) {
    ServerProtocol["http"] = "http";
    ServerProtocol["https"] = "https";
})(ServerProtocol = exports.ServerProtocol || (exports.ServerProtocol = {}));
//# sourceMappingURL=config.types.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
var types_1 = require("../@types/types");
require("reflect-metadata");
var metadata_1 = require("../core/metadata");
var Uuid = __importStar(require("uuid"));
function Service() {
    return function ServiceDecorator(target) {
        var _a, _b;
        var params = (_a = Reflect.getMetadata("design:paramtypes", target)) !== null && _a !== void 0 ? _a : [];
        var args = params.map(function (param) {
            var _a;
            param.prototype.id = (_a = param.prototype.id) !== null && _a !== void 0 ? _a : Uuid.v4();
            return param.prototype.id;
        });
        target.prototype.id = (_b = target.prototype.id) !== null && _b !== void 0 ? _b : Uuid.v4();
        var sd = {
            target: target.prototype.id,
            proto: target,
            priority: params.length,
            args: args,
            type: types_1.InjectorType.Service,
        };
        metadata_1.MetaDataStorage.addServiceDescriptor(sd);
    };
}
exports.Service = Service;

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
exports.MetaDataStorage = void 0;
const types_1 = require("../@types/types");
const PriorityList_1 = require("../utils/PriorityList");
const dotenv_1 = require("dotenv");
const EnvConfig_1 = require("./EnvConfig");
const Uuid = __importStar(require("uuid"));
const router_1 = require("./router");
const path_1 = require("path");
class MetaDataStorage {
    constructor() {
        // descriptor metadata storage
        // routesMap: RouterMap = new Map();
        this.serviceDescriptors = new PriorityList_1.PriorityList();
        this.controllerDescriptors = [];
        this.actionDescriptors = new Map();
        this.argumentsDescriptors = new Map();
        this.entityDescriptors = [];
        // instantiation storage
        this.serviceInstantiationMap = new Map();
    }
    static getMetaDataStroage() {
        if (!MetaDataStorage.instacne) {
            MetaDataStorage.instacne = new MetaDataStorage();
        }
        return MetaDataStorage.instacne;
    }
    static addServiceDescriptor(sd) {
        MetaDataStorage.getMetaDataStroage().serviceDescriptors.enqueue(sd);
    }
    static addControllerDescriptor(cd) {
        MetaDataStorage.getMetaDataStroage().controllerDescriptors.push(cd);
    }
    static addActionDescriptor(rmd) {
        const prev = MetaDataStorage.getMetaDataStroage().actionDescriptors.get(rmd.target) ?? [];
        MetaDataStorage.getMetaDataStroage().actionDescriptors.set(rmd.target, [...prev, rmd]);
    }
    static addArgumentsDescriptor(ad) {
        const prev = this.getMetaDataStroage().argumentsDescriptors.get(ad.target) ?? [];
        this.getMetaDataStroage().argumentsDescriptors.set(ad.target, [...prev, ad]);
    }
    static addEntityDescriptor(ed) {
        this.getMetaDataStroage().entityDescriptors.push(ed);
    }
    static addMiddleware(m) {
        this.getMetaDataStroage().serviceDescriptors.enqueue(m);
    }
    initializeController() {
        for (const cd of this.controllerDescriptors) {
            const instance = this.instantiationController(cd.proto, cd.args);
            const routers = this.actionDescriptors.get(cd.target) ?? [];
            for (const router of routers) {
                const args = this.argumentsDescriptors.get(cd.target)?.filter((arg) => arg.key === router.key) ?? [];
                router_1.RouterUtils.add({ actionDescriptor: router, prefix: cd.prefix, args, host: instance });
            }
            // RouterStorage.printRouter();
        }
    }
    injectConfig() {
        const proto = Reflect.getPrototypeOf(MetaDataStorage.envConfig);
        proto.id = proto.id ?? Uuid.v4();
        this.serviceInstantiationMap.set(proto.id, MetaDataStorage.envConfig);
        return MetaDataStorage.envConfig;
    }
    instantiationServices() {
        for (const s of this.serviceDescriptors) {
            // undo 参数不存在的情况
            const args = [];
            s.args.forEach((arg) => {
                if (this.serviceInstantiationMap.has(arg) !== undefined) {
                    args.push(this.serviceInstantiationMap.get(arg));
                }
            });
            const instance = Reflect.construct(s.proto, args);
            if (s.type === types_1.InjectorType.Middleware) {
                // MiddlewareStorage.add(instance, s.middlewareTypes!);
            }
            else {
                this.serviceInstantiationMap.set(s.target, instance);
            }
        }
    }
    instantiationController(cc, args) {
        return Reflect.construct(cc, args.map((arg) => this.serviceInstantiationMap.get(arg)));
    }
    // private async initDatabase() {
    //   if (this.entityDescriptors.length !== 0) {
    //     /// 初始化数据库， 先拿配置文件
    //     const db = DinarDatabase.getMongoDBInstance();
    //     if (MetaDataStorage.envConfig.use_mongo) {
    //       try {
    //         for (const ed of this.entityDescriptors) {
    //           const model = db.collection<any>(ed.name);
    //           this.serviceInstantiationMap.set(ed.target, model);
    //         }
    //       } catch (e) {
    //         console.log(e);
    //       }
    //     } else {
    //       throw "do not enable mongo db from .env file";
    //     }
    //   }
    // }
    static async resolve() {
        const instacne = MetaDataStorage.getMetaDataStroage();
        instacne.injectConfig();
        // console.log(instacne.controllerDescriptor);
        // console.log(instacne.routerMethodDescriptor);
        // console.log(instacne.serviceDescriptor);
        // 首先连接数据库
        // instacne.initDatabase();
        // init entities undo
        instacne.instantiationServices();
        // console.log(instacne.serviceInstantiationMap);
        // init controllers doing
        instacne.initializeController();
    }
}
exports.MetaDataStorage = MetaDataStorage;
MetaDataStorage.envConfig = new EnvConfig_1.EnvConfig(dotenv_1.config({ path: path_1.resolve(process.cwd(), ".env") }).parsed);
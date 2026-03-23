"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandlordsController = void 0;
const common_1 = require("@nestjs/common");
const landlords_service_1 = require("./landlords.service");
let LandlordsController = class LandlordsController {
    landlords;
    constructor(landlords) {
        this.landlords = landlords;
    }
    list() {
        return this.landlords.list();
    }
};
exports.LandlordsController = LandlordsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LandlordsController.prototype, "list", null);
exports.LandlordsController = LandlordsController = __decorate([
    (0, common_1.Controller)("landlords"),
    __metadata("design:paramtypes", [landlords_service_1.LandlordsService])
], LandlordsController);
//# sourceMappingURL=landlords.controller.js.map
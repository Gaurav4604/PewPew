"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Game_1 = __importDefault(require("./components/Game"));
const App = () => {
    return (react_1.default.createElement("div", { className: "App" },
        react_1.default.createElement(Game_1.default, { width: 800, height: 600 })));
};
exports.default = App;

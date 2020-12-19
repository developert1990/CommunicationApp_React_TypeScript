"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const PORT = 1234;
app.get('/', (req, res) => {
    res.send(`server is running on ${PORT}`);
});
app.listen(PORT, () => {
    console.log("App is listening on port 1234");
});

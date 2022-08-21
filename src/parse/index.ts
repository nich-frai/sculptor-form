import {  z , } from "zod";

export const formParser = {
	...z,
	boolean : (...params : Parameters<typeof z.boolean>) => {
		return z.preprocess((v) => {
			let parseBool = Boolean(v);
			if(typeof parseBool !== "boolean") {
				throw new TypeError('Value is not a valid boolean!');
			}
			return parseBool;
		}, z.boolean(...params));
	},
	number : (...params : Parameters<typeof z.number>) => {
		return z.preprocess((v) => {
			let parseNumber = Number(v);
			if(isNaN(parseNumber)) {
				throw new TypeError('Value is not a valid number!');
			}
			return parseNumber;
		}, z.number(...params));
	},
}
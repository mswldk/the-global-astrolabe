import { cca2Codes } from "@repo/data/rest-countries/cca2.codes";
import { Cca2Code, Cca3Code, Ccn3Code, CiocCode } from ".";
import { cca3Codes } from "@repo/data/rest-countries/cca3.codes";
import { ciocCodes } from "@repo/data/rest-countries/cioc";
import { ccn3Codes } from "@repo/data/rest-countries/ccn3";

export type LiteralUnion<T> = T | (string & {});

export type Code = Cca2Code | Cca3Code | CiocCode | Ccn3Code;
export const ALL_CODES = [...cca2Codes, ...cca3Codes, ...ciocCodes, ...ccn3Codes] as const;
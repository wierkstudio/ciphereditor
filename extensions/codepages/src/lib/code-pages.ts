
/**
 * Object mapping code pages to labels
 * @author n1474335@gmail.com
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 * @see https://github.com/gchq/CyberChef/blob/ed8bd34915a70e15def593df4105a7f112b2ff69/src/core/lib/ChrEnc.mjs
 */
export const codePageLabelMap = {
  65001: 'UTF-8 (65001)',
  65000: 'UTF-7 (65000)',
  1200: 'UTF-16LE (1200)',
  1201: 'UTF-16BE (1201)',
  12000: 'UTF-32LE (12000)',
  12001: 'UTF-32BE (12001)',
  500: 'IBM EBCDIC International (500)',
  37: 'IBM EBCDIC US-Canada (37)',
  870: 'IBM EBCDIC Multilingual/ROECE (Latin 2) (870)',
  875: 'IBM EBCDIC Greek Modern (875)',
  1010: 'IBM EBCDIC French (1010)',
  1026: 'IBM EBCDIC Turkish (Latin 5) (1026)',
  1047: 'IBM EBCDIC Latin 1/Open System (1047)',
  1132: 'IBM EBCDIC Lao (1132/1133/1341)',
  1140: 'IBM EBCDIC US-Canada (037 + Euro symbol) (1140)',
  1141: 'IBM EBCDIC Germany (20273 + Euro symbol) (1141)',
  1142: 'IBM EBCDIC Denmark-Norway (20277 + Euro symbol) (1142)',
  1143: 'IBM EBCDIC Finland-Sweden (20278 + Euro symbol) (1143)',
  1144: 'IBM EBCDIC Italy (20280 + Euro symbol) (1144)',
  1145: 'IBM EBCDIC Latin America-Spain (20284 + Euro symbol) (1145)',
  1146: 'IBM EBCDIC United Kingdom (20285 + Euro symbol) (1146)',
  1147: 'IBM EBCDIC France (20297 + Euro symbol) (1147)',
  1148: 'IBM EBCDIC International (500 + Euro symbol) (1148)',
  1149: 'IBM EBCDIC Icelandic (20871 + Euro symbol) (1149)',
  20273: 'IBM EBCDIC Germany (20273)',
  20277: 'IBM EBCDIC Denmark-Norway (20277)',
  20278: 'IBM EBCDIC Finland-Sweden (20278)',
  20280: 'IBM EBCDIC Italy (20280)',
  20284: 'IBM EBCDIC Latin America-Spain (20284)',
  20285: 'IBM EBCDIC United Kingdom (20285)',
  20290: 'IBM EBCDIC Japanese Katakana Extended (20290)',
  20297: 'IBM EBCDIC France (20297)',
  20420: 'IBM EBCDIC Arabic (20420)',
  20423: 'IBM EBCDIC Greek (20423)',
  20424: 'IBM EBCDIC Hebrew (20424)',
  20833: 'IBM EBCDIC Korean Extended (20833)',
  20838: 'IBM EBCDIC Thai (20838)',
  20871: 'IBM EBCDIC Icelandic (20871)',
  20880: 'IBM EBCDIC Cyrillic Russian (20880)',
  20905: 'IBM EBCDIC Turkish (20905)',
  20924: 'IBM EBCDIC Latin 1/Open System (1047 + Euro symbol) (20924)',
  21025: 'IBM EBCDIC Cyrillic Serbian-Bulgarian (21025)',
  437: 'OEM United States (437)',
  737: 'OEM Greek (formerly 437G); Greek (DOS) (737)',
  775: 'OEM Baltic; Baltic (DOS) (775)',
  808: 'OEM Russian; Cyrillic + Euro symbol (808)',
  850: 'OEM Multilingual Latin 1; Western European (DOS) (850)',
  852: 'OEM Latin 2; Central European (DOS) (852)',
  855: 'OEM Cyrillic (primarily Russian) (855)',
  857: 'OEM Turkish; Turkish (DOS) (857)',
  858: 'OEM Multilingual Latin 1 + Euro symbol (858)',
  860: 'OEM Portuguese; Portuguese (DOS) (860)',
  861: 'OEM Icelandic; Icelandic (DOS) (861)',
  862: 'OEM Hebrew; Hebrew (DOS) (862)',
  863: 'OEM French Canadian; French Canadian (DOS) (863)',
  864: 'OEM Arabic; Arabic (864) (864)',
  865: 'OEM Nordic; Nordic (DOS) (865)',
  866: 'OEM Russian; Cyrillic (DOS) (866)',
  869: 'OEM Modern Greek; Greek, Modern (DOS) (869)',
  872: 'OEM Cyrillic (primarily Russian) + Euro Symbol (872)',
  874: 'Windows-874 Thai (874)',
  1250: 'Windows-1250 Central European (1250)',
  1251: 'Windows-1251 Cyrillic (1251)',
  1252: 'Windows-1252 Latin (1252)',
  1253: 'Windows-1253 Greek (1253)',
  1254: 'Windows-1254 Turkish (1254)',
  1255: 'Windows-1255 Hebrew (1255)',
  1256: 'Windows-1256 Arabic (1256)',
  1257: 'Windows-1257 Baltic (1257)',
  1258: 'Windows-1258 Vietnam (1258)',
  28591: 'ISO-8859-1 Latin 1 Western European (28591)',
  28592: 'ISO-8859-2 Latin 2 Central European (28592)',
  28593: 'ISO-8859-3 Latin 3 South European (28593)',
  28594: 'ISO-8859-4 Latin 4 North European (28594)',
  28595: 'ISO-8859-5 Latin/Cyrillic (28595)',
  28596: 'ISO-8859-6 Latin/Arabic (28596)',
  28597: 'ISO-8859-7 Latin/Greek (28597)',
  28598: 'ISO-8859-8 Latin/Hebrew (28598)',
  38598: 'ISO 8859-8 Hebrew (ISO-Logical) (38598)',
  28599: 'ISO-8859-9 Latin 5 Turkish (28599)',
  28600: 'ISO-8859-10 Latin 6 Nordic (28600)',
  28601: 'ISO-8859-11 Latin/Thai (28601)',
  28603: 'ISO-8859-13 Latin 7 Baltic Rim (28603)',
  28604: 'ISO-8859-14 Latin 8 Celtic (28604)',
  28605: 'ISO-8859-15 Latin 9 (28605)',
  28606: 'ISO-8859-16 Latin 10 (28606)',
  50220: 'ISO 2022 JIS Japanese with no halfwidth Katakana (50220)',
  50221: 'ISO 2022 JIS Japanese with halfwidth Katakana (50221)',
  50222: 'ISO 2022 Japanese JIS X 0201-1989 (1 byte Kana-SO/SI) (50222)',
  50225: 'ISO 2022 Korean (50225)',
  50227: 'ISO 2022 Simplified Chinese (50227)',
  20269: 'ISO 6937 Non-Spacing Accent (20269)',
  51932: 'EUC Japanese (51932)',
  51936: 'EUC Simplified Chinese (51936)',
  51949: 'EUC Korean (51949)',
  57002: 'ISCII Devanagari (57002)',
  57003: 'ISCII Bengali (57003)',
  57004: 'ISCII Tamil (57004)',
  57005: 'ISCII Telugu (57005)',
  57006: 'ISCII Assamese (57006)',
  57007: 'ISCII Oriya (57007)',
  57008: 'ISCII Kannada (57008)',
  57009: 'ISCII Malayalam (57009)',
  57010: 'ISCII Gujarati (57010)',
  57011: 'ISCII Punjabi (57011)',
  932: 'Japanese Shift-JIS (932)',
  936: 'Simplified Chinese GBK (936)',
  949: 'Korean (949)',
  950: 'Traditional Chinese Big5 (950)',
  20127: 'US-ASCII (7-bit) (20127)',
  20936: 'Simplified Chinese GB2312 (20936)',
  20866: 'KOI8-R Russian Cyrillic (20866)',
  21866: 'KOI8-U Ukrainian Cyrillic (21866)',
  620: 'Mazovia (Polish) MS-DOS (620)',
  708: 'Arabic (ASMO 708) (708)',
  720: 'Arabic (Transparent ASMO); Arabic (DOS) (720)',
  895: 'Kamenický (Czech) MS-DOS (895)',
  1361: 'Korean (Johab) (1361)',
  10000: 'MAC Roman (10000)',
  10001: 'Japanese (Mac) (10001)',
  10002: 'MAC Traditional Chinese (Big5) (10002)',
  10003: 'Korean (Mac) (10003)',
  10004: 'Arabic (Mac) (10004)',
  10005: 'Hebrew (Mac) (10005)',
  10006: 'Greek (Mac) (10006)',
  10007: 'Cyrillic (Mac) (10007)',
  10008: 'MAC Simplified Chinese (GB 2312) (10008)',
  10010: 'Romanian (Mac) (10010)',
  10017: 'Ukrainian (Mac) (10017)',
  10021: 'Thai (Mac) (10021)',
  10029: 'MAC Latin 2 (Central European) (10029)',
  10079: 'Icelandic (Mac) (10079)',
  10081: 'Turkish (Mac) (10081)',
  10082: 'Croatian (Mac) (10082)',
  20000: 'CNS Taiwan (Chinese Traditional) (20000)',
  20001: 'TCA Taiwan (20001)',
  20002: 'ETEN Taiwan (Chinese Traditional) (20002)',
  20003: 'IBM5550 Taiwan (20003)',
  20004: 'TeleText Taiwan (20004)',
  20005: 'Wang Taiwan (20005)',
  20105: 'Western European IA5 (IRV International Alphabet 5) (20105)',
  20106: 'IA5 German (7-bit) (20106)',
  20107: 'IA5 Swedish (7-bit) (20107)',
  20108: 'IA5 Norwegian (7-bit) (20108)',
  20261: 'T.61 (20261)',
  20932: 'Japanese (JIS 0208-1990 and 0212-1990) (20932)',
  20949: 'Korean Wansung (20949)',
  21027: 'Extended/Ext Alpha Lowercase (21027)',
  29001: 'Europa 3 (29001)',
  47451: 'Atari ST/TT (47451)',
  52936: 'HZ-GB2312 Simplified Chinese (52936)',
  54936: 'Simplified Chinese GB18030 (54936)'
}

/**
 * Type for valid code pages
 */
export type CodePage = keyof (typeof codePageLabelMap)

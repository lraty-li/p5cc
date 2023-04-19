// import * as _ from "./utils"
import { randomOp, getCharSize, getRdmOneFromList, CheckChinese, FONTCOLORS } from "./utils.js";
import { knownZhFonts } from "./zh_fonts.js";

let queryFontBtn = document.getElementById('queryFont')
queryFontBtn.addEventListener("click", async () => {
  await self.queryLocalFonts();
}, false);

let fontQueryPermission = false
const MAX_ANGLE = 10
// const sfnt = await temp1[0].blob();
// A = new FontFace('test', await sfnt.arrayBuffer())

//[...new Set(arr)] 
// request font
// console.log(await queryLocalFonts());
// https://font-access-api.glitch.me/
const status = await navigator.permissions.query({ name: "local-fonts" });
let statusMessage = ''
if (status.state === "granted")
  fontQueryPermission = true;
else if (status.state === "prompt")
  statusMessage = 'click "Query Font" to acquire font permission';
else
  statusMessage = 'Permission was denied 👎, use default fonts';

if(statusMessage != ''){
  alert(statusMessage)
}

let sysFonts = []
if(fontQueryPermission){
   sysFonts = await self.queryLocalFonts();
  console.log(sysFonts)
}
let zhFonts = []
let enFonts = []
if (sysFonts.length == 0) {
  sysFonts.push('sans-serif') //TODO default font
}
let sysFontsFamiles = []
for (let j in sysFonts) {
  sysFontsFamiles.push(sysFonts[j].family)
}
sysFonts = [... new Set(sysFontsFamiles)]

// for (var sysFontName of sysFonts) {
//   if (knownZhFonts.includes(sysFontName)) {
//     zhFonts.push(sysFontName)
//   } else {
//     enFonts.push(sysFontName)
//   }
// }

zhFonts = sysFonts
enFonts = sysFonts
export class COLORS {
  static RED = "#E5191C"
  static WHITE = "#FDFDFD"
  static BLACK = "#0F0F0F"
}



export class CHAR_MODE {
  static FIRST = 1
  static WHITE = 2
  static RED = 3
  static SPACE = 4
}



export class BoxChar {
  static BorderScale = 1.4
  static BackgroundScale = 1.2

  char = ""
  fontFamily = ""
  fontSize = 0
  width = 0
  height = 0
  left = 0
  top = 0
  angle = 0
  scale = 0
  mode = CHAR_MODE.WHITE
  color = getRdmOneFromList(FONTCOLORS)

  constructor(char, mode, fontSize = 60, fontFamily = "sans-serif") {
    this.char = char
    this.mode = mode
    this.fontFamily = getRdmOneFromList(enFonts) //TODO
    // this.fontFamily = fontFamily

    // if (CheckChinese(char)) {
    //   this.fontFamily = getRdmOneFromList(zhFonts)
    //   // console.log(this.fontFamily)
    // }

    if (mode == CHAR_MODE.SPACE) {
      return
    }

    const angle = -(Math.round(Math.random() * 10) % MAX_ANGLE)
    if (mode == CHAR_MODE.FIRST) {
      this.scale = 1.1
      this.angle = angle
    } else {
      this.scale = 1 - (Math.floor(Math.random() * 10) % 3) / 10
      this.angle = angle * randomOp()
    }
    this.fontSize = fontSize * this.scale

    // if (mode == CHAR_MODE.RED) {
    //   this.color = COLORS.RED
    // }

    const { width, height, top, left } = getCharSize(
      char,
      this.fontSize,
      this.fontFamily,
      "bold"
    )
    this.width = width
    this.height = height
    this.top = top
    this.left = left

    this.fontSize = this.fontSize * (Math.random() * 0.5 + 0.5)
  }

  get font() {
    return `bold ${this.fontSize}px ${this.fontFamily}`
  }

  get rotateSize() {
    const angle = (this.angle * Math.PI) / 180
    const sin = Math.abs(Math.sin(angle)),
      cos = Math.abs(Math.cos(angle))
    const width = Math.ceil(this.width * cos) + Math.ceil(this.height * sin)
    const height = Math.ceil(this.height * cos) + Math.ceil(this.width * sin)
    return {
      width,
      height
    }
  }

  get outterSize() {
    const { width, height } = this.rotateSize
    // const scale =
    //   this.mode == CHAR_MODE.FIRST
    //     ? BoxChar.BorderScale
    //     : BoxChar.BackgroundScale
    return {
      width: width * 1.2,
      height: height * 1.2
    }
  }
}



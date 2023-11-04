import jsontext from "./testjson.js" // The relative path to your File
import testJson2 from "./testjson2.js" // The relative path to your File

class Json2HtmlConverter {
  static testConversion() {
    console.log("Testing json converter")
    let r = Json2HtmlConverter.converJson2Html(testJson2)
    return r
  }

  static converJson2Html(jsonStr) {
    const parsed = JSON.parse(jsonStr)
    let topChildren = Object.getOwnPropertyNames(parsed)
    let unRolledTree = []

    while (topChildren.length > 0) {
      let node = topChildren.shift()
      console.log(typeof node, node)
      if (typeof node === "number") {
        console.log("Element is number, get number input")
      }
    }

    console.log(parsed)
    return null
  }

  static traverseNode(node) {
    if (typeof node === "object") {
      console.log("call function again for each property of this node")
    }
  }
}

export default Json2HtmlConverter

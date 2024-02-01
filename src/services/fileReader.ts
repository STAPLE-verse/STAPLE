export async function fileReader(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      console.log("File content:", reader.result)

      if (reader.result && typeof reader.result === "string") {
        resolve(reader.result)
      } else {
        reject(new Error("Invalid file content"))
      }
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsText(file)
  })
}

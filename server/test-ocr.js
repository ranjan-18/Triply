import Tesseract from "tesseract.js";

async function test() {
  try {
    console.log("Starting OCR test...");
    // create a simple dummy image data uri (black square)
    const dummyImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    
    const { data: { text } } = await Tesseract.recognize(dummyImage, "eng", {
      logger: m => console.log(m)
    });
    console.log("OCR Success:", text);
  } catch (error) {
    console.error("OCR Failed:", error);
  }
}

test();

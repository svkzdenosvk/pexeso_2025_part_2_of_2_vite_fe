// import { projectFirestore } from "../lib/firebase/config";
// import { collection, getDocs } from "firebase/firestore";
import { _shuffleArray } from "./_inc_functions";
import type {
  My_Type_Img_Name,
  My_Type_ImgCount,
  My_Type_DivImg,
  My_Type_Image,
} from "./my_types";

//random string generate
import { v4 as uuidv4 } from "uuid";

// fun. to fetch img names from db
// export async function fetchOnlyImgNames() {
//   //create empty array -> it will be filled with img´s names
//   const arrImg: My_Type_Img_Name[] = [];

//   try {
//     //loading docs from Firebase
//     const snapshot = await getDocs(
//       collection(projectFirestore, "pexeso-img-names")
//     );
//     snapshot.forEach((doc) => {
//       const name: My_Type_Img_Name = doc.data().name;

//       if (name) {
//         //add name to array
//         arrImg.push(name);
//       }
//     });
//   } catch (error) {
//     console.error("Chyba pri načítaní dát z Firestore:", error);
//     //if error return empty array
//     return [];
//   }

//   return arrImg;
// }

export async function createDivsArrayFromImgNamesAndCountImg(
  selectedCountOfImg: My_Type_ImgCount,
  imgNamesInFunc: My_Type_Img_Name[]
) {
  //shuffle to randomize order of all received picture
  const shuffledImgNamesArray = _shuffleArray(imgNamesInFunc);

  //to cut selected count of pictures
  const afterCutArrImg = shuffledImgNamesArray.slice(0, selectedCountOfImg);

  const doubleImgs = [...afterCutArrImg, ...afterCutArrImg];

  //to shuffle before every game
  const shuffledImgNamesPairsArray = _shuffleArray(doubleImgs);

  //array of pairs names of pictures with ids
  const imgsWithKeys:My_Type_Image[] = shuffledImgNamesPairsArray.map((pictureName) => ({
    id:uuidv4(),
    name: pictureName,
  }));

  //-array of objects: img {name,id, classes} -> div>img
  const divItems: My_Type_DivImg[] = imgsWithKeys.map(({id, name }) => ({
    id: id,
    name: name,
    classNames: ["mask", "div_on_click"],
  }));

  //return final array
  return divItems; 
}

//---------function during loading images
export function preloadImages(imgNamesArr: My_Type_Img_Name[]) {
  
  return Promise.all(
    imgNamesArr.map((picture) => {
      return new Promise((resolve, reject) => {
        const img = new Image();

        // img.src = "/pictures/pexeso/" + picture + ".jpg";
                img.src = "/pictures/pexeso/" + picture + ".jpg";

        img.onload = async () => {
          try {
            await img.decode(); // waiting for decoding :contentReference[oaicite:3]{index=3}
            resolve(picture);
          } catch {
            reject(new Error(`Chyba dekódovania: ${picture}`));
          }
        };
        img.onerror = () => reject(new Error(`Chyba načítania: ${picture}`));
      });
    })
  );
}

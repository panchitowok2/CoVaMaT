import { ObjectId } from 'mongodb';
import client from '../config/db.js';
import _ from 'lodash';
import { getDatasheetInstancesByIdAndContextType } from './datasheetInstance.js'


const map = (obj) => {
  const studyCase = {
    _id: obj._id,
    name: obj.name,
    domain: obj.domain,
    description: obj.description,
    variety: obj.variety
  };
  return studyCase;
}

export const getCases = async () => {
  await client.connect();
  const result = client.db("covamatDB").collection("case").find()
  let cases = [];
  while (await result.hasNext()) {
    cases.push(await result.next())
  }
  client.close();
  return cases;

}

export const getCasesSimilarToReuseCase = async (reuseCase) => {
  const reuseCaseContext = reuseCase['reuseCase']['context'];
  await client.connect();
  //get cases with the same domain as reuse case
  const result = client.db("covamatDB").collection("case").find({ domain: { name: reuseCase['reuseCase']['domain']['name'] } })
  var similarCases = [];
  while (await result.hasNext()) {
    //for each case we have to check whether the reuse case context
    //is equals to the context of the case
    const actualCase = await result.next();
    //get the array of ids of ds instances
    let datasheetInstancesIds = actualCase['variety'];
    //get the context ds instances of the case
    const caseContextVariety = await getDatasheetInstancesByIdAndContextType(datasheetInstancesIds);
    if (caseContextVariety.length > 0) {
      // we have to check if every context variety of the case appeears in the
      //context of the reuse case
      var i = 0;
      //variable to break the loop if the case we are looking into
      //has a context variety that the reuse case doesn't
      var matches = true;
      while (i < caseContextVariety.length && matches) {
        //extract the variation point and variations in an object
        //to check exact appearence in the reuse case context array
        const variationPointAndVariations = {
          variationPoint: caseContextVariety[i]['variationPoint'],
          variations: caseContextVariety[i]['variations']
        };
        //findIndex checks if the extracted object appears in the context array of reuseObject
        //returns the index if exists, -1 otherwise
        if (_.findIndex(reuseCaseContext, variationPointAndVariations) == -1) {
          //this context variety of the case is not present in the context array of reuse object.
          matches = false;
        }
        i++;
      }
      if (matches) {
        //all of the case variety matched with the reuse case
        similarCases.push(actualCase)
      }
    }
  }
  client.close();
  return similarCases;
}


export const createCase = async (inputCase) => {
  await client.connect();
  //console.log('inputCase: ', inputCase)
  const idCase = await (await client.db("covamatDB")
    .collection("case").insertOne(inputCase)).insertedId;
  client.close();
  return idCase;
}

export const addDatasheetInstancesToCase = async (idCase, variations) => {
  //console.log('Entrada del metodo', idCase, ' ', variations)
  await client.connect();
  //get datasheet
  const oneCase = await client.db("covamatDB").collection("case").findOne({ "_id": new ObjectId(idCase) });
  //add variations
  
  let dsVariations = oneCase.variety || [];
  variations.forEach((variation) => {
    dsVariations.push(variation);
  })
  
  let result = [];
  //update datasheet
  if (variations && variations.length > 0) {
    result = await client.db("covamatDB").collection("case")
      .updateOne({ "_id": new ObjectId(idCase) }, { $set: { "variety": dsVariations } });

  }
  client.close();
  if (result.modifiedCount > 0) {
    //console.log('El datasheet se actualizó correctamente');
    return true;
  } else {
    //console.log('El datasheet no se actualizó');
    return false;
  }
}
/*
export const isDatasheetInstanceInCase = async (idCase, datasheetInstance) => {
  await client.connect();
  //get datasheet
  const oneCase = await client.db("covamatDB").collection("case")
    .findOne({ "_id": new ObjectId(idCase) });

  let result = false;
  let dsVariations = oneCase.variety;
  dsVariations.forEach(async (idVar) => {
    const dat = await client.db("covamatDB").collection("datasheetInstance")
      .findOne({ "_id": new ObjectId(idVar) });
    if (dat.domain.name === datasheetInstance.domain.name &&
      dat.varietyType.name === datasheetInstance.varietyType.name &&
      dat.variationPoint.name === datasheetInstance.variationPoint.name
    ) {
      dat.variations.map((var) => {
        //if (var.name === datasheetInstance[0].name) {
        //  result = true
        //}
      });
    }
  })
  return result
}
*/
/*
export const getIsDatasheetInstanceInCase = async (idCase, idDatasheetInstance) => {
  await client.connect();
  
  // Obtener el caso
  const oneCase = await client.db("covamatDB").collection("case")
    .findOne({ "_id": new ObjectId(idCase) });

  let result = false;
  let dsVariations = oneCase.variety;
  console.log("dsVariations ", dsVariations)

  if(oneCase.variety !== null && idDatasheetInstance !== null){
    // Usar Promise.all para esperar a que todas las promesas se resuelvan
    await Promise.all(dsVariations.map(async (idVar) => {
    const dat = await client.db("covamatDB").collection("datasheetInstance")
      .findOne({ "_id": new ObjectId(idVar) });
      //console.log("dat ", dat)
      //console.log("datasheetInstance ", datasheetInstance)
      idDatasheetInstance.map( async (idDatInput) => {
        const datInput = await client.db("covamatDB").collection("datasheetInstance")
        .findOne({ "_id": new ObjectId(idDatInput) });
        if (dat.domain.name === datInput.domain.name &&
          dat.varietyType.name === datInput.varietyType.name &&
          dat.variationPoint.name === datInput.variationPoint.name
        ) {
            dat.variations.forEach((variation) => {
            if (variation.name === datInput.variations[0].name) {
              result = true;
            }
          });
        }
      })
    }));
  }  

  await client.close();
  return result;
}
*/

/*
El metodo getIsDatasheetInstanceInCase valida si la variacion que el usuario desea agregar al caso
estaba previamente cargada en el mismo.
*/
export const getIsDatasheetInstanceInCase = async (idDatasheetInstanceArray, inputDatasheetInstance) => {
  await client.connect();

  try {
    
    let result = false;

    if (idDatasheetInstanceArray !== null && idDatasheetInstanceArray.length > 0 && inputDatasheetInstance !== null) {
      // Usar Promise.all para esperar a que todas las promesas se resuelvan
      await Promise.all(idDatasheetInstanceArray.map(async (idDat) => {

        const datInput = await client.db("covamatDB").collection("datasheetInstance")
          .findOne({ "_id": new ObjectId(idDat) });

        if (datInput &&
          inputDatasheetInstance.domain.name === datInput.domain.name &&
          inputDatasheetInstance.varietyType.name === datInput.varietyType.name &&
          inputDatasheetInstance.variationPoint.name === datInput.variationPoint.name
        ) {
          if (inputDatasheetInstance.variations && datInput.variations) {
            datInput.variations.forEach((variation) => {
              if (variation.name === inputDatasheetInstance.variations[0].name) {
                //console.log('variation.name ', variation.name, ' name del input ', inputDatasheetInstance.variations[0].name)
                result = true;
              }
            });
          }
        }

      }));
    }

    return result;
  } catch (error) {
    console.error("Error al verificar la instancia de datasheet:", error);
    throw new Error("Error interno del servidor");
  } finally {
    await client.close();
  }
}


/*
El metodo getIsDatasheetDataInstanceInCase valida si la datasheet instance que el usuario desea agregar al caso
estaba previamente cargada en el mismo.
*/
export const getIsDatasheetInstanceDataInCase = async (idDatasheetInstanceArray, inputDatasheetInstance) => {
  await client.connect();

  try {
    
    let result = null;

    if (idDatasheetInstanceArray !== null && idDatasheetInstanceArray.length > 0 && inputDatasheetInstance !== null) {
      // Usar Promise.all para esperar a que todas las promesas se resuelvan
      await Promise.all(idDatasheetInstanceArray.map(async (idDat) => {

        const datInput = await client.db("covamatDB").collection("datasheetInstance")
          .findOne({ "_id": new ObjectId(idDat) });
        //console.log('el valor del datasheet del caso', datInput)
        if (datInput &&
          inputDatasheetInstance.domain.name === datInput.domain.name &&
          inputDatasheetInstance.varietyType.name === datInput.varietyType.name &&
          inputDatasheetInstance.variationPoint.name === datInput.variationPoint.name
        ) {
          console.log('dio true', datInput._id)
          result = datInput._id
        }

      }));
    }

    return result;
  } catch (error) {
    console.error("Error al verificar la datasheet instance: ", error);
    throw new Error("Error interno del servidor");
  } finally {
    await client.close();
  }
}

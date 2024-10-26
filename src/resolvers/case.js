import { getCases, getCasesSimilarToReuseCase, createCase, 
  addDatasheetInstancesToCase, getIsDatasheetInstanceInCase, 
  getIsDatasheetInstanceDataInCase} from '../entities/case.js';
const resolvers = {
  Query: {
    getCases: (_, __, { }) => {
      return getCases();
    },
   // getCasesByDomain: (_, domain, { }) => {
   //   return getCasesByDomain(domain);
  //  },
    getCasesSimilarToReuseCase: (_, reuseCase, { }) => {
      return getCasesSimilarToReuseCase(reuseCase);
    },
    getIsDatasheetInstanceInCase(_,{idDatasheetInstanceArray, inputDatasheetInstance}, {}){
      return getIsDatasheetInstanceInCase(idDatasheetInstanceArray, inputDatasheetInstance);
    },
    getIsDatasheetInstanceDataInCase(_,{idDatasheetInstanceArray, inputDatasheetInstance}, {}){
      return getIsDatasheetInstanceDataInCase(idDatasheetInstanceArray, inputDatasheetInstance);
    }
  },
  Mutation: {
    createCase(_, { inputCase }) {
      //console.log("Datos recibidos en el resolver:", inputCase);
      return createCase(inputCase);
    },
    addDatasheetInstancesToCase(_, { idCase, variations }) {
      //console.log("Datos recibidos en el resolver case:", idCase, variations);
      return addDatasheetInstancesToCase(idCase, variations);
    }
  }
};

export default resolvers;
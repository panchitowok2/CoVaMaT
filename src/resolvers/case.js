import { getCases, getCasesSimilarToReuseCase, createCase, 
  addVariations, getIsDatasheetInstanceInCase} from '../entities/case.js';
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
    getIsDatasheetInstanceInCase(_,{idCase, datasheetInstance}){
      return getIsDatasheetInstanceInCase(idCase, datasheetInstance);
    }
  },
  Mutation: {
    createCase(_, { inputCase }) {
      //console.log("Datos recibidos en el resolver:", inputCase);
      return createCase(inputCase);
    },
    addVariations(_, { idCase, variations }) {
      //console.log("Datos recibidos en el resolver case:", idCase, variations);
      return addVariations(idCase, variations);
    }
  }
};

export default resolvers;
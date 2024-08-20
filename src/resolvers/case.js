import { getCases, getCasesSimilarToReuseCase, createCase, addVariations} from '../entities/case.js';
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
  },
  Mutation: {
    createCase(_, { inputCase }) {
      console.log("Datos recibidos en el resolver:", inputCase);
      return createCase(inputCase);
    },
    addVariations(_, { idCase, variations }) {
      return addVariations(idCase, variations);
    },
  }
};

export default resolvers;
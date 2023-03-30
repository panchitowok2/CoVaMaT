import { getCases, getCasesSimilarToReuseCase, createCase} from '../entities/case.js';
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
    hola: ()=> "Te saluda el server :D",
  },
  Mutation: {
    createCase(_, { inputCase }) {
      return createCase(inputCase);
    },
  }
};

export default resolvers;
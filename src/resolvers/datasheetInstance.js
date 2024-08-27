import {getDatasheetInstancesById,
  getDatasheetsInstances,
  createDatasheetInstance,
  addVariationsToInstance} from '../entities/datasheetInstance.js';
const resolvers = {
  Query: {
    getDatasheetInstances: (_, __, { }) => {
      return getDatasheetsInstances();
    },
    getDatasheetInstancesById: (_, {ids}, {} ) => {
      return getDatasheetInstancesById(ids);
    }

  },
  Mutation: {
    createDatasheetInstance(_, { datasheetInstance }) {
      return createDatasheetInstance(datasheetInstance);
    },
    addVariationsToInstance(_, { idDatasheetInstance, variations }) {
      //console.log("resolver datasheet instance")
      return addVariationsToInstance(idDatasheetInstance, variations);
    },
  }
};

export default resolvers;
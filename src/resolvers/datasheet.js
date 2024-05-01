import { getAllDatasheets, getDatasheetByDomain, 
  getDatasheetsByVarietyType, getDatasheetById, 
  createDatasheet, addVariations, 
  getDomains, getAllVarietyTypes,
getVariationPointsByVarietyTypes,
getDatasheetByDomainVTVP } from '../entities/datasheet.js';
const resolvers = {
  Query: {
    getAllDatasheets: (_, __, { }) => {
      return getAllDatasheets();
    },
    getDatasheetsByDomain: (_, domain, { }) => {
      return getDatasheetByDomain(domain);
    },
    getDatasheetsByVarietyType: (_, varietyType, { }) => {
      return getDatasheetsByVarietyType(varietyType);
    },
    getDatasheetById: (_, idDatasheet, { })=>{
      return getDatasheetById(idDatasheet);
    },
    getDomains: (_, __, { }) => {
      return getDomains();
    },
    getAllVarietyTypes: (_, __, { }) => {
      return getAllVarietyTypes()
    },
    getVariationPointsByVarietyTypes: (_, varietyType, { }) => {
      return getVariationPointsByVarietyTypes(varietyType)
    },
    getDatasheetByDomainVTVP: (_, { domain, varietyType, variationPoint }, {}) => {
      return getDatasheetByDomainVTVP(domain, varietyType, variationPoint)
    }
  },
  Mutation: {
    createDatasheet(_, { datasheet, variations }) {
      return createDatasheet(datasheet, variations);
    },
    addVariations(_, { idDatasheet, variations }) {
      return addVariations(idDatasheet, variations);
    },
  }
};

export default resolvers;
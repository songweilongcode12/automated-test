import moduleField from './moduleField';

const module = `
  id
  appID
  name
  alias
  tableInfo{
    database
    tableName
  }
  crossChain
  queryConditions{
    name
    uuid
    type
    roles
    formulas{
      formula
    }
  }
  template
  storeID
  fields{
    ${moduleField}
  }
  moduleParentID
  createdAt
  updatedAt
  globalEnabled
  uniqueIndexes{
    uuid
    fields
  }
`;

const moduleModel = `
  ${module}
 `;

export default moduleModel;

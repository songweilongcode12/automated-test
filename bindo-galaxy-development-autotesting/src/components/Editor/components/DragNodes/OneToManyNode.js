import React, { Component } from 'react'
import { Table, Button } from 'antd'
import hocNode from './hocNode'
import { listToColumns } from '../../../../utils/module'

@hocNode()
class OneToManyNode extends Component {
  getColumns = () => {
    const {
      field: {
        relation = {},
      } = {},
      existingModules = [],
    } = this.props;

    const { relatedModuleID } = relation || {};
    let module;
    for (let i = 0; i < existingModules.length; i++) {
      const moduleTemp = existingModules[i];
      if (moduleTemp && moduleTemp.id === relatedModuleID) {
        module = moduleTemp;
        break;
      }
    }

    if (module) {
      return listToColumns(module);
    }

    return [];
  }

  render() {
    const { t } = this.props;
    const nodeProps = {
      dataSource: [],
      columns: this.getColumns(),
      pagination: false,
    };

    return (
      <div style={{border: '1px solid #d9d9d9'}}>
        <Table {...nodeProps} />
        <div style={{display: 'flex', padding: 5}}>
          <Button icon="plus" type="primary">
            { t('common:add') }
          </Button>
        </div>
      </div>
    );
  }
}

export default OneToManyNode;

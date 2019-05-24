import React, { Component } from 'react'
import { translate } from 'react-i18next';
import EditableTable from '../../components/EditableTable'
import { languageData } from '../../data'

@translate()
class I18nTable extends Component {
  constructor(props) {
    super(props);

    const { dataSource } = this.props;

    this.state = {
      dataSource: this.parseDataSource(dataSource),
    }
  }

  parseDataSource = (dataSource) => {
    const data = [];

    dataSource.forEach(item => {
      const { key, name, i18n = {} } = item;
      data.push({
        key,
        name,
        ...i18n,
      })
    });

    return data;
  }

  getColumns = () => {
    const {t} = this.props;
    const columns = [{
      title: t('common:default'),
      dataIndex: 'name',
      key: 'name',
    }];

    languageData.forEach(item => {
      const { key, title } = item
      columns.push({
        title,
        dataIndex: key,
        key,
        editable: true,
      })
    });

    return columns
  }

  handleDataChange = ({ dataSource }) => {
    this.setState({ dataSource });
  }

  render() {
    const { dataSource } = this.state;

    return (
      <EditableTable
        pagination={false}
        dataSource={dataSource}
        columns={this.getColumns()}
        onDataChange={this.handleDataChange}
      />
    )
  }
}

export default I18nTable;

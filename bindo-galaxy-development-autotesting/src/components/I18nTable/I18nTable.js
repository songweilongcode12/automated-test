import React, { Component } from 'react'
import { Select } from 'antd'
import { translate } from 'react-i18next';
import EditableTable from '../EditableTable'
import { languageData } from '../../data'
import { filterOption } from '../../utils/galaxy'
import './I18nTable.less'

const prefix = 'bg-c-i18n-table'

@translate()
class I18nTable extends Component {
  constructor(props) {
    super(props);

    let columnType = '';
    const { fields = [] } = this.props;
    if (fields && fields.length > 0) {
      const { key } = fields[0];
      columnType = key;
    }

    this.state = {
      displayMode: 'language', // 'field', 'language'
      columnType,
    }
  }

  handleSave = row => {
    const { dataSource, onDataChange = () => {} } = this.props
    const newData = [...dataSource]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    const rowData = {
      ...item,
      ...row,
    }
    newData.splice(index, 1, rowData)

    onDataChange({ dataSource: newData, index, rowData })
  }

  getDataSource = () => {
    const { displayMode } = this.state

    if (displayMode === 'field') {
      return this.getFieldDataSource();
    }

    return this.getLanguageDataSource();
  }

  getFieldDataSource = () => {
    log.info('------getFieldDataSource')
    return [
      {
        'en-US': 'aaaa',
        key: 'sdf',
      },
    ]
  }

  getLanguageDataSource = () => {
    const { dataSource = [] } = this.props;
    const { columnType } = this.state;
    const data = [];

    dataSource.forEach(item => {
      const { key, i18n = {} } = item;
      data.push({
        key,
        [columnType]: item[columnType],
        ...i18n,
      })
    });

    return data;
  }

  getFieldColumn = () => {
    const { t, fields } = this.props;
    const columns = [{
      title: t('common:default'),
      dataIndex: '__id__',
      key: '__id__',
    }];

    fields.forEach(item => {
      const { key, title } = item
      columns.push({
        title,
        dataIndex: key,
        key,
      })
    });

    return columns
  }

  getLanguageColumn = () => {
    const {t} = this.props;
    const { columnType } = this.state;
    const columns = [{
      title: t('common:default'),
      dataIndex: columnType,
      key: columnType,
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

  getColumns = () => {
    const { displayMode } = this.state

    if (displayMode === 'field') {
      return this.getFieldColumn();
    }

    return this.getLanguageColumn();
  }

  getColumnTypeOptions = () => {
    const { displayMode } = this.state;
    const options = [];
    let data = [];

    if (displayMode === 'language') {
      const { fields } = this.props;
      data = [...fields];
    } else {
      data = [...languageData];
    }

    data.forEach(item =>{
      const { key, title } = item;
      options.push(
        <Select.Option key={key} value={key}>{title}</Select.Option>
      );
    });

    return options;
  }

  handleModeChange = (value) => {
    let columnType = '';
    const { fields } = this.props;
    if (value === 'language' && fields && fields.length > 0) {
      const { key } = fields[0];
      columnType = key;
    } else if (value === 'field' && languageData && languageData.length > 0) {
      const { key } = languageData[0];
      columnType = key;
    }

    this.setState({
      displayMode: value,
      columnType,
    });
  }

  handleColumnTypeChange = (value) => {
    this.setState({
      columnType: value,
    });
  }

  handleDataChange = ({ dataSource, index, rowData }) => {
    log.info(dataSource, index, rowData);
  }

  render() {
    const { t } = this.props
    const props = {...this.props};
    delete props.columns;
    delete props.dataSource;
    delete props.onDataChange;

    const { columnType, displayMode } = this.state;

    return (
      <div className={prefix}>
        <div className={`${prefix}-bar`}>
          <Select
            style={{ width: 200 }}
            onChange={this.handleModeChange}
            value={displayMode}
          >
            <Select.Option key="language" value="language">
              {t('common:byLanguage')}
            </Select.Option>
            <Select.Option key="field" value="field">
              {t('common:byField')}
            </Select.Option>
          </Select>
          <Select
            showSearch
            style={{ width: 200, marginLeft: 10 }}
            optionFilterProp="children"
            filterOption={filterOption}
            onChange={this.handleColumnTypeChange}
            value={columnType}
          >
            {this.getColumnTypeOptions()}
          </Select>
        </div>
        <EditableTable
          dataSource={this.getDataSource()}
          columns={this.getColumns()}
          onDataChange={this.handleDataChange}
          {...props}
        />
      </div>
    )
  }
}

export default I18nTable

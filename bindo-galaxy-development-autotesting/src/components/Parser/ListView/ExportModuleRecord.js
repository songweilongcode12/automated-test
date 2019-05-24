import React,{ Component } from 'react';
import lodash from 'lodash';
import {
  Modal,
  Select,
  // DatePicker,
  Button,
  message,
} from 'antd';
// import moment from 'moment';
import {
  filterOption,
} from '../../../utils/galaxy';
import {
  exportModuleRecord,
} from '../../../data/graphql/record';

// const days = 30;
// const prefix = 'bg-c-logs';

// const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class ExportModuleRecord extends Component{

  state = {
    // exportStartDate: moment().subtract(days, 'days'),
    // exportEndDate: moment(),
    url: '',
    exportLoaing: false,
  }

  componentDidMount () {
    const { stores = [] } = this.props;

    if (stores.length > 0) {
      this.setState({
        storeID: stores[0].id,
      })
    }
  }

  // 更改选择导出log的时间范围
  // handleExportDateChange = value => {
  //   const [startDate, endDate] = value;
  //   this.setState({
  //     exportStartDate: startDate,
  //     exportEndDate: endDate,
  //   })
  // }

  handleExportModuleRecord = async () =>{
    const {
      storeID,
    } = this.state;

    const {
      moduleID,
      module = {},
      formulas,
    } = this.props;

    const {
      fields,
      template,
    } = module || {};

    let {
      moduleParent = {}, // 后台默认值为 null
    } = module || {}

    if (lodash.isEmpty(moduleParent)) {
      moduleParent = {
        fields: [],
        template: {
          list: [],
        },
      }
    }

    const {
      fields: moduleParentFields = [],
      template: {
        list: moduleParentForm = [],
      },
    } = moduleParent;

    const {
      list = [],
    } = template || {};

    // TODO这里es6语法报错...未知原因
    const moduleList = [...moduleParentForm, ...list];
    const moduleFields = [...moduleParentFields,...fields];

    const fieldSort = this.hanleFieldSort({moduleList, moduleFields})

    const search = {
      includeTotal: true,
      page: 1,
      perPage: 999,
      formulas,
    }

    this.setState({
      exportLoaing: true,
    })

    const {url, code, error} = await exportModuleRecord({storeID, moduleID, search, fieldSort});

    if (url && code === 200) {
      // window.open(url)
      this.setState({
        url,
        exportLoaing: false,
      })
    }else if(code !== 200){
      message.warning(error)
      this.setState({
        exportLoaing: false,
      })
    }
  }

  // 根据list和field内数据, 拼出list的fieldname组成的数组
  hanleFieldSort = ({moduleList, moduleFields}) => {
    const temp = [];
    moduleList.forEach(list => {
      moduleFields.forEach(field => {
        if (field.uuid === list.uuid) {
          temp.push(field.name)
        }
      })
    })
    return temp;
  }

  render(){
    const {
      t,
      onCancelClick,
      stores = [],
    } = this.props;

    const {
      storeID,
      exportLoaing,
      // exportStartDate,
      // exportEndDate,
      url,
    } = this.state;

    return(
      <Modal
        visible={true}
        title={t('common:editor.export')}
        okText={t('common:editor.export')}
        cancelText={t('common:cancel')}
        onOk={this.handleExportModuleRecord}
        onCancel={onCancelClick}
        width={400}
        confirmLoading={exportLoaing}
        destroyOnClose={true}
      >
        <p>{t('common:app.selectStore')}</p>
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={filterOption}
          value={storeID}
          onChange={
            value => {
              this.setState({
                storeID: value,
              });
            }
          }
          style={{width: 330}}
        >
          {
            stores.map(store => (
              <Select.Option
                key={store.id}
                value={store.id}
              >
                {store.title}
              </Select.Option>
            ))
          }
        </Select>
        {/* <p style={{marginTop: 20}}>Time Range</p>
        <DatePicker.RangePicker
          placeholder={['Start Time', 'End Time']}
          defaultValue={[exportStartDate, exportEndDate]}
          format={dateFormat}
          className={`${prefix}-log-time`}
          onChange={this.handleExportDateChange}
        /> */}
        {
          url &&
          // eslint-disable-next-line jsx-a11y/anchor-has-content
          <Button style={{marginTop: 30}} icon="download">
            <a href={url} download='moduleRecord.csv' target="_blank" rel="noopener noreferrer">Download</a>
          </Button>
        }
      </Modal>
    )
  }
}

export default ExportModuleRecord;

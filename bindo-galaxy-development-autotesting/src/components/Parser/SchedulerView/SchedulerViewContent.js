import React, { Component } from 'react';
import {
  Button,
  Modal,
  message,
  Upload,
  Progress,
  Icon,
  Skeleton,
} from 'antd';
import lodash from 'lodash'
import Liquid from 'liquidjs'
import { CSVLink } from 'react-csv';
// import FilterView from '../FilterView';
import SchedulerParser from './SchedulerParser'
import {
  parseParams,
  createRouteUrl,
} from '../../../utils/galaxy';
import {
  findModule,
  findModuleByID,
} from '../../../utils/module';
import routes from '../../../constants/routes';
import common from '../../../constants/common';
import urls from '../../../constants/urls';
import reduxKey from '../../../constants/reduxKey';
import {
  queryRecords,
  deleteRecord,
  modelRecordMarkAsGlobal,
  modelRecordUnmarkAsGlobal,
} from '../../../data/graphql/record';

import {
  executeScript,
  queryScriptRecords,
} from '../../../data/graphql/action'
// import ExportTemplateModal from './ExportTemplateModal'
// import ExportModuleRecord from './ExportModuleRecord'
// import galaxyConstant from '../../../constants/galaxyConstant';
import './SchedulerView.less'

const galaxyPrefix = 'bg-galaxy';
const listviewPrefix = 'bg-c-parser-listview';
// const globalRowsPrefix ='dashboard-list-global-item';

let liquidParser = null;
class SchedulerViewContent extends Component {
  state = {
    records: null,
    rowRecords: null,
    rowModule: {},
    currentPage: 1,
    pageSize: 10,
    // total: 0,
    formulas: [],
    // showExportTemplateModal: false,
    // exportRecord: '',
    rate: 0,
    uploadFileUrl: '',
    uploadFileName: '',
    scriptList: [],
    moduleParent: {},
    scheduler: {},
  };

  componentDidMount () {
    this.processingInterval = null;
    this.processingCount= 0;

    this.loadScripts(this.props);

    this.loadData({
      props: this.props,
    });
  }

  shouldComponentUpdate (nextProps) {
    const { moduleID } = parseParams(this.props);
    const { moduleID: nextModuleID } = parseParams(nextProps);

    if (moduleID !== nextModuleID) {
      this.loadScripts(nextProps);
      const {
        dispatch,
      } = this.props;
      dispatch({
        type: reduxKey.UPDATE_GALAXY_REDUCER,
        payload: {
          galaxyLoading: true,
        },
      });

      this.setState({
        records: [],
      });

      this.loadData({
        props: nextProps,
      });
    }

    return true;
  }

  componentWillUnmount = () => {
    if(this.processingInterval !== null){
      clearInterval(this.processingInterval)
    }
    this.processingInterval = null;
    this.processingCount = 0;
  }

  loadData = async ({
    props,
  }) => {
    const {
      storeID,
      moduleID,
    } = parseParams(props);

    await Promise.all([
      this.loadRecords({
        storeID,
        moduleID,
      }),
      this.loadRowRecords({
        props,
        storeID,
        filters: [],
      }),
    ]);
  }

  loadRecords = async ({
    storeID,
    moduleID,
  }) => {
    const { dispatch } = this.props;
    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: true,
      },
    });

    const records = [];

    try {
      const { recordLists = [] } = await queryRecords({
        storeID,
        moduleID,
        search: {
          page: 1,
          perPage: 100,
          includeTotal: true,
        },
        associates: ['*'],
      });

      const { appID } = parseParams(this.props);

      const {
        moduleParent,
      } = this.getModuleAndParent({
        props: this.props,
        storeID,
        appID,
        moduleID,
      });

      this.setState({
        moduleParent,
      });

      if (Array.isArray(recordLists)) {
        records.push(...recordLists);
      }
    } catch (error) {
      log.error(error);
    }

    this.setState({
      records,
    });

    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: false,
      },
    });
  };

  loadRowRecords = async ({
    props,
    storeID,
    filters = [],
  }) => {

    const rowRecords = [];

    const {
      module,
    } = props;

    const {
      fields = [],
      template = {},
    } = module;
    const {
      scheduler = {},
    } = template;
    const {
      objectField= {},
    } = scheduler;

    const {
      uuid,
      name,
    } = objectField || {}

    const field = fields.find(item => item.uuid === uuid && item.name === name)

    if (!field) {
      return;
    }

    const {
      allowValue: {
        dynamicItemSource,
      },
    } = field;

    if (!lodash.isObject(dynamicItemSource)) {
      return;
    }

    const {
      moduleID,
    } = dynamicItemSource || {};

    const rowModule = findModuleByID({
      props: this.props,
      storeID,
      moduleID,
    })

    this.setState({
      scheduler: scheduler || {},
      rowModule,
    })

    if (storeID && moduleID) {
      const { recordLists = [] } = await queryRecords({
        storeID,
        moduleID,
        search: {
          page: 1,
          perPage: 100,
          filters,
        },
      });
      if (Array.isArray(recordLists)) {
        rowRecords.push(...recordLists);
      }
    }

    this.setState({
      rowRecords,
    });
  }

  loadScripts = async (props) => {
    const {
      scriptList,
    } = this.state;

    if (lodash.isArray(scriptList) && scriptList.length > 0) {
      return;
    }

    const {
      storeID,
      moduleID,
    } = parseParams(props);

    try {
      const {
        data=[],
      } = await queryScriptRecords({
        storeID,
        moduleID,
      })

      this.setState({
        scriptList: data,
      })
    } catch (error) {
      log.error(error)
    }
  }

  getModuleAndParent = (props) => {
    const module = findModule(props) || {};
    const {
      moduleParentID = '',
    } = module;

    let moduleParent;
    if (lodash.isString(moduleParentID) && moduleParentID.length > 1) {
      moduleParent = findModuleByID({
        props: this.props,
        storeID: props.storeID,
        moduleID: moduleParentID,
      })
    }

    if (lodash.isEmpty(moduleParent)) {
      moduleParent = {
        fields: [],
        template: {
          form: [],
        },
      }
    }

    return {
      module,
      moduleParent,
    }
  }

  runScripts = async (scripts = [], baseParams) => {
    let result = {};
    for (let i = 0; i < scripts.length; i++) {
      // eslint-disable-next-line
      result = await this.runScript(scripts[i], baseParams, result);

      if (result === false) {
        return;
      }
    }
  }

  runScript = (script, baseParams, result) => new Promise(resolve => {
    this.exeCustomEvent(script, baseParams, result, resolve)
  })

  exeCustomEvent = async (script, baseParams, result, resolve) => {
    const {
      actionType,
    } = script;
    const {
      t,
      dispatch,
    } = this.props;

    if (actionType === 'popOver') {
      if (!liquidParser) {
        liquidParser = new Liquid();
      }
      const liquidText = await liquidParser.parseAndRender(script.content, result);
      dispatch({
        type: reduxKey.UPDATE_GALAXY_REDUCER,
        payload: {
          galaxyLoading: false,
        },
      });
      Modal.confirm({
        title: t('common:confirm'),
        content: liquidText,
        okText: t('common:ok'),
        okType: 'danger',
        cancelText: t('common:cancel'),
        onOk() {
          dispatch({
            type: reduxKey.UPDATE_GALAXY_REDUCER,
            payload: {
              galaxyLoading: true,
            },
          });
          resolve(result);
        },
        onCancel() {
          dispatch({
            type: reduxKey.UPDATE_GALAXY_REDUCER,
            payload: {
              galaxyLoading: true,
            },
          });
          resolve(false);
        },
      })
    } else if (actionType === 'manually') {
      const {
        moduleID,
        appID,
        recordID,
        storeID,
      } = baseParams;
      const data = await executeScript({
        storeID,
        input: {
          moduleID,
          appID,
          recordID,
          actionName: script.actionName,
        },
      });
      resolve(data);
    } else {
      resolve(result);
    }
  }

  parseAndFindScirpts = (actions, scripts) => {
    if (
      !lodash.isArray(scripts)
      || !lodash.isArray(actions)
      || actions.length < 0
    ) {
      return;
    }

    const {
      scriptList,
    } = this.state;

    actions.forEach(item => {
      if (item && item.scriptName) {
        for (let i = 0; i < scriptList.length; i++) {
          const script = scriptList[i];
          if (script.actionName === item.scriptName) {
            scripts.push(lodash.cloneDeep(script));
            break;
          }
        }
      }
    });
  }

  // 执行绑定在button上的脚本
  handleCustomClick = async (btnData, recordID) => {
    const { dispatch } = this.props;

    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: true,
      },
    });

    try {
      const {
        appID,
        storeID,
        moduleID,
      } = parseParams(this.props);
      const scripts = [];
      const {
        params = {},
      } = btnData;
      const {
        preActions = [],
        afterActions = [],
      } = params || {};

      this.parseAndFindScirpts(preActions, scripts);
      this.parseAndFindScirpts([btnData], scripts);
      this.parseAndFindScirpts(afterActions, scripts);

      const baseParams = {
        moduleID,
        appID,
        recordID,
        storeID,
      };

      await this.runScripts(scripts, baseParams);

    } catch (e) {
      log.error(e)
    }

    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: false,
      },
    });

  }

  // 处理global事件
  handleGlobalClick = async (record) => {
    if (record && record.id) {
      const {
        storeID,
        moduleID,
      } = parseParams(this.props);
      let {
        records,
      } = this.state;
      const {
        id,
        __is_global: isGlobal,
      } = record;

      if (lodash.isBoolean(isGlobal) && isGlobal) { // 取消global
        try {
          const {
            success,
          } = await modelRecordUnmarkAsGlobal({
            storeID,
            moduleID,
            recordID: id,
          })

          // 更改state的records数据
          if (success) {
            records = records.map(item => {
              if (item.id === id) {
                // eslint-disable-next-line
                item.record.__is_global = false;
              }
              return item;
            })
            this.setState({records})
          }
        } catch (e) {
          log.error(e)
        }
      } else if (!isGlobal) { // 设置为global
        try {
          const {
            success,
          } = await modelRecordMarkAsGlobal({
            storeID,
            moduleID,
            recordID: id,
          })

          if (success) {
            records = records.map(item => {
              if (item.id === id) {
                // eslint-disable-next-line
                item.record.__is_global = true;
              }
              return item;
            })
            this.setState({records})
          }
        } catch (e) {
          log.error(e)
        }
      }
    }
  }

  handleDelete = data => {
    const { t } = this.props;

    Modal.confirm({
      title: t('common:module.deletePrompt'),
      content: data.name,
      okText: t('common:yes'),
      okType: 'danger',
      cancelText: t('common:no'),
      onOk: async () => {
        try {
          const {
            storeID,
            moduleID,
          } = parseParams(this.props);
          await deleteRecord({ storeID, moduleID, recordID: data.id });

          const {
            currentPage,
            pageSize,
            records = [],
            formulas = [],
          } = this.state;
          let page = currentPage;
          if (records.length <= 1) {
            page--;
          }

          if (page < 1) {
            page = 1;
          }
          this.loadRecords({
            storeID,
            moduleID,
            currentPage: page,
            pageSize,
            formulas,
          });

          if (page !== currentPage) {
            this.setState({
              currentPage: page,
            });

            const { dispatch } = this.props;
            dispatch({
              type: reduxKey.UPDATE_GALAXY_REDUCER,
              payload: {
                searchFilter: {
                  recordsModuleID: moduleID,
                  currentPage: page,
                  pageSize,
                  formulas,
                },
              },
            });
          }
        } catch (error) {
          message.error(t('common:module.deleteFailed'));
          log.error(error);
        }
      },
    });
  };

  handleRecord = (recordID, action) => {
    const { history } = this.props;
    const params = {};
    let route = routes.RECORD;

    if (recordID) {
      route = routes.RECORD_ACTION;
      params.recordID = recordID;
    }

    if (action) {
      params.action = action;
    }

    history.push({ pathname: createRouteUrl(route, params, this.props) });
  };

  handlePageChange = (currentPage, pageSize) => {
    this.setState({
      currentPage,
      pageSize,
    });

    const {
      storeID,
      moduleID,
    } = parseParams(this.props);
    const { formulas = [] } = this.state;
    this.loadRecords({ storeID, moduleID, currentPage, pageSize, formulas });

    const { dispatch } = this.props;
    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        searchFilter: {
          recordsModuleID: moduleID,
          currentPage,
          pageSize,
          formulas,
        },
      },
    });
  };

  handleShowSizeChange = (current, size) => {
    this.handlePageChange(current, size);
  };

  handleSearch = (formula = '') => {
    const {
      storeID,
      moduleID,
    } = parseParams(this.props);
    const currentPage = 1;
    const pageSize = 10;

    const formulas = [{ formula }];
    this.loadRecords({ storeID, moduleID, currentPage, pageSize, formulas });

    this.setState({
      formulas,
    });

    const { dispatch } = this.props;
    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        searchFilter: {
          recordsModuleID: moduleID,
          currentPage,
          pageSize,
          formulas,
        },
      },
    });
  };

  /**
   * 过滤搜索条件
   * 特殊处理为空和不为空两种类型
   * search: 过滤条件列表
   */
  getSearcgFilter = (search = []) => {
    if (search && search.length === 0) {
      return true;
    } else if (
      search.length === 1 &&
      (search[0].filter === 'not_null' || search[0].filter === 'is_null')
    ) {
      return false;
    }
    return true;
  };

  checkUploaded = (data, name) => {
    const {
      t,
      searchFilter,
      dispatch,
    } = this.props;
    const {
      storeID,
      moduleID,
    } = parseParams(this.props);
    const {
      status: processStatus,
      rate,
      importErrors=null,
    } = data;
    this.setState({
      rate,
    })
    if(importErrors === null){
      if(processStatus === common.IMPORTED){
        clearInterval(this.processingInterval)
        this.setState({
          pending: false,
        })

        const {
          pageSize,
          formulas = [],
        } = this.state;
        this.loadRecords({
          storeID,
          moduleID,
          currentPage: 1,
          pageSize,
          formulas,
        });
        dispatch({
          type: reduxKey.UPDATE_GALAXY_REDUCER,
          payload: {
            searchFilter: {
              ...searchFilter,
              currentPage: 1,
            },
          },
        });

        message.success(`${name} ${t('common:module.FileUploadSuccess')}`);
      }
    } else {
      message.error(importErrors);
      clearInterval(this.processingInterval)
      this.setState({
        pending: false,
      })
    }

  }

  handleUploaded = (infos, name) => {
    const {
      dispatch,
      t,
      searchFilter,
    } = this.props;
    const {
      storeID,
      moduleID,
    } = parseParams(this.props);

    const {
      importErrors = null,
      status: importStatus = '',
      id = '',
    } = infos;
    if(importErrors === null){
      if(importStatus === common.PENDING){
        this.processingInterval = setInterval(() => {
          if(this.processingCount > 23 ){
            clearInterval(this.processingInterval)
            this.setState({
              pending: false,
            })
            message.info(t('common:module.waitForServerProcess'));
          }
          this.processingCount += 1;
          dispatch({
            type: reduxKey.MODULE_RECORD_IMPORT_CHECK,
            payload: {
              storeID,
              moduleID,
              importID: id,
              callback: (data) => this.checkUploaded(data, name),
            },
          })

        }, 5000);

        this.setState({
          pending: true,
        })

      } else if(importStatus === common.IMPORTED) {
        const {
          pageSize,
          formulas = [],
        } = this.state;
        this.loadRecords({
          storeID,
          moduleID,
          currentPage: 1,
          pageSize,
          formulas,
        });
        dispatch({
          type: reduxKey.UPDATE_GALAXY_REDUCER,
          payload: {
            searchFilter: {
              ...searchFilter,
              currentPage: 1,
            },
          },
        });
        message.success(`${name} ${t('common:module.FileUploadSuccess')}`);
      }
    } else {
      log.error(importErrors);
      message.error(importErrors)
    }

  }

  handleUpload = (info) => {
    const {
      t,
    } = this.props;
    const {
      rate,
    } = this.state;

    this.setState({
      rate,
    })

    const {
      file = {},
    } = info || {};

    const {
      status,
      response = {},
      name = '',
      size = 0,
    } = file || {};

    const {
      success = false,
      url = '',
    } = response

    let isExcel = false;
    const fileExtension = name.slice(name.lastIndexOf('.')+1)

    switch (fileExtension) {
      case 'xlsx':
      case 'xls':
      case 'csv':
        isExcel = true;
        break;
      default:
        isExcel = false;
        break;
    }
    if (!isExcel) {
      message.error(`${t('common:module.FileFormatLimit')}`);
      return;
    }
    const isLt200M = size / 1024 / 1024 < 200;
    if (!isLt200M) {
      message.error(`${t('common:module.FileUploadLimit')}200MB!`);
      return;
    }

    if ( isLt200M && isExcel && status === 'done' && success ) {
      this.setState({
        uploadFileUrl: url,
        uploadFileName: name,
      })
    }

  }

  handleImportCancel = () => {
    const {
      onResetState,
    } = this.props;
    onResetState({
      showImportModal: false,
    })
  }

  handleImportOk = () => {
    const {
      onResetState,
    } = this.props;
    onResetState({
      showImportModal: false,
    })
    const {
      uploadFileUrl: url,
      uploadFileName: name,
    } = this.state;
    if(url === '' || name === ''){
      return;
    }

    const {
      dispatch,
    } = this.props;

    const {
      storeID,
      moduleID,
    } = parseParams(this.props);
    dispatch({
      type: reduxKey.MODULE_RECORD_IMPORT_CREATE,
      payload: {
        storeID,
        moduleID,
        importUrl: url,
        callback: infos => this.handleUploaded(infos, name),
      },
    })
  }

  handleUpdateRecord = (record) => {
    if (record && record.id) {
      const newRecords = [];
      const {
        records,
      } = this.state;

      records.forEach(item => {
        if (item.id === record.id) {
          newRecords.push(record);
        } else {
          newRecords.push(item);
        }
      });

      this.setState({
        records: newRecords,
      })
    }
  }

  handleDeleteRecord = (recordID) => {
    if (recordID) {
      const newRecords = [];
      const {
        records,
      } = this.state;

      records.forEach(item => {
        if (item.id !== recordID) {
          newRecords.push(item);
        }
      });

      this.setState({
        records: newRecords,
      })
    }
  }

  handleInsertRecord = (record) => {
    if (record && record.id) {
      const {
        records,
      } = this.state;

      records.push(record);

      this.setState({
        records: [
          ...records,
        ],
      })
    }
  }

  render () {
    const {
      t,
      module,
      showImportModal = false,
      csvData = '',
    } = this.props;
    const {
      moduleID,
    } = parseParams(this.props);

    const {
      moduleParent,
      records,
      rowRecords,
      rowModule,
      pending = false,
      rate = 0,
      uploadFileName = '',
      scheduler,
    } = this.state;

    const processProps = {
      percent: rate,
    };
    if(pending && rate >= 0 && rate < 100){
      processProps.status = 'active';
    } else if (rate === 100 || pending === false){
      processProps.status = 'success';
    }

    const url = urls.uploadUrlByModuleID.replace('{moduleID}', moduleID);

    const importProps = {
      action: url,
      name: 'upload[file]',
      onChange: this.handleUpload,
      multiple: false,
      listType: 'text',
      showUploadList: false,
    };

    return (
      <div className={`${galaxyPrefix}-content ${listviewPrefix}-content`}>
        {/* {
          <FilterView
            fields={fields}
            storeID={storeID}
            moduleID={moduleID}
            searchFilter={searchFilter}
            onSearch={this.handleSearch}
          />
        } */}
        {
          pending &&
          rate >= 0 &&
          <Progress style={{ marginTop: '0', marginBottom: '10px'}} {...processProps} />
        }
        <Skeleton
          active={true}
          loading={!records || !rowRecords}
          className="bg-galaxy-skeleton"
        >
          <SchedulerParser
            {...this.props}
            module={module}
            moduleParent={moduleParent}
            records={records}
            rowRecords={rowRecords}
            rowModule={rowModule}
            scheduler={scheduler}
            onInsertRecord={this.handleInsertRecord}
            onUpdateRecord={this.handleUpdateRecord}
            onDeleteRecord={this.handleDeleteRecord}
          />
        </Skeleton>
        {
          // showExportTemplateModal &&
          // <ExportTemplateModal
          //   onCancelClick={() => this.setState({showExportTemplateModal: false})}
          //   editorContext={editorContext}
          //   exportRecord={exportRecord}
          //   {...this.props}
          // />
        }
        {
          // showExportModulerecord &&
          // <ExportModuleRecord
          //   onCancelClick={() => {onResetState({showExportModulerecord: false})}}
          //   moduleID={moduleID}
          //   stores={stores}
          //   {...this.props}
          // />
        }
        {
          showImportModal &&
          <Modal
            title={t('common:editor.import')}
            visible={true}
            onOk={this.handleImportOk}
            onCancel={this.handleImportCancel}
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <CSVLink data={csvData}>
                <Button>
                  <Icon type='download' />
                  {t('common:editor.downloadFile')}
                </Button>
              </CSVLink>
              <Upload style={{color: '#fff'}} {...importProps}>
                <Button style={{ marginTop: '20px'}}>
                  <Icon type='upload' />
                  {t('common:editor.uploadFile')}
                </Button>
              </Upload>
              {
                uploadFileName&&
                <div style={{marginTop: '10px'}}>
                  <Icon style={{ marginRight: '5px'}} type='link' />
                  {uploadFileName}
                </div>
              }
              <div style={{ marginTop: '10px', color: 'rgba(0,0,0,0.65)'}}>
              {t('common:editor.support')}
              : .xlsx，.xls，.csv
              </div>
            </div>
          </Modal>
        }
      </div>
    );
  }
}

export default SchedulerViewContent;

import React, { Component } from 'react'
import lodash from 'lodash'
import { translate } from 'react-i18next'
import {
  Button,
  Icon as AntdIcon,
  Dropdown,
  Menu,
  Input,
} from 'antd'
import FilterTag from './FilterTag'
import Conditional from '../../Editor/components/Conditional'
import mqlKind from '../../../constants/mqlKind'
import { createUuid } from '../../../utils'
import {
  queryConditions,
  createCondition,
  deleteCondition,
} from '../../../data/graphql/condition'
import { formulaToCst, cstToFormula } from '../../../data/CstParser'
import './FilterView.less'

const prefix = 'bg-c-parser-filterview';
@translate()
class FilterView extends Component {
  state = {
    mode: 'verbose', // 'verbose', 'concise'
    showConditional: false,
    currentCstData: null,
    isExpand: true,
    filters: [],
  }

  componentDidMount() {
    this.loadConditions({
      props: this.props,
    });

    const {
      searchFilter,
    } = this.props;

    const {
      formulas = [],
    } = searchFilter || {};

    let formula = '';
    if (Array.isArray(formulas) && formulas.length > 0) {
      const formulaObj = formulas[0];

      if (lodash.isObject(formulaObj) && formulaObj.formula) {
        ({formula} = formulaObj);
      }
    }

    this.setState({
      currentCstData: formulaToCst(formula),
    })
  }

  shouldComponentUpdate (nextProps) {
    const { moduleID } = this.props;
    const { moduleID: nextModuleID } = nextProps;

    if (moduleID !== nextModuleID) {
      this.setState({
        currentCstData: null,
      });
      this.loadConditions({
        props: nextProps,
      });
    }

    return true;
  }

  loadConditions = async ({props}) => {
    const {
      storeID,
      moduleID,
    } = props;

    const filters = await queryConditions({
      storeID,
      moduleID,
    });

    this.setState({
      filters,
    })
  }

  handleModeChange = (mode) => {
    this.setState({
      mode,
    })
  }

  handleEditCst = () => {
    this.setState({
      showConditional: true,
    })
  }

  handleFormulaOk = (cst) => {
    this.setState({
      currentCstData: cst,
      showConditional: false,
    });
  }

  insertChildren = (list, children) => {
    for (let i = 0; i < children.length; i++) {
      list.push(children[i]);
    }
  };

  repairChildrenOperator = cstData => {
    if (
      !cstData ||
      !lodash.isArray(cstData.children) ||
      cstData.children.length < 1
    ) {
      return;
    }

    const children = [];
    for (let i = 0; i < cstData.children.length; i++) {
      const item = cstData.children[i];
      if (
        item.type === 'LogicalExpression' &&
        item.operator === cstData.operator &&
        lodash.isArray(item.children) &&
        item.children.length > 0
      ) {
        this.insertChildren(children, item.children);
      }

      if (item.type === 'BinaryExpression') {
        children.push(item);
      }
    }

    cstData.children = children;
  };

  modifyCstData = (cstData, uuid) => {
    if (
      !lodash.isObject(cstData)
      || !lodash.isArray(cstData.children)
      || cstData.children.length < 1
    ) {
      return null;
    }

    const children = [];
    cstData.children.forEach(item => {
      if (item.type === mqlKind.BinaryExpression && item.uuid !== uuid) {
        children.push(item);
      } else if (item.type === mqlKind.LogicalExpression) {
        const newItem = this.modifyCstData(item, uuid);
        if (newItem) {
          children.push(newItem);
        }
      }
    });

    if (children.length > 0) {
      if (
        children.length === 1
        && children[0].type === mqlKind.LogicalExpression
      ) {
        [cstData] = children;
      } else {
        cstData.children = children;
      }

      return { ...cstData };
    } else {
      return null;
    }
  }

  handleDeleteTag = (id) => {
    const {
      currentCstData,
    } = this.state;

    let cstData = this.modifyCstData(currentCstData, id);
    if (
      !lodash.isObject(cstData)
      || !lodash.isArray(cstData.children)
    ) {
      cstData = null;
    }

    if (cstData) {
      this.repairChildrenOperator(cstData);
    }

    this.setState({
      currentCstData: cstData,
    });
  }

  getExistingFields = () => {
    const {
      fields,
    } = this.props;

    return fields || [];
  }

  getTagData = (cst) => {
    const tagData = [];
    if (!cst) {
      return tagData;
    }

    if (
      lodash.isObject(cst)
      && cst.type === mqlKind.LogicalExpression
      && lodash.isArray(cst.children)
    ) {
      cst.children.forEach(item => {
        if (item.type === mqlKind.BinaryExpression) {
          tagData.push(item);
        } else if (item.type === mqlKind.LogicalExpression) {
          tagData.push(...this.getTagData(item))
        }
      });
    }

    return tagData
  }

  handleSearch = () => {
    const {
      onSearch,
    } = this.props;

    const {
      currentCstData,
    } = this.state;

    let formula = cstToFormula(currentCstData);
    // search时 gender特殊处理
    if(formula.toUpperCase() === "$.SELF.GENDER=='FEMALE'"){
      formula = '$.self.gender==1';
    } else if(formula.toUpperCase() === "$.SELF.GENDER=='MALE'"){
      formula = '$.self.gender==0';
    }
    if (typeof onSearch === 'function') {
      onSearch(formula);
    }
  }

  handleSave = async () => {
    const {
      filterName,
      currentCstData,
      filters,
    } = this.state;

    const {
      storeID,
      moduleID,
    } = this.props;

    const formula = cstToFormula(currentCstData);

    if (lodash.isString(formula) && formula.length > 0) {
      const condition = await createCondition({
        storeID,
        moduleID,
        input: {
          uuid: createUuid(),
          name: filterName,
          condition: formula,
        },
      });

      if (condition && condition.id) {
        this.setState({
          filters: [
            ...filters,
            condition,
          ],
          filterName: '',
        });
      }
    }
  }

  deleteFilter = async (evt, id) => {
    evt.stopPropagation();
    const {
      filters,
    } = this.state;

    const {
      storeID,
      moduleID,
    } = this.props;

    const newFilters = [];
    let filterID = null;
    filters.forEach(item => {
      if (item.id === id) {
        filterID = item.id;
      } else {
        newFilters.push(item);
      }
    })

    if (filterID) {
      await deleteCondition({
        storeID,
        moduleID,
        id: filterID,
      });

      this.setState({
        filters: newFilters,
      });
    }
  }

  handleFilterNameChange = (evt) => {
    this.setState({
      filterName: evt.target.value,
    });
  }

  handleFilterClick = (id) => {
    const {
      filters,
    } = this.state;

    let filter = null;
    for (let i = 0; i < filters.length; i++) {
      const item = filters[i];
      if (item.id === id) {
        filter = item;
        break;
      }
    }

    if (filter) {
      const currentCstData = formulaToCst(filter.condition);
      this.setState({
        filterName: filter.name,
        currentCstData,
      })
    }
  }

  handleExpandChange = (evt) => {
    evt.stopPropagation();
    const {
      isExpand,
    } = this.state;

    this.setState({
      isExpand: !isExpand,
    })
  }

  render () {
    const {
      t,
    } = this.props;

    const {
      mode,
      filters = [],
      filterName = '',
      showConditional,
      currentCstData,
      isExpand,
    } = this.state;

    const tagData = this.getTagData(currentCstData);

    return (
      <div className={prefix}>
        <div className={`${prefix}-filter-wrapper ${mode}`}>
          <div className={`${prefix}-filter-tags`}>
            {
              tagData &&
              tagData.map(item => (
                <FilterTag
                  t={t}
                  key={item.uuid}
                  data={item}
                  mode={mode}
                  onClose={this.handleDeleteTag}
                />
              ))
            }
          </div>
          {
            mode === 'verbose' &&
            <Button
              className={`${prefix}-add-btn`}
              onClick={this.handleEditCst}
            >
              <AntdIcon type='plus' />
            </Button>
          }
          {
            mode === 'concise' &&
            <Button
              className={`${prefix}-concise-btn`}
              onClick={() => this.handleModeChange('verbose')}
            >
              {t('common:editor.show')}
              <AntdIcon className={`${prefix}-concise-btn-icon`} type='down' />
            </Button>
          }
        </div>
        {
          mode === 'verbose' &&
          <div className={`${prefix}-btns`}>
            <Button onClick={() => this.handleModeChange('concise')}>
              {t('common:module.hide')}
              <AntdIcon type='up' />
            </Button>
            <div className={`${prefix}-btns-space`} />
            <Dropdown
              overlay={
                <Menu className={`${prefix}-favorites-menu`}>
                  {
                    filters.map(item => (
                      <Menu.Item
                        className='favorites-dropdown'
                        key={item.id}
                        onClick={() => this.handleFilterClick(item.id)}
                      >
                        <span className='title'>{item.name}</span>
                        <AntdIcon
                          className='delIcon'
                          type='delete'
                          style={{ color: '#1890FF' }}
                          onClick={(evt) => this.deleteFilter(evt, item.id)}
                        />
                      </Menu.Item>
                    ))
                  }
                  <Menu.Item className='favorites-dropdown-bottom' key='0'>
                    <div className='save-options'>
                      <div className='save-options-title' onClick={this.handleExpandChange}>
                        <span style={{ color: '#1890FF' }}>
                          {t('common:editor.saveCurrentFilterConditions')}
                        </span>
                        <AntdIcon style={{ color: '#1890FF' }} type={isExpand ? 'up' : 'down'} />
                      </div>
                      {
                        isExpand &&
                        <div className='save-options-filter'>{t('common:editor.filterName')}</div>
                      }
                      {
                        isExpand &&
                        <Input
                          className='save-options-input'
                          placeholder={t('common:editor.filterNameInputHolder')}
                          value={filterName}
                          onChange={this.handleFilterNameChange}
                          onClick={e => e.stopPropagation()}
                        />
                      }
                      {
                        isExpand &&
                        <Button
                          style={{ width: '226px', height: '32px' }}
                          type='primary'
                          className='save-options-btn'
                          onClick={this.handleSave}
                        >
                          {t('common:save')}
                        </Button>
                      }
                    </div>
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
              placement='bottomCenter'
            >
              <Button className={`${prefix}-btns-favorites`}>
                {t('common:editor.favorites')}
                <AntdIcon type='down' />
              </Button>
            </Dropdown>
            <Button type='primary' onClick={this.handleSearch}>
              {t('common:module.search')}
            </Button>
          </div>
        }
        {
          showConditional &&
          <Conditional
            getExistingFields={this.getExistingFields}
            onCancel={() => this.setState({
              showConditional: false,
            })}
            data={currentCstData}
            onSubmit={this.handleFormulaOk}
          />
        }
      </div>
    )
  }
}

export default FilterView;

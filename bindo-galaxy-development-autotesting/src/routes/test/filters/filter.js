import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Menu, Dropdown, Input } from 'antd';
import _ from 'lodash';
import { createUuid } from '../../../utils';
import OPERATOR from '../../../constants/operator'
import './index.less';
import TitleTag from './tags';
import Conditional from '../../../components/Editor/components/Conditional';
import { formulaToCst, cstToFormula } from '../../../data/CstParser';
// import hocProperties from '../../../components/Editor/components/NodeProperties/hocProperties'
// @hocProperties()

@connect(({ galaxy }) => ({ ...galaxy }))
class Filters extends Component {
  state = {
    showConditional: false,
    currentFormula: '',
    hidden: false,
    filterInputValue: '',
    tagList: [
      {
        identy: '111',
        title: 'title1',
        tag: 'tag1',
      },
      {
        identy: '222',
        title: 'title2',
        tag: 'tag2',
      },
    ],
    filters: [
      {
        key: '12',
        title: 'title2',
      },
      {
        key: '222',
        title: 'title2',
      },
    ],
  };

  hideTags = () => {
    this.setState({
      hidden: true,
    });
  };

  showTags = () => {
    this.setState({
      hidden: false,
    });
  };

  addItem = () => {
    const {
      currentFormula,
    } = this.state;
    log.info('addItem state', this.state)
    this.setState({
      cstData: formulaToCst(currentFormula),
      showConditional: true,
    });
  };

  handleFormulaOk = cst => {
    log.info('cst', cst)
    log.info('cstToFormula', cstToFormula(cst))
    this.setState({
      currentFormula: cstToFormula(cst).toString(),
      showConditional: false,
    });
    log.info('handleFormulaOk', this.state)
  };

  addFilter = e => {
    e.stopPropagation();
    const { filters, filterInputValue } = this.state;
    const uuid = createUuid();
    const newFilter = {
      key: uuid,
      title: filterInputValue || 'new title',
    };
    const newFilters = [...filters, newFilter];
    this.setState({
      filters: newFilters,
      filterInputValue: '',
    });
  };

  handleFilterInput = e => {
    this.setState({
      filterInputValue: e.target.value,
    });
  };

  getExistingFields = () => {
    const {
      fields,
    } = this.props;
    return fields;
  }

  parseCurrentFormula = (formula) => {
    if (formula.length < 1) {
      return;
    }
    const formulaString = formula.replace(/\(|\)|(\$\.self\.)|'/g, '').replace(/\|\|/g, '&&');
    log.info('formulaString', formulaString)
    const formulaArray = formulaString.split('&&');
    log.info('formulaArray', formulaArray);

    const final = [];
    formulaArray.forEach(item => {
      if (_.includes(item, OPERATOR.IS_NULL)) {
        item = item.replace(OPERATOR.IS_NULL, '');
        final.push({
          identy: createUuid(),
          title: item,
          tag: OPERATOR.IS_NULL,
        });
      } else if (_.includes(item, OPERATOR.NOT_NULL)) {
        item = item.replace(OPERATOR.NOT_NULL, '');
        final.push({
          identy: createUuid(),
          title: item,
          tag: OPERATOR.NOT_NULL,
        });
      } else if (_.includes(item, OPERATOR.NOT_CONTAIN)) {
        item = item.replace(OPERATOR.NOT_CONTAIN, '').split(',');
        final.push({
          identy: createUuid(),
          title: `${item[0]} ${OPERATOR.NOT_CONTAIN}`,
          tag: item[1],
        });
      } else if (_.includes(item, OPERATOR.CONTAIN)) {
        item = item.replace(OPERATOR.CONTAIN, '').split(',');
        final.push({
          identy: createUuid(),
          title: `${item[0]} ${OPERATOR.CONTAIN}`,
          tag: item[1],
        });
      } else if (_.includes(item, OPERATOR.NOT_IN)) {
        item = item.replace(OPERATOR.NOT_IN, '');
        const index = item.indexOf(',');
        const key = item.slice(0, index);
        const value = item.slice(index + 1);
        final.push({
          identy: createUuid(),
          title: `${key} ${OPERATOR.NOT_IN}`,
          tag: value,
        });
      } else if (_.includes(item, OPERATOR.IN)) {
        item = item.replace(OPERATOR.IN, '');
        const index = item.indexOf(',');
        const key = item.slice(0, index);
        const value = item.slice(index + 1);
        final.push({
          identy: createUuid(),
          title: `${key} ${OPERATOR.IN}`,
          tag: value,
        });
      } else if (_.includes(item, '==')) {
        item = item.split('==');
        final.push({
          identy: createUuid(),
          title: `${item[0]} =`,
          tag: item[1],
        });
      } else if (_.includes(item, '!=')) {
        item = item.split('!=');
        final.push({
          identy: createUuid(),
          title: `${item[0]} !=`,
          tag: item[1],
        });
      } else if (_.includes(item, '>=')) {
        item = item.split('>=');
        final.push({
          identy: createUuid(),
          title: `${item[0]} >=`,
          tag: item[1],
        });
      } else if (_.includes(item, '>')) {
        item = item.split('>');
        final.push({
          identy: createUuid(),
          title: `${item[0]} >`,
          tag: item[1],
        });
      } else if (_.includes(item, '<=')) {
        item = item.split('<=');
        final.push({
          identy: createUuid(),
          title: `${item[0]} <=`,
          tag: item[1],
        });
      } else if (_.includes(item, '<')) {
        item = item.split('<');
        final.push({
          identy: createUuid(),
          title: `${item[0]} <`,
          tag: item[1],
        });
      }
    });

    log.info('final', final);
    return final;
  }

  delItem = () => {
    this.addItem();
  }

  delMenuItem (key, e) {
    e.stopPropagation();
    let { filters } = this.state;
    filters = filters.filter(item => item.key !== key);
    this.setState({
      filters,
    });
  }

  render () {
    const {
      hidden,
      filters,
      filterInputValue,
      showConditional,
      cstData,
      currentFormula,
    } = this.state;

    const tagList = this.parseCurrentFormula(currentFormula);
    log.info('tagList', tagList)

    return (
      <div
        className={`bg-filter-container ${
          hidden ? 'bg-filter-container-hidden' : 'bg-filter-container-show'
        }`}
      >
        <div className={`board ${!hidden && 'boardBorderHide'}`}>
          <div className='lists'>
            <div className='innerList'>
              {tagList && tagList.map(item => (
                <TitleTag
                  hidden={hidden}
                  delItem={this.delItem}
                  key={item.identy}
                  identy={item.identy}
                  title={item.title}
                  tag={item.tag}
                  className='titleTag'
                />
              ))}
            </div>
          </div>
          {hidden ? (
            <Button className='showBtn' onClick={this.showTags}>
              Show
              <Icon className='upDownIcon' type='down' />
            </Button>
          ) : (
              <Button className='editBtn' onClick={this.addItem}>
                <span className='addEditBtn'>+</span>
              </Button>
          )}
        </div>
        {hidden ? (
          <span />
        ) : (
            <div className='bottom'>
              <Button className='hideBtn' onClick={this.hideTags}>
                Hide
              <Icon className='upDownIcon' type='up' />
              </Button>
              <div className='right'>
                <Dropdown
                  overlay={
                    <Menu className='bg-filter-favorites-menu'>
                      {filters.map(item => (
                        <Menu.Item className='favorites-dropdown' key={item.key}>
                          <span className='title'>{item.title}</span>
                          <Icon
                            className='delIcon'
                            type='delete'
                            style={{ color: '#1890FF' }}
                            onClick={e => this.delMenuItem(item.key, e)}
                          />
                        </Menu.Item>
                      ))}
                      <Menu.Item className='favorites-dropdown-bottom' key='0'>
                        <div className='save-options'>
                          <div className='save-options-title'>
                            <span style={{ color: '#1890FF' }}>
                              Save current Filter Conditions
                            </span>
                            <Icon style={{ color: '#1890FF' }} type='down' />
                          </div>
                          <div className='save-options-filter'>Filter Name</div>
                          <Input
                            className='save-options-input'
                            placeholder='input'
                            value={filterInputValue}
                            onChange={this.handleFilterInput}
                            onClick={e => e.stopPropagation()}
                          />
                          <Button
                            style={{ width: '226px', height: '32px' }}
                            type='primary'
                            className='save-options-btn'
                            onClick={this.addFilter}
                          >
                            Save
                          </Button>
                        </div>
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                  placement='bottomLeft'
                >
                  <Button className='favBtn'>
                    Favorites
                  <Icon className='upDownIcon' type='down' />
                  </Button>
                </Dropdown>
                <Button type='primary' className='searchBtn'>
                  Search
                </Button>
              </div>
            </div>
        )}
        {showConditional && (
          <Conditional
            getExistingFields={this.getExistingFields}
            onCancel={() => this.setState({
              showConditional: false,
            })}
            data={cstData}
            onSubmit={this.handleFormulaOk}
          />
        )}
      </div>
    );
  }
}

export default Filters;

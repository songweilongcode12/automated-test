import React, { Component } from 'react'
import { Select, Icon as AntdIcon } from 'antd'
import ConditionalContext from './ConditionalContext'
import BinaryExpression from './BinaryExpression'
import Operator from '../../../../constants/operator'

class LogicalExpression extends Component {
  render() {

    const {
      t,
      data,
      prefix,
      index,
      parentUuid,
      rootNode,
    } = this.props;
    const {
      uuid,
      operator = Operator.AND,
      children = [],
    } = data;

    const itemsStyle = {};
    const lineStyle = {
      display: 'flex',
    }

    if (!rootNode) {
      itemsStyle.marginLeft = '32px';
      lineStyle.marginTop = '5px';
    }

    return (
      <ConditionalContext.Consumer>
        {
          (context) => (
            <div>
              <div style={lineStyle}>
                <div style={{flex: 1}}>
                  {
                    rootNode &&
                    <span>Match records with</span>
                  }
                  <Select
                    value={operator}
                    onChange={value => context.modifyOperator({
                      uuid,
                      data: {
                        operator: value,
                      },
                    })}
                  >
                    <Select.Option key="all" value={Operator.AND}>
                      {t('common:editor.all')}
                    </Select.Option>
                    <Select.Option key="or" value={Operator.OR}>
                      {t('common:editor.any')}
                    </Select.Option>
                  </Select>
                  {
                    rootNode &&
                    <span>of the following rules:</span>
                  }
                  {
                    !rootNode &&
                    <span>of:</span>
                  }
                </div>
                {
                  !rootNode &&
                  <AntdIcon
                    type="close"
                    style={{marginLeft: '8px'}}
                    className={`${prefix}-binary-btn`}
                    onClick={() => context.removeLogical({uuid})}
                  />
                }
                {
                  !rootNode &&
                  <AntdIcon
                    type="plus-circle"
                    className={`${prefix}-binary-btn add`}
                    onClick={() => context.insertLogical({
                      uuid: parentUuid,
                      index: index + 1,
                      type: 'BinaryExpression',
                    })}
                  />
                }
                {
                  !rootNode &&
                  <AntdIcon
                    type="dash"
                    className={`${prefix}-binary-btn`}
                    onClick={() => context.insertLogical({
                      uuid: parentUuid,
                      index: index+1,
                      operator,
                      type: 'LogicalExpression',
                    })}
                  />
                }
              </div>
              <div style={itemsStyle}>
                {
                  children.map((item, idx) => {
                    if (item.type === 'LogicalExpression') {
                      return (
                        <LogicalExpression
                          t={t}
                          parentUuid={uuid}
                          key={item.uuid}
                          data={item}
                          prefix={prefix}
                          index={idx}
                        />
                      );
                    } else if (item.type === 'BinaryExpression') {
                      return (
                        <BinaryExpression
                          t={t}
                          parentUuid={uuid}
                          key={item.uuid}
                          data={item}
                          prefix={prefix}
                          index={idx}
                          parentOperator={operator}
                        />
                      );
                    }

                    return;
                  })
                }
              </div>
            </div>
          )
        }
      </ConditionalContext.Consumer>
    );
  }
}

export default LogicalExpression;

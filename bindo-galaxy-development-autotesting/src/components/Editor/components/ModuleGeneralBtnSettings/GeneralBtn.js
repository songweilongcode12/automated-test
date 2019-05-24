import React from 'react'
import { Form, Checkbox } from 'antd'
import common from '../../../../constants/common'

export default (props) => {
  const {
    t,
    data,
    viewType,
    onChange = () => {},
  } = props;

  const {
    status = common.INVALID,
    title,
  } = data || {};

  return (
    <Form.Item>
      <Checkbox
        checked={status === common.ACTIVE}
        onChange={({target}) => {
          const {
            checked = false,
          } = target || {};

          onChange(
            {
              ...data,
              status: checked ? common.ACTIVE : common.INVALID,
            },
            viewType
          );
        }}
      >
        {t('common:editor.funcBtnTitleWrapper').replace('{title}', t(title))}
      </Checkbox>
    </Form.Item>
  );
};

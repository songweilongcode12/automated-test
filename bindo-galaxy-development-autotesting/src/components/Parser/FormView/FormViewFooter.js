import React from 'react'
import {
  Button,
} from 'antd'
import galaxyConstant from '../../../constants/galaxyConstant'
import common from '../../../constants/common'
import {
  parseParams,
} from '../../../utils/galaxy'

const galaxyPrefix = 'bg-galaxy';

export default (props) => {
  const {
    t,
    funcBtns,
    permissionsMap,
    permissionsAndModulesDone,
    editableData,
    galaxyLoading,
    moduleType,
    onSubmitClick = () => {},
    onEditClick = () => {},
    onCancelClick = () => {},
    onToListClick = () => {},
  } = props;

  const {
    action,
  } = parseParams(props);

  return (
    <div className={`${galaxyPrefix}-footer`}>
      <span>Overview</span>
      {
        (
          funcBtns.formSet.has('Edit') && permissionsMap.get(galaxyConstant.ACTIONS).has('EDIT')
          || funcBtns.listSet.has('New') && permissionsMap.get(galaxyConstant.ACTIONS).has('CREATE')
        )
        && editableData &&
        <Button
          type="primary"
          className={`${galaxyPrefix}-btn`}
          loading={galaxyLoading}
          onClick={onSubmitClick}
        >
          {t('common:save')}
        </Button>
      }
      {
        funcBtns.formSet.has('Edit') && permissionsMap.get(galaxyConstant.ACTIONS).has('EDIT')
        && !editableData && (action === 'view' || moduleType === common.SETTING) &&
        <Button
          type="primary"
          className={`${galaxyPrefix}-btn`}
          onClick={onEditClick}
        >
          {t('common:edit')}
        </Button>
      }
      {
        permissionsAndModulesDone &&
        editableData && (action === 'view' || moduleType === common.SETTING) &&
        <Button
          type="primary"
          className={`${galaxyPrefix}-btn`}
          onClick={onCancelClick}
        >
          {t('common:cancel')}
        </Button>
      }
      {
        permissionsAndModulesDone &&
        moduleType !== common.SETTING && (action === 'edit' || action === 'new') &&
        <Button
          type="primary"
          className={`${galaxyPrefix}-btn`}
          onClick={onToListClick}
        >
          {t('common:cancel')}
        </Button>
      }
    </div>
  );
}

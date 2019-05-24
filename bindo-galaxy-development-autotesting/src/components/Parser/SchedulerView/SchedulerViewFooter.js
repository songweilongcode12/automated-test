
import React from 'react'
import {
  Button,
  Skeleton,
} from 'antd'
import galaxyConstant from '../../../constants/galaxyConstant'

const galaxyPrefix = 'bg-galaxy';

export default (props) => {
  const {
    t,
    storesMap,
    funcBtns,
    permissionsMap,
    permissionsAndModulesDone,
    onNewClick = () => {},
    onImportClick = () => {},
    onExportClick = () => {},
    pending = false,
  } = props;
  return (
    <div className={`${galaxyPrefix}-footer`}>
      <span>Overview</span>
      <Skeleton
        active={true}
        loading={storesMap.size < 1 || !permissionsAndModulesDone}
        className="bg-galaxy-skeleton"
      >
        {
          funcBtns.listSet.has('New')
          && permissionsMap.get(galaxyConstant.ACTIONS).has('CREATE') &&
          <Button
            type='primary'
            className={`${galaxyPrefix}-btn`}
            onClick={onNewClick}
          >
            {t('common:new')}
          </Button>
        }
        {
          funcBtns.listSet.has('Import')
          && permissionsMap.get(galaxyConstant.ACTIONS).has('IMPORT') &&
          <Button
            disabled={pending}
            onClick={onImportClick}
            type='primary'
            className={`${galaxyPrefix}-btn`}
          >
          {t('common:editor.import')}
          </Button>
        }
        {
          funcBtns.listSet.has('Export')
          && permissionsMap.get(galaxyConstant.ACTIONS).has('EXPORT') &&
          <Button
            type='primary'
            className={`${galaxyPrefix}-btn`}
            onClick={onExportClick}
          >
            {t('common:editor.export')}
          </Button>
        }
      </Skeleton>
    </div>
  )
}

import React from 'react'
import { Button } from 'antd'
import galaxyConstant from '../../constants/galaxyConstant'

const galaxyPrefix = 'bg-galaxy'

export default ({
  t,
  modeType,
  sorting,
  onNewClick,
  onDiscardSortClick,
  onSaveSortClick,
  onSortClick,
}) => (
  <div className={`${galaxyPrefix}-footer`}>
    <span>Overview</span>
    {
      modeType === galaxyConstant.NORMAL &&
      <Button
        type="primary"
        className={`${galaxyPrefix}-btn`}
        onClick={onNewClick}
      >
        {t('common:new')}
      </Button>
    }
    {
      modeType === galaxyConstant.NORMAL &&
      <Button
        type="primary"
        className={`${galaxyPrefix}-btn`}
        onClick={onSortClick}
      >
        {t('common:sort')}
      </Button>
    }
    {
      modeType === galaxyConstant.SORTING &&
      <Button
        type="primary"
        loading={sorting}
        className={`${galaxyPrefix}-btn`}
        onClick={onSaveSortClick}
      >
        {t('common:save')}
      </Button>
    }
    {
      modeType === galaxyConstant.SORTING &&
      <Button
        type="primary"
        loading={sorting}
        className={`${galaxyPrefix}-btn`}
        onClick={onDiscardSortClick}
      >
        {t('common:discard')}
      </Button>
    }
  </div>
)

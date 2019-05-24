import React from 'react'
import Sortable from '../Sortable'

const prefix = 'bindo-galaxy-editor-content-container'

const name = 'formview-container'
const options = {
  group: {
    name,
    put: [
      'formview-layout-widgets',
      'formview-base-widgets',
      'formview-relation-widgets',
      // 'formview-tabs-view',
    ],
  },
}

export default (props) => {
  const {
    viewModels = [],
    sortableDisabled = false,
    fields = [],
  } = props
  return (
    <Sortable
      data={viewModels}
      uuid="0"
      type={name}
      options={options}
      fields={fields}
      sortableDisabled={sortableDisabled}
      className={prefix}
    />
  )
}

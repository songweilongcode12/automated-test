import { createUuid } from '../../../../utils';
import widgets from '../../../../constants/widgets';

export default [
  // {
  //   viewType: widgets.WIDGET,
  //   type: widgets.ONE_TO_ONE,
  //   text: 'one2One',
  //   icon: 'icon-one-to-one',
  //   uuid: createUuid(),
  // },
  {
    viewType: widgets.WIDGET,
    type: widgets.ONE_TO_MANY,
    text: 'one2Many',
    icon: 'icon-one-to-many',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.MANY_TO_ONE,
    text: 'many2One',
    icon: 'icon-many-to-one',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.MANY_TO_MANY,
    text: 'many2Many',
    icon: 'icon-many-to-many',
    uuid: createUuid(),
  },
  // {
  //   viewType: widgets.WIDGET,
  //   type: widgets.RELATED_FIELD,
  //   text: 'relatedField',
  //   icon: 'icon-workflow-setup',
  //   uuid: createUuid(),
  // },
]

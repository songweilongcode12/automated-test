import { createUuid } from '../../../../utils';
import widgets from '../../../../constants/widgets';

const data = [
  {
    viewType: widgets.WIDGET,
    type: widgets.TABS,
    text: 'tabs',
    icon: 'icon-tabs',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.COLUMNS,
    text: 'columns',
    icon: 'icon-columns',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.EDITOR,
    text: 'tempEditor',
    icon: 'icon-input',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.DIVIDER,
    text: 'divider',
    icon: 'icon-input',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.LABEL,
    text: 'label',
    icon: 'icon-input',
    uuid: createUuid(),
  },
]

export default data

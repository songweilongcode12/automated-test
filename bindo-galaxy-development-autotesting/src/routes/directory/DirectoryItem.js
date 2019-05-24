import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';

const prefix = 'bg-r-directory';

export default (props) => {
  const { url, icon, title } = props;
  return (
    <Link to={url} className={`${prefix}-item`}>
      <Icon type={icon} />
      <div className="title">{title}</div>
    </Link>
  );
}

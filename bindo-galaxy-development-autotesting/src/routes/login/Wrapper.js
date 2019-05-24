import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Menu, Dropdown } from 'antd';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { languageData } from '../../data';

const prefix = 'bg-r-login';

@translate()
class Wrapper extends Component {
  changeLanguage = (key) => {
    if (i18n.language !== key) {
      i18n.changeLanguage(key);
    }
  }

  getLanguageOverlay = () => (
    <Menu onClick={({key}) => this.changeLanguage(key)}>
      {
        languageData.map(item =>
          <Menu.Item key={item.key} style={{background: item.key === i18n.language ? '#E6F7FF' : ''}}>
            <Icon type={item.icon} />
            {item.title}
          </Menu.Item>
        )
      }
    </Menu>
  )

  render() {
    const {
      children,
    } = this.props;

    return (
      <div className={prefix}>
        <div className={`${prefix}-header`}>
          <Dropdown
            className={`${prefix}-menu`}
            overlay={this.getLanguageOverlay()}
          >
            <Icon
              type="icon-language"
              style={{fontSize: '20px'}}
            />
          </Dropdown>
        </div>
        <div className={`${prefix}-content`}>
          <div className={`${prefix}-wrapper`}>
            {
              children
            }
          </div>
        </div>
        <div className={`${prefix}-footer`}>
          <div>2018 Bindo Labs, Inc. All rights reserved.</div>
          <div>Bindo is a registered trademark of Bindo Labs, Inc</div>
        </div>
      </div>
    );
  }
}

export default Wrapper;

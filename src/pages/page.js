import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Page extends Component {
  render() {
    return (
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">首页</Link>
            </li>
            <li>
              <Link to="/second">第二页</Link>
            </li>
          </ul>
        </nav>
        {/* 其他页面内容 */}
      </div>
    );
  }
}

export default Page;

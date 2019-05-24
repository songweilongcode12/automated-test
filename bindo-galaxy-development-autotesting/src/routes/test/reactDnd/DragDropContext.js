import React, {Component} from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class App extends Component {
  handleClick = ()=> {
    log.info('handleClick')
  }

  render(){
    return <div onClick={this.handleClick}>ReacDnd</div>
  }
}

export default DragDropContext(HTML5Backend)(App);

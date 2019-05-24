import React, { Component } from 'react'
import FormulaEditor from '../../../components/FormulaEditor'
import { formulaToMql, mqlToFormula } from '../../../data/MqlParser';

class TestFormulaEditor extends Component {
  componentDidMount() {
    const source = "IN($.self.color, ['red', 'green'])|| $.self.count>20 && ($.self.count<60 || $.self.count==90)";
    // const source = "IN($.self.user_name, ['admin'])&&IN($.self.user_name, ['bob'])&&IN($.self.user_name, ['Jack'])";
    log.info(source)
    const mql = formulaToMql(source);
    log.info(mql);
    log.info(JSON.stringify(mql));
    const string = mqlToFormula(mql);
    log.info(string);
  }

  render() {
    return (
      <FormulaEditor />
    );
  }
}

export default TestFormulaEditor;

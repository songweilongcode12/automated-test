import { mqlToCst, cstToMql } from '../CstParser'
import operatorConstants from '../../constants/operator'
import mqlKindConstants from '../../constants/mqlKind'

const mql1 = {
  kind: mqlKindConstants.LOGICAL,
  left: {
    kind: mqlKindConstants.LOGICAL,
    left: {
      kind: mqlKindConstants.LOGICAL,
      left: {
        kind: mqlKindConstants.BINARY,
        left: {
          kind: mqlKindConstants.VARIABLE,
          value: '$.self.f',
        },
        operator: operatorConstants.GT,
        right: {
          kind: mqlKindConstants.LITERAL,
          value: 100,
        },
      },
      operator: operatorConstants.AND,
      right: {
        kind: mqlKindConstants.BINARY,
        left: {
          kind: mqlKindConstants.VARIABLE,
          value: '$.self.q',
        },
        operator: operatorConstants.LT,
        right: {
          kind: mqlKindConstants.LITERAL,
          value: 200,
        },
      },
    },
    operator: operatorConstants.AND,
    right: {
      kind: mqlKindConstants.BINARY,
      left: {
        kind: mqlKindConstants.VARIABLE,
        value: '$.self.a',
      },
      operator: operatorConstants.GT,
      right: {
        kind: mqlKindConstants.LITERAL,
        value: 1,
      },
    },
  },
  operator: operatorConstants.AND,
  right: {
    kind: mqlKindConstants.BINARY,
    left: {
      kind: mqlKindConstants.VARIABLE,
      value: '$.self.c',
    },
    operator: operatorConstants.GT,
    right: {
      kind: mqlKindConstants.LITERAL,
      value: 5,
    },
  },
}

it('MQL to Conditional data', () => {
  const cst = mqlToCst(mql1)
  expect(cst.operator).toEqual(operatorConstants.AND)
  expect(cst.type).toEqual(mqlKindConstants.LogicalExpression)
  expect(cst.children[0].type).toEqual(mqlKindConstants.BinaryExpression)
  expect(cst.children[0].operator).toEqual(operatorConstants.GT)
  expect(cst.children[0].left.type).toEqual(mqlKindConstants.VARIABLE)
  expect(cst.children[0].left.value).toEqual('f')
  expect(cst.children[0].right.type).toEqual(mqlKindConstants.LITERAL)
  expect(cst.children[0].right.value).toEqual(100)
  expect(cst.children[1].type).toEqual(mqlKindConstants.BinaryExpression)
  expect(cst.children[1].operator).toEqual(operatorConstants.LT)
  expect(cst.children[1].left.type).toEqual(mqlKindConstants.VARIABLE)
  expect(cst.children[1].left.value).toEqual('q')
  expect(cst.children[1].right.type).toEqual(mqlKindConstants.LITERAL)
  expect(cst.children[1].right.value).toEqual(200)
  expect(cst.children[2].type).toEqual(mqlKindConstants.BinaryExpression)
  expect(cst.children[2].operator).toEqual(operatorConstants.GT)
  expect(cst.children[2].left.type).toEqual(mqlKindConstants.VARIABLE)
  expect(cst.children[2].left.value).toEqual('a')
  expect(cst.children[2].right.type).toEqual(mqlKindConstants.LITERAL)
  expect(cst.children[2].right.value).toEqual(1)
  expect(cst.children[3].type).toEqual(mqlKindConstants.BinaryExpression)
  expect(cst.children[3].operator).toEqual(operatorConstants.GT)
  expect(cst.children[3].left.type).toEqual(mqlKindConstants.VARIABLE)
  expect(cst.children[3].left.value).toEqual('c')
  expect(cst.children[3].right.type).toEqual(mqlKindConstants.LITERAL)
  expect(cst.children[3].right.value).toEqual(5)
})

const mql2 = {
  kind: mqlKindConstants.LOGICAL,
  left: {
    kind: mqlKindConstants.LOGICAL,
    left: {
      kind: mqlKindConstants.LOGICAL,
      left: {
        kind: mqlKindConstants.BINARY,
        left: {
          kind: mqlKindConstants.VARIABLE,
          value: '$.self.f',
        },
        operator: operatorConstants.GT,
        right: {
          kind: mqlKindConstants.LITERAL,
          value: 100,
        },
      },
      operator: operatorConstants.AND,
      right: {
        kind: mqlKindConstants.BINARY,
        left: {
          kind: mqlKindConstants.VARIABLE,
          value: '$.self.q',
        },
        operator: operatorConstants.LT,
        right: {
          kind: mqlKindConstants.LITERAL,
          value: 200,
        },
      },
    },
    operator: operatorConstants.OR,
    right: {
      kind: mqlKindConstants.BINARY,
      left: {
        kind: mqlKindConstants.VARIABLE,
        value: '$.self.a',
      },
      operator: operatorConstants.GT,
      right: {
        kind: mqlKindConstants.LITERAL,
        value: 1,
      },
    },
  },
  operator: operatorConstants.AND,
  right: {
    kind: mqlKindConstants.BINARY,
    left: {
      kind: mqlKindConstants.VARIABLE,
      value: '$.self.c',
    },
    operator: operatorConstants.GT,
    right: {
      kind: mqlKindConstants.LITERAL,
      value: 5,
    },
  },
}

it('MQL to Conditional data', () => {
  const cst = mqlToCst(mql2)
  expect(cst.operator).toEqual(operatorConstants.AND)
  expect(cst.type).toEqual(mqlKindConstants.LogicalExpression)
  expect(cst.children[0].operator).toEqual(operatorConstants.OR)
  expect(cst.children[0].type).toEqual(mqlKindConstants.LogicalExpression)
  expect(cst.children[0].children[0].operator).toEqual(operatorConstants.AND)
  expect(cst.children[0].children[0].type).toEqual(mqlKindConstants.LogicalExpression)
  expect(cst.children[0].children[0].children[0].operator).toEqual(operatorConstants.GT)
  expect(cst.children[0].children[0].children[0].type).toEqual(mqlKindConstants.BinaryExpression)
  expect(cst.children[0].children[0].children[0].left.type).toEqual(mqlKindConstants.VARIABLE)
  expect(cst.children[0].children[0].children[0].left.value).toEqual('f')
  expect(cst.children[0].children[0].children[0].right.type).toEqual(mqlKindConstants.LITERAL)
  expect(cst.children[0].children[0].children[0].right.value).toEqual(100)
  expect(cst.children[0].children[0].children[1].operator).toEqual(operatorConstants.LT)
  expect(cst.children[0].children[0].children[1].type).toEqual(mqlKindConstants.BinaryExpression)
  expect(cst.children[0].children[0].children[1].left.type).toEqual(mqlKindConstants.VARIABLE)
  expect(cst.children[0].children[0].children[1].left.value).toEqual('q')
  expect(cst.children[0].children[0].children[1].right.type).toEqual(mqlKindConstants.LITERAL)
  expect(cst.children[0].children[0].children[1].right.value).toEqual(200)
  expect(cst.children[0].children[1].operator).toEqual(operatorConstants.GT)
  expect(cst.children[0].children[1].type).toEqual(mqlKindConstants.BinaryExpression)
  expect(cst.children[0].children[1].left.type).toEqual(mqlKindConstants.VARIABLE)
  expect(cst.children[0].children[1].left.value).toEqual('a')
  expect(cst.children[0].children[1].right.type).toEqual(mqlKindConstants.LITERAL)
  expect(cst.children[0].children[1].right.value).toEqual(1)
  expect(cst.children[1].operator).toEqual(operatorConstants.GT)
  expect(cst.children[1].type).toEqual(mqlKindConstants.BinaryExpression)
  expect(cst.children[1].left.type).toEqual(mqlKindConstants.VARIABLE)
  expect(cst.children[1].left.value).toEqual('c')
  expect(cst.children[1].right.type).toEqual(mqlKindConstants.LITERAL)
  expect(cst.children[1].right.value).toEqual(5)
})

const cst1 = {
  operator: operatorConstants.AND,
  type: mqlKindConstants.LogicalExpression,
  children: [{
    operator: operatorConstants.GT,
    type: mqlKindConstants.BinaryExpression,
    left: {
      type: mqlKindConstants.VARIABLE,
      viewType: '',
      value: 'f',
    },
    right: {
      type: mqlKindConstants.LITERAL,
      value: 100,
    },
  }, {
    operator: operatorConstants.LT,
    type: mqlKindConstants.BinaryExpression,
    left: {
      type: mqlKindConstants.VARIABLE,
      viewType: '',
      value: 'q',
    },
    right: {
      type: mqlKindConstants.LITERAL,
      value: 200,
    },
  }, {
    operator: operatorConstants.GT,
    type: mqlKindConstants.BinaryExpression,
    left: {
      type: mqlKindConstants.VARIABLE,
      viewType: '',
      value: 'a',
    },
    right: {
      type: mqlKindConstants.LITERAL,
      value: 1,
    },
  }, {
    operator: operatorConstants.GT,
    type: mqlKindConstants.BinaryExpression,
    left: {
      type: mqlKindConstants.VARIABLE,
      viewType: '',
      value: 'c',
    },
    right: {
      type: mqlKindConstants.LITERAL,
      value: 5,
    },
  }],
}

it('Conditional to MQL data', () => {
  const mql = cstToMql(cst1)
  expect(mql.kind).toEqual(mqlKindConstants.LOGICAL)
  expect(mql.operator).toEqual(operatorConstants.AND)
  expect(mql.left.kind).toEqual(mqlKindConstants.LOGICAL)
  expect(mql.left.operator).toEqual(operatorConstants.AND)
  expect(mql.left.left.kind).toEqual(mqlKindConstants.LOGICAL)
  expect(mql.left.left.operator).toEqual(operatorConstants.AND)
  expect(mql.left.left.left.kind).toEqual(mqlKindConstants.BINARY)
  expect(mql.left.left.left.operator).toEqual(operatorConstants.GT)
  expect(mql.left.left.left.left.kind).toEqual(mqlKindConstants.VARIABLE)
  expect(mql.left.left.left.left.value).toEqual('$.self.f')
  expect(mql.left.left.left.right.kind).toEqual(mqlKindConstants.LITERAL)
  expect(mql.left.left.left.right.value).toEqual(100)
  expect(mql.left.left.right.kind).toEqual(mqlKindConstants.BINARY)
  expect(mql.left.left.right.operator).toEqual(operatorConstants.LT)
  expect(mql.left.left.right.left.kind).toEqual(mqlKindConstants.VARIABLE)
  expect(mql.left.left.right.left.value).toEqual('$.self.q')
  expect(mql.left.left.right.right.kind).toEqual(mqlKindConstants.LITERAL)
  expect(mql.left.left.right.right.value).toEqual(200)
  expect(mql.left.right.kind).toEqual(mqlKindConstants.BINARY)
  expect(mql.left.right.operator).toEqual(operatorConstants.GT)
  expect(mql.left.right.left.kind).toEqual(mqlKindConstants.VARIABLE)
  expect(mql.left.right.left.value).toEqual('$.self.a')
  expect(mql.left.right.right.kind).toEqual(mqlKindConstants.LITERAL)
  expect(mql.left.right.right.value).toEqual(1)
  expect(mql.right.kind).toEqual(mqlKindConstants.BINARY)
  expect(mql.right.operator).toEqual(operatorConstants.GT)
  expect(mql.right.left.kind).toEqual(mqlKindConstants.VARIABLE)
  expect(mql.right.left.value).toEqual('$.self.c')
  expect(mql.right.right.kind).toEqual(mqlKindConstants.LITERAL)
  expect(mql.right.right.value).toEqual(5)
})

const cst2 = {
  operator: operatorConstants.AND,
  type: mqlKindConstants.LogicalExpression,
  children: [{
    operator: operatorConstants.OR,
    type: mqlKindConstants.LogicalExpression,
    children: [{
      operator: operatorConstants.AND,
      type: mqlKindConstants.LogicalExpression,
      children: [{
        operator: operatorConstants.GT,
        type: mqlKindConstants.BinaryExpression,
        left: {
          type: mqlKindConstants.VARIABLE,
          viewType: '',
          value: 'f',
        },
        right: {
          type: mqlKindConstants.LITERAL,
          value: 100,
        },
      }, {
        operator: operatorConstants.LT,
        type: mqlKindConstants.BinaryExpression,
        left: {
          type: mqlKindConstants.VARIABLE,
          viewType: '',
          value: 'q',
        },
        right: {
          type: mqlKindConstants.LITERAL,
          value: 200,
        },
      }],
    }, {
      operator: operatorConstants.GT,
      type: mqlKindConstants.BinaryExpression,
      left: {
        type: mqlKindConstants.VARIABLE,
        viewType: '',
        value: 'a',
      },
      right: {
        type: mqlKindConstants.LITERAL,
        value: 1,
      },
    }],
  }, {
    operator: operatorConstants.GT,
    type: mqlKindConstants.BinaryExpression,
    left: {
      type: mqlKindConstants.VARIABLE,
      viewType: '',
      value: 'c',
    },
    right: {
      type: mqlKindConstants.LITERAL,
      value: 5,
    },
  }],
}

it('Conditional to MQL data', () => {
  const mql = cstToMql(cst2)
  expect(mql.kind).toEqual(mqlKindConstants.LOGICAL)
  expect(mql.operator).toEqual(operatorConstants.AND)
  expect(mql.left.kind).toEqual(mqlKindConstants.LOGICAL)
  expect(mql.left.operator).toEqual(operatorConstants.OR)
  expect(mql.left.left.kind).toEqual(mqlKindConstants.LOGICAL)
  expect(mql.left.left.operator).toEqual(operatorConstants.AND)
  expect(mql.left.left.left.kind).toEqual(mqlKindConstants.BINARY)
  expect(mql.left.left.left.operator).toEqual(operatorConstants.GT)
  expect(mql.left.left.left.left.kind).toEqual(mqlKindConstants.VARIABLE)
  expect(mql.left.left.left.left.value).toEqual('$.self.f')
  expect(mql.left.left.left.right.kind).toEqual(mqlKindConstants.LITERAL)
  expect(mql.left.left.left.right.value).toEqual(100)
  expect(mql.left.left.right.kind).toEqual(mqlKindConstants.BINARY)
  expect(mql.left.left.right.operator).toEqual(operatorConstants.LT)
  expect(mql.left.left.right.left.kind).toEqual(mqlKindConstants.VARIABLE)
  expect(mql.left.left.right.left.value).toEqual('$.self.q')
  expect(mql.left.left.right.right.kind).toEqual(mqlKindConstants.LITERAL)
  expect(mql.left.left.right.right.value).toEqual(200)
  expect(mql.left.right.kind).toEqual(mqlKindConstants.BINARY)
  expect(mql.left.right.operator).toEqual(operatorConstants.GT)
  expect(mql.left.right.left.kind).toEqual(mqlKindConstants.VARIABLE)
  expect(mql.left.right.left.value).toEqual('$.self.a')
  expect(mql.left.right.right.kind).toEqual(mqlKindConstants.LITERAL)
  expect(mql.left.right.right.value).toEqual(1)
  expect(mql.right.kind).toEqual(mqlKindConstants.BINARY)
  expect(mql.right.operator).toEqual(operatorConstants.GT)
  expect(mql.right.left.kind).toEqual(mqlKindConstants.VARIABLE)
  expect(mql.right.left.value).toEqual('$.self.c')
  expect(mql.right.right.kind).toEqual(mqlKindConstants.LITERAL)
  expect(mql.right.right.value).toEqual(5)
})

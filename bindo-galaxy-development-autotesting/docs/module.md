### Field

{
  label: '控件标签',
  name: '数据库表字段名',
  type: '字段类型：[BASIC | RELATION | LINK]',
  dataType: '数据类型，例如：TEXT, MULTILINETEXT, INTEGER_NUMBER, ONETOMANY...',
  viewType: '视图类型',
  readOnly: '只读控件，默认false, 可根据需求，设置满足条件只读，validations.kind===readOnly',
  invisible: '不显示控件，默认false, 可根据需求，设置满足条件不显示，validations.kind===invisible',
  required: '必填项，默认false, 可根据需求，设置满足条件必填，validations.kind===required',
  isBindField: 'true: 和已存在的表中的某个字段绑定',
  allowValue: { // which values can be select for dataType=select|checkbox etc...
    type: 'STATIC: 静态或字面量数据， DYNAMIC: 动态数据',
    staticItems: 'Object: 静态数据集合', // type === 'STATIC',
    dynamicItems: { //
      moduleID: '数据源moduleID',
      displayField: '在控件中用于显示的字段',
      valueField: '数据标识字段',
      queryConditions: [{formula:'过来数据源条件 MQLInput'}]
    }
  },
  //数据存在强一致的关联，允许创建对象的同时，创建relation module record.
  //强制使用关联字段的映射关系作为where eq条件。
  //queryConditions也会继续应用
  //for One2Many,One2One?
  relation: {
    relatedModuleID: '被关联的moduleID',
    fieldMapping: [{
      field: 映射字段,
      relatedField: 被映射字段, 来自于被关联module字段,
    }]
  },
  //只允许进行query时候关联，配合queryConditions
  // for Many2Many
  link: {
    linkedModuleID: '被绑定的moduleID'
  },
  queryConditions: [{
    formula: MQLInput
  }],
  queryOrder: {
    orderField: '排序字段'
    orderBy: '[ASC按升序排列|DESC按降序排列]'
  },
  // 从另一个module关联出数据
  // for Related Field
  queryEvaluation: {
    type: '[PLAIN|AGGREGATE]',
    selectFields: ['字段集合'],
    aggregate: {
      formula: MQLInput
    }
  },
  listens: [{
    field: '字段名称',
    evaluations: [{
      formula: 'String',
      value: 'String',
      valueList: ['String'],
    }]
  }],
  validations: [{
    formula: 'String',
    validationErrorMessage: 'String',
  }]
}

1. onetomany, type = relation,data_type = onetomany,relation.relatedModuleID,relation.fieldMapping
{
  type: 'RELATION',
  dataType: 'ONETOMANY',
  viewType: 'ONETOMANY',
  allowMultiValue: true,
  relation: {
    relatedModuleID: '',
    fieldMapping: [],
  },
}
{
  type: 'RELATION',
  dataType: 'MANYTOONE',
  viewType: 'MANYTOONE',
  allowMultiValue: true,
  relation: {
    relatedModuleID: '',
    fieldMapping: [],
  },
}
{
  type: 'RELATION',
  dataType: 'MANYTOMANY',
  viewType: 'MANYTOMANY',
  allowMultiValue: true,,
  relation: {
    relatedModuleID: '',
  },
}
{
  type: 'LINK',
  dataType: 'MANYTOONE',
  viewType: 'RELATED_FIELD',
  allowMultiValue: true,
  link: {
    linkedModuleID: '',
  },
  queryEvaluation: {
    type: 'AGGREGATE',
    exportFields: {
      fromField: 'name',
      destField: 'user_id',
    }
  }
}

2. manytoone, type = relation,data_type = onetomany,relation.relatedModuleID,relation.fieldMapping

3. manytomany, type = relation,data_type = onetomany,relation.relatedModuleID
1 + b
{
  kind: 'MATH',
  left: {
    kind: 'LITERAL'
    kindValue: 1,
  }
  operator: 'ADD',
  right: {
    kind: 'VARIABLE',
    kindValue: '$.self.b'
  }
}

1 + b * 5
{
  kind: 'MATH',
  right: {
    kind: 'MATH',
    left: {
      kind: 'VARIABLE'
      kindValue: '$.self.b',
      
    }
    operator: 'MULTI',
    right: {
      kind: 'LITERAL',
      kindValue: 5
    }
  }
  operator: 'ADD',
  left: {
    kind: 'LITERAL',
    kindValue: 1
  }
}
age > 32 && name contain 'kk'
MQLInput
{
  kind: 'LOGICAL',
  left: {
    kind: 'BINARY',
    left: {
      kind: 'VARIABLE',
      kindValue: '$.self.age'
    }
    operator: 'GT',
    right: {
      kind: 'LITERAL',
      kindValue: 32
    }
  }
  operator: 'AND',
  right: {
    kind: 'CALL',
    left: {
      kind: 'VARIABLE',
      kindValue: '$.self.name'
    }
    operator: 'CONTAIN',
    right: {
      kind: 'LITERAL',
      kindValue: 'kk'
    }
  }
}
Conditional
{
  children: [
    {
      operator: "GT"
      type: "BinaryExpression"
      uuid: "a0da2ee13f1411e9b1f7dd72abe9084d"
      left: {
        type: "VARIABLE"
        value: "age"
        viewType: ""
      }
      right: {
        type: "LITERAL"
        value: 32
      }
    }
    {
      operator: "CONTAIN"
      type: "BinaryExpression"
      uuid: "a0da2ee13f1411e9b1f7dd72abe9084d"
      left: {
        type: "VARIABLE"
        value: "name"
        viewType: ""
      }
      right: {
        type: "LITERAL"
        value: 'kk'
      }
    }
  ]
  operator: "AND"
  type: "LogicalExpression"
  uuid: "a0da2ee03f1411e9b1f7dd72abe9084d"
}
### MQLInput
{
  kind: '[BINARY|LOGICAL|MATH|EVALUATION|VARIABLE|LITERAL|CALL]',
  left: 'MQLInput',
  right: 'MQLInput',
  kindValue: Object,
  operator: '[
    EQ 等于
    GT 大于
    LT 小于
    EGT 大于或等于
    ELT 小于或等于
    NOT 不等于
    IN 在其中
    NOT_IN 不再其中
    CONTAIN 包含（数据库中的like）
    NOT_CONTAIN 不包含
    IS_NULL 为空
    NOT_NULL 不为空
    AND 逻辑与
    OR 逻辑或
    ADD 加
    SUB 减
    MULTI 乘
    DIVISION 除
  ]'
}

$.self.user_id == &.relation.id && &.relation.age <= 32

MqlkindBinary     Mqlkind = "BINARY" // GT LT EQ
MqlkindLogical    Mqlkind = "LOGICAL"  //AND OR
MqlkindMath       Mqlkind = "MATH" //ADD SUB MULTI DIVISION
MqlkindEvaluation Mqlkind = "EVALUATION" //$.self.name + 1
MqlkindVariable   Mqlkind = "VARIABLE" // $.self.name, MQL.Value
MqlkindLiteral    Mqlkind = "LITERAL" //1 true "1",     MQL.Value 
MqlkindCall       Mqlkind = "CALL" //IS_NULL($.self.name)

field: {
  invisible: false,
  required: false,
  readOnly: false,
  defaultValue: '',
  label: '',
}

view: {
  helpTooltip: '',
  hiddenLabel: false,
  placeholder: '',
  format: any,
  addonBefore: [], // Text
  addonAfter: [], // Text
  visibleRows: 3, // TextArea
  mode: radio, // Selection
  label: '' // Label
  fontWeight: 500, // Label
  fontSize: 14, // Label
  step: 1, // Integer
  maxValue, // Integer
  minValue, // Integer
  precision: 1, // Decimal
  buttonText: '', // Image, File
  uploadUrl: '', // Image, File
}

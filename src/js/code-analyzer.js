import * as esprima from 'esprima';


const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc:true});
};


const functionMap= {'FunctionDeclaration':(expr) => {return parseFuncDec(expr);},
    'VariableDeclaration':(expr) => {return parseVarDec(expr);},
    'ExpressionStatement':(expr) => {return parseExprState(expr);},
    'WhileStatement':(expr) => {return parseWhileState(expr);},
    'IfStatement':(expr) => {return parseIfStatement(expr);},
    'ReturnStatement':(expr) => {return parseReturnStat(expr);},
    'ForStatement':(expr) => {return parseForStat(expr);},
    'BlockStatement':(expr) => {return parseBlockStat(expr);},
    'UpdateExpression':(expr) => {return parseUpdateExpr(expr);},
    'AssignmentExpression':(expr) => {return parseAssignExpr(expr);},
};


function parseProgram(program){
    return parseBody(program.body);
}
function parseBody(bodyCode){
    let Lines=[];
    for(let i=0; i<bodyCode.length;i++) {
        Lines=Lines.concat(parseExpr(bodyCode[i]));
    }
    return Lines;
}

function parseExpr(expr){
    return functionMap[expr.type](expr);
}



function parseBlockStat(blockStat){
    return parseBody(blockStat.body);
}


function parseFuncDec(funcDec){
    let Lines= [{Line: funcDec.id.loc.start.line, Type: 'function declaration',Name: funcDec.id.name, Condition: '' , Value: ''}].concat(parseParams(funcDec.params));
    return Lines.concat(parseExpr(funcDec.body));
}
function parseParams(funcParams) {
    let paramLines=[];
    for(let i=0; i<funcParams.length;i++) {
        paramLines = paramLines.concat([{Line: funcParams[i].loc.start.line, Type: 'variable declaration' ,Name: funcParams[i].name, Condition:''  , Value:'' }]);
    }
    return paramLines;
}
function parseVarDec(varDec) {
    let varsLines=[];
    let decs=varDec.declarations;
    for(let i=0; i<decs.length;i++) {
        varsLines= varsLines.concat([{Line: decs[i].id.loc.start.line, Type: 'variable declaration',Name: decs[i].id.name, Condition: '' , Value:decs[i].init===null?'NULL':parseCompExpr(decs[i].init) }]);
    }
    return varsLines;
}
function parseExprState(exprState) {
    switch(exprState.expression.type) {
    case 'AssignmentExpression': return parseAssignExpr(exprState.expression);
    case 'UpdateExpression': return parseUpdateExpr(exprState.expression);
    }
}
function parseAssignExpr(assignExpr) {
    return [{Line:assignExpr.left.loc.start.line , Type:'assignment expression' ,Name: parseCompExpr(assignExpr.left), Condition: '' , Value: parseCompExpr(assignExpr.right)}];
}


function parseWhileState(whileState) {
    let Lines=[];
    let testString=parseCompExpr(whileState.test.left) +' '+ whileState.test.operator +' '+ parseCompExpr(whileState.test.right);
    Lines=Lines.concat([{Line: whileState.test.left.loc.start.line, Type:'while statement' ,Name:'' , Condition: testString , Value:''}]);
    return Lines.concat(parseExpr(whileState.body));
}

function parseIfStatement(ifState) {
    let Lines=[];
    let testString=parseCompExpr(ifState.test.left) + ' '+ ifState.test.operator +' '+ parseCompExpr(ifState.test.right);
    Lines=Lines.concat([{Line: ifState.test.left.loc.start.line, Type: 'if statement',Name: '', Condition: testString , Value: ''}]);
    Lines=Lines.concat(parseExpr(ifState.consequent));
    if(ifState.alternate===null)
        return Lines;
    if(ifState.alternate.type === 'IfStatement')
        return Lines.concat(parseElseIf(ifState.alternate));
    else
        return Lines.concat(parseExpr(ifState.alternate));
}
function parseElseIf(elseIfState) {
    let Lines=[];
    let testString=parseCompExpr(elseIfState.test.left) +' '+ elseIfState.test.operator +' '+ parseCompExpr(elseIfState.test.right);
    Lines=Lines.concat([{Line: elseIfState.test.left.loc.start.line, Type: 'else if statement',Name: '', Condition: testString , Value:'' }]);
    Lines=Lines.concat(parseExpr(elseIfState.consequent));
    if(elseIfState.alternate===null)
        return Lines;
    if(elseIfState.alternate.type === 'IfStatement')
        return Lines.concat(parseElseIf(elseIfState.alternate));
    else
        return Lines.concat(parseExpr(elseIfState.alternate));
}



function parseCompExpr(compExpr){
    switch (compExpr.type) {
    case 'Identifier': return compExpr.name;
    case 'Literal': return ''+compExpr.value;
    case 'MemberExpression': return parseCompExpr(compExpr.object) + '[' + parseCompExpr(compExpr.property) + ']';
    case 'UpdateExpression': return parseCompExpr(compExpr.argument) + ' '+ compExpr.operator+' ';
    }
    return parseBinaryOnary(compExpr);
}
function parseBinaryOnary(compExpr){
    if(compExpr.type==='BinaryExpression')
        return parseBinaryExpr(compExpr);
    else
        return  parseUnaryExpr(compExpr);
}


function parseBinaryExpr(binaryExpr)
{
    let ans ='';
    ans = ans + parseCompExpr(binaryExpr.left);
    if(binaryExpr.left.type==='BinaryExpression' || binaryExpr.left.type==='UnaryExpression')
        ans = '(' + ans + ')';
    ans = ans + ' '+binaryExpr.operator+' ';
    if(binaryExpr.right.type==='BinaryExpression' || binaryExpr.right.type==='UnaryExpression')
        ans = ans + '(' + parseCompExpr(binaryExpr.right) + ')';
    else
        ans = ans + parseCompExpr(binaryExpr.right);
    return ans;
}
function parseUnaryExpr(unaryExpr)
{
    if(unaryExpr.argument.type==='BinaryExpression' || unaryExpr.argument.type==='UnaryExpression')
        return unaryExpr.operator + '(' + parseCompExpr(unaryExpr.argument) + ')';
    else
        return unaryExpr.operator + parseCompExpr(unaryExpr.argument);
}
function parseReturnStat(returnStat) {
    return [{Line:returnStat.loc.start.line, Type: 'return statement',Name:'' , Condition: '' , Value: parseCompExpr(returnStat.argument)}];
}

function parseForStat(forState) {
    let Lines=[];
    let testString=parseCompExpr(forState.test.left) + ' ' +forState.test.operator +' '+ parseCompExpr(forState.test.right);
    Lines=Lines.concat([{Line: forState.test.left.loc.start.line, Type:'for statement' ,Name:'' , Condition: testString , Value:''}]);
    Lines=Lines.concat(parseExpr(forState.init));
    Lines=Lines.concat(parseExpr(forState.update));
    return Lines.concat(parseExpr(forState.body));
}

function parseUpdateExpr(assignExpr) {
    let name=parseCompExpr(assignExpr.argument);
    return [{Line:assignExpr.loc.start.line , Type:'update expression' ,Name: name, Condition: '' , Value: name + assignExpr.operator}];
}

export {parseCode};
export {parseProgram};



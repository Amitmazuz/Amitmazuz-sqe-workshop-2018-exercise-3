import * as esprima from 'esprima';
import * as esgraph from 'esgraph/lib';

let funcParams=[];
let nodeShapes;
let nodeColoros;
let paramsEnv;
//Assignment 3 functions:


function genreateGraphDotFromInput(code,paramsString){
    nodeShapes = {};
    nodeColoros ={};
    paramsEnv={};
    let subbedCode =subCode(code).body[0];
    let cfgFromSubCode = esgraph(subbedCode.body);
    cfgFromSubCode = cleanCFG(cfgFromSubCode);
    let cfgDot=esgraph.dot(cfgFromSubCode,{counter:0, source: code});
    if(paramsString!=null && paramsString.length !== 0){
        paramsEnv=takeParams(paramsString);
        takeColors(cfgFromSubCode[2][0]);
    }
    return 'digraph{' + fixDot(cfgDot) + '}';
}

function cleanCFG(cfgToClean){
    //Remove that start and the exit
    cfgToClean[2].splice(0,1);
    cfgToClean[2].splice(cfgToClean[2].length - 1, 1);
    //Calculate shapes
    takeShapes(cfgToClean[2]);
    //Delete exit nodes
    cfgToClean[2]=cleanExit(cfgToClean[2]);
    //Clean exceptions and init the index attribute
    for(let i = 0; i < cfgToClean[2].length; i++){
        cfgToClean[2][i].exception = undefined;
        cfgToClean[2][i].index = i;
        nodeColoros[i]='';
    }
    return cfgToClean;
}

function fixDot(dot) {

    let counter = 1;
    let lines = dot.split('\n');
    for(let i = 0; i < lines.length; i++){
        lines[i] = lines[i].replace('true','T');
        lines[i] = lines[i].replace('false','F');
        if(!lines[i].includes('->')){
            lines[i] = lines[i].replace('label="','label="*'+ counter++ +'*\n');
            lines[i] = lines[i].replace('[','[shape="'+nodeShapes[i]+'"');
            if(nodeColoros[i] === 'draw') {
                lines[i] = lines[i].replace('[','[style="filled", color= "green",');
            }
        }
    }
    return lines.join('\n');
}

function takeColors(cfgNode) {
    if(nodeColoros[cfgNode.index] != 'draw'){
        nodeColoros[cfgNode.index]='draw';
        if(cfgNode.parent.type === 'IfStatement'){
            let exprToEval=subParseCompExpr(cfgNode.astNode,paramsEnv);
            if(eval(exprToEval)){
                takeColors(cfgNode.true);
            }else{
                takeColors(cfgNode.false);
            }
        }else{
            for(let i=0;i<cfgNode.next.length;i++){
                takeColors(cfgNode.next[i]);
            }
        }
    }
}

function takeShapes(cfgElement) {
    for(let i = 0; i < cfgElement.length; i++) {
        if(['IfStatement','WhileStatement'].includes(cfgElement[i].parent.type))
            nodeShapes[i] = 'diamond';
        else
            nodeShapes[i] = 'square';
    }
}

function cleanExit(cfgElement) {
    for(let i = 0; i < cfgElement.length; i++) {
        if(cfgElement[i].next[0].type === 'exit')
            cfgElement[i].next.splice(0,1);
        if(cfgElement[i].normal != undefined && cfgElement[i].normal.type === 'exit')
            cfgElement[i].normal = undefined;
    }
    return cfgElement;
}



//Assignment 2 functions:

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{range: true});
};
const subCode = (codeToSub) => {
    let parsedCode = parseCode(codeToSub);
    let substitutedCode= substituteProgram(parsedCode,{});
    return substitutedCode;
};
const substituteProgram = (codeToSub,env) => {
    codeToSub.body=subBody(codeToSub.body,env);
    return codeToSub;
};

function subBody(bodyCode,env){
    for(let i=0; i<bodyCode.length;i++) {
        if(bodyCode[i].type != 'FunctionDeclaration')
            bodyCode[i]=subExpr(bodyCode[i],env);
    }
    for(let i=0; i<bodyCode.length;i++) {
        if(bodyCode[i].type === 'FunctionDeclaration')
            bodyCode[i]=subExpr(bodyCode[i],env);
    }
    //bodyCode=bodyCode.filter((expr) => deleteRows(expr));
    return bodyCode;
}

function subExpr(expr,env){
    return functionMap[expr.type](expr,env);
}

const functionMap= {'FunctionDeclaration':(expr,env) => {return subFuncDec(expr,env);},
    'VariableDeclaration':(expr,env) => {return subVarDec(expr,env);},
    'ExpressionStatement':(expr,env) => {return subExprState(expr,env);},
    'WhileStatement':(expr,env) => {return subWhileState(expr,env);},
    'IfStatement':(expr,env) => {return subIfStatement(expr,env);},
    'ReturnStatement':(expr,env) => {return subReturnStat(expr,env);},
    'ForStatement':(expr,env) => {return subForStat(expr,env);},
    'BlockStatement':(expr,env) => {return subBlockStat(expr,env);},
    'UpdateExpression':(expr,env) => {return subUpdateExpr(expr,env);},
    //'AssignmentExpression':(expr,env) => {return subAssignExpr(expr,env);},
};

function subFuncDec(funcDec,env){
    for(let i=0;i<funcDec.params.length;i++){
        funcParams[i]=funcDec.params[i].name;
        env[funcDec.params[i].name]='';
    }
    funcDec.body=subExpr(funcDec.body,env);
    return funcDec;
}


// function deleteRows(expr){
//     if(expr.type === 'VariableDeclaration')
//         return false;
//     if(expr.type === 'ExpressionStatement' && expr.expression.type==='AssignmentExpression') {
//         if(!funcParams.includes(expr.expression.left.name))
//             return false;
//     }
//     return true;
// }

function subBlockStat(blockStat,env){
    blockStat.body= subBody(blockStat.body,env);
    return blockStat;
}

function subVarDec(varDec,env) {
    let decs=varDec.declarations;
    for(let i=0; i<decs.length;i++) {
        env[decs[i].id.name]= subParseCompExpr(decs[i].init,env);
    }
    return varDec;
}

function subIfStatement(ifState,env) {
    ifState.test.left=parseCode(subParseCompExpr(ifState.test.left,env)).body[0].expression;
    ifState.test.right=parseCode(subParseCompExpr(ifState.test.right,env)).body[0].expression;
    let newEnv={};
    Object.keys(env).forEach(function(key) {
        newEnv[key] = env[key];
    });
    ifState.consequent=subExpr(ifState.consequent,env);
    if(ifState.alternate===null)
        return ifState;
    ifState.alternate=subExpr(ifState.alternate,newEnv);
    return ifState;
}

function subExprState(exprState,env) {
    switch(exprState.expression.type) {
    case 'AssignmentExpression': exprState.expression=subAssignExpr(exprState.expression,env); break;
    case 'UpdateExpression': exprState.expression=subUpdateExpr(exprState.expression);
    }
    return exprState;
}
function subAssignExpr(assignExpr,env) {
    env[assignExpr.left.name]=subParseCompExpr(assignExpr.right,env);
    assignExpr.right=parseCode(env[assignExpr.left.name]).body[0].expression;
    return assignExpr;
}

function subUpdateExpr(updateExpr) {
    return updateExpr;
}



function subReturnStat(returnStat,env) {
    returnStat.argument=parseCode(subParseCompExpr(returnStat.argument,env)).body[0].expression;
    return returnStat;
}



function subParseCompExpr(compExpr,env){
    switch (compExpr.type) {
    case 'Identifier': return (env[compExpr.name]===null || env[compExpr.name]==='')?('('+compExpr.name+')'):('('+env[compExpr.name]+')');
    case 'Literal': return ''+compExpr.value;
    }
    return subParseCompExprContinue(compExpr,env);
}

function subParseCompExprContinue(compExpr,env){
    if(compExpr.type === 'MemberExpression') {
        return subParseCompExpr(compExpr.object,env) + '[' + subParseCompExpr(compExpr.property,env) + ']';
    }else{
        return subParseBinaryOnary(compExpr,env);
    }
}


function subParseBinaryOnary(compExpr,env){
    if(compExpr.type==='BinaryExpression')
        return subParseBinaryExpr(compExpr,env);
    else
        return  subParseUnaryExpr(compExpr,env);
}
function subParseBinaryExpr(binaryExpr,env)
{
    let ans ='';
    ans = ans + subParseCompExpr(binaryExpr.left,env);
    if(binaryExpr.left.type==='BinaryExpression' || binaryExpr.left.type==='UnaryExpression')
        ans = '(' + ans + ')';
    ans = ans + ' '+binaryExpr.operator+' ';
    if(binaryExpr.right.type==='BinaryExpression' || binaryExpr.right.type==='UnaryExpression')
        ans = ans + '(' + subParseCompExpr(binaryExpr.right,env) + ')';
    else
        ans = ans + subParseCompExpr(binaryExpr.right,env);
    return ans;
}
function subParseUnaryExpr(unaryExpr,env)
{
    if(unaryExpr.argument.type==='BinaryExpression' || unaryExpr.argument.type==='UnaryExpression')
        return unaryExpr.operator + '(' + subParseCompExpr(unaryExpr.argument,env) + ')';
    else
        return unaryExpr.operator + subParseCompExpr(unaryExpr.argument,env);
}


function subWhileState(whileState,env) {
    whileState.test.left=parseCode(subParseCompExpr(whileState.test.left,env)).body[0].expression;
    whileState.test.right=parseCode(subParseCompExpr(whileState.test.right,env)).body[0].expression;
    whileState.body=subExpr(whileState.body,env);
    return whileState;
}

function subForStat(forState,env) {
    forState.init=subExpr(forState.init,env);
    forState.test.left=parseCode(subParseCompExpr(forState.test.left,env)).body[0].expression;
    forState.test.right=parseCode(subParseCompExpr(forState.test.right,env)).body[0].expression;
    forState.update=subExpr(forState.update,env);
    forState.body=subExpr(forState.body,env);
    return forState;
}

const takeParams = (paramsString) => {
    let assignments = paramsString.slice(1,-1).split(';');
    for (let i=0;i<assignments.length;i++) {
        let param = assignments[i].split('=');
        paramsEnv[param[0]] = param[1];
    }
    return paramsEnv;
};



export {genreateGraphDotFromInput};
export {subCode};
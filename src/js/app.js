import $ from 'jquery';
import {subParseCompExpr} from './code-analyzer';
import {subCode} from './code-analyzer';
import * as safeEval from 'safe-eval';
import * as esgraph from 'esgraph';
import Viz from 'viz.js';
import {Module, render} from 'viz.js/full.render.js';

let nodeShapes;
let nodeColoros;
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        nodeShapes = {};
        nodeColoros ={};
        let paramsEnv=takeParams($('#paramsPlaceHolder').val());
        $('#parsedCode').empty();
        let originalCode=$('#codePlaceholder').val();
        let subbedCode =subCode(originalCode).body[0];
        let cfgFromSubCode = esgraph(subbedCode.body);
        cfgFromSubCode = cleanCFG(cfgFromSubCode);
        let cfgDot=esgraph.dot(cfgFromSubCode,{counter:0, source: originalCode});
        if($('#paramsPlaceHolder').val().length !== 0){
            takeColors(cfgFromSubCode[2][0],paramsEnv);
        }
        let finalDot = 'digraph{' + fixDot(cfgDot) + '}';
        let graph = document.getElementById('graph');
        let viz = new Viz({Module,render});
        viz.renderSVGElement(finalDot).then(e => {graph.innerHTML = ''; graph.append(e);});
    });
});




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

const takeParams = (paramsString) => {
    let assignments = paramsString.slice(1,-1).split(';');
    let paramsEnv={};
    if(assignments.length !== 0){
        for (let i=0;i<assignments.length;i++) {
            let param = assignments[i].split('=');
            paramsEnv[param[0]] = param[1];
        }
    }
    return paramsEnv;
};

function takeColors(cfgNode,paramsEnv) {
    if(nodeColoros[cfgNode.index] != 'draw'){
        nodeColoros[cfgNode.index]='draw';
        if(cfgNode.parent.type === 'IfStatement'){
            let exprToEval=subParseCompExpr(cfgNode.astNode,paramsEnv);
            if(safeEval(exprToEval)){
                takeColors(cfgNode.true,paramsEnv);
            }else{
                takeColors(cfgNode.false,paramsEnv);
            }
        }else{
            for(let i=0;i<cfgNode.next.length;i++){
                takeColors(cfgNode.next[i],paramsEnv);
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

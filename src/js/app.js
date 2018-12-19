import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {subParseCompExpr} from './code-analyzer';
import {subCode} from './code-analyzer';
import * as safeEval from 'safe-eval';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let paramsEnv=takeParams();
        $('#parsedCode').empty();
        let codeLines=subCode($('#codePlaceholder').val()).split('\n');
        for(let i=0;i<codeLines.length;i++){
            if(codeLines[i].includes('if')){
                let temp=codeLines[i].split('if')[1];
                let exprToEval=subParseCompExpr(parseCode(temp.substring(0,temp.length-1)).body[0].expression,paramsEnv);
                if(safeEval(exprToEval)){
                    $('#parsedCode').append('<p style="background:green">' + codeLines[i] + '<br></p>');
                }else{
                    $('#parsedCode').append('<p style="background:red">' + codeLines[i] + '<br></p>');
                }
            }else{
                $('#parsedCode').append('<p>' + codeLines[i] + '<br></p>');
            }
        }
    });
});

const takeParams = () => {
    let assignments = $('#paramsPlaceHolder').val().slice(1,-1).split(';');
    let paramsEnv={};
    for (let i=0;i<assignments.length;i++) {
        let param = assignments[i].split('=');
        paramsEnv[param[0]] = param[1];
    }
    return paramsEnv;
};
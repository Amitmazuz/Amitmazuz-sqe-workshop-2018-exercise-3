import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parseProgram} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let result= parseProgram(parsedCode);
        $('#here_table').empty();
        var $table = $('<table/>');
        $table.append( '<tr style="border: solid black 1px; background: chartreuse" > <td>' + 'Line'  + '</td>' + '<td>' + 'Type'  + '</td>' + '<td>' + 'Name'  + '</td>' + '<td>' + 'Condition'  + '</td>' +'<td>' + 'Value'  + '</td> </tr>');
        for(let i=0;i<result.length;i++){
            $table.append('<tr style="border:solid black 1px">' + '<td>'+ result[i].Line+  '</td>' +
                '<td>'+ result[i].Type+  '</td>'+
                '<td>'+ result[i].Name+  '</td>'+
                '<td>'+ result[i].Condition+  '</td>'+
                '<td>'+ result[i].Value+  '</td>'+
                '</tr>');

        }
        $('#here_table').append($table);
    });
});


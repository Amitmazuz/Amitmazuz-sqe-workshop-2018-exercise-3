import $ from 'jquery';
import {genreateGraphDotFromInput} from './code-analyzer';

import Viz from 'viz.js';
import {Module, render} from 'viz.js/full.render.js';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        $('#parsedCode').empty();
        let originalCode=$('#codePlaceholder').val();
        let graphDot= genreateGraphDotFromInput(originalCode,$('#paramsPlaceHolder').val());
        let graph = document.getElementById('graph');
        let viz = new Viz({Module,render});
        viz.renderSVGElement(graphDot).then(e => {graph.innerHTML = ''; graph.append(e);});
    });
});


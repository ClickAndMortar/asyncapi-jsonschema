import CodeMirror from 'codemirror/lib/codemirror.js';

import '../css/app.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/lint/lint.css';
import 'highlight.js/styles/monokai.css'
import 'codemirror/addon/dialog/dialog.css';
import 'materialize-css/dist/css/materialize.min.css'

import 'codemirror/mode/yaml/yaml';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/yaml-lint';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';

import jsyaml from 'js-yaml';
window.jsyaml = jsyaml;

import $ from 'jquery';
window.$ = $;
window.jQuery = $;

import 'materialize-css/dist/js/materialize.min.js';
import Vue from 'vue/dist/vue.min';

import hljs from 'highlight.js/lib/highlight'
import hlJson from 'highlight.js/lib/languages/json'
hljs.registerLanguage('json', hlJson);
window.hljs = hljs;

import Converter from './converter';
window.converter = new Converter;

window.addEventListener('load', () => {
    window.asyncSchemaCM = CodeMirror.fromTextArea(document.getElementById('async-schema'), {
        mode: 'yaml',
        theme: 'monokai',
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        foldGutter: true,
        gutters: ['CodeMirror-lint-markers', 'CodeMirror-foldgutter'],
        lint: true
    });

    window.asyncSchemaCM.on('change', () => {
        window.asyncSchemaCM.save();
        app.fetchChannels();
    });
});

let app = new Vue({
    el: '#app',
    data: {
        channels: [],
        loading: false,
        jsonSchema: ""
    },
    methods: {
        fetchChannels() {
            this.channels = converter.getChannels($('#async-schema').val());
        },
        convert() {
            let yaml = $('#async-schema').val();
            let channel = $('#channel').val();
            this.loading = true;
            this.jsonSchema = converter.convert(yaml, channel);
            this.loading = false;
        }
    },
    updated() {
        $('select#channel').formSelect();
        if (this.jsonSchema) {
            hljs.highlightBlock($('#json-schema')[0]);
        }
    }
});

$(() => {
    $('select').formSelect();
});

import assert from 'assert';
import {subCode,genreateGraphDotFromInput} from '../src/js/code-analyzer';
import * as escodegen from 'escodegen';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(genreateGraphDotFromInput('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n',''), 'digraph{n0 [shape="square"label="*1*\n' +
            'let a = x + 1;"]\n' +
            'n1 [shape="square"label="*2*\n' +
            'let b = a + y;"]\n' +
            'n2 [shape="square"label="*3*\n' +
            'let c = 0;"]\n' +
            'n3 [shape="diamond"label="*4*\n' +
            'b < z"]\n' +
            'n4 [shape="square"label="*5*\n' +
            'c = c + 5"]\n' +
            'n5 [shape="square"label="*6*\n' +
            'return c;"]\n' +
            'n6 [shape="diamond"label="*7*\n' +
            'b < z * 2"]\n' +
            'n7 [shape="square"label="*8*\n' +
            'c = c + x + 5"]\n' +
            'n8 [shape="square"label="*9*\n' +
            'c = c + z + 5"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 [label="T"]\n' +
            'n3 -> n6 [label="F"]\n' +
            'n4 -> n5 []\n' +
            'n6 -> n7 [label="T"]\n' +
            'n6 -> n8 [label="F"]\n' +
            'n7 -> n5 []\n' +
            'n8 -> n5 []\n' +
            '}'
        );
    });


    it('is parsing an empty function correctly', () => {
        assert.equal(genreateGraphDotFromInput('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n','{x=1;y=2;z=3}'), 'digraph{n0 [style="filled", color= "green",shape="square"label="*1*\n' +
            'let a = x + 1;"]\n' +
            'n1 [style="filled", color= "green",shape="square"label="*2*\n' +
            'let b = a + y;"]\n' +
            'n2 [style="filled", color= "green",shape="square"label="*3*\n' +
            'let c = 0;"]\n' +
            'n3 [style="filled", color= "green",shape="diamond"label="*4*\n' +
            'b < z"]\n' +
            'n4 [shape="square"label="*5*\n' +
            'c = c + 5"]\n' +
            'n5 [style="filled", color= "green",shape="square"label="*6*\n' +
            'return c;"]\n' +
            'n6 [style="filled", color= "green",shape="diamond"label="*7*\n' +
            'b < z * 2"]\n' +
            'n7 [style="filled", color= "green",shape="square"label="*8*\n' +
            'c = c + x + 5"]\n' +
            'n8 [shape="square"label="*9*\n' +
            'c = c + z + 5"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 [label="T"]\n' +
            'n3 -> n6 [label="F"]\n' +
            'n4 -> n5 []\n' +
            'n6 -> n7 [label="T"]\n' +
            'n6 -> n8 [label="F"]\n' +
            'n7 -> n5 []\n' +
            'n8 -> n5 []\n' +
            '}'
        );
    });

    it('is parsing an empty function correctly', () => {
        assert.equal(genreateGraphDotFromInput('function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < z) {\n' +
            '       c = a + b;\n' +
            '       z = c * 2;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n',''), 'digraph{n0 [shape="square"label="*1*\n' +
            'let a = x + 1;"]\n' +
            'n1 [shape="square"label="*2*\n' +
            'let b = a + y;"]\n' +
            'n2 [shape="square"label="*3*\n' +
            'let c = 0;"]\n' +
            'n3 [shape="diamond"label="*4*\n' +
            'a < z"]\n' +
            'n4 [shape="square"label="*5*\n' +
            'c = a + b"]\n' +
            'n5 [shape="square"label="*6*\n' +
            'z = c * 2"]\n' +
            'n6 [shape="square"label="*7*\n' +
            'a++"]\n' +
            'n7 [shape="square"label="*8*\n' +
            'return z;"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 [label="T"]\n' +
            'n3 -> n7 [label="F"]\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 []\n' +
            'n6 -> n3 []\n' +
            '}'
        );
    });



    it('is parsing an empty function correctly', () => {
        assert.equal(genreateGraphDotFromInput('function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < z) {\n' +
            '       c = a + b;\n' +
            '       z = c * 2;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n','{x=1;y=2;z=3}'), 'digraph{n0 [style="filled", color= "green",shape="square"label="*1*\n' +
            'let a = x + 1;"]\n' +
            'n1 [style="filled", color= "green",shape="square"label="*2*\n' +
            'let b = a + y;"]\n' +
            'n2 [style="filled", color= "green",shape="square"label="*3*\n' +
            'let c = 0;"]\n' +
            'n3 [style="filled", color= "green",shape="diamond"label="*4*\n' +
            'a < z"]\n' +
            'n4 [style="filled", color= "green",shape="square"label="*5*\n' +
            'c = a + b"]\n' +
            'n5 [style="filled", color= "green",shape="square"label="*6*\n' +
            'z = c * 2"]\n' +
            'n6 [style="filled", color= "green",shape="square"label="*7*\n' +
            'a++"]\n' +
            'n7 [style="filled", color= "green",shape="square"label="*8*\n' +
            'return z;"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 [label="T"]\n' +
            'n3 -> n7 [label="F"]\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 []\n' +
            'n6 -> n3 []\n' +
            '}'
        );
    });






    it('is parsing an empty function correctly', () => {
        assert.equal(escodegen.generate(subCode('function test(x){\n' +
                'let c=x+5;\n' +
                'x=x+4;\n' +
                'if(x>4)\n' +
                'c=c+5\n' +
                'return c;\n' +
                '}')), 'function test(x) {\n' +
            '    let c = x + 5;\n' +
            '    x = x + 4;\n' +
            '    if (x + 4 > 4)\n' +
            '        c = x + 5 + 5;\n' +
            '    return x + 5 + 5;\n' +
            '}'
        );
    });

    it('is parsing an empty function correctly', () => {
        assert.equal(
            escodegen.generate(subCode('function test(x){\n' +
                'let c=x+5;\n' +
                'x=x+4;\n' +
                'if(x>4)\n' +
                '\tc=c+5;\n' +
                'else if(x<4)\n' +
                '\t\tc=c+6;\n' +
                'return c;\n' +
                '}')),
            'function test(x) {\n' +
            '    let c = x + 5;\n' +
            '    x = x + 4;\n' +
            '    if (x + 4 > 4)\n' +
            '        c = x + 5 + 5;\n' +
            '    else if (x + 4 < 4)\n' +
            '        c = x + 5 + 6;\n' +
            '    return x + 5 + 5;\n' +
            '}'
        );
    });

    it('is parsing an empty function correctly', () => {
        assert.equal(
            escodegen.generate(subCode('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } else if (b < z * 2) {\n' +
                '        c = c + x + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } else {\n' +
                '        c = c + z + 5;\n' +
                '        return x + y + z + c;\n' +
                '    }\n' +
                '}\n')),
            'function foo(x, y, z) {\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    if (x + 1 + y < z) {\n' +
            '        c = 0 + 5;\n' +
            '        return x + y + z + (0 + 5);\n' +
            '    } else if (x + 1 + y < z * 2) {\n' +
            '        c = 0 + x + 5;\n' +
            '        return x + y + z + (0 + x + 5);\n' +
            '    } else {\n' +
            '        c = 0 + z + 5;\n' +
            '        return x + y + z + (0 + z + 5);\n' +
            '    }\n' +
            '}'
        );
    });

    it('is parsing an empty function correctly', () => {
        assert.equal(
            escodegen.generate(subCode('function test(x){\n' +
                'let c=x+5;\n' +
                'x=x+4;\n' +
                'for(let i=1; i< x; i++)\n' +
                '\tif(x>4)\n' +
                '\t\tc=c+5;\n' +
                '\telse if(x<4)\n' +
                '\t\t\tc=c+6;\n' +
                'return c;\n' +
                '}')),
            'function test(x) {\n' +
            '    let c = x + 5;\n' +
            '    x = x + 4;\n' +
            '    for (let i = 1; 1 < x + 4; i++)\n' +
            '        if (x + 4 > 4)\n' +
            '            c = x + 5 + 5;\n' +
            '        else if (x + 4 < 4)\n' +
            '            c = x + 5 + 6;\n' +
            '    return x + 5 + 5;\n' +
            '}'
        );
    });

    it('is parsing an empty function correctly', () => {
        assert.equal(
            escodegen.generate(subCode('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    while (a < z) {\n' +
                '        c = a + b;\n' +
                '        z = c * 2;\n' +
                '    }\n' +
                '    \n' +
                '    return z;\n' +
                '}\n')),
            'function foo(x, y, z) {\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    while (x + 1 < z) {\n' +
            '        c = x + 1 + (x + 1 + y);\n' +
            '        z = (x + 1 + (x + 1 + y)) * 2;\n' +
            '    }\n' +
            '    return (x + 1 + (x + 1 + y)) * 2;\n' +
            '}'
        );
    });
    it('is parsing an empty function correctly', () => {
        assert.equal(
            escodegen.generate(subCode('function test(x){\n' +
                'let c=x+5;\n' +
                'x=x+4;\n' +
                'for(let i=1; i< x; i++)\n' +
                '\tc++;\n' +
                'return c;\n' +
                '}')),
            'function test(x) {\n' +
            '    let c = x + 5;\n' +
            '    x = x + 4;\n' +
            '    for (let i = 1; 1 < x + 4; i++)\n' +
            '        c++;\n' +
            '    return x + 5;\n' +
            '}'
        );
    });

    it('is parsing an empty function correctly', () => {
        assert.equal(
            escodegen.generate(subCode('function test(x){\n' +
                'let c=x+5;\n' +
                'x=-5;\n' +
                'c=3+(c+5)\n' +
                'for(let i=1; i< x; i++)\n' +
                '\tc++;\n' +
                'return c;\n' +
                '}')),
            'function test(x) {\n' +
            '    let c = x + 5;\n' +
            '    x = -5;\n' +
            '    c = 3 + (x + 5 + 5);\n' +
            '    for (let i = 1; 1 < -5; i++)\n' +
            '        c++;\n' +
            '    return 3 + (x + 5 + 5);\n' +
            '}'
        );
    });
    it('is parsing an empty function correctly', () => {
        assert.equal(
            escodegen.generate(subCode('function test(x){\n' +
                'let c=x+5;\n' +
                'x=-5 + (c-3);\n' +
                'c=3+(-(c+5))\n' +
                'for(let i=1; i< x; i++)\n' +
                '\tc++;\n' +
                'return c;\n' +
                '}')),
            'function test(x) {\n' +
            '    let c = x + 5;\n' +
            '    x = -5 + (x + 5 - 3);\n' +
            '    c = 3 + -(x + 5 + 5);\n' +
            '    for (let i = 1; 1 < -5 + (x + 5 - 3); i++)\n' +
            '        c++;\n' +
            '    return 3 + -(x + 5 + 5);\n' +
            '}'
        );
    });
    it('is parsing an empty function correctly', () => {
        assert.equal(
            escodegen.generate(subCode('let k=4;\n' +
                'function test(x){\n' +
                'let c=x+5;\n' +
                'x=-5 + (c-3);\n' +
                'c=k+5\n' +
                'for(let i=1; i< x; i++)\n' +
                '\tc++;\n' +
                'return c;\n' +
                '}')),
            'let k = 4;\n' +
            'function test(x) {\n' +
            '    let c = x + 5;\n' +
            '    x = -5 + (x + 5 - 3);\n' +
            '    c = 4 + 5;\n' +
            '    for (let i = 1; 1 < -5 + (x + 5 - 3); i++)\n' +
            '        c++;\n' +
            '    return 4 + 5;\n' +
            '}'
        );
    });
    it('is parsing an empty function correctly', () => {
        assert.equal(
            escodegen.generate(subCode('function test(x){\n' +
                'let c=x+5;\n' +
                'x=y+c;\n' +
                'c=k+5\n' +
                'for(let i=1; i< x; i++)\n' +
                '\tc++;\n' +
                'return c;\n' +
                '}\n' +
                'let k=4;\n' +
                'let y=k+5;')),
            'function test(x) {\n' +
            '    let c = x + 5;\n' +
            '    x = 4 + 5 + (x + 5);\n' +
            '    c = 4 + 5;\n' +
            '    for (let i = 1; 1 < 4 + 5 + (x + 5); i++)\n' +
            '        c++;\n' +
            '    return 4 + 5;\n' +
            '}\n' +
            'let k = 4;\n' +
            'let y = k + 5;'
        );
    });
	it('is parsing an empty function correctly', () => {
        assert.equal(
            escodegen.generate(subCode('function test(x,y)\n' +
                '{\n' +
                'a=x;\n' +
                'if(a[1]>20){\n' +
                'return a[1];\n' +
                '}\n' +
                'return a[0];\n' +
                '}')),
            'function test(x, y) {\n' +
            '    a = x;\n' +
            '    if (x[1] > 20) {\n' +
            '        return x[1];\n' +
            '    }\n' +
            '    return x[0];\n' +
            '}'
        );
    });



});

import assert from 'assert';
import {subCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(subCode('function test(x){\n' +
                'let c=x+5;\n' +
                'x=x+4;\n' +
                'if(x>4)\n' +
                'c=c+5\n' +
                'return c;\n' +
                '}'), 'function test(x) {\n' +
            '    x = x + 4;\n' +
            '    if (x + 4 > 4)\n' +
            '        c = x + 5 + 5;\n' +
            '    return x + 5 + 5;\n' +
            '}'
        );
    });

    it('is parsing an empty function correctly', () => {
        assert.equal(
            subCode('function test(x){\n' +
                'let c=x+5;\n' +
                'x=x+4;\n' +
                'if(x>4)\n' +
                '\tc=c+5;\n' +
                'else if(x<4)\n' +
                '\t\tc=c+6;\n' +
                'return c;\n' +
                '}'),
            'function test(x) {\n' +
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
            subCode('function foo(x, y, z){\n' +
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
                '}\n'),
            'function foo(x, y, z) {\n' +
            '    if (x + 1 + y < z) {\n' +
            '        return x + y + z + (0 + 5);\n' +
            '    } else if (x + 1 + y < z * 2) {\n' +
            '        return x + y + z + (0 + x + 5);\n' +
            '    } else {\n' +
            '        return x + y + z + (0 + z + 5);\n' +
            '    }\n' +
            '}'
        );
    });
    it('is parsing an empty function correctly', () => {
        assert.equal(
            subCode('function test(x){\n' +
                'let c=x+5;\n' +
                'x=x+4;\n' +
                'for(let i=1; i< x; i++)\n' +
                '\tif(x>4)\n' +
                '\t\tc=c+5;\n' +
                '\telse if(x<4)\n' +
                '\t\t\tc=c+6;\n' +
                'return c;\n' +
                '}'),
            'function test(x) {\n' +
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
            subCode('function foo(x, y, z){\n' +
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
                '}\n'),
            'function foo(x, y, z) {\n' +
            '    while (x + 1 < z) {\n' +
            '        z = (x + 1 + (x + 1 + y)) * 2;\n' +
            '    }\n' +
            '    return (x + 1 + (x + 1 + y)) * 2;\n' +
            '}'
        );
    });
    it('is parsing an empty function correctly', () => {
        assert.equal(
            subCode('function test(x){\n' +
                'let c=x+5;\n' +
                'x=x+4;\n' +
                'for(let i=1; i< x; i++)\n' +
                '\tc++;\n' +
                'return c;\n' +
                '}'),
            'function test(x) {\n' +
            '    x = x + 4;\n' +
            '    for (let i = 1; 1 < x + 4; i++)\n' +
            '        c++;\n' +
            '    return x + 5;\n' +
            '}'
        );
    });
    it('is parsing an empty function correctly', () => {
        assert.equal(
            subCode('function test(x){\n' +
                'let c=x+5;\n' +
                'x=-5;\n' +
                'c=3+(c+5)\n' +
                'for(let i=1; i< x; i++)\n' +
                '\tc++;\n' +
                'return c;\n' +
                '}'),
            'function test(x) {\n' +
            '    x = -5;\n' +
            '    for (let i = 1; 1 < -5; i++)\n' +
            '        c++;\n' +
            '    return 3 + (x + 5 + 5);\n' +
            '}'
        );
    });
    it('is parsing an empty function correctly', () => {
        assert.equal(
            subCode('function test(x){\n' +
                'let c=x+5;\n' +
                'x=-5 + (c-3);\n' +
                'c=3+(-(c+5))\n' +
                'for(let i=1; i< x; i++)\n' +
                '\tc++;\n' +
                'return c;\n' +
                '}'),
            'function test(x) {\n' +
            '    x = -5 + (x + 5 - 3);\n' +
            '    for (let i = 1; 1 < -5 + (x + 5 - 3); i++)\n' +
            '        c++;\n' +
            '    return 3 + -(x + 5 + 5);\n' +
            '}'
        );
    });
    it('is parsing an empty function correctly', () => {
        assert.equal(
            subCode('let k=4;\n' +
                'function test(x){\n' +
                'let c=x+5;\n' +
                'x=-5 + (c-3);\n' +
                'c=k+5\n' +
                'for(let i=1; i< x; i++)\n' +
                '\tc++;\n' +
                'return c;\n' +
                '}'),
            'function test(x) {\n' +
            '    x = -5 + (x + 5 - 3);\n' +
            '    for (let i = 1; 1 < -5 + (x + 5 - 3); i++)\n' +
            '        c++;\n' +
            '    return 4 + 5;\n' +
            '}'
        );
    });
    it('is parsing an empty function correctly', () => {
        assert.equal(
            subCode('function test(x){\n' +
                'let c=x+5;\n' +
                'x=y+c;\n' +
                'c=k+5\n' +
                'for(let i=1; i< x; i++)\n' +
                '\tc++;\n' +
                'return c;\n' +
                '}\n' +
                'let k=4;\n' +
                'let y=k+5;'),
            'function test(x) {\n' +
            '    x = 4 + 5 + (x + 5);\n' +
            '    for (let i = 1; 1 < 4 + 5 + (x + 5); i++)\n' +
            '        c++;\n' +
            '    return 4 + 5;\n' +
            '}'
        );
    });
	it('is parsing an empty function correctly', () => {
        assert.equal(
            subCode('function test(x,y)\n' +
                '{\n' +
                'a=x;\n' +
                'if(a[1]>20){\n' +
                'return a[1];\n' +
                '}\n' +
                'return a[0];\n' +
                '}'),
            'function test(x, y) {\n' +
            '    if (x[1] > 20) {\n' +
            '        return x[1];\n' +
            '    }\n' +
            '    return x[0];\n' +
            '}'
        );
    });



});
